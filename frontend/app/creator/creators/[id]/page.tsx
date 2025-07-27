import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  Monitor,
  Users,
  MapPin,
  Sparkles,
  Instagram,
  Youtube,
  Mail,
  Globe,
  Atom,
  FlaskConical,
  Beaker,
  Wind,
  Flame,
} from "lucide-react"

// In a real app, you would fetch this data based on the `params.id`
const creatorData = {
  name: "Madeline",
  nickname: "Mads_Molecule",
  lastName: "Carter",
  followers: "320,000",
  platform: "TikTok",
  category: "Education & Science", // Added category
  creatorType: "Content Creator", // Added creator type
  bio: 'Hey hey! I\'m Mads Molecule 🔬\nFull-time chaos coordinator / part-time science exploder. I make loud, weird, totally questionable science content on TikTok that turns "ugh, chemistry" into "wait, what just happened!?"',
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
    { icon: Mail, name: "Email", handle: "mads@madsmolcule.com", link: "mailto:mads@madsmolcule.com" },
    { icon: Globe, name: "Website", handle: "www.madsmolcule.com", link: "https://www.madsmolcule.com" },
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
  bannerImageUrl: "/images/science-banner.jpg",
  profilePicUrl: "/images/mads-molecule-avatar.png",
}

export default function CreatorProfileViewPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-80 lg:h-96">
          <Image
            src={creatorData.bannerImageUrl || "/placeholder.svg"}
            alt="Profile banner with science notes"
            layout="fill"
            objectFit="cover"
            className="z-0"
            priority
          />
        </section>

        {/* Main content area */}
        <div className="relative bg-background pt-8 pb-12">
          <div className="container px-4 md:px-6">
            {/* Top section with Avatar, Stats, and Buttons */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Picture - Overlapping */}
              <div className="relative -mt-24 md:-mt-32 lg:-mt-36 flex-shrink-0">
                <Avatar className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-primary shadow-lg">
                  <AvatarImage
                    src={creatorData.profilePicUrl || "/placeholder.svg"}
                    alt={`${creatorData.name} profile picture`}
                  />
                  <AvatarFallback className="bg-primary text-white text-5xl font-bold">
                    {creatorData.name[0]}
                    {creatorData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Follower Count and Action Buttons */}
              <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4 w-full">
                <div className="text-left">
                  <p className="text-4xl font-bold text-foreground">{creatorData.followers}</p>
                  <p className="text-lg text-muted-foreground">Followers ({creatorData.platform})</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Follow
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="mt-8 space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold">
                {creatorData.name} <span className="text-primary">&quot;{creatorData.nickname}&quot;</span>{" "}
                {creatorData.lastName}
              </h1>
              <p className="text-lg leading-relaxed whitespace-pre-line">{creatorData.bio}</p>

              {/* Display Category and Creator Type */}
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-lg">
                {creatorData.category && (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Category: {creatorData.category}</span>
                  </div>
                )}
                {creatorData.creatorType && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Type: {creatorData.creatorType}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {creatorData.details.map((detail, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <detail.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">{detail.text}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Official Platforms:</h3>
                <ul className="space-y-2 list-inside">
                  {creatorData.platforms.map((platform, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <platform.icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <Link href={platform.link} className="text-lg hover:underline" prefetch={false}>
                        {platform.name} - {platform.handle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold">
                  What <span className="text-primary">I Do</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 text-lg">
                  {creatorData.whatIDo.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold">
                  My <span className="text-primary">People</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 text-lg">
                  {creatorData.myPeople.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold">
                  My <span className="text-primary">Content</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 text-lg">
                  {creatorData.myContent.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold">
                  I&apos;ve <span className="text-primary">Worked With</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 text-lg">
                  {creatorData.workedWith.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Collabs Through Us Section */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Collabs <span className="text-primary">Through Us</span>
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <Atom className="h-12 w-12 text-foreground" />
              <FlaskConical className="h-12 w-12 text-foreground" />
              <Beaker className="h-12 w-12 text-foreground" />
              <Wind className="h-12 w-12 text-foreground" />
              <Flame className="h-12 w-12 text-foreground" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
