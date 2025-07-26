"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CreateCampaignPage() {
  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    category: "", // New field for category
  })

  // Category options - in the future this will come from a GET request to category table
  const categoryOptions = [
    { id: "1", name: "Technology" },
    { id: "2", name: "Beauty & Skincare" },
    { id: "3", name: "Fashion & Style" },
    { id: "4", name: "Fitness & Health" },
    { id: "5", name: "Food & Cooking" },
    { id: "6", name: "Travel & Adventure" },
    { id: "7", name: "Gaming" },
    { id: "8", name: "Education & Science" },
    { id: "9", name: "Music & Entertainment" },
    { id: "10", name: "Lifestyle & Vlogs" },
    { id: "11", name: "Art & Design" },
    { id: "12", name: "Business & Finance" },
    { id: "13", name: "Home & DIY" },
    { id: "14", name: "Parenting & Family" },
    { id: "15", name: "Sports" },
    { id: "16", name: "Comedy & Humor" },
    { id: "17", name: "Photography" },
    { id: "18", name: "Automotive" },
    { id: "19", name: "Pets & Animals" },
    { id: "20", name: "Other" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setCampaignData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setCampaignData((prev) => ({ ...prev, category: value }))
  }

  const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
    setCampaignData((prev) => ({ ...prev, [field]: date }))
  }

  const handleConfirmCampaign = () => {
    // In a real application, you would send campaignData to your backend
    console.log("Campaign Data:", campaignData)
    toast({
      title: "Campaign Created",
      description: "Your sponsorship campaign has been successfully created!",
    })
    // Redirect to campaign list or dashboard
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Create New Sponsorship Campaign</h1>
            <p className="text-muted-foreground mt-2">Fill out the details for your new campaign.</p>
          </div>

          <div className="space-y-6 rounded-lg border border-muted bg-card p-6 shadow-lg">
            <div>
              <Label htmlFor="name" className="text-lg font-semibold">
                Campaign Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Summer Product Launch"
                value={campaignData.name}
                onChange={handleChange}
                className="mt-2 bg-muted border-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-lg font-semibold">
                Campaign Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign objectives, target audience, and desired outcomes."
                value={campaignData.description}
                onChange={handleChange}
                className="mt-2 min-h-[120px] bg-muted border-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Label htmlFor="budget" className="text-lg font-semibold">
                Budget ($)
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 5000"
                value={campaignData.budget}
                onChange={handleChange}
                className="mt-2 bg-muted border-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Category Selection */}
            <div>
              <Label htmlFor="category" className="text-lg font-semibold">
                Category/Niche
              </Label>
              <Select value={campaignData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full mt-2 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3">
                  <SelectValue placeholder="Select campaign category/niche" />
                </SelectTrigger>
                <SelectContent className="bg-card text-foreground max-h-60 overflow-y-auto">
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="hover:bg-primary/20">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startDate" className="text-lg font-semibold">
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 bg-muted border-none text-foreground hover:bg-muted/80",
                        !campaignData.startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignData.startDate ? format(campaignData.startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card text-foreground">
                    <Calendar
                      mode="single"
                      selected={campaignData.startDate}
                      onSelect={(date) => handleDateChange("startDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="endDate" className="text-lg font-semibold">
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 bg-muted border-none text-foreground hover:bg-muted/80",
                        !campaignData.endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignData.endDate ? format(campaignData.endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card text-foreground">
                    <Calendar
                      mode="single"
                      selected={campaignData.endDate}
                      onSelect={(date) => handleDateChange("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button onClick={handleConfirmCampaign} className="w-full rounded-full py-3 text-lg">
              Create Campaign
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
