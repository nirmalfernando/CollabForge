"use client"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Tag, MapPin, Globe, Mail } from "lucide-react" // Using MessageCircle for the quote icon
import { Button } from "@/components/ui/button"

export default function BrandProfilePage() {
  // Dummy data for the brand profile
  const brandData = {
    name: "Zentro Labs",
    bio: "At Zentro Labs, we believe science shouldn't be intimidating — it should be inspiring, accessible, and maybe even a little weird. We build science kits, experiments, and digital learning tools that turn curiosity into action. From students and hobbyists to teachers and content creators, we help curious minds across the world explore science their way.",
    details: [
      { icon: Tag, text: "Tagline: Science, Simplified." },
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
    testimonials: [
      {
        avatarSrc: "/placeholder.svg?height=60&width=60",
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
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1">
        {/* Banner Section (empty as per screenshot) */}
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-background overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-8">
              <div className="w-48 h-24 sm:w-64 sm:h-32 bg-white rounded-b-full" />
              <div className="w-48 h-24 sm:w-64 sm:h-32 bg-white rounded-b-full" />
            </div>
          </div>
        </section>

        {/* Main content area with dark background */}
        <div className="relative bg-background pb-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Picture/Logo Container - positioned to overlap */}
              <div className="relative -mt-20 md:-mt-24 lg:-mt-28 flex-shrink-0">
                <Avatar className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-primary shadow-lg bg-black flex items-center justify-center">
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
                    {" "}
                    {/* Updated link */}
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
                  {" "}
                  {/* This div was originally outside */}
                  <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold">{brandData.name}</h1> {/* Increased font size */}
                    <p className="text-lg text-muted-foreground">{brandData.bio}</p> {/* Increased font size */}
                  </div>
                  {/* Contact Details */}
                  <div className="grid gap-2">
                    {brandData.details.map((detail, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <detail.icon className="h-5 w-5 text-primary" /> {/* Changed icon color to primary */}
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
                  {/* "What We Look For" Section */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold">
                      What We Look For in <span className="text-primary">Collaborators</span>
                    </h3>
                    <ul className="list-disc list-inside text-lg space-y-1 text-muted-foreground">
                      {" "}
                      {/* Increased font size */}
                      {brandData.whatWeLookFor.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {/* Sponsorship Campaigns Section */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold">
                      Popular <span className="text-primary">Sponsorship Campaigns</span>
                    </h3>
                    <div className="grid gap-4">
                      {brandData.sponsorshipCampaigns.map((campaign, index) => (
                        <div key={index} className="border border-primary rounded-md p-4 space-y-2 bg-card">
                          {" "}
                          {/* Added border-primary, bg-card */}
                          <h4 className="font-semibold text-xl text-primary">{campaign.name}</h4>{" "}
                          {/* Increased font size, changed to primary */}
                          <p className="text-base text-foreground">{campaign.description}</p> {/* Adjusted font size */}
                          <p className="text-base text-muted-foreground">Budget: {campaign.budget}</p>{" "}
                          {/* Adjusted font size */}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Testimonials Section */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold">
                      What People Say About <span className="text-primary">Us</span>
                    </h3>
                    <div className="grid gap-4">
                      {brandData.testimonials.map((testimonial, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 border border-primary rounded-md p-4 bg-card"
                        >
                          {" "}
                          {/* Added border-primary, bg-card */}
                          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                            {" "}
                            {/* Increased avatar size */}
                            <AvatarImage src={testimonial.avatarSrc || "/placeholder.svg"} alt={testimonial.author} />
                            <AvatarFallback className="bg-primary text-white text-xl font-bold">
                              {testimonial.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-2 flex flex-col justify-center">
                            {" "}
                            {/* Centered content vertically */}
                            <p className="text-lg italic text-foreground leading-relaxed">
                              &ldquo;{testimonial.quote}&rdquo;
                            </p>
                            <p className="text-base font-medium text-muted-foreground">{testimonial.author}</p>{" "}
                            {/* Adjusted font size */}
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
