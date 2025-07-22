"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useRouter } from "next/navigation"
import { Trash2, X } from "lucide-react"

export default function CreateCampaignPage() {
  const [campaignData, setCampaignData] = useState({
    title: "",
    budget: "",
    status: "",
    requirements: "",
    description: "",
    category: "", // Added category state
  })
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const router = useRouter()

  const categoryOptions = [
    "Technology",
    "Beauty",
    "Fashion",
    "Fitness",
    "Gaming",
    "Education",
    "Food & Drink",
    "Travel",
    "Lifestyle",
    "Arts & Culture",
    "Music",
    "Sports",
    "Finance",
    "Health & Wellness",
    "Parenting",
    "DIY & Crafts",
    "Pets",
    "Automotive",
    "Science",
    "Comedy",
  ]

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Open the confirmation dialog
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmCampaign = () => {
    console.log("Campaign Data confirmed for submission:", campaignData)
    // In a real app, this is where you would call your API to submit the campaign data
    // For now, simulate submission and redirect
    setTimeout(() => {
      setIsConfirmDialogOpen(false) // Close dialog
      router.push("/brand/dashboard") // Redirect to brand dashboard after creation
    }, 500)
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />

        <main className="flex-1 flex items-center justify-center py-12 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl rounded-xl overflow-hidden shadow-lg bg-card">
            {/* Left Panel - Campaign Form */}
            <div className="bg-card p-8 md:p-12 flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-8 text-primary">Sponsorships</h1>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <Input
                  type="text"
                  placeholder="Title"
                  value={campaignData.title}
                  onChange={(e) => setCampaignData({ ...campaignData, title: e.target.value })}
                  className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                  required
                />
                <Input
                  type="text"
                  placeholder="Budget"
                  value={campaignData.budget}
                  onChange={(e) => setCampaignData({ ...campaignData, budget: e.target.value })}
                  className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                  required
                />
                <Select
                  value={campaignData.status}
                  onValueChange={(value) => setCampaignData({ ...campaignData, status: value })}
                >
                  <SelectTrigger className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-foreground">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {/* New Category Dropdown */}
                <Select
                  value={campaignData.category}
                  onValueChange={(value) => setCampaignData({ ...campaignData, category: value })}
                >
                  <SelectTrigger className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3">
                    <SelectValue placeholder="Select Category/Niche" />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-foreground max-h-60 overflow-y-auto">
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Requirements"
                  value={campaignData.requirements}
                  onChange={(e) => setCampaignData({ ...campaignData, requirements: e.target.value })}
                  className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                  required
                />
                <Textarea
                  placeholder="Description"
                  value={campaignData.description}
                  onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                  rows={5}
                  className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 resize-y"
                  required
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent mt-6"
                >
                  Next
                </Button>
              </form>
            </div>

            {/* Right Panel - Decorative (mimicking the arc) */}
            <div className="hidden lg:flex items-center justify-center bg-background relative overflow-hidden">
              {/* Large blue arc */}
              <div
                className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full bg-primary"
                style={{ clipPath: "ellipse(50% 50% at 100% 50%)" }}
              />
              <h2 className="text-5xl font-bold text-white z-10">CollabForge</h2>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Confirmation Dialog - Moved outside main content */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card text-foreground border-4 border-primary rounded-xl p-8 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <DialogHeader className="relative mb-6">
            <DialogTitle className="text-primary text-3xl font-bold text-left">Confirm</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 text-primary hover:text-primary/80"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
            <Button variant="ghost" size="icon" className="absolute top-0 right-10 text-primary hover:text-primary/80">
              <Trash2 className="h-6 w-6" />
              <span className="sr-only">Delete</span>
            </Button>
          </DialogHeader>
          <DialogDescription className="text-foreground text-base leading-relaxed mb-8">
            You&apos;re about to finalize this action. Please double-check all the information provided, as once
            confirmed, changes may not be possible. If everything looks good and you&apos;re ready to proceed, click
            &apos;Confirm&apos; to continue. Otherwise, take a moment to review your inputs before moving forward.
          </DialogDescription>
          <DialogFooter className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
              onClick={handleConfirmCampaign}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
