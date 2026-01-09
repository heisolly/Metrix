"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserPlus,
  Phone,
  MapPin,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuthActions, useIsLoading, useAuthError } from "@/store/authStore";
import { signUp } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { UserRole, COUNTRIES } from "@/types";
import { cn, validatePassword } from "@/utils";

// =================================================================
// VALIDATION SCHEMA
// =================================================================

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+/, "First name can only contain letters and spaces"),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+/, "Last name can only contain letters and spaces"),

    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must not exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+/,
        "Username can only contain letters, numbers, and underscores",
      ),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email must not exceed 100 characters"),

    phoneNumber: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const phoneRegex = /^(\+234|234|0)[789][01]\d{8}/;
        return phoneRegex.test(val.replace(/\s/g, ""));
      }, "Please enter a valid Nigerian phone number"),

    country: z.string().min(1, "Country is required"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    role: z
      .nativeEnum(UserRole, {
        errorMap: () => ({ message: "Please select a valid role" }),
      })
      .default(UserRole.PLAYER),

    agreeToTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// =================================================================
// COMPONENT
// =================================================================

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}

export default function RegisterForm({
  onSuccess,
  redirectTo,
  className,
}: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, clearError } = useAuthActions();
  const isLoading = useIsLoading();
  const authError = useAuthError();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
  }>({
    score: 0,
    feedback: [],
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phoneNumber: "",
      country: "",
      password: "",
      confirmPassword: "",
      role: UserRole.PLAYER,
      agreeToTerms: false,
    },
  });

  const watchedPassword = watch("password");

  // Capture referral code from URL
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferralCode(refCode);
      console.log("Referral code detected:", refCode);
    }
  }, [searchParams]);

  // Update password strength when password changes
  useEffect(() => {
    if (watchedPassword) {
      const strength = validatePassword(watchedPassword);
      setPasswordStrength(strength);
    }
  }, [watchedPassword]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      clearErrors();

      // 1. Sign up with Supabase Auth
      const { user } = await signUp({
        email: data.email,
        password: data.password,
        username: data.username,
        fullName: `{data.firstName} ${data.lastName}`
      });

      if (!user) throw new Error("Registration failed");

      // 2. Create Profile in public.profiles
      // Note: We use upsert to handle cases where trigger might have race-created it
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: data.username,
          full_name: `{data.firstName} ${data.lastName}`,
          phone: data.phoneNumber,
          role: data.role,
          // Store other fields if columns exist or use metadata
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Continue anyway as auth user is created, user can update profile later
      }

      // 3. Process referral code if present
      if (referralCode) {
        try {
          // Find the referrer by referral code
          const { data: referrer, error: referrerError } = await supabase
            .from('profiles')
            .select('id')
            .eq('referral_code', referralCode)
            .single();

          if (referrer && !referrerError) {
            // Create referral record
            const { error: referralError } = await supabase
              .from('referrals')
              .insert({
                referrer_id: referrer.id,
                referred_id: user.id,
                status: 'pending',
                bonus_amount: 500 // Default bonus amount
              });

            if (referralError) {
              console.error("Referral creation error:", referralError);
            } else {
              console.log("Referral recorded successfully!");
              
              // Update referrer's total_referrals count
              const { data: currentProfile } = await supabase
                .from('profiles')
                .select('total_referrals')
                .eq('id', referrer.id)
                .single();
              
              if (currentProfile) {
                await supabase
                  .from('profiles')
                  .update({ total_referrals: (currentProfile.total_referrals || 0) + 1 })
                  .eq('id', referrer.id);
              }
            }
          } else {
            console.warn("Invalid referral code:", referralCode);
          }
        } catch (refError) {
          console.error("Referral processing error:", refError);
          // Don't fail registration if referral processing fails
        }
      }

      toast.success(
        "Registration successful! Please check your email to verify your account.",
        {
          icon: "🎉",
          duration: 6000,
        },
      );

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/auth/verify-email");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.message?.includes("email")) {
        setError("email", {
          message: "An account with this email already exists",
        });
      } else if (error.message?.includes("username")) {
        setError("username", {
          message: "This username is already taken",
        });
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["firstName", "lastName", "username"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["email", "phoneNumber", "country"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score >= 4) return "text-green-500";
    if (score >= 3) return "text-yellow-500";
    if (score >= 2) return "text-orange-500";
    return "text-red-500";
  };

  const getPasswordStrengthText = (score: number) => {
    if (score >= 4) return "Very Strong";
    if (score >= 3) return "Strong";
    if (score >= 2) return "Fair";
    return "Weak";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full max-w-2xl mx-auto", className)}
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
            <UserPlus className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
            Join Metrix Gaming
          </h1>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Create your gaming account and start competing
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  step <= currentStep
                    ? "bg-gaming-primary text-white"
                    : "bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-muted dark:text-dark-text-muted",
                )}
              >
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-2 transition-all",
                    step < currentStep
                      ? "bg-gaming-primary"
                      : "bg-light-border dark:bg-dark-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-center space-x-8 text-xs text-light-text-muted dark:text-dark-text-muted mb-6">
          <span
            className={cn(
              currentStep >= 1 && "text-gaming-primary font-medium",
            )}
          >
            Personal Info
          </span>
          <span
            className={cn(
              currentStep >= 2 && "text-gaming-primary font-medium",
            )}
          >
            Contact Details
          </span>
          <span
            className={cn(
              currentStep >= 3 && "text-gaming-primary font-medium",
            )}
          >
            Account Setup
          </span>
        </div>

        {/* Error Message */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-gaming-danger/10 border border-gaming-danger/30 text-gaming-danger px-4 py-3 rounded-lg text-sm"
          >
            {authError}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                    <input
                      {...register("firstName")}
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      className={cn(
                        "input pl-11 pr-4",
                        errors.firstName && "input-error",
                      )}
                      placeholder="Enter your first name"
                      disabled={isSubmitting || isLoading}
                    />
                  </div>
                  {errors.firstName && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-gaming-danger"
                    >
                      {errors.firstName.message}
                    </motion.p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                    <input
                      {...register("lastName")}
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      className={cn(
                        "input pl-11 pr-4",
                        errors.lastName && "input-error",
                      )}
                      placeholder="Enter your last name"
                      disabled={isSubmitting || isLoading}
                    />
                  </div>
                  {errors.lastName && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-gaming-danger"
                    >
                      {errors.lastName.message}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                  <input
                    {...register("username")}
                    id="username"
                    type="text"
                    autoComplete="username"
                    className={cn(
                      "input pl-11 pr-4",
                      errors.username && "input-error",
                    )}
                    placeholder="Choose a unique username"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gaming-danger"
                  >
                    {errors.username.message}
                  </motion.p>
                )}
                <p className="text-xs text-light-text-muted dark:text-dark-text-muted">
                  Your username will be visible to other players
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Contact Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Email */}
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
                    {...register("email")}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={cn(
                      "input pl-11 pr-4",
                      errors.email && "input-error",
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

              {/* Phone Number */}
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary"
                >
                  Phone Number{" "}
                  <span className="text-light-text-muted dark:text-dark-text-muted">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                  <input
                    {...register("phoneNumber")}
                    id="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    className={cn(
                      "input pl-11 pr-4",
                      errors.phoneNumber && "input-error",
                    )}
                    placeholder="e.g., +234 801 234 5678"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                {errors.phoneNumber && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gaming-danger"
                  >
                    {errors.phoneNumber.message}
                  </motion.p>
                )}
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary"
                >
                  Country
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                  <select
                    {...register("country")}
                    id="country"
                    className={cn(
                      "select pl-11 pr-4",
                      errors.country && "input-error",
                    )}
                    disabled={isSubmitting || isLoading}
                  >
                    <option value="">Select your country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gaming-danger"
                  >
                    {errors.country.message}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Account Setup */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Account Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="relative">
                    <input
                      {...register("role")}
                      type="radio"
                      value={UserRole.PLAYER}
                      className="sr-only peer"
                      disabled={isSubmitting || isLoading}
                    />
                    <div className="card-interactive p-4 peer-checked:border-gaming-primary peer-checked:bg-gaming-primary/5 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gaming-primary rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">Player</h4>
                          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            Compete in tournaments
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="relative">
                    <input
                      {...register("role")}
                      type="radio"
                      value={UserRole.SPECTATOR}
                      className="sr-only peer"
                      disabled={isSubmitting || isLoading}
                    />
                    <div className="card-interactive p-4 peer-checked:border-gaming-secondary peer-checked:bg-gaming-secondary/5 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gaming-secondary rounded-lg flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">Spectator</h4>
                          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            Watch and verify matches
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
                {errors.role && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gaming-danger"
                  >
                    {errors.role.message}
                  </motion.p>
                )}
              </div>

              {/* Password */}
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
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={cn(
                      "input pl-11 pr-11",
                      errors.password && "input-error",
                    )}
                    placeholder="Create a strong password"
                    disabled={isSubmitting || isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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

                {/* Password Strength Indicator */}
                {watchedPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-light-text-muted dark:text-dark-text-muted">
                        Password Strength
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          getPasswordStrengthColor(passwordStrength.score),
                        )}
                      >
                        {getPasswordStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            "h-1 flex-1 rounded-full",
                            level <= passwordStrength.score
                              ? passwordStrength.score >= 4
                                ? "bg-green-500"
                                : passwordStrength.score >= 3
                                  ? "bg-yellow-500"
                                  : passwordStrength.score >= 2
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                              : "bg-light-border dark:bg-dark-border",
                          )}
                        />
                      ))}
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="text-xs text-light-text-muted dark:text-dark-text-muted space-y-1">
                        {passwordStrength.feedback.map((feedback, index) => (
                          <li key={index}>• {feedback}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                  <input
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={cn(
                      "input pl-11 pr-11",
                      errors.confirmPassword && "input-error",
                    )}
                    placeholder="Confirm your password"
                    disabled={isSubmitting || isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted hover:text-gaming-primary transition-colors"
                    disabled={isSubmitting || isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gaming-danger"
                  >
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    {...register("agreeToTerms")}
                    id="agreeToTerms"
                    type="checkbox"
                    className="w-4 h-4 text-gaming-primary bg-light-bg-primary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-gaming-primary focus:ring-2 mt-1"
                    disabled={isSubmitting || isLoading}
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-light-text-secondary dark:text-dark-text-secondary"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-gaming-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-gaming-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gaming-danger"
                  >
                    {errors.agreeToTerms.message}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={prevStep}
                className="btn-outline px-6 py-2"
                disabled={isSubmitting || isLoading}
              >
                Previous
              </motion.button>
            )}

            {currentStep < 3 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={nextStep}
                className="btn-primary px-6 py-2 ml-auto"
                disabled={isSubmitting || isLoading}
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || isLoading}
                className={cn(
                  "btn-primary px-6 py-3 font-semibold ml-auto relative overflow-hidden",
                  (isSubmitting || isLoading) &&
                    "opacity-70 cursor-not-allowed",
                )}
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </div>
                )}
              </motion.button>
            )}
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-center pt-4 border-t border-light-border dark:border-dark-border">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-gaming-primary hover:text-gaming-primary/80 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-light-text-muted dark:text-dark-text-muted">
          We take your privacy and security seriously. Your data is encrypted
          and protected.
        </p>
      </motion.div>
    </motion.div>
  );
}
