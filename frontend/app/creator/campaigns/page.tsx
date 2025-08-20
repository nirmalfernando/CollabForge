"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { campaignApi, categoryApi } from "@/lib/api";

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
  // Populated fields from backend
  brand?: {
    companyName: string;
  };
  category?: {
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

export default function CreatorCampaignsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get campaign ID from different possible field names
  const getCampaignId = (campaign: Campaign): string | null => {
    return campaign._id || campaign.id || campaign.campaignId || null;
  };

  // Format budget display
  const formatBudget = (budget: number) => {
    return `$${budget.toLocaleString()}`;
  };

  // Fetch campaigns and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch campaigns and categories concurrently
        const [campaignsResponse, categoriesResponse] = await Promise.all([
          campaignApi.getAllCampaigns(),
          categoryApi.getAllCategories(),
        ]);

        // Debug: Log the full response to see the structure
        console.log("Campaigns Response:", campaignsResponse);
        console.log("Categories Response:", categoriesResponse);

        // Check the structure of the response
        const allCampaigns =
          campaignsResponse.campaigns || campaignsResponse || [];

        // Debug: Log all campaigns before filtering
        console.log("All Campaigns:", allCampaigns);

        // Filter only active campaigns for creators to browse
        const activeCampaigns = allCampaigns.filter((campaign: Campaign) => {
          // Debug: Log each campaign and its properties
          console.log("Campaign:", campaign);
          console.log("Campaign ID:", getCampaignId(campaign));
          console.log("Campaign Status:", campaign.campaignStatus);
          console.log("Campaign Active Status:", campaign.status);

          return (
            campaign.campaignStatus === "active" && campaign.status === true
          );
        });

        console.log("Active Campaigns:", activeCampaigns);

        setCampaigns(activeCampaigns);
        setCategories(
          categoriesResponse.categories || categoriesResponse || []
        );
      } catch (err) {
        console.error("Error fetching data:", err);
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

    fetchData();
  }, []);

  // Create categories list including "All"
  const categoryOptions = ["All", ...categories.map((cat) => cat.name)];

  // Filter campaigns based on selected category and search query
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesCategory =
      selectedCategory === "All" ||
      campaign.category?.name === selectedCategory;
    const matchesSearch =
      campaign.brand?.companyName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      campaign.campaignTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Loading campaigns...
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
        <Header isLoggedIn={true} userRole="influencer" />
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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-4 pr-16 text-lg"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground hover:text-primary"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Filter menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 bg-card border-2 border-primary rounded-lg p-4"
                align="end"
              >
                {categoryOptions.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    className="cursor-pointer hover:bg-primary/20 text-foreground text-lg py-3 px-4 rounded-none border-none focus:bg-primary/20"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Display Applied Filter */}
          <div className="flex justify-end mb-4">
            <span className="text-sm text-muted-foreground">
              Category:{" "}
              <span className="font-semibold text-primary">
                {selectedCategory}
              </span>
            </span>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredCampaigns.map((campaign) => {
              const campaignId = getCampaignId(campaign);

              // Debug: Log each campaign being rendered
              console.log(
                "Rendering campaign:",
                campaignId,
                campaign.campaignTitle
              );

              return (
                <Card
                  key={campaignId || `campaign-${Math.random()}`}
                  className="bg-card border-primary rounded-lg p-6 flex flex-col justify-between"
                >
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl font-bold text-foreground">
                      {campaign.brand?.companyName || "Brand"} -{" "}
                      <span className="text-primary">
                        {campaign.campaignTitle}
                      </span>
                    </h3>
                    <p className="text-foreground text-sm leading-relaxed">
                      {campaign.description}
                    </p>
                    <p className="text-primary font-medium">
                      Budget: {formatBudget(campaign.budget)}
                    </p>
                  </div>

                  {/* Only render Link if campaign ID exists */}
                  {campaignId ? (
                    <Link
                      href={`/creator/campaigns/${campaignId}`}
                      prefetch={false}
                      className="mt-auto"
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                      >
                        Check It Out
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="w-full rounded-full border-gray-400 text-gray-400 bg-transparent mt-auto"
                      onClick={() =>
                        console.log("Full campaign object:", campaign)
                      }
                    >
                      Invalid Campaign ID
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>

          {/* No Results Message */}
          {filteredCampaigns.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No campaigns found matching your criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
