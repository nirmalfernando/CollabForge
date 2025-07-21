"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Menu } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function CreatorCampaignsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample campaign data for creators to browse
  const campaignData = [
    {
      id: 1,
      brand: "Zentro Labs",
      title: "Science, Simplified",
      description: "We're looking for curious minds to feature our health tech gear in real-world routines.",
      budget: "$500 - $900",
      category: "Technology",
    },
    {
      id: 2,
      brand: "Veltra",
      title: "Minimal Moves",
      description: "Join Veltra's minimalist fashion wave. Showcase our limited drops...",
      budget: "$1,000 flat per post",
      category: "Lifestyle",
    },
    {
      id: 3,
      brand: "DripHaus",
      title: "The GlowUp Campaign",
      description: "We're teaming up with fresh creators to showcase our latest skincare drops.",
      budget: "$750 - $1,200",
      category: "Beauty",
    },
    {
      id: 4,
      brand: "Loopify",
      title: "Plug In. Speak Out.",
      description: "Show off our wireless audio gear in action. Music lovers and creators with chill...",
      budget: "$300 - $600",
      category: "Technology",
    },
    {
      id: 5,
      brand: "Orbiton",
      title: "Level Up with Orbiton",
      description: "Gamers, tech heads, and streamers — help us drop our newest smart gear to your audience.",
      budget: "$1,500 - $2,500",
      category: "Technology",
    },
    {
      id: 6,
      brand: "NovaGlow",
      title: "Radiate Bold",
      description: "Create glowing, confident content with NovaGlow's new beauty boosters.",
      budget: "$800 per video + affiliate bonus",
      category: "Beauty",
    },
  ]

  const categories = ["All", "Technology", "Beauty", "Lifestyle"]

  // Filter campaigns based on selected category and search query
  const filteredCampaigns = campaignData.filter((campaign) => {
    const matchesCategory = selectedCategory === "All" || campaign.category === selectedCategory
    const matchesSearch =
      campaign.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-4 pr-16 text-lg"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground hover:text-primary"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Filter menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-card border-2 border-primary rounded-lg p-4" align="end">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    className="cursor-pointer hover:bg-primary/20 text-foreground text-lg py-3 px-4 rounded-none border-none focus:bg-primary/20"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Display Applied Filter */}
          <div className="flex justify-end mb-4">
            <span className="text-sm text-muted-foreground">
              Category: <span className="font-semibold text-primary">{selectedCategory}</span>
            </span>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-card border-primary rounded-lg p-6 flex flex-col justify-between">
                <div className="space-y-2 mb-4">
                  {" "}
                  {/* Added mb-4 for spacing */}
                  <h3 className="text-xl font-bold text-foreground">
                    {campaign.brand} - <span className="text-primary">{campaign.title}</span>
                  </h3>
                  <p className="text-foreground text-sm leading-relaxed">{campaign.description}</p>
                  <p className="text-primary font-medium">Budget: {campaign.budget}</p>
                </div>
                <Link href={`/creator/campaigns/${campaign.id}`} prefetch={false} className="mt-auto">
                  {" "}
                  {/* Added mt-auto to push to bottom */}
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Check It Out
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          {/* No Results Message */}
          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No campaigns found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
