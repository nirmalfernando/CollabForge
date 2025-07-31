"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Leaf, ChevronDown, Clock, RefreshCw } from "lucide-react";
import { useEffect, useState, use } from "react";
import { campaignApi, proposalApi, creatorApi, brandApi } from "@/lib/api";

interface Creator {
  _id: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  bio?: string;
  profilePicUrl?: string;
  socialMedia?: Array<{
    platform: string;
    handle: string;
    url: string;
    followers?: number;
  }>;
  type: string;
}

interface Proposal {
  _id: string;
  proposalId?: string; // Allow both formats
  creatorId: string;
  proposalTitle: string;
  proposalStatus: string;
}

interface ApplicantData {
  id: string;
  name: string;
  platform: string;
  handle: string;
  followers: string;
  avatarSrc: string;
  proposalId: string;
  bio?: string;
  type: string;
}

export default function CampaignApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  const [campaignData, setCampaignData] = useState<any>(null);
  const [brandName, setBrandName] = useState<string>("Brand");
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch campaign details
      const campaignResponse = await campaignApi.getCampaignById(
        resolvedParams.id
      );
      const campaign = campaignResponse.campaign || campaignResponse;
      setCampaignData(campaign);

      // Fetch brand name if brandId is available
      if (campaign?.brandId) {
        try {
          const brandResponse = await brandApi.getBrandById(campaign.brandId);
          const brand = brandResponse.brand || brandResponse;
          setBrandName(brand?.companyName || "Brand");
        } catch (brandError) {
          console.log("Could not fetch brand name, using default");
          setBrandName("Brand");
        }
      }

      // Fetch proposals for this campaign with proper error handling
      let proposals: Proposal[] = [];

      try {
        const proposalsResponse = await proposalApi.getProposalsByCampaign(
          resolvedParams.id
        );
        // Handle different response formats
        proposals = proposalsResponse.proposals || proposalsResponse || [];

        if (!Array.isArray(proposals)) {
          proposals = [];
        }
      } catch (proposalError: any) {
        // Handle 404 or "no proposals found" as normal case, not error
        if (
          proposalError.status === 404 ||
          proposalError.message?.includes("No") ||
          proposalError.message?.includes("not found")
        ) {
          console.log("No proposals found for this campaign (normal case)");
          proposals = [];
        } else {
          // Re-throw other errors
          throw proposalError;
        }
      }

      // If no proposals found, set empty array and continue (don't throw error)
      if (proposals.length === 0) {
        setApplicants([]);
        return;
      }

      // Fetch creator details for each proposal
      const applicantPromises = proposals.map(async (proposal) => {
        try {
          const creator: Creator = await creatorApi.getCreatorById(
            proposal.creatorId
          );

          // Get primary social media platform (first one or TikTok if available)
          const primarySocial =
            creator.socialMedia?.find(
              (sm) => sm.platform.toLowerCase() === "tiktok"
            ) || creator.socialMedia?.[0];

          return {
            id: creator._id,
            name:
              creator.nickName || `${creator.firstName} ${creator.lastName}`,
            platform: primarySocial?.platform || "N/A",
            handle: primarySocial?.handle || "N/A",
            followers: primarySocial?.followers
              ? primarySocial.followers >= 1000000
                ? `${(primarySocial.followers / 1000000).toFixed(1)}M`
                : primarySocial.followers >= 1000
                ? `${(primarySocial.followers / 1000).toFixed(0)}K`
                : primarySocial.followers.toString()
              : "N/A",
            avatarSrc: creator.profilePicUrl || "",
            // Handle both _id and proposalId formats
            proposalId: proposal.proposalId || proposal._id,
            bio: creator.bio,
            type: creator.type,
          };
        } catch (creatorError) {
          console.error(
            `Error fetching creator ${proposal.creatorId}:`,
            creatorError
          );
          return null;
        }
      });

      const applicantResults = await Promise.all(applicantPromises);
      const validApplicants = applicantResults.filter(
        (applicant) => applicant !== null
      ) as ApplicantData[];

      setApplicants(validApplicants);
    } catch (err) {
      console.error("Error fetching campaign applicants:", err);

      // Only set error for actual API failures, not for empty results
      if (err instanceof Error) {
        if (err.message.includes("CORS")) {
          setError(
            "CORS error - Backend server may not be running or not configured for CORS"
          );
        } else if (err.message.includes("Network")) {
          setError("Network error - Check if backend server is running");
        } else if (
          err.message.includes("404") ||
          err.message.includes("not found")
        ) {
          // Handle 404 errors gracefully - just show no applications
          setApplicants([]);
          return;
        } else {
          setError("Failed to load campaign data. Please try again.");
        }
      } else {
        setError("Failed to load campaign data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-muted-foreground">
                Loading campaign applicants...
              </div>
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
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="text-red-500 text-lg">{error}</div>
              <Button
                onClick={fetchData}
                variant="outline"
                className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
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
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto space-y-8">
          {/* Campaign Header Section */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h1 className="text-5xl md:text-6xl font-bold text-primary">
                {campaignData?.campaignTitle || "Loading..."}
              </h1>
              <div className="flex items-center gap-3 text-foreground flex-shrink-0">
                <Leaf className="h-6 w-6" />
                <span className="text-lg">By {brandName}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1 text-sm bg-transparent ml-4"
                    >
                      Status <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 bg-card text-foreground"
                    align="end"
                  >
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/20">
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/20">
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/20">
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-foreground">
              {campaignData?.description || "Campaign description..."}
            </p>
          </div>

          {/* Applicants List Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Applicants List
            </h2>
            <div className="relative">
              {applicants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-6 bg-card rounded-xl border border-primary/20">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                    <Clock className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">
                      No Active Applications Found
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-md">
                      This campaign hasn't received any applications yet.
                      Creators are still discovering your campaign.
                    </p>
                    <p className="text-primary font-medium">
                      Check back later for new applications!
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={fetchData}
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2 bg-transparent"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Link href="/brand/campaigns" prefetch={false}>
                      <Button
                        variant="outline"
                        className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2 bg-transparent"
                      >
                        Back to Campaigns
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  {applicants.map((applicant, index) => (
                    <div
                      key={`${applicant.id}-${applicant.proposalId}-${index}`}
                      className="flex items-center justify-between bg-card rounded-lg p-4 border border-primary/20"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 border-2 border-primary">
                          <AvatarImage
                            src={applicant.avatarSrc || "/placeholder.svg"}
                            alt={applicant.name}
                          />
                          <AvatarFallback className="bg-primary text-white font-bold">
                            {applicant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            Name: {applicant.name}
                          </h3>
                          <p className="text-muted-foreground">
                            Platform: {applicant.platform}
                          </p>
                          <p className="text-muted-foreground">
                            Handle: {applicant.handle}
                          </p>
                          <p className="text-muted-foreground">
                            Followers: {applicant.followers}
                          </p>
                          {applicant.type && (
                            <p className="text-muted-foreground">
                              Type: {applicant.type}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/brand/creators/${applicant.id}`}
                          prefetch={false}
                        >
                          <Button
                            variant="outline"
                            className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2 bg-transparent"
                          >
                            Profile
                          </Button>
                        </Link>
                        <Link
                          href={`/brand/campaigns/${resolvedParams.id}/applications/${applicant.proposalId}`}
                          prefetch={false}
                        >
                          <Button
                            variant="outline"
                            className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2 bg-transparent"
                          >
                            Application
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Custom Scrollbar */}
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #1a1a1a; /* Darker track */
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: #2196f3; /* Primary blue thumb */
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: #0088ff; /* Darker blue on hover */
                }
              `}</style>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
