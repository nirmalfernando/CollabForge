"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Import useRouter
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Eye, EyeOff } from "lucide-react"

type UserRole = "influencer" | "brand-manager"

interface LoginFormData {
  username: string
  password: string
  rememberMe: boolean
  role: UserRole
}

interface LoginFormState {
  isLoading: boolean
  error: string | null
  showPassword: boolean
}

export default function LoginForm() {
  const router = useRouter() // Initialize useRouter
  const [selectedRole, setSelectedRole] = useState<UserRole>("influencer")
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    rememberMe: false,
    role: "influencer",
  })
  const [formState, setFormState] = useState<LoginFormState>({
    isLoading: false,
    error: null,
    showPassword: false,
  })

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role)
    setFormData((prev) => ({ ...prev, role }))
    // Clear any existing errors when switching roles
    setFormState((prev) => ({ ...prev, error: null }))
  }

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formState.error) {
      setFormState((prev) => ({ ...prev, error: null }))
    }
  }

  const togglePasswordVisibility = () => {
    setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.username.trim()) {
      setFormState((prev) => ({ ...prev, error: "Username is required" }))
      return
    }

    if (!formData.password) {
      setFormState((prev) => ({ ...prev, error: "Password is required" }))
      return
    }

    setFormState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Login submitted with data:", formData)

      // Simulate successful login and redirect
      console.log("Login successful! Redirecting to home page...")
      router.push("/home") // Redirect to the authenticated home page
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error: "Invalid username or password. Please try again.",
      }))
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const getUsernameLabel = () => {
    return selectedRole === "brand-manager" ? "Brand Name" : "Username"
  }

  const getUsernamePlaceholder = () => {
    return selectedRole === "brand-manager" ? "Brand Name" : "Username"
  }

  return (
    <div className="w-full max-w-md mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-collab-primary mb-8">Log-In</h1>

        {/* Role Selection Tabs */}
        <div className="flex rounded-lg overflow-hidden bg-collab-dark-light border border-collab-dark-border">
          <button
            type="button"
            onClick={() => handleRoleChange("influencer")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
              selectedRole === "influencer"
                ? "bg-collab-primary text-white shadow-lg"
                : "bg-transparent text-collab-text-muted hover:text-white hover:bg-collab-dark-lighter"
            }`}
            aria-pressed={selectedRole === "influencer"}
            disabled={formState.isLoading}
          >
            Influencer
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("brand-manager")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
              selectedRole === "brand-manager"
                ? "bg-collab-primary text-white shadow-lg"
                : "bg-transparent text-collab-text-muted hover:text-white hover:bg-collab-dark-lighter"
            }`}
            aria-pressed={selectedRole === "brand-manager"}
            disabled={formState.isLoading}
          >
            Brand-Manager
          </button>
        </div>

        {/* Error Message */}
        {formState.error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {formState.error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder={getUsernamePlaceholder()}
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              required
              disabled={formState.isLoading}
              className="w-full px-4 py-3 bg-collab-dark-light border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-xl focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50"
              aria-label={getUsernameLabel()}
            />
          </div>

          <div className="space-y-2 relative">
            <Input
              type={formState.showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              disabled={formState.isLoading}
              className="w-full px-4 py-3 pr-12 bg-collab-dark-light border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-xl focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={formState.isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-collab-text-muted hover:text-white transition-colors disabled:opacity-50"
              aria-label={formState.showPassword ? "Hide password" : "Show password"}
            >
              {formState.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
              disabled={formState.isLoading}
              className="border-collab-dark-border data-[state=checked]:bg-collab-primary data-[state=checked]:border-collab-primary"
            />
            <label
              htmlFor="remember-me"
              className="text-sm text-collab-text-muted hover:text-white transition-colors cursor-pointer"
            >
              Remember Me
            </label>
          </div>

          <Button
            type="submit"
            disabled={formState.isLoading}
            className="w-full py-3 text-lg font-semibold bg-collab-primary hover:bg-collab-blue-dark text-white rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formState.isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign-In"
            )}
          </Button>
        </form>

        {/* Additional Links */}
        <div className="space-y-4 text-center">
          <Link
            href="/forgot-password"
            className="block text-collab-primary hover:text-collab-secondary transition-colors font-medium"
          >
            Forgot Password?
          </Link>
          <Link
            href="/signup"
            className="block text-collab-primary hover:text-collab-secondary transition-colors font-medium"
          >
            Don't Have an Account Yet
          </Link>
        </div>
      </div>
    </div>
  )
}
