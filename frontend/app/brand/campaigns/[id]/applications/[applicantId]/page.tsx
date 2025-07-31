"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Leaf } from "lucide-react";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
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

interface Brand {
  _id: string;
  companyName: string;
  bio?: string;
  profilePicUrl?: string;
}

interface Campaign {
  _id: string;
  campaignTitle: string;
  description: string;
  brandId: string;
}

interface Proposal {
  _id?: string;
  proposalId?: string;
  campaignId: string;
  creatorId: string;
  proposalTitle: string;
  proposalPitch: string;
  contentPlan?: string;
  startDate: string;
  endDate: string;
  proposalStatus: string;
  createdAt: string;
}

interface ApplicationData {
  proposal: Proposal;
  creator: Creator;
  campaign: Campaign;
  brand: Brand;
}

// Dummy data for "You Might Also Like" section (other applicants)
const otherApplicants = [
  {
    id: 2,
    name: "Mads Molecule",
    platform: "TikTok",
    handle: "@madsmolcule",
    followers: "320,000",
    avatarSrc: "/images/mads-molecule-avatar.png",
  },
  {
    id: 3,
    name: "Mads Molecule",
    platform: "TikTok",
    handle: "@madsmolcule",
    followers: "320,000",
    avatarSrc: "/images/mads-molecule-avatar.png",
  },
  {
    id: 4,
    name: "Mads Molecule",
    platform: "TikTok",
    handle: "@madsmolcule",
    followers: "320,000",
    avatarSrc: "/images/mads-molecule-avatar.png",
  },
  {
    id: 5,
    name: "Mads Molecule",
    platform: "TikTok",
    handle: "@madsmolcule",
    followers: "320,000",
    avatarSrc: "/images/mads-molecule-avatar.png",
  },
];

export default function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string; applicantId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        console.log(
          "Fetching application data for:",
          resolvedParams.applicantId
        );
        console.log("All resolved params:", resolvedParams);

        // Validate applicantId (which is actually the proposalId)
        if (
          !resolvedParams.applicantId ||
          resolvedParams.applicantId === "undefined"
        ) {
          throw new Error("Invalid proposal ID");
        }

        // Fetch proposal details directly using the proposalId
        const proposal: Proposal = await proposalApi.getProposalById(
          resolvedParams.applicantId
        );
        console.log("Proposal data:", proposal);

        // Fetch creator details
        const creator: Creator = await creatorApi.getCreatorById(
          proposal.creatorId
        );
        console.log("Creator data:", creator);

        // Fetch campaign details
        const campaign: Campaign = await campaignApi.getCampaignById(
          proposal.campaignId
        );
        console.log("Campaign data:", campaign);

        // Fetch brand details
        const brand: Brand = await brandApi.getBrandById(campaign.brandId);
        console.log("Brand data:", brand);

        setApplicationData({
          proposal,
          creator,
          campaign,
          brand,
        });
      } catch (err) {
        console.error("Error fetching application data:", err);
        // Ensure error is always a string
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load application details";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [resolvedParams.applicantId]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  const handleStatusUpdate = async (status: "accepted" | "rejected") => {
    if (!applicationData) return;

    try {
      const proposalId =
        applicationData.proposal._id || applicationData.proposal.proposalId;
      if (!proposalId) {
        console.error("No proposal ID available");
        return;
      }

      await proposalApi.updateProposalStatus(proposalId, status);

      // Update local state
      setApplicationData((prev) =>
        prev
          ? {
              ...prev,
              proposal: { ...prev.proposal, proposalStatus: status },
            }
          : null
      );

      // If proposal is accepted, redirect to contract creation page
      if (status === "accepted") {
        router.push(
          `/brand/campaigns/${resolvedParams.id}/applications/${resolvedParams.applicantId}/contract`
        );
      }
    } catch (err) {
      console.error("Error updating proposal status:", err);
    }
  };

  const parseContentPlan = (contentPlan?: string): string[] => {
    if (!contentPlan) return [];

    try {
      // If it's a JSON string, parse it
      if (contentPlan.startsWith("[") || contentPlan.startsWith("{")) {
        const parsed = JSON.parse(contentPlan);
        if (Array.isArray(parsed)) {
          // Ensure all items are strings
          return parsed.map((item) =>
            typeof item === "string" ? item : String(item)
          );
        }
        // If it's an object, convert values to string array
        return Object.values(parsed).map((item) => String(item));
      }

      // If it's a regular string, split by newlines or common delimiters
      return contentPlan
        .split(/\n|;|\|/)
        .filter((item) => item.trim().length > 0)
        .map((item) => item.trim());
    } catch {
      // If parsing fails, return as single item array
      return [String(contentPlan)];
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading application details...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !applicationData) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-red-500">
                {error || "Application not found"}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { proposal, creator, campaign, brand } = applicationData;
  const creatorName =
    creator.nickName || `${creator.firstName} ${creator.lastName}`;
  const contentPlanItems = parseContentPlan(proposal.contentPlan);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto space-y-12">
          {/* Top Section: Campaign Title and Brand */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h1 className="text-5xl md:text-6xl font-bold text-primary">
                &ldquo;{String(campaign.campaignTitle)}&rdquo;
              </h1>
              <div className="flex items-center gap-3 text-foreground flex-shrink-0">
                <Leaf className="h-6 w-6" />
                <span className="text-lg">By {brand.companyName}</span>
              </div>
            </div>
          </div>

          {/* Applicant Section */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-primary">Applicant</h2>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-2 border-primary">
                <AvatarImage
                  src={creator.profilePicUrl || "/placeholder.svg"}
                  alt={creatorName}
                />
                <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                  {creatorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-4xl font-semibold text-foreground">
                {creatorName}
              </span>
            </div>
          </div>

          {/* Main Content Grid: Proposal Details (left) and You Might Also Like (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Application Details and Action Buttons */}
            <div className="lg:col-span-2 space-y-8">
              {/* Proposal Title */}
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">
                  Proposal Title
                </h3>
                <p className="text-lg leading-relaxed text-foreground">
                  {String(proposal.proposalTitle)}
                </p>
              </div>

              {/* Proposal Pitch */}
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">
                  Proposal Pitch
                </h3>
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                  {String(proposal.proposalPitch)}
                </p>
              </div>

              {/* Content Plan */}
              {contentPlanItems.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-primary">
                    Content Plan
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-lg text-foreground">
                    {contentPlanItems.map((item, index) => (
                      <li key={index}>{String(item)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content Timeline */}
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">
                  Content Timeline
                </h3>
                <ul className="list-disc list-inside space-y-1 text-lg text-foreground">
                  <li>Start Date: {formatDate(proposal.startDate)}</li>
                  <li>End Date: {formatDate(proposal.endDate)}</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <div className="flex-1">
                  <Button
                    onClick={() => handleStatusUpdate("accepted")}
                    variant="outline"
                    disabled={proposal.proposalStatus !== "pending"}
                    className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent disabled:opacity-50"
                  >
                    {proposal.proposalStatus === "accepted"
                      ? "Accepted"
                      : "Accept"}
                  </Button>
                </div>
                <div className="flex-1">
                  <Button
                    onClick={() => handleStatusUpdate("rejected")}
                    variant="outline"
                    disabled={proposal.proposalStatus !== "pending"}
                    className="w-full rounded-full border-[#f32121] text-[#f32121] hover:bg-[#ff0000]/10 hover:text-[#ff0000] px-6 py-3 text-lg bg-transparent disabled:opacity-50"
                  >
                    {proposal.proposalStatus === "rejected"
                      ? "Rejected"
                      : "Reject"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: "You Might Also Like" Sidebar */}
            <div className="lg:col-span-1 bg-muted rounded-xl p-8 space-y-6 row-start-1 lg:row-start-auto">
              <h2 className="text-3xl font-bold text-foreground">
                You Might Also <span className="text-primary">Like</span>
              </h2>
              <div className="space-y-6">
                {otherApplicants.map((otherApplicant) => (
                  <div
                    key={otherApplicant.id}
                    className="flex items-start gap-4"
                  >
                    <Avatar className="w-16 h-16 border-2 border-primary flex-shrink-0">
                      <AvatarImage
                        src={otherApplicant.avatarSrc || "/placeholder.svg"}
                        alt={otherApplicant.name}
                      />
                      <AvatarFallback className="bg-primary text-white font-bold">
                        {otherApplicant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-bold text-foreground">
                        {otherApplicant.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Platform: {otherApplicant.platform}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Handle: {otherApplicant.handle}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Followers: {otherApplicant.followers}
                      </p>
                      <div className="flex flex-row gap-2 mt-2">
                        <Link
                          href={`/brand/creators/${otherApplicant.id}`}
                          prefetch={false}
                        >
                          <Button
                            variant="outline"
                            className="w-24 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1 text-sm bg-transparent"
                          >
                            Profile
                          </Button>
                        </Link>
                        <Link
                          href={`/brand/campaigns/${resolvedParams.id}/applications/${otherApplicant.id}`}
                          prefetch={false}
                        >
                          <Button
                            variant="outline"
                            className="w-24 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1 text-sm bg-transparent"
                          >
                            Application
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <Link
                  href={`/brand/campaigns/${resolvedParams.id}/applicants`}
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
