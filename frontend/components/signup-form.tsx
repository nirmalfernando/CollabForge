"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Import useRouter
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react" // Import Loader2 for loading state

type UserRole = "influencer" | "brand-manager"

interface FormData {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
  contactNumber: string
  role: UserRole
}

export default function SignUpForm() {
  const router = useRouter() // Initialize useRouter
  const [selectedRole, setSelectedRole] = useState<UserRole>("influencer")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    role: "influencer",
  })
  const [isLoading, setIsLoading] = useState(false) // Add loading state
  const [error, setError] = useState<string | null>(null) // Add error state

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role)
    setFormData((prev) => ({ ...prev, role }))
    setError(null) // Clear error on role change
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null) // Clear error on input change
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Basic client-side validation
    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.")
      setIsLoading(false)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call for signup
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Form submitted with data:", formData)

      // Simulate successful signup and redirect
      console.log("Signup successful! Redirecting to dashboard...")
      router.push("/") // Redirect to the landing page (which will show dashboard if authenticated)
    } catch (err) {
      setError("Signup failed. Please try again.")
      console.error("Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-collab-primary mb-8">Sign-Up</h1>

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
            disabled={isLoading}
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
            disabled={isLoading}
          >
            Brand-Manager
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-collab-dark-light border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-xl focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-collab-dark-light border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-xl focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-collab-dark-light border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-xl focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-collab-dark-light border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-xl focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-collab-dark-light border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-xl focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="tel"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange("contactNumber", e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-collab-dark-light border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-xl focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-lg font-semibold bg-collab-primary hover:bg-collab-blue-dark text-white rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing Up...
              </>
            ) : (
              "Sign-Up"
            )}
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <Link href="/login" className="text-collab-primary hover:text-collab-secondary transition-colors font-medium">
            I Already Have an Account!
          </Link>
        </div>
      </div>
    </div>
  )
}
