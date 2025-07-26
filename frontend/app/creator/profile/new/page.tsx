"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  Pencil,
  Plus,
  Monitor,
  Users,
  MapPin,
  Sparkles,
  Instagram,
  Youtube,
  Mail,
  Globe,
  PlusCircle,
  X,
} from "lucide-react"
import { creatorApi, categoryApi, getAuthData, imageUploadApi } from "@/lib/api" // Import imageUploadApi

const MAX_FILE_SIZE_MB = 10 // Max file size for image uploads

export default function CreatorNewProfilePage() {
  const router = useRouter()
  const [authData, setAuthDataState] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // State for managing forms
  const [isAddingDetail, setIsAddingDetail] = useState(false)
  const [isAddingPlatform, setIsAddingPlatform] = useState(false)
  const [isEditingBanner, setIsEditingBanner] = useState(false)
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false)

  const [newDetail, setNewDetail] = useState({ type: "Custom", value: "" })
  const [newPlatform, setNewPlatform] = useState({ icon: "Monitor", name: "", handle: "", link: "" })

  // States for image uploads
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null)
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null)
  const [selectedProfilePicFile, setSelectedProfilePicFile] = useState<File | null>(null)
  const [profilePicPreviewUrl, setProfilePicPreviewUrl] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCreatorType, setSelectedCreatorType] = useState("")

  // Creator Type options - Restricted to only these three
  const creatorTypeOptions = [
    { id: "Content Creator", name: "Content Creator" },
    { id: "Model", name: "Model" },
    { id: "Live Streamer", name: "Live Streamer" },
  ]

  // Map detail types to icons and placeholders
  const detailTypeMap = {
    Platform: { icon: Monitor, placeholder: "e.g., TikTok" },
    Followers: { icon: Users, placeholder: "e.g., 320,000 strong" },
    "Based in": { icon: MapPin, placeholder: "e.g., Austin, TX" },
    Vibe: { icon: Sparkles, placeholder: "e.g., Bill Nye meets highlighter" },
    Custom: { icon: PlusCircle, placeholder: "Enter custom detail" },
  }

  // Initial creator data for new profile - set image URLs to null
  const [creatorData, setCreatorData] = useState({
    name: "",
    nickname: "",
    lastName: "",
    followerInfo: "",
    bio: "",
    details: [] as any[],
    platforms: [] as any[],
    whatIDo: [""],
    myPeople: [""],
    myContent: [""],
    workedWith: [""],
    bannerImageUrl: null as string | null, // Changed to null
    profilePicUrl: null as string | null, // Changed to null
  })

  useEffect(() => {
    const auth = getAuthData()
    if (!auth || auth.user.role !== "influencer") {
      router.push("/login")
      return
    }
    setAuthDataState(auth)

    // Load categories
    const loadCategories = async () => {
      try {
        const categoriesData = await categoryApi.getAllCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }

    loadCategories()
  }, [router])

  // Cleanup object URLs when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl)
      if (profilePicPreviewUrl) URL.revokeObjectURL(profilePicPreviewUrl)
    }
  }, [bannerPreviewUrl, profilePicPreviewUrl])

  const iconMap = {
    Monitor,
    Users,
    MapPin,
    Sparkles,
    Instagram,
    Youtube,
    Mail,
    Globe,
    PlusCircle,
  }

  const handleAddDetail = () => {
    if (newDetail.value.trim()) {
      const IconComponent = detailTypeMap[newDetail.type as keyof typeof detailTypeMap].icon
      setCreatorData((prev) => ({
        ...prev,
        details: [...prev.details, { type: newDetail.type, value: newDetail.value, icon: IconComponent }],
      }))
      setNewDetail({ type: "Custom", value: "" })
      setIsAddingDetail(false)
      toast({
        title: "Detail Added",
        description: "Your new detail has been added successfully.",
      })
    }
  }

  const handleAddPlatform = () => {
    if (newPlatform.name.trim() && newPlatform.handle.trim()) {
      const IconComponent = iconMap[newPlatform.icon as keyof typeof iconMap]
      setCreatorData((prev) => ({
        ...prev,
        platforms: [
          ...prev.platforms,
          {
            icon: IconComponent,
            name: newPlatform.name,
            handle: newPlatform.handle,
            link: newPlatform.link || "#",
          },
        ],
      }))
      setNewPlatform({ icon: "Monitor", name: "", handle: "", link: "" })
      setIsAddingPlatform(false)
      toast({
        title: "Platform Added",
        description: "Your new platform has been added successfully.",
      })
    }
  }

  const handleSaveSettings = async () => {
    if (!authData) return

    if (!creatorData.name.trim() || !creatorData.lastName.trim() || !selectedCategory || !selectedCreatorType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (First Name, Last Name, Category, Creator Type).",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Transform data to match API format
      const apiData = {
        userId: authData.user.userId,
        firstName: creatorData.name,
        lastName: creatorData.lastName,
        nickName: creatorData.nickname || undefined,
        bio: creatorData.bio || undefined,
        details: creatorData.details.map((detail) => ({
          label: detail.type,
          value: detail.value,
        })),
        socialMedia: creatorData.platforms.map((platform) => ({
          platform: platform.name,
          handle: platform.handle,
          url: platform.link,
          followers: 0, // Default value
        })),
        whatIDo: creatorData.whatIDo
          .filter((item) => item.trim())
          .map((item) => ({
            activity: item,
            experience: "",
          })),
        myPeople: creatorData.myPeople
          .filter((item) => item.trim())
          .map((item) => ({
            name: item,
            role: "",
            contact: "",
          })),
        myContent: creatorData.myContent
          .filter((item) => item.trim())
          .map((item) => ({
            title: item,
            url: "",
            views: 0,
          })),
        pastCollaborations: creatorData.workedWith
          .filter((item) => item.trim())
          .map((item) => ({
            brand: item,
            campaign: "",
            date: "",
          })),
        categoryId: selectedCategory,
        profilePicUrl: creatorData.profilePicUrl || undefined, // Send null/undefined if not set
        backgroundImgUrl: creatorData.bannerImageUrl || undefined, // Send null/undefined if not set
        type: selectedCreatorType as "Content Creator" | "Model" | "Live Streamer",
      }

      await creatorApi.createCreator(apiData)

      toast({
        title: "Profile Created",
        description: "Your creator profile has been created successfully!",
      })

      // Redirect to profile page
      router.push("/creator/profile")
    } catch (error: any) {
      console.error("Failed to create profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeDetail = (index: number) => {
    setCreatorData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }))
    toast({
      title: "Detail Removed",
      description: "The detail has been removed from your profile.",
    })
  }

  const removePlatform = (index: number) => {
    setCreatorData((prev) => ({
      ...prev,
      platforms: prev.platforms.filter((_, i) => i !== index),
    }))
    toast({
      title: "Platform Removed",
      description: "The platform has been removed from your profile.",
    })
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
        setCreatorData((prev) => ({ ...prev, bannerImageUrl: uploadedImage.url }))
        setIsEditingBanner(false)
        setSelectedBannerFile(null)
        setBannerPreviewUrl(null)
        toast({
          title: "Banner Updated",
          description: "Your profile banner has been updated.",
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
        setCreatorData((prev) => ({ ...prev, profilePicUrl: uploadedImage.url }))
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
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-[#f5f5f5]">
          <Image
            src={creatorData.bannerImageUrl || "/placeholder.svg?height=400&width=1200"}
            alt="Profile banner"
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
                        src={creatorData.profilePicUrl || "/placeholder.svg?height=200&width=200"}
                        alt={`${creatorData.name} profile picture`}
                      />
                      <AvatarFallback className="bg-primary text-white flex items-center justify-center text-4xl font-bold">
                        {creatorData.name[0] || "U"}
                        {creatorData.lastName[0] || ""}
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
                {/* Editable follower count and Save Settings button */}
                <div className="flex items-center justify-between w-full mb-4">
                  <Input
                    type="text"
                    value={creatorData.followerInfo}
                    onChange={(e) => setCreatorData((prev) => ({ ...prev, followerInfo: e.target.value }))}
                    placeholder="e.g., 320,000 Followers (TikTok)"
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
            <Tabs defaultValue="user-details" className="w-full mt-8">
              <TabsList className="grid w-full grid-cols-3 bg-muted text-foreground">
                <TabsTrigger
                  value="user-details"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  User Details
                </TabsTrigger>
                <TabsTrigger
                  value="accounts-metrics"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Accounts & Metrics
                </TabsTrigger>
                <TabsTrigger
                  value="past-works"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Past Works
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user-details" className="mt-6 space-y-8">
                {/* Name and Bio */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Input
                      type="text"
                      value={creatorData.name}
                      onChange={(e) => setCreatorData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="First Name"
                      className="flex-1 min-w-[100px] bg-muted border-none text-foreground text-4xl md:text-5xl font-bold p-2"
                    />
                    <span className="text-primary text-4xl md:text-5xl font-bold">&quot;</span>
                    <Input
                      type="text"
                      value={creatorData.nickname}
                      onChange={(e) => setCreatorData((prev) => ({ ...prev, nickname: e.target.value }))}
                      placeholder="Nickname"
                      className="flex-1 min-w-[100px] bg-muted border-none text-primary text-4xl md:text-5xl font-bold p-2"
                    />
                    <span className="text-primary text-4xl md:text-5xl font-bold">&quot;</span>
                    <Input
                      type="text"
                      value={creatorData.lastName}
                      onChange={(e) => setCreatorData((prev) => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Last Name"
                      className="flex-1 min-w-[100px] bg-muted border-none text-foreground text-4xl md:text-5xl font-bold p-2"
                    />
                  </div>
                  <Label htmlFor="bio" className="text-lg font-semibold mb-2 block">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={creatorData.bio}
                    onChange={(e) => setCreatorData((prev) => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[120px]"
                  />
                </div>

                {/* Category/Niche and Creator Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category" className="text-lg font-semibold mb-2 block">
                      Category/Niche *
                    </Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3">
                        <SelectValue placeholder="Select your category/niche" />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground max-h-60 overflow-y-auto">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.categoryId}
                            value={category.categoryId}
                            className="hover:bg-primary/20"
                          >
                            {category.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="creator-type" className="text-lg font-semibold mb-2 block">
                      Creator Type *
                    </Label>
                    <Select value={selectedCreatorType} onValueChange={setSelectedCreatorType}>
                      <SelectTrigger className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3">
                        <SelectValue placeholder="Select your creator type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground max-h-60 overflow-y-auto">
                        {creatorTypeOptions.map((type) => (
                          <SelectItem key={type.id} value={type.id} className="hover:bg-primary/20">
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                {/* Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">Details:</h3>
                  <ul className="space-y-2">
                    {creatorData.details.map((detail, index) => {
                      const IconComponent = detail.icon || PlusCircle
                      return (
                        <li key={index} className="flex items-center gap-2">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <span className="font-medium text-foreground">
                            {detail.type !== "Custom" ? `${detail.type}:` : ""}
                          </span>
                          <Input
                            type="text"
                            value={detail.value}
                            onChange={(e) => {
                              const updatedDetails = [...creatorData.details]
                              updatedDetails[index].value = e.target.value
                              setCreatorData((prev) => ({ ...prev, details: updatedDetails }))
                            }}
                            className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDetail(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      )
                    })}
                  </ul>

                  {/* Add New Detail Dialog */}
                  <Dialog open={isAddingDetail} onOpenChange={setIsAddingDetail}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="mt-4 text-primary hover:text-primary/80">
                        <PlusCircle className="h-5 w-5 mr-2" /> Add New Detail
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
                      <DialogHeader>
                        <DialogTitle>Add New Detail</DialogTitle>
                        <DialogDescription>
                          Add a new detail to your profile. Choose a type and enter the text.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="detail-type" className="text-right">
                            Type
                          </Label>
                          <Select
                            value={newDetail.type}
                            onValueChange={(value) => setNewDetail((prev) => ({ ...prev, type: value, value: "" }))}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select detail type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(detailTypeMap).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="detail-value" className="text-right">
                            Text
                          </Label>
                          <Input
                            id="detail-value"
                            value={newDetail.value}
                            onChange={(e) => setNewDetail((prev) => ({ ...prev, value: e.target.value }))}
                            className="col-span-3"
                            placeholder={detailTypeMap[newDetail.type as keyof typeof detailTypeMap].placeholder}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddingDetail(false)}>
                          Cancel
                        </Button>
                        <Button type="button" onClick={handleAddDetail}>
                          Add Detail
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Official Platforms */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">Official Platforms:</h3>
                  <ul className="space-y-2">
                    {creatorData.platforms.map((platform, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <platform.icon className="h-5 w-5 text-primary" />
                        <Input
                          type="text"
                          defaultValue={`${platform.name} - ${platform.handle}`}
                          className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2"
                        />
                        <Link href={platform.link} className="text-primary hover:underline" prefetch={false}>
                          View
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePlatform(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>

                  {/* Add New Platform Dialog */}
                  <Dialog open={isAddingPlatform} onOpenChange={setIsAddingPlatform}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="mt-4 text-primary hover:text-primary/80">
                        <PlusCircle className="h-5 w-5 mr-2" /> Add New Platform
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
                      <DialogHeader>
                        <DialogTitle>Add New Platform</DialogTitle>
                        <DialogDescription>Add a new social media platform to your profile.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="platform-icon" className="text-right">
                            Icon
                          </Label>
                          <Select
                            value={newPlatform.icon}
                            onValueChange={(value) => setNewPlatform((prev) => ({ ...prev, icon: value }))}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monitor">TikTok</SelectItem>
                              <SelectItem value="Instagram">Instagram</SelectItem>
                              <SelectItem value="Youtube">YouTube</SelectItem>
                              <SelectItem value="Mail">Email</SelectItem>
                              <SelectItem value="Globe">Website</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="platform-name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="platform-name"
                            value={newPlatform.name}
                            onChange={(e) => setNewPlatform((prev) => ({ ...prev, name: e.target.value }))}
                            className="col-span-3"
                            placeholder="Platform name"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="platform-handle" className="text-right">
                            Handle
                          </Label>
                          <Input
                            id="platform-handle"
                            value={newPlatform.handle}
                            onChange={(e) => setNewPlatform((prev) => ({ ...prev, handle: e.target.value }))}
                            className="col-span-3"
                            placeholder="Platform handle (e.g., @johndoe)"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="platform-link" className="text-right">
                            Link
                          </Label>
                          <Input
                            id="platform-link"
                            value={newPlatform.link}
                            onChange={(e) => setNewPlatform((prev) => ({ ...prev, link: e.target.value }))}
                            className="col-span-3"
                            placeholder="Link to profile (optional)"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddingPlatform(false)}>
                          Cancel
                        </Button>
                        <Button type="button" onClick={handleAddPlatform}>
                          Add Platform
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsContent>

              <TabsContent value="accounts-metrics" className="mt-6 space-y-8">
                {/* What I Do */}
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    What <span className="text-primary">I Do</span>
                  </h2>
                  {creatorData.whatIDo.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...creatorData.whatIDo]
                          updated[index] = e.target.value
                          setCreatorData((prev) => ({ ...prev, whatIDo: updated }))
                        }}
                        placeholder="e.g., Create engaging short-form videos"
                        className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCreatorData((prev) => ({
                            ...prev,
                            whatIDo: prev.whatIDo.filter((_, i) => i !== index),
                          }))
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="mt-2 text-primary hover:text-primary/80"
                    onClick={() => setCreatorData((prev) => ({ ...prev, whatIDo: [...prev.whatIDo, ""] }))}
                  >
                    <PlusCircle className="h-5 w-5 mr-2" /> Add Activity
                  </Button>
                </div>

                {/* My People */}
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    My <span className="text-primary">People</span>
                  </h2>
                  {creatorData.myPeople.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...creatorData.myPeople]
                          updated[index] = e.target.value
                          setCreatorData((prev) => ({ ...prev, myPeople: updated }))
                        }}
                        placeholder="e.g., My manager, John Doe"
                        className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCreatorData((prev) => ({
                            ...prev,
                            myPeople: prev.myPeople.filter((_, i) => i !== index),
                          }))
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="mt-2 text-primary hover:text-primary/80"
                    onClick={() => setCreatorData((prev) => ({ ...prev, myPeople: [...prev.myPeople, ""] }))}
                  >
                    <PlusCircle className="h-5 w-5 mr-2" /> Add Person
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="past-works" className="mt-6 space-y-8">
                {/* My Content */}
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    My <span className="text-primary">Content</span>
                  </h2>
                  {creatorData.myContent.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...creatorData.myContent]
                          updated[index] = e.target.value
                          setCreatorData((prev) => ({ ...prev, myContent: updated }))
                        }}
                        placeholder="e.g., Viral TikTok: 'Day in the life of a creator'"
                        className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCreatorData((prev) => ({
                            ...prev,
                            myContent: prev.myContent.filter((_, i) => i !== index),
                          }))
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="mt-2 text-primary hover:text-primary/80"
                    onClick={() => setCreatorData((prev) => ({ ...prev, myContent: [...prev.myContent, ""] }))}
                  >
                    <PlusCircle className="h-5 w-5 mr-2" /> Add Content
                  </Button>
                </div>

                {/* I've Worked With */}
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    I&apos;ve <span className="text-primary">Worked With</span>
                  </h2>
                  {creatorData.workedWith.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...creatorData.workedWith]
                          updated[index] = e.target.value
                          setCreatorData((prev) => ({ ...prev, workedWith: updated }))
                        }}
                        placeholder="e.g., Brand X - Summer Campaign"
                        className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCreatorData((prev) => ({
                            ...prev,
                            workedWith: prev.workedWith.filter((_, i) => i !== index),
                          }))
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="mt-2 text-primary hover:text-primary/80"
                    onClick={() => setCreatorData((prev) => ({ ...prev, workedWith: [...prev.workedWith, ""] }))}
                  >
                    <PlusCircle className="h-5 w-5 mr-2" /> Add Collaboration
                  </Button>
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
