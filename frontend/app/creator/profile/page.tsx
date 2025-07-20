"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  Pencil,
  Monitor,
  Users,
  MapPin,
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

export default function CreatorProfilePage() {
  // Dummy data for the creator profile
  const creatorData = {
    name: "Madeline",
    nickname: "Mads_Molecule",
    lastName: "Carter",
    followers: "320,000",
    platform: "TikTok",
    bio: "Hey hey! I'm Mads Molecule 🔬 Full-time chaos coordinator / part-time science exploder. I make loud, weird, totally questionable science content on TikTok that turns “ugh, chemistry” into “wait, what just happened!?”",
    details: [
      { icon: Monitor, text: "Platform: TikTok" },
      { icon: Users, text: "Followers: 320,000 strong and mostly here for the explosions" },
      { icon: MapPin, text: "Based in: Austin, TX (but mentally in a test tube)" },
      { icon: Sparkles, text: "Vibe: Imagine if Bill Nye and a highlighter had a baby" },
    ],
    platforms: [
      { icon: Monitor, name: "TikTok", handle: "@madsmolcule", link: "#" },
      { icon: Instagram, name: "Instagram", handle: "@madsmolcule", link: "#" },
      { icon: Youtube, name: "YouTube", handle: "Mad Science in Motion", link: "#" },
      { icon: Mail, name: "Email", handle: "mads@madsmolcule.com", link: "#" },
      { icon: Globe, name: "Website", handle: "www.madsmolcule.com", link: "#" },
    ],
    whatIDo: [
      "I break down real science concepts into 60 seconds of color, chaos and commentary.",
      "I answer wild questions from my followers like “Can you microwave acid?” (spoiler: no)",
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
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1">
        {/* Banner Section - Changed background to light gray #f5f5f5 */}
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
                  <AvatarFallback>
                    {creatorData.name[0]}
                    {creatorData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 w-full pt-4 md:pt-0">
                {/* Follower count and Edit Profile button - next to avatar */}
                <div className="flex items-center justify-between w-full mb-4">
                  <p className="text-2xl font-semibold text-muted-foreground">
                    {creatorData.followers} Followers ({creatorData.platform})
                  </p>
                  <Link href="/creator/profile/edit" prefetch={false}>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                </div>
                {/* Name, Bio, Details, Platforms - now correctly positioned below the avatar and its horizontal content */}
                <h1 className="text-4xl md:text-5xl font-bold mt-2">
                  {creatorData.name} <span className="text-primary">&quot;{creatorData.nickname}&quot;</span>{" "}
                  {creatorData.lastName}
                </h1>
                <p className="text-foreground mt-4">{creatorData.bio}</p>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Details:</h3>
                    <ul className="space-y-2">
                      {creatorData.details.map((detail, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <detail.icon className="h-5 w-5 text-primary" />
                          {detail.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Official Platforms:</h3>
                    <ul className="space-y-2">
                      {creatorData.platforms.map((platform, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <platform.icon className="h-5 w-5 text-primary" />
                          <Link href={platform.link} className="hover:underline" prefetch={false}>
                            {platform.name} - {platform.handle}
                          </Link>
                        </li>
                      ))}
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
                  {creatorData.whatIDo.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">
                  My <span className="text-primary">People</span>
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {creatorData.myPeople.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">
                  My <span className="text-primary">Content</span>
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {creatorData.myContent.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">
                  I&apos;ve <span className="text-primary">Worked With</span>
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {creatorData.workedWith.map((item, index) => (
                    <li key={index}>{item}</li>
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
