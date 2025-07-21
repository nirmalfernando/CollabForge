"use client"

import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Menu, Leaf } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function CreatorSponsorshipsPage() {
  // Sample campaign data - in a real app this would come from an API
  const campaigns = Array(8).fill({
    title: "Minimal Moves",
    applicants: "20K",
    timestamp: "20:24:39",
    status: "Since reveal",
  })

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" /> {/* Set userRole to influencer */}
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Our Events</h1>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <Menu className="h-8 w-8" />
                <span className="sr-only">Menu</span>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Leaf className="h-6 w-6 text-foreground" />
              <span className="text-lg text-foreground">By Zentro Labs</span>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {campaigns.map((campaign, index) => (
              <Card key={index} className="bg-card border-primary rounded-xl p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      {campaign.title} - <span className="text-primary">{campaign.applicants}</span> Applicants
                    </h2>
                    <p className="text-primary text-lg">
                      {campaign.timestamp} {campaign.status}
                    </p>
                  </div>
                  {/* Link to creator's campaign detail page */}
                  <Link href={`/creator/campaigns/${index + 1}`} prefetch={false}>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-2 bg-transparent"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
