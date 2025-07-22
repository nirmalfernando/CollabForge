"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useRouter } from "next/navigation" // Import useRouter

export default function SignUpPage() {
  const [role, setRole] = useState<"influencer" | "brand-manager">("influencer")
  const router = useRouter() // Initialize useRouter

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate successful sign-up
    setTimeout(() => {
      router.push("/home") // Redirect to home page
    }, 500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={false} /> {/* Header for unauthenticated users */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl rounded-xl overflow-hidden shadow-lg">
          {/* Left Panel - Sign-Up Form */}
          <div className="bg-background p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-8 text-primary">Sign-Up</h1>

            {/* Role Selection Toggle */}
            <div className="flex bg-muted rounded-full p-1 mb-8">
              <Button
                className={`flex-1 rounded-full text-lg py-3 ${
                  role === "influencer"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground hover:bg-primary/20"
                }`}
                onClick={() => setRole("influencer")}
              >
                Influencer
              </Button>
              <Button
                className={`flex-1 rounded-full text-lg py-3 ${
                  role === "brand-manager"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground hover:bg-primary/20"
                }`}
                onClick={() => setRole("brand-manager")}
              >
                Brand-Manager
              </Button>
            </div>

            {/* Sign-Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Name"
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
              />
              <Input
                type="text"
                placeholder="Username"
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
              />
              <Input
                type="email"
                placeholder="E-mail"
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
              />
              <Input
                type="tel"
                placeholder="Contact Number"
                className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
              />

              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent mt-6"
              >
                Sign-Up
              </Button>
            </form>
            <div className="text-center mt-4">
              <Link href="/login" className="text-primary hover:underline" prefetch={false}>
                I Already Have an Account!
              </Link>
            </div>
          </div>

          {/* Right Panel - Decorative */}
          <div className="hidden lg:flex items-center justify-center bg-primary p-8 md:p-12 relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full border-4 border-primary/50 animate-pulse" />
            </div>
            <h2 className="text-5xl font-bold text-white z-10">CollabForge</h2>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
