"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
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

export default function CreatorEditProfilePage() {
  // State for managing forms
  const [isAddingDetail, setIsAddingDetail] = useState(false)
  const [isAddingPlatform, setIsAddingPlatform] = useState(false)
  const [newDetail, setNewDetail] = useState({ icon: "Monitor", text: "" })
  const [newPlatform, setNewPlatform] = useState({ icon: "Monitor", name: "", handle: "", link: "" })

  // Dummy data for the creator profile (pre-filled for editing)
  const [creatorData, setCreatorData] = useState({
    name: "Madeline",
    nickname: "Mads_Molecule",
    lastName: "Carter",
    followerInfo: "320,000 Followers (TikTok)",
    bio: 'Hey hey! I\'m Mads Molecule 🔬 Full-time chaos coordinator / part-time science exploder. I make loud, weird, totally questionable science content on TikTok that turns "ugh, chemistry" into "wait, what just happened!?"',
    details: [
      { icon: Monitor, text: "Platform: TikTok" },
      { icon: Users, text: "Followers: 320,000 strong and mostly here for the explosions" },
      { icon: MapPin, text: "Based in: Austin, TX (but mentally in a test tube)" },
      { icon: Sparkles, text: "Vibe: Imagine if Bill Nye and a highlighter had a baby" },
    ],
    platforms: [
      { icon: Monitor, name: "TikTok", handle: "@madsmolcule", link: "https://tiktok.com/@madsmolcule" },
      { icon: Instagram, name: "Instagram", handle: "@madsmolcule", link: "https://instagram.com/madsmolcule" },
      { icon: Youtube, name: "YouTube", handle: "Mad Science in Motion", link: "https://youtube.com/@madscience" },
      { icon: Mail, name: "Email", handle: "mads@madsmolcule.com", link: "mailto:mads@madsmolcule.com" },
      { icon: Globe, name: "Website", handle: "www.madsmolcule.com", link: "https://madsmolcule.com" },
    ],
    whatIDo: [
      "I break down real science concepts into 60 seconds of color, chaos and commentary.",
      'I answer wild questions from my followers like "Can you microwave acid?" (spoiler: no)',
      "I build ridiculous experiments with stuff I probably shouldn't own.",
    ],
    myPeople: [
      "13-30 year olds who like science but have attention spans shaped by pop songs",
      "Nerds, students, meme collectors, and the occasional confused parent",
      "Folks who want to learn but also laugh and maybe scream a little",
    ],
    myContent: [
      '"Why This Happens" series = most likely to go viral',
      "Duets & stitches with bad science takes (don't worry, I come in peace)",
      "Glow-in-the-dark demos, soda geysers, DIY slime chaos",
      "Unboxings of things that really shouldn't be unboxed at home",
    ],
    workedWith: [
      "FizzCo Kits (we made 3 kinds of slime and 2 kinds of regret)",
      "EduHub App (yes, learning can be fun)",
      "BrainFood Energy (which I consume right before regrettable experiments)",
    ],
  })

  const iconMap = {
    Monitor,
    Users,
    MapPin,
    Sparkles,
    Instagram,
    Youtube,
    Mail,
    Globe,
  }

  const handleAddDetail = () => {
    if (newDetail.text.trim()) {
      const IconComponent = iconMap[newDetail.icon as keyof typeof iconMap]
      setCreatorData((prev) => ({
        ...prev,
        details: [...prev.details, { icon: IconComponent, text: newDetail.text }],
      }))
      setNewDetail({ icon: "Monitor", text: "" })
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

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your profile has been updated successfully.",
    })
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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-[#f5f5f5]">
          <Image
            src="/placeholder.svg?height=400&width=1200"
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
                    src="/placeholder.svg?height=200&width=200"
                    alt={`${creatorData.name} profile picture`}
                  />
                  <AvatarFallback className="bg-primary text-white flex items-center justify-center">
                    <Plus className="h-24 w-24" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 w-full pt-4 md:pt-0">
                {/* Editable follower count and Save Settings button */}
                <div className="flex items-center justify-between w-full mb-4">
                  <Input
                    type="text"
                    value={creatorData.followerInfo}
                    onChange={(e) => setCreatorData((prev) => ({ ...prev, followerInfo: e.target.value }))}
                    className="flex-1 max-w-xs bg-muted border-none text-foreground text-2xl font-semibold"
                  />
                  <Button
                    onClick={handleSaveSettings}
                    variant="outline"
                    className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                  >
                    Save Settings
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
                      className="flex-1 min-w-[100px] bg-muted border-none text-foreground text-4xl md:text-5xl font-bold p-2"
                    />
                    <span className="text-primary text-4xl md:text-5xl font-bold">&quot;</span>
                    <Input
                      type="text"
                      value={creatorData.nickname}
                      onChange={(e) => setCreatorData((prev) => ({ ...prev, nickname: e.target.value }))}
                      className="flex-1 min-w-[100px] bg-muted border-none text-primary text-4xl md:text-5xl font-bold p-2"
                    />
                    <span className="text-primary text-4xl md:text-5xl font-bold">&quot;</span>
                    <Input
                      type="text"
                      value={creatorData.lastName}
                      onChange={(e) => setCreatorData((prev) => ({ ...prev, lastName: e.target.value }))}
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
                    {creatorData.details.map((detail, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <detail.icon className="h-5 w-5 text-primary" />
                        <Input
                          type="text"
                          defaultValue={detail.text}
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
                              <SelectItem value="Monitor">Monitor</SelectItem>
                              <SelectItem value="Users">Users</SelectItem>
                              <SelectItem value="MapPin">Map Pin</SelectItem>
                              <SelectItem value="Sparkles">Sparkles</SelectItem>
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
                            placeholder="@username or handle"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="platform-link" className="text-right">
                            URL
                          </Label>
                          <Input
                            id="platform-link"
                            value={newPlatform.link}
                            onChange={(e) => setNewPlatform((prev) => ({ ...prev, link: e.target.value }))}
                            className="col-span-3"
                            placeholder="https://..."
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

                {/* What I Do */}
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    What <span className="text-primary">I Do</span>
                  </h2>
                  <Textarea
                    value={creatorData.whatIDo.join("\n")}
                    onChange={(e) => setCreatorData((prev) => ({ ...prev, whatIDo: e.target.value.split("\n") }))}
                    className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[100px]"
                    placeholder="List what you do, one item per line."
                  />
                </div>

                {/* My People */}
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    My <span className="text-primary">People</span>
                  </h2>
                  <Textarea
                    value={creatorData.myPeople.join("\n")}
                    onChange={(e) => setCreatorData((prev) => ({ ...prev, myPeople: e.target.value.split("\n") }))}
                    className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[100px]"
                    placeholder="Describe your audience, one item per line."
                  />
                </div>

                {/* My Content */}
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    My <span className="text-primary">Content</span>
                  </h2>
                  <Textarea
                    value={creatorData.myContent.join("\n")}
                    onChange={(e) => setCreatorData((prev) => ({ ...prev, myContent: e.target.value.split("\n") }))}
                    className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[100px]"
                    placeholder="Describe your content, one item per line."
                  />
                </div>

                {/* I've Worked With */}
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    I&apos;ve <span className="text-primary">Worked With</span>
                  </h2>
                  <Textarea
                    value={creatorData.workedWith.join("\n")}
                    onChange={(e) => setCreatorData((prev) => ({ ...prev, workedWith: e.target.value.split("\n") }))}
                    className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[100px]"
                    placeholder="List brands you've worked with, one item per line."
                  />
                </div>
              </TabsContent>

              <TabsContent value="accounts-metrics" className="mt-6">
                <h2 className="text-3xl font-bold mb-4">Accounts & Metrics</h2>
                <p className="text-muted-foreground">
                  This section will allow you to connect social media accounts and view analytics.
                </p>
                {/* Placeholder for future implementation */}
              </TabsContent>

              <TabsContent value="past-works" className="mt-6">
                <h2 className="text-3xl font-bold mb-4">Past Works</h2>
                <p className="text-muted-foreground">Showcase your previous collaborations and content here.</p>
                {/* Placeholder for future implementation */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
