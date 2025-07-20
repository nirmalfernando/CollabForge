"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
import { Pencil, Plus, Microscope, MapPin, Globe, Mail, PlusCircle, X, Tag } from "lucide-react"

export default function BrandEditProfilePage() {
  const [isEditingBanner, setIsEditingBanner] = useState(false)
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false)
  const [isAddingDetail, setIsAddingDetail] = useState(false)
  const [isAddingCampaign, setIsAddingCampaign] = useState(false)

  const [newDetail, setNewDetail] = useState({ icon: "Tag", text: "" })
  const [newCampaign, setNewCampaign] = useState({ name: "", budget: "", description: "" })

  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null)
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null)
  const [selectedProfilePicFile, setSelectedProfilePicFile] = useState<File | null>(null)
  const [profilePicPreviewUrl, setProfilePicPreviewUrl] = useState<string | null>(null)

  const [brandData, setBrandData] = useState({
    name: "Zentro Labs",
    bio: "At Zentro Labs, we believe science shouldn't be intimidating — it should be inspiring, accessible, and maybe even a little weird. We build science kits, experiments, and digital learning tools that turn curiosity into action. From students and hobbyists to teachers and content creators, we help curious minds across the world explore science their way.",
    contactsToggle: true,
    publicAvailabilityToggle: true,
    notificationsToggle: true,
    displayActivitiesToggle: true,
    details: [
      { icon: Microscope, text: "Tagline: Science, Simplified." },
      { icon: MapPin, text: "Headquarters: Boston, MA" },
      { icon: Globe, text: "Website: zentrolabs.com", link: "#" },
      { icon: Mail, text: "Contact: sponsors@zentrolabs.com", link: "#" },
    ],
    whatWeLookFor: [
      "Bring energy and clarity to complex topics",
      "Have an audience that's into STEM, education, or DIY content",
      "Aren't afraid to get a little messy in the name of discovery",
      "Use platforms like TikTok, YouTube, or Instagram Reels to make learning go viral",
    ],
    sponsorshipCampaigns: [
      {
        name: "Glow Lab Challenge",
        budget: "$750–$1,500 per creator",
        description: "Send our glow-in-the-dark kits to creators to demo and remix their own science experiments.",
      },
      {
        name: "#ScienceSimplified Series",
        budget: "$1,000–$2,500",
        description: "Sponsored content series breaking down one complex idea in a super simple, creative way.",
      },
      {
        name: "Zentro Drops – Limited Kit Unboxings",
        budget: "$500 flat + affiliate perks",
        description: "Unbox & demo our newest kit drop with your own creative twist.",
      },
      {
        name: "Zentro Classroom Collabs",
        budget: "Custom/Varies",
        description: "Partner with educators or STEM influencers to create downloadable learning content.",
      },
    ],
    bannerImageUrl: "/placeholder.svg?height=400&width=1200", // Default banner image
    profilePicUrl: "/placeholder.svg?height=200&width=200", // Default profile picture
  })

  // Cleanup object URLs when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl)
      if (profilePicPreviewUrl) URL.revokeObjectURL(profilePicPreviewUrl)
    }
  }, [bannerPreviewUrl, profilePicPreviewUrl])

  const iconMap = {
    Microscope,
    MapPin,
    Globe,
    Mail,
    Tag,
  }

  const handleAddDetail = () => {
    if (newDetail.text.trim()) {
      const IconComponent = iconMap[newDetail.icon as keyof typeof iconMap]
      setBrandData((prev) => ({
        ...prev,
        details: [...prev.details, { icon: IconComponent, text: newDetail.text }],
      }))
      setNewDetail({ icon: "Tag", text: "" })
      setIsAddingDetail(false)
      toast({
        title: "Detail Added",
        description: "Your new detail has been added successfully.",
      })
    }
  }

  const handleAddCampaign = () => {
    if (newCampaign.name.trim() && newCampaign.budget.trim() && newCampaign.description.trim()) {
      setBrandData((prev) => ({
        ...prev,
        sponsorshipCampaigns: [...prev.sponsorshipCampaigns, newCampaign],
      }))
      setNewCampaign({ name: "", budget: "", description: "" })
      setIsAddingCampaign(false)
      toast({
        title: "Campaign Added",
        description: "Your new campaign has been added successfully.",
      })
    }
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your profile has been updated successfully.",
    })
  }

  const removeDetail = (index: number) => {
    setBrandData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }))
    toast({
      title: "Detail Removed",
      description: "The detail has been removed from your profile.",
    })
  }

  const removeCampaign = (index: number) => {
    setBrandData((prev) => ({
      ...prev,
      sponsorshipCampaigns: prev.sponsorshipCampaigns.filter((_, i) => i !== index),
    }))
    toast({
      title: "Campaign Removed",
      description: "The campaign has been removed from your profile.",
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
      setSelectedBannerFile(file)
      if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl)
      setBannerPreviewUrl(URL.createObjectURL(file))
    } else {
      setSelectedBannerFile(null)
      setBannerPreviewUrl(null)
    }
  }

  const handleSaveBannerImage = () => {
    if (selectedBannerFile && bannerPreviewUrl) {
      setBrandData((prev) => ({ ...prev, bannerImageUrl: bannerPreviewUrl }))
      setIsEditingBanner(false)
      setSelectedBannerFile(null)
      setBannerPreviewUrl(null)
      toast({
        title: "Banner Updated",
        description: "Your profile banner has been updated.",
      })
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
      setSelectedProfilePicFile(file)
      if (profilePicPreviewUrl) URL.revokeObjectURL(profilePicPreviewUrl)
      setProfilePicPreviewUrl(URL.createObjectURL(file))
    } else {
      setSelectedProfilePicFile(null)
      setProfilePicPreviewUrl(null)
    }
  }

  const handleSaveProfilePic = () => {
    if (selectedProfilePicFile && profilePicPreviewUrl) {
      setBrandData((prev) => ({ ...prev, profilePicUrl: profilePicPreviewUrl }))
      setIsEditingProfilePic(false)
      setSelectedProfilePicFile(null)
      setProfilePicPreviewUrl(null)
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated.",
      })
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
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-background overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Static "eyes" graphic */}
            <div className="flex space-x-8">
              <div className="w-48 h-24 sm:w-64 sm:h-32 bg-white rounded-b-full" />
              <div className="w-48 h-24 sm:w-64 sm:h-32 bg-white rounded-b-full" />
            </div>
          </div>
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
                <Button type="button" onClick={handleSaveBannerImage} disabled={!selectedBannerFile}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/* Main content area with dark background */}
        <div className="relative bg-background pt-8 pb-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Picture/Logo Container - positioned to overlap */}
              <div className="relative -mt-20 md:-mt-24 lg:-mt-28 flex-shrink-0">
                <Dialog open={isEditingProfilePic} onOpenChange={setIsEditingProfilePic}>
                  <DialogTrigger asChild>
                    <Avatar className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-primary shadow-lg cursor-pointer group relative overflow-hidden bg-black flex items-center justify-center">
                      <AvatarImage
                        src={brandData.profilePicUrl || "/placeholder.svg"}
                        alt={`${brandData.name} profile picture`}
                      />
                      <AvatarFallback className="bg-primary text-white flex items-center justify-center text-4xl font-bold">
                        {/* Custom SVG for Zentro Labs 'T' logo */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-24 w-24 text-white"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5M12 22V12M17 15l-5 3-5-3M7 9l5 3 5-3" />
                          <path
                            fillRule="evenodd"
                            d="M12 2a1 1 0 011 1v18a1 1 0 11-2 0V3a1 1 0 011-1zm6.945 3.336a1 1 0 011.644 1.107l-6.5 10a1 1 0 01-1.644-1.107l6.5-10zM5.411 6.443a1 1 0 011.644-1.107l6.5 10a1 1 0 01-1.644 1.107l-6.5-10z"
                            clipRule="evenodd"
                          />
                        </svg>
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
                      <Button type="button" onClick={handleSaveProfilePic} disabled={!selectedProfilePicFile}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex-1 w-full pt-4 md:pt-0">
                {/* Save Settings button */}
                <div className="flex items-center justify-end w-full mb-4">
                  <Button
                    onClick={handleSaveSettings}
                    variant="outline"
                    className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                  >
                    Save Settings
                  </Button>
                </div>
                {/* Blue horizontal divider line */}
                <div className="w-full h-[2px] bg-primary mb-6" />

                {/* Brand Name and Bio */}
                <div className="space-y-2 mb-8">
                  <Input
                    type="text"
                    value={brandData.name}
                    onChange={(e) => setBrandData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-muted border-none text-primary text-4xl md:text-5xl font-bold p-2"
                  />
                  <Label htmlFor="bio" className="sr-only">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your brand..."
                    value={brandData.bio}
                    onChange={(e) => setBrandData((prev) => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[120px] text-lg"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contacts-toggle" className="text-lg font-semibold">
                      Contacts
                    </Label>
                    <Switch
                      id="contacts-toggle"
                      checked={brandData.contactsToggle}
                      onCheckedChange={(checked) => setBrandData((prev) => ({ ...prev, contactsToggle: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="display-activities-toggle" className="text-lg font-semibold">
                      Display In App Activities
                    </Label>
                    <Switch
                      id="display-activities-toggle"
                      checked={brandData.displayActivitiesToggle}
                      onCheckedChange={(checked) =>
                        setBrandData((prev) => ({ ...prev, displayActivitiesToggle: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public-availability-toggle" className="text-lg font-semibold">
                      Public Availability
                    </Label>
                    <Switch
                      id="public-availability-toggle"
                      checked={brandData.publicAvailabilityToggle}
                      onCheckedChange={(checked) =>
                        setBrandData((prev) => ({ ...prev, publicAvailabilityToggle: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications-toggle" className="text-lg font-semibold">
                      Notifications
                    </Label>
                    <Switch
                      id="notifications-toggle"
                      checked={brandData.notificationsToggle}
                      onCheckedChange={(checked) => setBrandData((prev) => ({ ...prev, notificationsToggle: checked }))}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-2">Details:</h3>
                  <ul className="space-y-2">
                    {brandData.details.map((detail, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <detail.icon className="h-5 w-5 text-primary" />
                        <Input
                          type="text"
                          value={detail.text}
                          onChange={(e) => {
                            const updatedDetails = [...brandData.details]
                            updatedDetails[index].text = e.target.value
                            setBrandData((prev) => ({ ...prev, details: updatedDetails }))
                          }}
                          className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2 text-lg"
                        />
                        {detail.link && (
                          <Link href={detail.link} className="text-primary hover:underline text-sm" prefetch={false}>
                            View
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDetail(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
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
                          Add a new detail to your profile. Choose an icon and enter the text.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="detail-icon" className="text-right">
                            Icon
                          </Label>
                          <Select
                            value={newDetail.icon}
                            onValueChange={(value) => setNewDetail((prev) => ({ ...prev, icon: value }))}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Tag">Tag</SelectItem>
                              <SelectItem value="Microscope">Microscope</SelectItem>
                              <SelectItem value="MapPin">Map Pin</SelectItem>
                              <SelectItem value="Globe">Globe</SelectItem>
                              <SelectItem value="Mail">Mail</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="detail-text" className="text-right">
                            Text
                          </Label>
                          <Input
                            id="detail-text"
                            value={newDetail.text}
                            onChange={(e) => setNewDetail((prev) => ({ ...prev, text: e.target.value }))}
                            className="col-span-3"
                            placeholder="Enter detail text"
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

                {/* What We Look For */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    What We Look For in <span className="text-primary">Collaborators</span>
                  </h2>
                  <Textarea
                    value={brandData.whatWeLookFor.join("\n")}
                    onChange={(e) => setBrandData((prev) => ({ ...prev, whatWeLookFor: e.target.value.split("\n") }))}
                    className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[100px] text-lg"
                    placeholder="List what you look for in collaborators, one item per line."
                  />
                </div>

                {/* Popular Sponsorship Campaigns */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Popular <span className="text-primary">Sponsorship Campaigns</span>
                  </h2>
                  <div className="space-y-4">
                    {brandData.sponsorshipCampaigns.map((campaign, index) => (
                      <div key={index} className="border border-primary rounded-md p-4 space-y-2 bg-card">
                        <div className="flex justify-between items-center">
                          <Input
                            type="text"
                            value={campaign.name}
                            onChange={(e) => {
                              const updatedCampaigns = [...brandData.sponsorshipCampaigns]
                              updatedCampaigns[index].name = e.target.value
                              setBrandData((prev) => ({ ...prev, sponsorshipCampaigns: updatedCampaigns }))
                            }}
                            className="flex-1 bg-transparent border-none text-primary font-semibold text-xl p-0"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCampaign(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="text"
                          value={campaign.budget}
                          onChange={(e) => {
                            const updatedCampaigns = [...brandData.sponsorshipCampaigns]
                            updatedCampaigns[index].budget = e.target.value
                            setBrandData((prev) => ({ ...prev, sponsorshipCampaigns: updatedCampaigns }))
                          }}
                          className="w-full bg-transparent border-none text-muted-foreground text-base p-0"
                        />
                        <Textarea
                          value={campaign.description}
                          onChange={(e) => {
                            const updatedCampaigns = [...brandData.sponsorshipCampaigns]
                            updatedCampaigns[index].description = e.target.value
                            setBrandData((prev) => ({ ...prev, sponsorshipCampaigns: updatedCampaigns }))
                          }}
                          className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[80px] text-base"
                          placeholder="Campaign description"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add New Campaign Dialog */}
                  <Dialog open={isAddingCampaign} onOpenChange={setIsAddingCampaign}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="mt-4 text-primary hover:text-primary/80">
                        <PlusCircle className="h-5 w-5 mr-2" /> Add New Campaign
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
                      <DialogHeader>
                        <DialogTitle>Add New Campaign</DialogTitle>
                        <DialogDescription>Add a new sponsorship campaign to your profile.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="campaign-name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="campaign-name"
                            value={newCampaign.name}
                            onChange={(e) => setNewCampaign((prev) => ({ ...prev, name: e.target.value }))}
                            className="col-span-3"
                            placeholder="Campaign Name"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="campaign-budget" className="text-right">
                            Budget
                          </Label>
                          <Input
                            id="campaign-budget"
                            value={newCampaign.budget}
                            onChange={(e) => setNewCampaign((prev) => ({ ...prev, budget: e.target.value }))}
                            className="col-span-3"
                            placeholder="e.g., $500 - $1,000"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="campaign-description" className="text-right">
                            Description
                          </Label>
                          <Textarea
                            id="campaign-description"
                            value={newCampaign.description}
                            onChange={(e) => setNewCampaign((prev) => ({ ...prev, description: e.target.value }))}
                            className="col-span-3 min-h-[80px]"
                            placeholder="Describe the campaign"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddingCampaign(false)}>
                          Cancel
                        </Button>
                        <Button type="button" onClick={handleAddCampaign}>
                          Add Campaign
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
