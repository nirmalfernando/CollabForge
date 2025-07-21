"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Menu, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function CreatorBrowseCreatorsPage() {
  const [activeCreatorType, setActiveCreatorType] = useState("Content Creators")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample creator data (same as brand/creators for consistency)
  const creatorData = [
    {
      id: 1,
      type: "Content Creators",
      category: "Technology",
      name: "Alex Chen",
      handle: "@techwithalex",
      followers: "125K",
      engagement: "4.2%",
      description:
        "Tech reviewer and educator creating bite-sized tutorials on the latest gadgets and software. Specializes in making complex tech accessible to everyone.",
      platforms: ["TikTok", "YouTube", "Instagram"],
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      type: "Models",
      category: "Lifestyle",
      name: "Maya Rodriguez",
      handle: "@mayastyle",
      followers: "89K",
      engagement: "5.8%",
      description:
        "Fashion and lifestyle model with a focus on sustainable and minimalist aesthetics. Known for authentic product showcases and styling tips.",
      platforms: ["Instagram", "TikTok"],
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      type: "Live Streamers",
      category: "Beauty",
      name: "Jordan Kim",
      handle: "@jordanglows",
      followers: "67K",
      engagement: "7.1%",
      description:
        "Beauty enthusiast and makeup artist streaming live tutorials and product reviews. Expert in skincare routines and bold makeup looks.",
      platforms: ["Twitch", "Instagram", "YouTube"],
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      type: "Content Creators",
      category: "Technology",
      name: "Sam Parker",
      handle: "@codewithsam",
      followers: "156K",
      engagement: "3.9%",
      description:
        "Software developer and coding instructor creating educational content about programming, web development, and tech career advice.",
      platforms: ["YouTube", "TikTok", "LinkedIn"],
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      type: "Models",
      category: "Technology",
      name: "Zoe Williams",
      handle: "@zoevibes",
      followers: "203K",
      engagement: "6.3%",
      description:
        "Beauty and wellness model promoting natural skincare and self-care routines. Advocates for body positivity and mental health awareness.",
      platforms: ["Instagram", "TikTok", "YouTube"],
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      type: "Live Streamers",
      category: "Lifestyle",
      name: "Riley Thompson",
      handle: "@rileylive",
      followers: "94K",
      engagement: "8.2%",
      description:
        "Lifestyle streamer sharing daily routines, productivity tips, and cozy home content. Known for interactive Q&A sessions and community building.",
      platforms: ["Twitch", "Instagram", "TikTok"],
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 7,
      type: "Content Creators",
      category: "Beauty",
      name: "Mia Santos",
      handle: "@miamakeup",
      followers: "178K",
      engagement: "5.4%",
      description:
        "Professional makeup artist creating tutorials for special occasions, everyday looks, and product reviews. Specializes in diverse skin tones and inclusive beauty.",
      platforms: ["YouTube", "Instagram", "TikTok"],
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 8,
      type: "Models",
      category: "Technology",
      name: "Casey Liu",
      handle: "@caseytech",
      followers: "112K",
      engagement: "4.7%",
      description:
        "Tech-savvy model showcasing wearable technology, smart accessories, and futuristic fashion. Bridges the gap between style and innovation.",
      platforms: ["Instagram", "TikTok", "YouTube"],
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 9,
      type: "Live Streamers",
      category: "Technology",
      name: "Devon Martinez",
      handle: "@devonstreams",
      followers: "143K",
      engagement: "6.8%",
      description:
        "Gaming and tech streamer reviewing the latest hardware, streaming setups, and gaming accessories. Interactive streams with real-time product testing.",
      platforms: ["Twitch", "YouTube", "TikTok"],
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  const creatorTypes = ["Content Creators", "Models", "Live Streamers"]
  const categories = ["All", "Technology", "Beauty", "Lifestyle"]

  // Filter creators based on active type and selected category
  const filteredCreators = creatorData.filter((creator) => {
    const matchesType = creator.type === activeCreatorType
    const matchesCategory = selectedCategory === "All" || creator.category === selectedCategory
    const matchesSearch =
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" /> {/* Set userRole to influencer */}
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Input
              type="text"
              placeholder="Search creators..."
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

          <div className="flex justify-end mb-4">
            <span className="text-sm text-muted-foreground">
              Category: <span className="font-semibold text-primary">{selectedCategory}</span>
            </span>
          </div>

          {/* Creator Type Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {creatorTypes.map((type) => (
              <Button
                key={type}
                variant="outline"
                className={`rounded-full px-8 py-3 text-lg transition-colors ${
                  activeCreatorType === type
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                }`}
                onClick={() => setActiveCreatorType(type)}
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Creators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredCreators.map((creator) => (
              <div key={creator.id} className="bg-card rounded-lg p-6 space-y-4 flex flex-col">
                {/* Creator Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                    <AvatarFallback className="bg-primary text-white font-bold">
                      {creator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{creator.name}</h3>
                    <p className="text-primary font-medium">{creator.handle}</p>
                  </div>
                </div>

                {/* Creator Stats */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{creator.followers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{creator.engagement}</span>
                  </div>
                </div>

                {/* Creator Description */}
                <p className="text-foreground text-sm leading-relaxed">{creator.description}</p>

                {/* Platforms */}
                <div className="flex flex-wrap gap-2">
                  {creator.platforms.map((platform) => (
                    <span key={platform} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                      {platform}
                    </span>
                  ))}
                </div>

                {/* View Profile Button */}
                <Link href={`/creator/creators/${creator.id}`} prefetch={false} className="mt-4 block mt-auto">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    View Profile
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredCreators.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No creators found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
