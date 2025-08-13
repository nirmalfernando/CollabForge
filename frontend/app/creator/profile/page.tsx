"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  Pencil,
  Monitor,
  Users,
  Sparkles,
  Instagram,
  Youtube,
  Mail,
  Globe,
  BoltIcon as Bat,
  Gem,
  Feather,
  Zap,
  Leaf,
} from "lucide-react"
import { creatorApi, getAuthData } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export default function CreatorProfilePage() {
  const router = useRouter()
  const [creatorData, setCreatorData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authData, setAuthDataState] = useState<any>(null)

  useEffect(() => {
    const auth = getAuthData()
    if (!auth || auth.user.role !== "influencer") {
      router.push("/login")
      return
    }
    setAuthDataState(auth)

    const loadCreatorProfile = async () => {
      try {
        setIsLoading(true)
        const profile = await creatorApi.getCreatorByUserId(auth.user.userId)
        setCreatorData(profile)
      } catch (error: any) {
        console.error("Failed to load creator profile:", error)
        if (error.status === 404) {
          // Profile doesn't exist, redirect to create new profile
          router.push("/creator/profile/new")
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

    loadCreatorProfile()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading profile...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!creatorData) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 flex items-center justify-center">
          <div>Profile not found</div>
        </main>
        <Footer />
      </div>
    )
  }

  // Map social media platforms to icons
  const platformIconMap: { [key: string]: any } = {
    TikTok: Monitor,
    Instagram: Instagram,
    YouTube: Youtube,
    Email: Mail,
    Website: Globe,
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1">
        {/* Banner Section - Changed background to light gray #f5f5f5 */}
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-[#f5f5f5]">
          <Image
            src={creatorData.backgroundImgUrl || "/placeholder.svg?height=400&width=1200"}
            alt="Profile banner"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-primary rounded-full p-2 z-10 hover:bg-primary/80"
          >
            <Pencil className="h-6 w-6 text-white" />
            <span className="sr-only">Edit banner</span>
          </Button>
        </section>

        {/* Main content area with dark background */}
        <div className="relative bg-background pt-8 pb-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Picture Container - positioned to overlap */}
              <div className="relative -mt-20 md:-mt-24 lg:-mt-28 flex-shrink-0">
                <Avatar className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-primary shadow-lg">
                  <AvatarImage
                    src={creatorData.profilePicUrl || "/placeholder.svg?height=200&width=200"}
                    alt={`${creatorData.firstName} profile picture`}
                  />
                  <AvatarFallback>
                    {creatorData.firstName?.[0]}
                    {creatorData.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 w-full pt-4 md:pt-0">
                {/* Follower count and Edit Profile button - next to avatar */}
                <div className="flex items-center justify-between w-full mb-4">
                  <p className="text-2xl font-semibold text-muted-foreground">
                    {creatorData.socialMedia?.find((sm: any) => sm.followers)?.followers || "0"} Followers (
                    {creatorData.socialMedia?.[0]?.platform || "Platform"})
                  </p>
                  <Link href="/creator/profile/edit" prefetch={false}>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                </div>
                {/* Name, Bio, Details, Platforms - now correctly positioned below the avatar and its horizontal content */}
                <h1 className="text-4xl md:text-5xl font-bold mt-2">
                  {creatorData.firstName}{" "}
                  {creatorData.nickName && <span className="text-primary">&quot;{creatorData.nickName}&quot;</span>}{" "}
                  {creatorData.lastName}
                </h1>
                <p className="text-foreground mt-4">{creatorData.bio}</p>

                {/* Display Creator Type */}
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-lg">
                  {creatorData.type && (
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Type: {creatorData.type}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Details:</h3>
                    <ul className="space-y-2">
                      {creatorData.details?.map((detail: any, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          {detail.label}: {detail.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Official Platforms:</h3>
                    <ul className="space-y-2">
                      {creatorData.socialMedia?.map((platform: any, index: number) => {
                        const IconComponent = platformIconMap[platform.platform] || Monitor
                        return (
                          <li key={index} className="flex items-center gap-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <Link href={platform.url || "#"} className="hover:underline" prefetch={false}>
                              {platform.platform} - {platform.handle}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* Remaining sections: What I Do, My People, My Content, Worked With */}
            <div className="mt-8 space-y-8 text-lg">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  What <span className="text-primary">I Do</span>
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {creatorData.whatIDo?.map((item: any, index: number) => (
                    <li key={index}>
                      {item.activity} {item.experience && `(${item.experience})`}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">
                  My <span className="text-primary">People</span>
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {creatorData.myPeople?.map((item: any, index: number) => (
                    <li key={index}>
                      {item.name} {item.role && `- ${item.role}`}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">
                  My <span className="text-primary">Content</span>
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {creatorData.myContent?.map((item: any, index: number) => (
                    <li key={index}>
                      {item.title} {item.views && `(${item.views} views)`}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">
                  I&apos;ve <span className="text-primary">Worked With</span>
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {creatorData.pastCollaborations?.map((item: any, index: number) => (
                    <li key={index}>
                      {item.brand} - {item.campaign} {item.date && `(${item.date})`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Collabs Through Us Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted mt-12">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Collabs <span className="text-primary">Through Us</span>
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <Bat className="h-12 w-12 text-foreground" />
              <Gem className="h-12 w-12 text-foreground" />
              <Zap className="h-12 w-12 text-foreground" />
              <Feather className="h-12 w-12 text-foreground" />
              <Leaf className="h-12 w-12 text-foreground" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}