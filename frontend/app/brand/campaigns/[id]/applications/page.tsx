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
import { Leaf, ChevronDown } from "lucide-react";
import { useEffect, useState, use } from "react";
import { campaignApi, proposalApi, creatorApi } from "@/lib/api";

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
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch campaign details
        const campaign = await campaignApi.getCampaignById(resolvedParams.id);
        setCampaignData(campaign);

        // Fetch proposals for this campaign
        const proposals: Proposal[] = await proposalApi.getProposalsByCampaign(
          resolvedParams.id
        );

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
        setError("Failed to load campaign applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading campaign applicants...</div>
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
            <div className="flex items-center justify-center h-64">
              <div className="text-red-500">{error}</div>
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
                <span className="text-lg">
                  By {campaignData?.brandId || "Brand"}
                </span>
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
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">
                    No applicants found for this campaign.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  {applicants.map((applicant, index) => (
                    <div
                      key={`${applicant.id}-${applicant.proposalId}-${index}`}
                      className="flex items-center justify-between bg-card rounded-lg p-4"
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
