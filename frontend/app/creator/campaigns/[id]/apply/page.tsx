"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { DateRange } from "react-day-picker" // Import DateRange type

export default function CampaignApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<{
    proposalTitle: string
    proposalPitch: string
    contentPlan: string
    timeline: DateRange | undefined // Changed type to DateRange | undefined
  }>({
    proposalTitle: "",
    proposalPitch: "",
    contentPlan: "",
    timeline: undefined, // Initialize as undefined
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // No direct handleChange for timeline as it's handled by the DatePicker

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate application submission
    console.log("Application submitted:", formData)
    toast({
      title: "Application Submitted",
      description: "Your application has been successfully submitted!",
    })
    // Redirect back to the campaign details page or a confirmation page
    router.push("/creator/applications")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />
      <main className="flex-1 flex items-center justify-center py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl rounded-xl overflow-hidden shadow-lg">
          {/* Left Panel - Application Form */}
          <div className="bg-muted p-8 md:p-12 flex flex-col justify-center rounded-l-xl">
            <h1 className="text-4xl font-bold mb-8 text-primary">Application</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  name="proposalTitle"
                  placeholder="Proposal Title"
                  value={formData.proposalTitle}
                  onChange={handleChange}
                  className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <Textarea
                  name="proposalPitch"
                  placeholder="Proposal Pitch"
                  value={formData.proposalPitch}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 resize-y"
                  required
                />
              </div>
              <div>
                <Textarea
                  name="contentPlan"
                  placeholder="Content Plan"
                  value={formData.contentPlan}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 resize-y"
                  required
                />
              </div>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3",
                        !formData.timeline?.from && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.timeline?.from ? (
                        formData.timeline.to ? (
                          <>
                            {format(formData.timeline.from, "LLL dd, y")} - {format(formData.timeline.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(formData.timeline.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Timeline</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card text-foreground" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={formData.timeline?.from}
                      selected={formData.timeline}
                      onSelect={(range) => setFormData((prev) => ({ ...prev, timeline: range || undefined }))}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent mt-6"
              >
                Apply
              </Button>
            </form>
          </div>

          {/* Right Panel - Decorative */}
          <div className="hidden lg:flex items-center justify-center bg-background relative overflow-hidden rounded-r-xl">
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
  )
}
