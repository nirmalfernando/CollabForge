"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { brandApi, getAuthData } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

export default function BrandProfilePage() {
  const router = useRouter()
  const [brandData, setBrandData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authData, setAuthDataState] = useState<any>(null)

  useEffect(() => {
    const auth = getAuthData()
    if (!auth || auth.user.role !== "brand") {
      router.push("/login")
      return
    }
    setAuthDataState(auth)

    const loadBrandProfile = async () => {
      try {
        setIsLoading(true)
        const profile = await brandApi.getBrandByUserId(auth.user.userId)
        setBrandData(profile)
      } catch (error: any) {
        console.error("Failed to load brand profile:", error)
        if (error.status === 404) {
          router.push("/brand/profile/new")
        } else {
          toast({
            title: "Error",
            description: "Failed to load profile",
            variant: "destructive",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadBrandProfile()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand" />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading profile...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!brandData) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand" />
        <main className="flex-1 flex items-center justify-center">
          <div>Profile not found</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand" />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-[#f5f5f5]">
          <Image
            src={brandData.backgroundImageUrl || "/placeholder.svg?height=400&width=1200"}
            alt="Brand banner"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
        </section>

        {/* Main content area with dark background */}
        <div className="relative bg-background pb-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Picture/Logo Container - positioned to overlap */}
              <div className="relative -mt-20 md:-mt-24 lg:-mt-28 flex-shrink-0">
                <Avatar className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-primary shadow-lg bg-black flex items-center justify-center">
                  <AvatarImage src={brandData.profilePicUrl || "/placeholder.svg"} alt={brandData.companyName} />
                  <AvatarFallback className="bg-primary text-white text-4xl font-bold">
                    {brandData.companyName?.[0] || "B"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Brand Info */}
              <div className="flex-1 w-full pt-4 md:pt-0">
                {/* Horizontal Blue Line and Buttons */}
                <div className="flex items-center justify-end w-full space-x-4 mb-4">
                  <Link href="/brand/profile/edit" prefetch={false}>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 bg-transparent"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/brand/campaigns/create" prefetch={false}>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 bg-transparent"
                    >
                      Create Campaigns
                    </Button>
                  </Link>
                </div>
                {/* Blue horizontal divider line */}
                <div className="w-full h-[2px] bg-primary mb-6" />

                {/* Original content follows here for brand name, bio, details etc. */}
                <div className="flex flex-col gap-4 md:gap-5 flex-1">
                  <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold">{brandData.companyName}</h1>
                    <p className="text-lg text-muted-foreground">{brandData.bio}</p>
                  </div>

                  {/* What We Look For Section */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold">
                      What We Look For in <span className="text-primary">Collaborators</span>
                    </h3>
                    <div className="text-lg space-y-1 text-muted-foreground">
                      <p>Target Audience: {brandData.whatWeLookFor?.targetAudience}</p>
                      <p>Collaboration Type: {brandData.whatWeLookFor?.collaborationType}</p>
                    </div>
                  </div>

                  {/* Popular Campaigns Section */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold">
                      Popular <span className="text-primary">Sponsorship Campaigns</span>
                    </h3>
                    <div className="grid gap-4">
                      {brandData.popularCampaigns?.map((campaign: any, index: number) => (
                        <div key={index} className="border border-primary rounded-md p-4 space-y-2 bg-card">
                          <h4 className="font-semibold text-xl text-primary">{campaign.campaignName}</h4>
                          <p className="text-base text-muted-foreground">
                            {campaign.startDate} - {campaign.endDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description Section */}
                  {brandData.description && (
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold">
                        About <span className="text-primary">Us</span>
                      </h3>
                      <div className="text-lg space-y-2 text-muted-foreground">
                        {brandData.description.mission && (
                          <p>
                            <strong>Mission:</strong> {brandData.description.mission}
                          </p>
                        )}
                        {brandData.description.vision && (
                          <p>
                            <strong>Vision:</strong> {brandData.description.vision}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}