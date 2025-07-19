"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BrandSection from "@/components/brand-section"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSubmitted(true)
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-collab-dark">
      <Header />

      <main className="flex-1 grid lg:grid-cols-2">
        {/* Left Column - Forgot Password Form */}
        <div className="flex items-center justify-center py-12 px-4 bg-collab-dark">
          <div className="w-full max-w-md mx-auto px-6 py-8">
            <div className="space-y-8">
              {/* Back Link */}
              <Link
                href="/login"
                className="inline-flex items-center text-collab-primary hover:text-collab-secondary transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>

              {!isSubmitted ? (
                <>
                  {/* Title */}
                  <div>
                    <h1 className="text-4xl font-bold text-collab-primary mb-4">Forgot Password?</h1>
                    <p className="text-collab-text-muted">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (error) setError(null)
                        }}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-collab-dark-light border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-lg focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50"
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
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  {/* Success State */}
                  <div className="text-center space-y-6">
                    <div className="flex justify-center">
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-collab-primary mb-4">Check Your Email</h1>
                      <p className="text-collab-text-muted">
                        We've sent a password reset link to <span className="text-white font-medium">{email}</span>
                      </p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm text-collab-text-muted">
                        Didn't receive the email? Check your spam folder or try again.
                      </p>
                      <Button
                        onClick={() => {
                          setIsSubmitted(false)
                          setEmail("")
                        }}
                        variant="outline"
                        className="w-full border-collab-primary text-collab-primary hover:bg-collab-primary hover:text-white"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Brand Section */}
        <div className="hidden lg:block">
          <BrandSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
