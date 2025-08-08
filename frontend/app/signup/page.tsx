"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useRouter } from "next/navigation"
import { authApi, setAuthData, ApiError } from "@/lib/api"

export default function SignUpPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<"influencer" | "brand">("influencer")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNo: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required"
        } else if (value.length < 1 || value.length > 255) {
          newErrors.name = "Name must be between 1 and 255 characters"
        } else {
          delete newErrors.name
        }
        break

      case "username":
        if (!value.trim()) {
          newErrors.username = "Username is required"
        } else if (value.length < 3 || value.length > 100) {
          newErrors.username = "Username must be between 3 and 100 characters"
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username = "Username can only contain letters, numbers, and underscores"
        } else {
          delete newErrors.username
        }
        break

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Invalid email format"
        } else {
          delete newErrors.email
        }
        break

      case "password":
        if (!value.trim()) {
          newErrors.password = "Password is required"
        } else if (value.length < 8 || value.length > 100) {
          newErrors.password = "Password must be between 8 and 100 characters"
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(
            value
          )
        ) {
          newErrors.password =
            "Password must contain at least one uppercase, one lowercase, one number, and one special character"
        } else {
          delete newErrors.password
          // Also validate confirmPassword if password changes
          if (formData.confirmPassword && value !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
          } else {
            delete newErrors.confirmPassword
          }
        }
        break

      case "confirmPassword":
        if (!value.trim()) {
          newErrors.confirmPassword = "Please confirm your password"
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match"
        } else {
          delete newErrors.confirmPassword
        }
        break

      case "contactNo":
        if (!value.trim()) {
          newErrors.contactNo = "Contact number is required"
        } else if (!/^\+?[1-9]\d{7,14}$/.test(value)) {
          newErrors.contactNo =
            "Contact number must be in international format (e.g., +1234567890)"
        } else {
          delete newErrors.contactNo
        }
        break

      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    validateField(id, value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    validateField(id, value)
  }

  const handleUserTypeChange = (value: "influencer" | "brand") => {
    setUserType(value)
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Validate all fields
    isValid = validateField("name", formData.name) && isValid
    isValid = validateField("username", formData.username) && isValid
    isValid = validateField("email", formData.email) && isValid
    isValid = validateField("password", formData.password) && isValid
    isValid = validateField("confirmPassword", formData.confirmPassword) && isValid
    isValid = validateField("contactNo", formData.contactNo) && isValid

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const userData = {
        ...formData,
        role: userType,
      }

      const response = await authApi.register(userData)

      // Store auth data
      setAuthData(response.token, { role: userType })

      toast({
        title: "Sign Up Successful",
        description: "Your account has been created successfully!",
      })

      // Redirect based on role
      if (userType === "influencer") {
        router.push("/creator/dashboard")
      } else {
        router.push("/brand/dashboard")
      }
    } catch (error) {
      console.error("Sign up error:", error)

      if (error instanceof ApiError) {
        // Handle backend validation errors
        if (error.details?.errors) {
          // Convert array of errors to object format
          const backendErrors = error.details.errors.reduce((acc: Record<string, string>, curr: any) => {
            // Use 'param' (field name) as key and 'msg' as value
            const field = curr.param || curr.path || 'general';
            acc[field] = curr.msg;
            return acc;
          }, {});

          // Update the errors state with backend validation errors
          setErrors(backendErrors);

          toast({
            title: "Validation Error",
            description: "Please fix the errors in the form",
            variant: "destructive",
          });
        } else {
          // Handle other API errors
          toast({
            title: "Sign Up Failed",
            description: error.message || "An unexpected error occurred",
            variant: "destructive",
          });
        }
      } else {
        // Handle non-API errors
        toast({
          title: "Sign Up Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={false} />

      <main className="flex-1 flex">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
          {/* Left Panel - Sign-Up Form */}
          <div className="bg-background p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-8 text-primary">Sign-Up</h1>

            {/* Role Selection Toggle */}
            <div className="flex bg-muted rounded-full p-1 mb-8">
              <Button
                type="button"
                className={`flex-1 rounded-full text-lg py-3 ${
                  userType === "influencer"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground hover:bg-primary/20"
                }`}
                onClick={() => handleUserTypeChange("influencer")}
                disabled={isLoading}
              >
                Influencer
              </Button>
              <Button
                type="button"
                className={`flex-1 rounded-full text-lg py-3 ${
                  userType === "brand"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground hover:bg-primary/20"
                }`}
                onClick={() => handleUserTypeChange("brand")}
                disabled={isLoading}
              >
                Brand-Manager
              </Button>
            </div>

            {/* Sign-Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  required
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 ${
                    errors.username ? "border-red-500" : ""
                  }`}
                  required
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  required
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  required
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  required
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <Input
                  id="contactNo"
                  type="tel"
                  placeholder="Contact Number (e.g., +1234567890)"
                  value={formData.contactNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 ${
                    errors.contactNo ? "border-red-500" : ""
                  }`}
                  required
                  disabled={isLoading}
                />
                {errors.contactNo && (
                  <p className="mt-1 text-sm text-red-500">{errors.contactNo}</p>
                )}
              </div>

              {/* Display general errors from backend */}
              {errors.general && (
                <div className="mt-4 text-sm text-red-500">
                  {errors.general}
                </div>
              )}

              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent mt-6"
                disabled={isLoading || Object.keys(errors).length > 0}
              >
                {isLoading ? "Signing Up..." : "Sign-Up"}
              </Button>
            </form>

            <div className="text-center mt-4">
              <Link
                href="/login"
                className="text-primary hover:underline"
                prefetch={false}
              >
                I Already Have an Account
              </Link>
            </div>
          </div>

          {/* Right Panel - Decorative */}
          <div className="hidden lg:flex items-center justify-center bg-primary p-8 md:p-12 relative overflow-hidden">
            {/* Large blue arc */}
            <div className="absolute -left-40 -top-40 w-[600px] h-[600px] rounded-full border-4 border-primary-foreground/30" />
            <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] rounded-full border-4 border-primary-foreground/20" />
            <h2 className="text-5xl font-bold text-white z-10">CollabForge</h2>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}