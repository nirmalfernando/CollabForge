"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Leaf, ArrowLeft } from "lucide-react";
import { campaignApi, brandApi } from "@/lib/api";

interface Campaign {
  _id: string;
  campaignTitle: string;
  budget: number;
  campaignStatus: "draft" | "active" | "completed" | "cancelled";
  categoryId: string;
  description: string;
  brandId: string;
  requirements?: {
    influencerType?: string;
    followers?: string;
    voice?: string;
    contentStyle?: string;
    location?: string;
    bonus?: string;
    goals?: string[];
    deliverables?: string;
    bonuses?: string;
  };
  status: boolean;
  // Populated fields from backend
  brand?: {
    _id: string;
    companyName: string;
    bio?: string;
  };
  category?: {
    name: string;
  };
}

interface Brand {
  _id: string;
  companyName: string;
  bio?: string;
  description?: {
    mission?: string;
    vision?: string;
  };
}

// Dummy data for "You Might Also Like" section - this could be fetched from API later
const relatedCampaigns = [
  {
    id: "related-1",
    brand: "DripHaus",
    title: "The GlowUp Campaign",
    description:
      "We're teaming up with fresh creators to showcase our latest skincare drops. Think glow, glam, and good vibes.",
  },
  {
    id: "related-2",
    brand: "Veltra",
    title: "Minimal Moves",
    description:
      "Join Veltra's minimalist fashion wave. Showcase our limited drops in your own aesthetic style.",
  },
  {
    id: "related-3",
    brand: "Loopify",
    title: "Plug In. Speak Out.",
    description:
      "Show off our wireless audio gear in action. Music lovers and creators with chill energy welcome.",
  },
  {
    id: "related-4",
    brand: "Orbiton",
    title: "Level Up with Orbiton",
    description:
      "Gamers, tech heads, and streamers — help us drop our newest smart gear to your audience.",
  },
  {
    id: "related-5",
    brand: "NovaGlow",
    title: "Radiate Bold",
    description:
      "Create glowing, confident content with NovaGlow's new beauty boosters. Tutorials & GRWM welcome.",
  },
];

export default function CreatorCampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise
  const { id } = use(params);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);

        // Fetch campaign data
        const campaignResponse = await campaignApi.getCampaignById(id);
        const campaignData = campaignResponse.campaign || campaignResponse;

        console.log("Campaign data:", campaignData);
        console.log("Campaign _id:", campaignData._id);
        console.log("Campaign object keys:", Object.keys(campaignData));

        setCampaign(campaignData);

        // Fetch brand data if brandId is available
        if (campaignData.brandId) {
          try {
            const brandResponse = await brandApi.getBrandById(
              campaignData.brandId
            );
            const brandData = brandResponse.brand || brandResponse;
            setBrand(brandData);
          } catch (brandError) {
            console.error("Error fetching brand data:", brandError);
            // Don't set error for brand fetch failure, just continue without brand details
          }
        }
      } catch (err) {
        console.error("Error fetching campaign:", err);
        if (err instanceof Error) {
          setError(`Failed to load campaign: ${err.message}`);
        } else {
          setError("Failed to load campaign. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaignData();
    }
  }, [id]);

  // Format budget display
  const formatBudget = (budget: number) => {
    return `$${budget.toLocaleString()}`;
  };

  // Parse requirements or provide defaults
  const getRequirements = () => {
    if (!campaign?.requirements) {
      return {
        goals: [
          "Increase brand awareness",
          "Drive engagement",
          "Generate authentic content",
        ],
        influencerType: "Nano & Micro Influencers",
        followers: "1,000 - 100,000 followers",
        voice:
          "Authentic and engaging voice that resonates with target audience",
        contentStyle:
          "High-quality photos and videos that align with brand aesthetic",
        location: "Based in target market regions",
        bonus: "Previous brand collaboration experience is a plus",
        deliverables: "Multiple posts and stories as per campaign brief",
        bonuses: "Performance bonuses based on engagement metrics",
      };
    }

    return {
      goals: campaign.requirements.goals || [
        "Increase brand awareness",
        "Drive engagement",
      ],
      influencerType:
        campaign.requirements.influencerType || "Nano & Micro Influencers",
      followers: campaign.requirements.followers || "1,000 - 100,000 followers",
      voice: campaign.requirements.voice || "Authentic and engaging voice",
      contentStyle:
        campaign.requirements.contentStyle || "High-quality visual content",
      location: campaign.requirements.location || "Global",
      bonus: campaign.requirements.bonus || "Previous experience preferred",
      deliverables:
        campaign.requirements.deliverables || "As per campaign brief",
      bonuses:
        campaign.requirements.bonuses || "Performance-based bonuses available",
    };
  };

  // Helper function to get the campaign ID (handles both _id and campaignId)
  const getCampaignId = () => {
    if (!campaign) return id;
    return campaign._id || id;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Loading campaign details...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="text-center py-12 space-y-4">
              <p className="text-red-500 text-lg">
                {error || "Campaign not found"}
              </p>
              <div className="space-x-4">
                <Link href="/creator/campaigns">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Campaigns
                  </Button>
                </Link>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const requirements = getRequirements();
  const brandName =
    brand?.companyName || campaign.brand?.companyName || "Brand";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto space-y-12">
          {/* Back Button */}
          <Link
            href="/creator/campaigns"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Link>

          {/* Top Section: Title, Brand, Button, Description */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h1 className="text-5xl md:text-6xl font-bold text-primary">
                {campaign.campaignTitle}
              </h1>
              <div className="flex items-center gap-3 text-foreground flex-shrink-0">
                <Leaf className="h-6 w-6" />
                <span className="text-lg">By {brandName}</span>
                {brand?._id && (
                  <Link href={`/creator/brands/${brand._id}`} prefetch={false}>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1 text-sm bg-transparent ml-4"
                    >
                      View Profile
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg leading-relaxed text-foreground">
                {campaign.description}
              </p>
              <p className="text-2xl font-bold text-primary">
                Budget: {formatBudget(campaign.budget)}
              </p>
              <p className="text-sm text-muted-foreground">
                Status:{" "}
                <span className="capitalize font-medium text-foreground">
                  {campaign.campaignStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Main Content Grid: Campaign Details (left) and You Might Also Like (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Campaign Details and Action Buttons */}
            <div className="lg:col-span-2 space-y-8">
              {/* Campaign Goals */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Campaign <span className="text-primary">Goals</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 text-lg text-foreground">
                  {requirements.goals.map((goal, index) => (
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
                  <li>
                    <strong>Influencer Type:</strong>{" "}
                    {requirements.influencerType}
                  </li>
                  <li>
                    <strong>Followers:</strong> {requirements.followers}
                  </li>
                  <li>
                    <strong>Voice:</strong> {requirements.voice}
                  </li>
                  <li>
                    <strong>Content Style:</strong> {requirements.contentStyle}
                  </li>
                  <li>
                    <strong>Location:</strong> {requirements.location}
                  </li>
                  <li>
                    <strong>Bonus:</strong> {requirements.bonus}
                  </li>
                </ul>
              </div>

              {/* Budget & Compensation */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Budget <span className="text-primary">& Compensation</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 text-lg text-foreground">
                  <li>
                    <strong>Campaign Budget:</strong>{" "}
                    {formatBudget(campaign.budget)}
                  </li>
                  <li>
                    <strong>Bonuses:</strong> {requirements.bonuses}
                  </li>
                  <li>
                    <strong>Deliverables:</strong> {requirements.deliverables}
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 pt-8">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                  onClick={() => {
                    console.log("Contact campaign:", getCampaignId());
                    alert("Contact functionality to be implemented");
                  }}
                >
                  Contact Us
                </Button>
                <Link
                  href={`/creator/campaigns/${getCampaignId()}/apply`}
                  prefetch={false}
                  onClick={() => {
                    console.log(
                      "Navigating to apply page with ID:",
                      getCampaignId()
                    );
                    console.log(
                      "Full URL:",
                      `/creator/campaigns/${getCampaignId()}/apply`
                    );
                  }}
                >
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
                {relatedCampaigns.slice(0, 4).map((relatedCampaign) => (
                  <Link
                    key={relatedCampaign.id}
                    href={`/creator/campaigns/${relatedCampaign.id}`}
                    prefetch={false}
                    className="block p-2 -mx-2 rounded-md hover:bg-primary/10 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-foreground">
                        {relatedCampaign.brand} -{" "}
                        <span className="text-primary">
                          &ldquo;{relatedCampaign.title}&rdquo;
                        </span>
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {relatedCampaign.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-right">
                <Link
                  href="/creator/campaigns"
                  className="text-primary hover:underline text-lg"
                  prefetch={false}
                >
                  More...
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
