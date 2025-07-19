"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function ContactUsSection() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"success" | "error" | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
    if (status) setStatus(null)
    if (message) setMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus(null)
    setMessage(null)

    // Basic validation
    if (!formData.email || !formData.name || !formData.message) {
      setStatus("error")
      setMessage("All fields are required.")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setStatus("success")
      setMessage("Your message has been sent successfully!")
      setFormData({ email: "", name: "", message: "" }) // Clear form
    } catch (err) {
      setStatus("error")
      setMessage("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-collab-dark py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Image */}
        <div className="relative w-full h-64 md:h-96 lg:h-full rounded-xl overflow-hidden shadow-lg">
          <img
            src="/placeholder.svg?height=600&width=800" // Placeholder for the abstract image
            alt="Abstract background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* You can replace the above with a real image or a more complex gradient/pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-collab-blue-darker/50 to-collab-dark/70"></div>
        </div>

        {/* Right side - Contact Form */}
        <div className="bg-collab-dark-light p-8 rounded-xl shadow-lg border border-collab-dark-border">
          <h2 className="text-4xl font-bold text-collab-primary mb-8 text-center lg:text-left">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-collab-dark-lighter border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-xl focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-collab-dark-lighter border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-xl focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <Textarea
                id="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                disabled={isLoading}
                rows={5}
                className="w-full px-4 py-3 bg-collab-dark-lighter border border-collab-dark-border text-white placeholder:text-collab-text-muted rounded-xl focus:border-collab-primary focus:ring-1 focus:ring-collab-primary transition-colors disabled:opacity-50 resize-y"
              />
            </div>
            {status && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  status === "success"
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}
              >
                {message}
              </div>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              variant="outline"
              className="w-full py-3 text-lg font-semibold border-collab-primary text-collab-primary hover:bg-collab-primary hover:text-white rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Response"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
