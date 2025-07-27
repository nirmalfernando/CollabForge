"use client"

import type React from "react"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Pencil, Plus } from "lucide-react"
import { brandApi, getAuthData, imageUploadApi } from "@/lib/api" // Import imageUploadApi

const MAX_FILE_SIZE_MB = 10 // Max file size for image uploads

export default function BrandNewProfilePage() {
  const router = useRouter()
  const [authData, setAuthDataState] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // State for managing forms
  const [isEditingBanner, setIsEditingBanner] = useState(false)
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false)

  // States for image uploads
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null)
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null)
  const [selectedProfilePicFile, setSelectedProfilePicFile] = useState<File | null>(null)
  const [profilePicPreviewUrl, setProfilePicPreviewUrl] = useState<string | null>(null)

  // Initial brand data for new profile - set image URLs to null
  const [brandData, setBrandData] = useState({
    companyName: "",
    bio: "",
    mission: "",
    vision: "",
    targetAudience: "",
    collaborationType: "",
    profilePicUrl: null as string | null, // Changed to null
    bannerImageUrl: null as string | null, // Changed to null
  })

  useEffect(() => {
    const auth = getAuthData()
    if (!auth || auth.user.role !== "brand") {
      router.push("/login")
      return
    }
    setAuthDataState(auth)
  }, [router])

  // Cleanup object URLs when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl)
      if (profilePicPreviewUrl) URL.revokeObjectURL(profilePicPreviewUrl)
    }
  }, [bannerPreviewUrl, profilePicPreviewUrl])

  const handleSaveSettings = async () => {
    if (!authData) return

    if (!brandData.companyName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the Company Name.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Transform data to match API format
      const apiData = {
        userId: authData.user.userId,
        companyName: brandData.companyName,
        bio: brandData.bio || undefined,
        description: {
          mission: brandData.mission || undefined,
          vision: brandData.vision || undefined,
        },
        whatWeLookFor: {
          targetAudience: brandData.targetAudience || undefined,
          collaborationType: brandData.collaborationType || undefined,
        },
        profilePicUrl: brandData.profilePicUrl || undefined, // Send null/undefined if not set
        backgroundImageUrl: brandData.bannerImageUrl || undefined, // Send null/undefined if not set
      }

      await brandApi.createBrand(apiData)

      toast({
        title: "Profile Created",
        description: "Your brand profile has been created successfully!",
      })

      // Redirect to profile page
      router.push("/brand/profile")
    } catch (error: any) {
      console.error("Failed to create brand profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create brand profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBannerFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (e.g., JPG, PNG, GIF).",
          variant: "destructive",
        })
        setSelectedBannerFile(null)
        setBannerPreviewUrl(null)
        return
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `Please select an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
          variant: "destructive",
        })
        setSelectedBannerFile(null)
        setBannerPreviewUrl(null)
        return
      }
      setSelectedBannerFile(file)
      if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl)
      setBannerPreviewUrl(URL.createObjectURL(file))
    } else {
      setSelectedBannerFile(null)
      setBannerPreviewUrl(null)
    }
  }

  const handleSaveBannerImage = async () => {
    if (selectedBannerFile) {
      try {
        setIsLoading(true)
        const uploadedImage = await imageUploadApi.uploadImage(selectedBannerFile)
        setBrandData((prev) => ({ ...prev, bannerImageUrl: uploadedImage.url }))
        setIsEditingBanner(false)
        setSelectedBannerFile(null)
        setBannerPreviewUrl(null)
        toast({
          title: "Banner Updated",
          description: "Your brand banner has been updated.",
        })
      } catch (error: any) {
        console.error("Failed to upload banner image:", error)
        toast({
          title: "Upload Error",
          description: error.message || "Failed to upload banner image. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      toast({
        title: "Error",
        description: "Please select an image file for the banner.",
        variant: "destructive",
      })
    }
  }

  const handleProfilePicFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (e.g., JPG, PNG, GIF).",
          variant: "destructive",
        })
        setSelectedProfilePicFile(null)
        setProfilePicPreviewUrl(null)
        return
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `Please select an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
          variant: "destructive",
        })
        setSelectedProfilePicFile(null)
        setProfilePicPreviewUrl(null)
        return
      }
      setSelectedProfilePicFile(file)
      if (profilePicPreviewUrl) URL.revokeObjectURL(profilePicPreviewUrl)
      setProfilePicPreviewUrl(URL.createObjectURL(file))
    } else {
      setSelectedProfilePicFile(null)
      setProfilePicPreviewUrl(null)
    }
  }

  const handleSaveProfilePic = async () => {
    if (selectedProfilePicFile) {
      try {
        setIsLoading(true)
        const uploadedImage = await imageUploadApi.uploadImage(selectedProfilePicFile)
        setBrandData((prev) => ({ ...prev, profilePicUrl: uploadedImage.url }))
        setIsEditingProfilePic(false)
        setSelectedProfilePicFile(null)
        setProfilePicPreviewUrl(null)
        toast({
          title: "Profile Picture Updated",
          description: "Your profile picture has been updated.",
        })
      } catch (error: any) {
        console.error("Failed to upload profile picture:", error)
        toast({
          title: "Upload Error",
          description: error.message || "Failed to upload profile picture. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      toast({
        title: "Error",
        description: "Please select an image file for the profile picture.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand" />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-[#f5f5f5]">
          <Image
            src={brandData.bannerImageUrl || "/placeholder.svg?height=400&width=1200"}
            alt="Brand banner"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          <Dialog open={isEditingBanner} onOpenChange={setIsEditingBanner}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-primary rounded-full p-2 z-10 hover:bg-primary/80"
              >
                <Pencil className="h-6 w-6 text-white" />
                <span className="sr-only">Edit banner</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
              <DialogHeader>
                <DialogTitle>Edit Banner Image</DialogTitle>
                <DialogDescription>Upload a new image for your banner.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Label htmlFor="banner-image-upload" className="text-right">
                  Upload Image
                </Label>
                <Input id="banner-image-upload" type="file" accept="image/*" onChange={handleBannerFileChange} />
                {bannerPreviewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <Image
                      src={bannerPreviewUrl || "/placeholder.svg"}
                      alt="Banner preview"
                      width={400}
                      height={150}
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditingBanner(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveBannerImage} disabled={!selectedBannerFile || isLoading}>
                  {isLoading ? "Uploading..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/* Main content area with dark background */}
        <div className="relative bg-background pt-8 pb-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Picture Container - positioned to overlap */}
              <div className="relative -mt-20 md:-mt-24 lg:-mt-28 flex-shrink-0">
                <Dialog open={isEditingProfilePic} onOpenChange={setIsEditingProfilePic}>
                  <DialogTrigger asChild>
                    <Avatar className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-primary shadow-lg cursor-pointer group relative overflow-hidden">
                      <AvatarImage
                        src={brandData.profilePicUrl || "/placeholder.svg?height=200&width=200"}
                        alt={`${brandData.companyName} profile picture`}
                      />
                      <AvatarFallback className="bg-primary text-white flex items-center justify-center text-4xl font-bold">
                        {brandData.companyName[0] || "U"}
                      </AvatarFallback>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="h-12 w-12 text-white" />
                        <span className="sr-only">Change profile picture</span>
                      </div>
                    </Avatar>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
                    <DialogHeader>
                      <DialogTitle>Edit Profile Picture</DialogTitle>
                      <DialogDescription>Upload a new image for your profile picture.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Label htmlFor="profile-pic-upload" className="text-right">
                        Upload Image
                      </Label>
                      <Input
                        id="profile-pic-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicFileChange}
                      />
                      {profilePicPreviewUrl && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                          <Image
                            src={profilePicPreviewUrl || "/placeholder.svg"}
                            alt="Profile picture preview"
                            width={150}
                            height={150}
                            objectFit="cover"
                            className="rounded-full mx-auto"
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsEditingProfilePic(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveProfilePic}
                        disabled={!selectedProfilePicFile || isLoading}
                      >
                        {isLoading ? "Uploading..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex-1 w-full pt-4 md:pt-0">
                {/* Company Name and Save Settings button */}
                <div className="flex items-center justify-between w-full mb-4">
                  <Input
                    type="text"
                    value={brandData.companyName}
                    onChange={(e) => setBrandData((prev) => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Company Name"
                    className="flex-1 max-w-xs bg-muted border-none text-foreground text-2xl font-semibold"
                  />
                  <Button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    variant="outline"
                    className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                  >
                    {isLoading ? "Creating..." : "Create Profile"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs for profile sections */}
            <Tabs defaultValue="brand-details" className="w-full mt-8">
              <TabsList className="grid w-full grid-cols-2 bg-muted text-foreground">
                <TabsTrigger
                  value="brand-details"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Brand Details
                </TabsTrigger>
                <TabsTrigger
                  value="what-we-look-for"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  What We Look For
                </TabsTrigger>
              </TabsList>

              <TabsContent value="brand-details" className="mt-6 space-y-8">
                {/* Bio */}
                <div>
                  <Label htmlFor="bio" className="text-lg font-semibold mb-2 block">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your brand..."
                    value={brandData.bio}
                    onChange={(e) => setBrandData((prev) => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[120px]"
                  />
                </div>

                {/* Mission and Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="mission" className="text-lg font-semibold mb-2 block">
                      Mission
                    </Label>
                    <Textarea
                      id="mission"
                      placeholder="Our mission is..."
                      value={brandData.mission}
                      onChange={(e) => setBrandData((prev) => ({ ...prev, mission: e.target.value }))}
                      className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vision" className="text-lg font-semibold mb-2 block">
                      Vision
                    </Label>
                    <Textarea
                      id="vision"
                      placeholder="Our vision is..."
                      value={brandData.vision}
                      onChange={(e) => setBrandData((prev) => ({ ...prev, vision: e.target.value }))}
                      className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contacts-toggle" className="text-lg font-semibold">
                      Contacts
                    </Label>
                    <Switch id="contacts-toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="display-activities-toggle" className="text-lg font-semibold">
                      Display In App Activities
                    </Label>
                    <Switch id="display-activities-toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public-availability-toggle" className="text-lg font-semibold">
                      Public Availability
                    </Label>
                    <Switch id="public-availability-toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications-toggle" className="text-lg font-semibold">
                      Notifications
                    </Label>
                    <Switch id="notifications-toggle" defaultChecked />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="what-we-look-for" className="mt-6 space-y-8">
                {/* Target Audience */}
                <div>
                  <Label htmlFor="target-audience" className="text-lg font-semibold mb-2 block">
                    Target Audience
                  </Label>
                  <Textarea
                    id="target-audience"
                    placeholder="Describe your ideal target audience..."
                    value={brandData.targetAudience}
                    onChange={(e) => setBrandData((prev) => ({ ...prev, targetAudience: e.target.value }))}
                    className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[120px]"
                  />
                </div>

                {/* Collaboration Type */}
                <div>
                  <Label htmlFor="collaboration-type" className="text-lg font-semibold mb-2 block">
                    Collaboration Type
                  </Label>
                  <Textarea
                    id="collaboration-type"
                    placeholder="Describe the types of collaborations you are looking for..."
                    value={brandData.collaborationType}
                    onChange={(e) => setBrandData((prev) => ({ ...prev, collaborationType: e.target.value }))}
                    className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[120px]"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
