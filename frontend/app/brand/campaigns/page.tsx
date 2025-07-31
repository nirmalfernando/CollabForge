"use client";

import { useState, useEffect, JSX } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Menu, Leaf } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { campaignApi, brandApi, proposalApi, getAuthData } from "@/lib/api";

interface Campaign {
  _id?: string;
  id?: string;
  campaignId?: string;
  campaignTitle: string;
  budget: number;
  campaignStatus: "draft" | "active" | "completed" | "cancelled";
  categoryId: string;
  description: string;
  brandId: string;
  requirements?: object;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Populated fields from backend
  brand?: {
    companyName: string;
  };
  category?: {
    name: string;
  };
  // Add proposal count
  proposalCount?: number;
}

interface Brand {
  _id: string;
  companyName: string;
  bio?: string;
}

export default function BrandCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get campaign ID from different possible field names
  const getCampaignId = (campaign: Campaign): string | null => {
    return campaign._id || campaign.id || campaign.campaignId || null;
  };

  // Helper function to fetch proposal count for a campaign
  const fetchProposalCount = async (campaignId: string): Promise<number> => {
    try {
      const response = await proposalApi.getProposalsByCampaign(campaignId);
      const proposals = response.proposals || response || [];
      return Array.isArray(proposals) ? proposals.length : 0;
    } catch (error) {
      console.error(
        `Error fetching proposals for campaign ${campaignId}:`,
        error
      );
      return 0;
    }
  };

  // Helper function to format proposal count
  const formatProposalCount = (count: number): string => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}K`;
    }
    return count.toString();
  };

  // Enhanced helper function to get relative time (e.g., "2 hours ago", "3 days ago")
  const getRelativeTime = (dateString?: string): string => {
    if (!dateString) return "Unknown time";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60)
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
      if (diffInHours < 24)
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
      if (diffInDays < 7)
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
      if (diffInWeeks < 4)
        return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
      if (diffInMonths < 12)
        return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;

      // For dates older than a year, show the actual date
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown time";
    }
  };

  // Helper function to format full date and time for tooltips
  const formatFullDateTime = (dateString?: string): string => {
    if (!dateString) return "No date available";

    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid date";
    }
  };

  // Helper function to get status-specific timestamp text
  const getStatusTimestampText = (
    campaignStatus: string,
    createdAt?: string,
    updatedAt?: string
  ): {
    text: string;
    timestamp: string;
    fullDateTime: string;
  } => {
    // Determine which timestamp to use based on status
    let relevantDate: string | undefined;
    let statusText: string;

    switch (campaignStatus) {
      case "draft":
        relevantDate = createdAt;
        statusText = "Created";
        break;
      case "active":
        // Use updatedAt if it's different from createdAt (meaning it was activated later)
        relevantDate =
          updatedAt && updatedAt !== createdAt ? updatedAt : createdAt;
        statusText = "Activated";
        break;
      case "completed":
        relevantDate = updatedAt || createdAt;
        statusText = "Completed";
        break;
      case "cancelled":
        relevantDate = updatedAt || createdAt;
        statusText = "Cancelled";
        break;
      default:
        relevantDate = updatedAt || createdAt;
        statusText = "Updated";
    }

    return {
      text: statusText,
      timestamp: getRelativeTime(relevantDate),
      fullDateTime: formatFullDateTime(relevantDate),
    };
  };

  // Helper function to get status badge styling
  const getStatusBadge = (campaignStatus: string): JSX.Element => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    switch (campaignStatus) {
      case "active":
        return (
          <span
            className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}
          >
            Active
          </span>
        );
      case "draft":
        return (
          <span
            className={`${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`}
          >
            Draft
          </span>
        );
      case "completed":
        return (
          <span
            className={`${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`}
          >
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span
            className={`${baseClasses} bg-red-100 text-red-800 border border-red-200`}
          >
            Cancelled
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`}
          >
            Unknown
          </span>
        );
    }
  };

  useEffect(() => {
    const fetchBrandCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get auth data to get brand info
        const authData = getAuthData();

        if (!authData) {
          setError("Please log in to view campaigns");
          return;
        }

        // First, get the brand data to get brandId
        let brandData: Brand | null = null;
        try {
          const brandResponse = await brandApi.getBrandByUserId(
            authData.user.userId
          );
          brandData = brandResponse.brand || brandResponse;
          setBrand(brandData);
        } catch (brandError) {
          // Instead of failing immediately, let's try to get all campaigns and filter later
          try {
            const allCampaignsResponse = await campaignApi.getAllCampaigns();
            const allCampaigns =
              allCampaignsResponse.campaigns || allCampaignsResponse || [];

            // Fetch proposal counts for all campaigns
            const campaignsWithProposals = await Promise.all(
              allCampaigns.map(async (campaign: Campaign) => {
                const campaignId = getCampaignId(campaign);
                const proposalCount = campaignId
                  ? await fetchProposalCount(campaignId)
                  : 0;
                return { ...campaign, proposalCount };
              })
            );

            setCampaigns(campaignsWithProposals);
            setBrand({ _id: "unknown", companyName: "Your Brand" });
            return;
          } catch (fallbackError) {
            setError("Failed to load brand information and campaigns");
            return;
          }
        }

        if (!brandData?._id) {
          // Fallback: try to get all campaigns
          try {
            const allCampaignsResponse = await campaignApi.getAllCampaigns();
            const allCampaigns =
              allCampaignsResponse.campaigns || allCampaignsResponse || [];

            // Fetch proposal counts for all campaigns
            const campaignsWithProposals = await Promise.all(
              allCampaigns.map(async (campaign: Campaign) => {
                const campaignId = getCampaignId(campaign);
                const proposalCount = campaignId
                  ? await fetchProposalCount(campaignId)
                  : 0;
                return { ...campaign, proposalCount };
              })
            );

            setCampaigns(campaignsWithProposals);
            setBrand({ _id: "unknown", companyName: "Your Brand" });
            return;
          } catch (fallbackError) {
            setError(
              "Brand profile not found. Please complete your brand setup."
            );
            return;
          }
        }

        // Fetch campaigns for this brand
        const campaignsResponse = await campaignApi.getCampaignsByBrand(
          brandData._id
        );

        // Check the structure of the response
        const brandCampaigns =
          campaignsResponse.campaigns || campaignsResponse || [];

        // Fetch proposal counts for each campaign
        const campaignsWithProposals = await Promise.all(
          brandCampaigns.map(async (campaign: Campaign) => {
            const campaignId = getCampaignId(campaign);
            const proposalCount = campaignId
              ? await fetchProposalCount(campaignId)
              : 0;
            return { ...campaign, proposalCount };
          })
        );

        setCampaigns(campaignsWithProposals);
      } catch (err) {
        // Check if it's a network error, CORS error, or API error
        if (err instanceof Error) {
          if (err.message.includes("CORS")) {
            setError(
              "CORS error - Backend server may not be running or not configured for CORS"
            );
          } else if (err.message.includes("Network")) {
            setError("Network error - Check if backend server is running");
          } else {
            setError(`API Error: ${err.message}`);
          }
        } else {
          setError("Failed to load campaigns. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrandCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Loading campaigns and proposals...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const brandName = brand?.companyName || "Your Brand";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Our Events
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-primary"
              >
                <Menu className="h-8 w-8" />
                <span className="sr-only">Menu</span>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Leaf className="h-6 w-6 text-foreground" />
              <span className="text-lg text-foreground">By {brandName}</span>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {campaigns.length > 0 ? (
              campaigns.map((campaign, index) => {
                const campaignId = getCampaignId(campaign);
                const proposalCount = campaign.proposalCount || 0;
                const formattedProposalCount =
                  formatProposalCount(proposalCount);

                // Get enhanced timestamp information
                const timestampInfo = getStatusTimestampText(
                  campaign.campaignStatus,
                  campaign.createdAt,
                  campaign.updatedAt
                );

                return (
                  <Card
                    key={campaignId || `campaign-${index}`}
                    className="bg-card border-primary rounded-xl p-6 flex flex-col h-full"
                  >
                    <div className="space-y-4 flex-1">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex-1">
                            {campaign.campaignTitle} -{" "}
                            <span className="text-primary">
                              {formattedProposalCount}
                            </span>{" "}
                            {proposalCount === 1 ? "Proposal" : "Proposals"}
                          </h2>
                          {getStatusBadge(campaign.campaignStatus)}
                        </div>
                        <p
                          className="text-primary text-lg cursor-help"
                          title={timestampInfo.fullDateTime}
                        >
                          {timestampInfo.timestamp} •{" "}
                          {timestampInfo.text.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      {/* Only render Link if campaign ID exists */}
                      {campaignId ? (
                        <Link
                          href={`/brand/campaigns/${campaignId}/applications`}
                          prefetch={false}
                        >
                          <Button
                            variant="outline"
                            className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-2 bg-transparent w-full"
                          >
                            View Applications
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="outline"
                          disabled
                          className="rounded-full border-gray-400 text-gray-400 bg-transparent px-8 py-2 w-full"
                        >
                          Invalid Campaign
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })
            ) : (
              // No campaigns found
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No campaigns found. Create your first campaign to get started!
                </p>
                <Link href="/brand/campaigns/create">
                  <Button
                    variant="outline"
                    className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-2 bg-transparent"
                  >
                    Create Campaign
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
