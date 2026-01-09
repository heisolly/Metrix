'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { useAuthActions, useIsLoading, useAuthError } from '@/store/authStore';
import { cn } from '@/utils';

// =================================================================
// VALIDATION SCHEMA
// =================================================================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

// =================================================================
// COMPONENT
// =================================================================

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}

export default function LoginForm({ onSuccess, redirectTo, className }: LoginFormProps) {
  const router = useRouter();
  const { login, clearError } = useAuthActions();
  const isLoading = useIsLoading();
  const authError = useAuthError();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      clearErrors();

      await login(data.email, data.password, data.rememberMe);

      toast.success('Welcome back to Metrix!', {
        icon: '🎮',
        duration: 4000,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo || '/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.statusCode === 401) {
        setError('email', {
          message: 'Invalid email or password'
        });
        setError('password', {
          message: 'Invalid email or password'
        });
      } else if (error.statusCode === 423) {
        setError('email', {
          message: 'Account is temporarily locked due to multiple failed login attempts'
        });
      } else if (error.statusCode === 403) {
        setError('email', {
          message: 'Your account has been suspended. Please contact support.'
        });
      } else {
        toast.error(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('w-full max-w-md mx-auto', className)}
    >
      <div className="card p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-16 h-16 bg-gaming-gradient rounded-xl mx-auto flex items-center justify-center mb-4"
          >
            <LogIn className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
            Welcome Back
          </h1>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Sign in to your Metrix gaming account
          </p>
        </div>

        {/* Error Message */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gaming-danger/10 border border-gaming-danger/30 text-gaming-danger px-4 py-3 rounded-lg text-sm"
          >
            {authError}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className={cn(
                  'input pl-11 pr-4',
                  errors.email && 'input-error'
                )}
                placeholder="Enter your email address"
                disabled={isSubmitting || isLoading}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gaming-danger"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className={cn(
                  'input pl-11 pr-11',
                  errors.password && 'input-error'
                )}
                placeholder="Enter your password"
                disabled={isSubmitting || isLoading}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted hover:text-gaming-primary transition-colors"
                disabled={isSubmitting || isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gaming-danger"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                {...register('rememberMe')}
                id="rememberMe"
                type="checkbox"
                className="w-4 h-4 text-gaming-primary bg-light-bg-primary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-gaming-primary focus:ring-2"
                disabled={isSubmitting || isLoading}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-light-text-secondary dark:text-dark-text-secondary"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gaming-primary hover:text-gaming-primary/80 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || isLoading}
            className={cn(
              'btn-primary w-full py-3 font-semibold relative overflow-hidden',
              (isSubmitting || isLoading) && 'opacity-70 cursor-not-allowed'
            )}
          >
            {isSubmitting || isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </div>
            )}
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center pt-4 border-t border-light-border dark:border-dark-border">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              className="text-gaming-primary hover:text-gaming-primary/80 font-medium"
            >
              Sign up now
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border"
          >
            <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Demo Accounts (Development)
            </h4>
            <div className="space-y-1 text-xs">
              <p className="text-light-text-muted dark:text-dark-text-muted">
                <strong>Admin:</strong> admin@metrix.com / admin123
              </p>
              <p className="text-light-text-muted dark:text-dark-text-muted">
                <strong>Player:</strong> player@metrix.com / player123
              </p>
              <p className="text-light-text-muted dark:text-dark-text-muted">
                <strong>Spectator:</strong> spectator@metrix.com / spectator123
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-light-text-muted dark:text-dark-text-muted">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-gaming-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-gaming-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
