// Axios type extensions for custom metadata

import "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime?: number;
      [key: string]: any;
    };
  }
}
