import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Microscope, MapPin, Globe, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image" // Import Image component

// In a real app, you would fetch this data based on the `params.id`
const brandData = {
  name: "Zentro Labs",
  bio: "At Zentro Labs, we believe science shouldn't be intimidating — it should be inspiring, accessible, and maybe even a little weird. We build science kits, experiments, and digital learning tools that turn curiosity into action. From students and hobbyists to teachers and content creators, we help curious minds across the world explore science their way.",
  details: [
    { icon: Microscope, text: "Tagline: Science, Simplified." },
    { icon: MapPin, text: "Headquarters: Boston, MA" },
    { icon: Globe, text: "Website: zentrolabs.com", link: "#" },
    { icon: Mail, text: "Contact: sponsors@zentrolabs.com", link: "mailto:sponsors@zentrolabs.com" },
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
  testimonials: [
    {
      avatarSrc: "/images/mads-molecule-avatar.png",
      quote: "They don't just want ads — they want experiments, ideas, and energy.",
      author: "Mads Molecule (@madsmolcule)",
    },
    {
      avatarSrc: "/placeholder.svg?height=60&width=60",
      quote:
        "Working with Zentro felt like a science-fueled fever dream in the best way. They respected my nerdy side AND my aesthetic.",
      author: "Nina Neuron (@neuroninja)",
    },
  ],
  bannerImageUrl: "/images/brand-banner.png", // Added banner image URL
  profilePicUrl: "/placeholder.svg?height=200&width=200", // Placeholder for Zentro logo
}

const ZentroLogo = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
    <path d="M19.6364 20L32 29.0909L44.3636 20" stroke="currentColor" strokeWidth="3" />
    <path d="M19.6364 34.9091L32 44L44.3636 34.9091" stroke="currentColor" strokeWidth="3" />
    <path d="M32 29.0909V44" stroke="currentColor" strokeWidth="3" />
  </svg>
)

export default function CreatorBrandProfileViewPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1">
        {/* Banner Section with background image */}
        <section className="relative w-full h-48 md:h-64 overflow-hidden">
          <Image
            src={brandData.bannerImageUrl || "/placeholder.svg"}
            alt="Brand banner"
            layout="fill"
            objectFit="cover"
            className="z-0"
            priority
          />
        </section>

        {/* Main content area */}
        <div className="relative bg-background pb-12">
          <div className="container px-4 md:px-6">
            {/* Profile Header with Logo, Blue Line, and Buttons */}
            <div className="relative flex flex-col md:flex-row items-center gap-6 -mt-24">
              {/* Profile Picture/Logo Container */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary p-1">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center p-4">
                    {/* Using Avatar for consistency, but rendering custom SVG inside fallback */}
                    <Avatar className="w-full h-full bg-transparent">
                      <AvatarImage src={brandData.profilePicUrl || "/placeholder.svg"} alt={`${brandData.name} logo`} />
                      <AvatarFallback className="bg-transparent">
                        <ZentroLogo />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>

              {/* Blue Line and Buttons - Grouped to ensure horizontal alignment */}
              <div className="flex-1 flex flex-col md:flex-row items-center gap-6 w-full">
                {/* Blue Line - now truly "alongside" the profile picture and extending to buttons */}
                <div className="w-full h-[2px] bg-primary flex-1 hidden md:block" />
                {/* Buttons */}
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <div className="flex gap-2">
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
                  <Link href="/creator/sponsorships" prefetch={false}>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      Sponsorships
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            {/* This line was redundant for md screens, but kept for smaller screens if needed */}
            <div className="w-full h-[2px] bg-primary mt-6 md:hidden" />

            {/* Profile Details */}
            <div className="mt-8 space-y-10">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-primary">{brandData.name}</h1>
                <p className="text-lg text-muted-foreground">{brandData.bio}</p>
              </div>

              <div className="grid gap-2">
                {brandData.details.map((detail, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <detail.icon className="h-5 w-5 text-primary" />
                    {detail.link ? (
                      <Link href={detail.link} className="text-lg hover:underline text-foreground">
                        {detail.text}
                      </Link>
                    ) : (
                      <span className="text-lg text-foreground">{detail.text}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold">
                  What We Look For in <span className="text-primary">Collaborators</span>
                </h2>
                <ul className="list-disc list-inside text-lg space-y-1 text-muted-foreground">
                  {brandData.whatWeLookFor.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold">
                  Popular <span className="text-primary">Sponsorship Campaigns</span>
                </h2>
                <div className="space-y-4">
                  {brandData.sponsorshipCampaigns.map((campaign, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h4 className="font-semibold text-xl text-foreground">{campaign.name}</h4>
                      <p className="text-base text-muted-foreground">Budget: {campaign.budget}</p>
                      <p className="text-base text-muted-foreground">{campaign.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold">
                  What People Say <span className="text-primary">About Us</span>
                </h2>
                <div className="grid gap-8">
                  {brandData.testimonials.map((testimonial, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <Avatar className="w-16 h-16 flex-shrink-0">
                        <AvatarImage src={testimonial.avatarSrc || "/placeholder.svg"} alt={testimonial.author} />
                        <AvatarFallback>
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-lg italic text-foreground leading-relaxed">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                        <p className="text-base font-medium text-muted-foreground">&ndash; {testimonial.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <Link href="#" className="text-primary hover:underline text-lg" prefetch={false}>
                    More...
                  </Link>
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
