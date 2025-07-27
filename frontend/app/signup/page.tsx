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
  const [userType, setUserType] = useState("influencer") // Default to influencer
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNo: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleUserTypeChange = (value: string) => {
    setUserType(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
        role: userType as "influencer" | "brand",
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
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sign Up Failed",
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
              <Input
                id="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
                disabled={isLoading}
              />
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
                disabled={isLoading}
              />
              <Input
                id="email"
                type="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
                disabled={isLoading}
              />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
                disabled={isLoading}
              />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
                disabled={isLoading}
              />
              <Input
                id="contactNo"
                type="tel"
                placeholder="Contact Number (e.g., +1234567890)"
                value={formData.contactNo}
                onChange={handleChange}
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign-Up"}
              </Button>
            </form>

            <div className="text-center mt-4">
              <Link href="/login" className="text-primary hover:underline" prefetch={false}>
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
