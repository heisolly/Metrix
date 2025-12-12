// HTTP Client Service for Metrix Gaming Platform Frontend

import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiResponse, ApiError } from "@/types";
import { storage } from "@/utils";

// =================================================================
// TYPES AND INTERFACES
// =================================================================

interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  withCredentials: boolean;
}

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  withAuth?: boolean;
}

interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

// =================================================================
// API CLIENT CLASS
// =================================================================

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;
  private retryConfig: RetryConfig = {
    retries: 3,
    retryDelay: 1000,
    retryCondition: (error: AxiosError) => {
      return !error.response || error.response.status >= 500;
    },
  };

  constructor(config: ApiClientConfig) {
    this.client = axios.create(config);
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add authentication token
        const token = storage.get<string>("access_token");
        if (token && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        config.metadata = {
          ...config.metadata,
          startTime: Date.now(),
        };

        // Log request in development
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[API Request] {config.method?.toUpperCase()} ${config.url}`,
          );
        }

        return config;
      },
      (error) => {
        console.error("[API Request Error]", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response in development
        if (process.env.NODE_ENV === "development") {
          const duration =
            Date.now() - (response.config.metadata?.startTime || Date.now());
          console.log(
            `[API Response] {response.status} {response.config.url} (${duration}ms)`,
          );
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
          _retryCount?: number;
        };

        // Handle 401 Unauthorized - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.handleAuthenticationError();
            return Promise.reject(refreshError);
          }
        }

        // Handle network errors and 5xx errors with retry logic
        if (this.shouldRetry(error) && !originalRequest._retryCount) {
          return this.retryRequest(originalRequest, error);
        }

        // Log error in development
        if (process.env.NODE_ENV === "development") {
          console.error(
            `[API Error] {error.response?.status} ${error.config?.url}`,
            error,
          );
        }

        return Promise.reject(this.transformError(error));
      },
    );
  }

  /**
   * Refresh authentication token
   */
  private async refreshToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = storage.get<string>("refresh_token");
    if (!refreshToken) {
      return null;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await axios.post(
          `${this.client.defaults.baseURL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        const { accessToken } = response.data.data.tokens;
        storage.set("access_token", accessToken);

        return accessToken;
      } catch (error) {
        storage.remove("access_token");
        storage.remove("refresh_token");
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Handle authentication errors
   */
  private handleAuthenticationError(): void {
    storage.remove("access_token");
    storage.remove("refresh_token");
    storage.remove("user");

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(error: AxiosError): boolean {
    if (!this.retryConfig.retryCondition) return false;
    return this.retryConfig.retryCondition(error);
  }

  /**
   * Retry failed request with exponential backoff
   */
  private async retryRequest(
    originalRequest: InternalAxiosRequestConfig & { _retryCount?: number },
    error: AxiosError,
  ): Promise<AxiosResponse> {
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (originalRequest._retryCount >= this.retryConfig.retries) {
      return Promise.reject(error);
    }

    originalRequest._retryCount++;

    // Exponential backoff
    const delay =
      this.retryConfig.retryDelay *
      Math.pow(2, originalRequest._retryCount - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return this.client(originalRequest);
  }

  /**
   * Transform axios error to standard API error format
   */
  private transformError(error: AxiosError): ApiError {
    const response = error.response;

    if (
      response?.data &&
      typeof response.data === "object" &&
      "error" in response.data
    ) {
      return (response.data as ApiResponse).error!;
    }

    // Create standardized error
    return {
      name: error.name,
      message: error.message || "An unexpected error occurred",
      statusCode: response?.status || 500,
      status: response?.status
        ? response.status < 500
          ? "fail"
          : "error"
        : "error",
      code: this.getErrorCode(response?.status || 500),
      timestamp: new Date().toISOString(),
      path: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };
  }

  /**
   * Get error code from HTTP status
   */
  private getErrorCode(status: number): string {
    const codes: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      422: "VALIDATION_ERROR",
      429: "RATE_LIMIT_EXCEEDED",
      500: "INTERNAL_SERVER_ERROR",
      502: "BAD_GATEWAY",
      503: "SERVICE_UNAVAILABLE",
      504: "GATEWAY_TIMEOUT",
    };
    return codes[status] || "UNKNOWN_ERROR";
  }

  // =================================================================
  // PUBLIC HTTP METHODS
  // =================================================================

  /**
   * GET request
   */
  async get<T = any>(
    url: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, {
        headers: config?.headers,
        params: config?.params,
        timeout: config?.timeout,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data, {
        headers: config?.headers,
        params: config?.params,
        timeout: config?.timeout,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data, {
        headers: config?.headers,
        params: config?.params,
        timeout: config?.timeout,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch(url, data, {
        headers: config?.headers,
        params: config?.params,
        timeout: config?.timeout,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url, {
        headers: config?.headers,
        params: config?.params,
        timeout: config?.timeout,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload file
   */
  async upload<T = any>(
    url: string,
    file: File | FormData,
    config?: RequestConfig & {
      onUploadProgress?: (progressEvent: any) => void;
    },
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append("file", file);
    }

    try {
      const response = await this.client.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...config?.headers,
        },
        params: config?.params,
        timeout: config?.timeout || 60000, // 60 seconds for uploads
        onUploadProgress: config?.onUploadProgress,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download file
   */
  async download(
    url: string,
    filename?: string,
    config?: RequestConfig,
  ): Promise<void> {
    try {
      const response = await this.client.get(url, {
        ...config,
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw error;
    }
  }

  // =================================================================
  // UTILITY METHODS
  // =================================================================

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    storage.set("access_token", token);
  }

  /**
   * Remove authentication token
   */
  removeToken(): void {
    storage.remove("access_token");
    storage.remove("refresh_token");
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return storage.get<string>("access_token");
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Set base URL
   */
  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }

  /**
   * Set default timeout
   */
  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout;
  }

  /**
   * Add default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    Object.assign(this.client.defaults.headers.common, headers);
  }

  /**
   * Create request with custom config
   */
  createRequest<T = any>(
    config: InternalAxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.client(config).then((response) => response.data);
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(message?: string): void {
    // This would require implementing a request tracking system
    console.log("Cancelling all requests:", message);
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.get<{ status: string }>("/health");
      return {
        status: response.data?.status || "unknown",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "error",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// =================================================================
// API CLIENT INSTANCE
// =================================================================

const apiConfig: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  timeout: 30000, // 30 seconds
  withCredentials: true,
};

export const apiClient = new ApiClient(apiConfig);

// =================================================================
// CONVENIENCE METHODS
// =================================================================

/**
 * Quick GET request
 */
export const get = <T = any>(url: string, config?: RequestConfig) =>
  apiClient.get<T>(url, config);

/**
 * Quick POST request
 */
export const post = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig,
) => apiClient.post<T>(url, data, config);

/**
 * Quick PUT request
 */
export const put = <T = any>(url: string, data?: any, config?: RequestConfig) =>
  apiClient.put<T>(url, data, config);

/**
 * Quick PATCH request
 */
export const patch = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig,
) => apiClient.patch<T>(url, data, config);

/**
 * Quick DELETE request
 */
export const del = <T = any>(url: string, config?: RequestConfig) =>
  apiClient.delete<T>(url, config);

/**
 * Quick file upload
 */
export const upload = <T = any>(
  url: string,
  file: File | FormData,
  config?: RequestConfig,
) => apiClient.upload<T>(url, file, config);

/**
 * Quick file download
 */
export const download = (
  url: string,
  filename?: string,
  config?: RequestConfig,
) => apiClient.download(url, filename, config);

// =================================================================
// ERROR HANDLING UTILITIES
// =================================================================

/**
 * Check if error is API error
 */
export function isApiError(error: any): error is ApiError {
  return (
    error &&
    typeof error === "object" &&
    "statusCode" in error &&
    "code" in error
  );
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: any): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * Check if error is network error
 */
export function isNetworkError(error: any): boolean {
  return isApiError(error) && !error.statusCode;
}

/**
 * Check if error is server error (5xx)
 */
export function isServerError(error: any): boolean {
  return isApiError(error) && error.statusCode >= 500;
}

/**
 * Check if error is client error (4xx)
 */
export function isClientError(error: any): boolean {
  return isApiError(error) && error.statusCode >= 400 && error.statusCode < 500;
}

/**
 * Check if error is validation error
 */
export function isValidationError(error: any): boolean {
  return (
    isApiError(error) && (error.statusCode === 400 || error.statusCode === 422)
  );
}

/**
 * Check if error is authentication error
 */
export function isAuthError(error: any): boolean {
  return (
    isApiError(error) && (error.statusCode === 401 || error.statusCode === 403)
  );
}

// =================================================================
// EXPORTS
// =================================================================

export default apiClient;
export type { ApiClient, RequestConfig, RetryConfig };
