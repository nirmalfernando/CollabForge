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

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    identifier: "", // Can be username or email
    password: "",
  })
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    general: "",
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      identifier: "",
      password: "",
      general: "",
    }

    // Validate identifier (username or email)
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Username or email is required"
      isValid = false
    } else if (formData.identifier.includes("@")) {
      // Validate email format if it contains @
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.identifier)) {
        newErrors.identifier = "Invalid email format"
        isValid = false
      }
    } else {
      // Validate username length
      if (formData.identifier.length < 3 || formData.identifier.length > 100) {
        newErrors.identifier = "Username must be between 3 and 100 characters"
        isValid = false
      }
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    // Clear error when user types
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({ ...errors, general: "" })

    try {
      const response = await authApi.login(formData)

      // Store auth data
      setAuthData(response.token, response.user)

      toast({
        title: "Login Successful",
        description: "You have been successfully logged in!",
      })

      // Redirect based on role
      if (response.user.role === "influencer") {
        router.push("/creator/dashboard")
      } else if (response.user.role === "brand") {
        router.push("/brand/dashboard")
      } else {
        // Handle other roles or default to a home page
        router.push("/home")
      }
    } catch (error) {
      console.error("Login error:", error)

      if (error instanceof ApiError) {
        if (error.status === 404) {
          setErrors({
            ...errors,
            identifier: "User not found",
            password: "",
          })
        } else if (error.status === 401) {
          setErrors({
            ...errors,
            identifier: "",
            password: "Incorrect password",
          })
        } else {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Login Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
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
          {/* Left Panel - Login Form */}
          <div className="bg-background p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-8 text-primary">Login</h1>

            {/* Display general error message */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Username or E-mail"
                  value={formData.identifier}
                  onChange={handleChange}
                  className={`w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 ${
                    errors.identifier ? "border-red-500" : ""
                  }`}
                  required
                  disabled={isLoading}
                />
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
                )}
              </div>

              <div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  required
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Logging In..." : "Login"}
              </Button>
            </form>

            <div className="text-center mt-4">
              <Link href="/signup" className="text-primary hover:underline" prefetch={false}>
                Don&apos;t Have an Account? Sign Up
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