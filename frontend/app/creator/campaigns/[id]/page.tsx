import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Leaf } from "lucide-react"

// Dummy data for a single campaign detail (replace with fetched data in a real app)
const campaignDetailData = {
  id: 1,
  brand: "Zentro Labs",
  title: "Science, Simplified",
  tagline:
    "We're teaming up with creators to make smart wellness cool. Show how Zentro Labs' health tech fits into your real life — whether it's your morning routine, fitness journey, or daily productivity hacks.",
  goals: [
    "Promote Zentro's latest wearable health tracker.",
    "Drive app downloads from a younger tech-savvy audience.",
    "Build trust through authentic creator use-cases.",
  ],
  whoWeAreLookingFor: {
    influencerType: "Nano & Micro Influencers",
    followers: "3,000 - 50,000 followers on TikTok, Instagram, or YouTube",
    voice:
      "Authentic Voice: You love explaining things in a simple, helpful way — especially around health, wellness, or productivity",
    contentStyle: "Short-form videos, vlogs, or story-style content (natural lighting, unfiltered, casual tone)",
    location: "Based in the US, UK, Canada, or Australia",
    bonus: "If you've used smart health gear (like Oura, Fitbit, Whoop) before — we want you!",
  },
  budgetCompensation: {
    perCampaign: "$500 - $900 per campaign",
    bonuses: "performance bonuses (tracked links, affiliate % optional)",
    deliverables: "1-2 short-form videos or 1 long-form video + 3 story mentions",
  },
}

// Dummy data for "You Might Also Like" section
const relatedCampaigns = [
  {
    id: 3,
    brand: "DripHaus",
    title: "The GlowUp Campaign",
    description:
      "We're teaming up with fresh creators to showcase our latest skincare drops. Think glow, glam, and good vibes.",
  },
  {
    id: 2,
    brand: "Veltra",
    title: "Minimal Moves",
    description: "Join Veltra's minimalist fashion wave. Showcase our limited drops in your own aesthetic style.",
  },
  {
    id: 4,
    brand: "Loopify",
    title: "Plug In. Speak Out.",
    description: "Show off our wireless audio gear in action. Music lovers and creators with chill energy welcome.",
  },
  {
    id: 5,
    brand: "Orbiton",
    title: "Level Up with Orbiton",
    description: "Gamers, tech heads, and streamers — help us drop our newest smart gear to your audience.",
  },
  {
    id: 6,
    brand: "NovaGlow",
    title: "Radiate Bold",
    description: "Create glowing, confident content with NovaGlow's new beauty boosters. Tutorials & GRWM welcome.",
  },
]

export default function CreatorCampaignDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would use params.id to fetch the specific campaign data
  // For now, we're using static dummy data
  const campaign = campaignDetailData
  const brandId = 1 // In a real app, this would come from the campaign data

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto space-y-12">
          {/* Top Section: Title, Brand, Button, Tagline */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h1 className="text-5xl md:text-6xl font-bold text-primary">{campaign.title}</h1>
              <div className="flex items-center gap-3 text-foreground flex-shrink-0">
                <Leaf className="h-6 w-6" />
                <span className="text-lg">By {campaign.brand}</span>
                <Link href={`/creator/brands/${brandId}`} prefetch={false}>
                  <Button
                    variant="outline"
                    className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1 text-sm bg-transparent ml-4"
                  >
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-foreground">{campaign.tagline}</p>
          </div>

          {/* Main Content Grid: Goals, Who, Budget, Buttons (left) and You Might Also Like (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Campaign Details and Action Buttons */}
            <div className="lg:col-span-2 space-y-8">
              {/* Campaign Goals */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Campaign <span className="text-primary">Goals</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 text-lg text-foreground">
                  {campaign.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>

              {/* Who We're Looking For */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Who <span className="text-primary">We're Looking For</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 text-lg text-foreground">
                  <li>{campaign.whoWeAreLookingFor.influencerType}</li>
                  <li>{campaign.whoWeAreLookingFor.followers}</li>
                  <li>{campaign.whoWeAreLookingFor.voice}</li>
                  <li>{campaign.whoWeAreLookingFor.contentStyle}</li>
                  <li>{campaign.whoWeAreLookingFor.location}</li>
                  <li>{campaign.whoWeAreLookingFor.bonus}</li>
                </ul>
              </div>

              {/* Budget & Compensation */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Budget <span className="text-primary">& Compensation</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 text-lg text-foreground">
                  <li>{campaign.budgetCompensation.perCampaign}</li>
                  <li>{campaign.budgetCompensation.bonuses}</li>
                  <li>{campaign.budgetCompensation.deliverables}</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 pt-8">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                >
                  Contact Us
                </Button>
                <Link href={`/creator/campaigns/${campaign.id}/apply`} prefetch={false}>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                  >
                    Apply
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: "You Might Also Like" Sidebar */}
            <div className="lg:col-span-1 bg-muted rounded-xl p-8 space-y-6 row-start-1 lg:row-start-auto">
              <h2 className="text-3xl font-bold text-foreground">
                You Might Also <span className="text-primary">Like</span>
              </h2>
              <div className="space-y-6">
                {relatedCampaigns.map((relatedCampaign) => (
                  <Link
                    key={relatedCampaign.id}
                    href={`/creator/campaigns/${relatedCampaign.id}`}
                    prefetch={false}
                    className="block p-2 -mx-2 rounded-md hover:bg-primary/10 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-foreground">
                        {relatedCampaign.brand} -{" "}
                        <span className="text-primary">&ldquo;{relatedCampaign.title}&rdquo;</span>
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{relatedCampaign.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-right">
                <Link href="/creator/campaigns" className="text-primary hover:underline text-lg" prefetch={false}>
                  More...
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
