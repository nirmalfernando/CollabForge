"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  FileCheck,
  Loader2,
} from "lucide-react"; // Icons for status
import {
  proposalApi,
  creatorApi,
  campaignApi,
  brandApi,
  getAuthData,
  ApiError,
} from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Type definitions
interface Application {
  id: string;
  campaignTitle: string;
  brandName: string;
  status: string;
  submissionDate: string;
}

export default function CreatorApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creatorId, setCreatorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Check authentication
        const authData = getAuthData();
        if (!authData) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view your applications.",
            variant: "destructive",
          });
          router.push("/auth/login");
          return;
        }

        console.log(
          "🔍 Fetching creator profile for user:",
          authData.user.userId
        );

        // Get creator profile by user ID
        const creatorResponse = await creatorApi.getCreatorByUserId(
          authData.user.userId
        );
        if (!creatorResponse || !creatorResponse.creatorId) {
          toast({
            title: "Profile Required",
            description: "Please complete your creator profile first.",
            variant: "destructive",
          });
          router.push("/creator/profile");
          return;
        }

        const fetchedCreatorId = creatorResponse.creatorId;
        setCreatorId(fetchedCreatorId);

        console.log("📋 Fetching proposals for creator:", fetchedCreatorId);

        // Get all proposals for this creator
        const proposalsResponse = await proposalApi.getProposalsByCreator(
          fetchedCreatorId
        );
        console.log("📊 Raw proposals response:", proposalsResponse);

        // If no proposals found, set empty array
        if (!proposalsResponse || proposalsResponse.length === 0) {
          setApplications([]);
          setIsLoading(false);
          return;
        }

        // Fetch additional data for each proposal (campaign and brand info)
        const enrichedApplications = await Promise.all(
          proposalsResponse.map(async (proposal: any) => {
            try {
              console.log("🎯 Processing proposal:", proposal.proposalId);

              // Fetch campaign details
              const campaignResponse = await campaignApi.getCampaignById(
                proposal.campaignId
              );
              console.log("🏢 Campaign response:", campaignResponse);

              // Fetch brand details
              const brandResponse = await brandApi.getBrandById(
                campaignResponse.brandId
              );
              console.log("🏷️ Brand response:", brandResponse);

              // Map proposal status to display status
              const getDisplayStatus = (proposalStatus: string) => {
                switch (proposalStatus) {
                  case "pending":
                    return "Pending";
                  case "accepted":
                    return "Approved";
                  case "rejected":
                    return "Rejected";
                  default:
                    return "Draft";
                }
              };

              return {
                id: proposal.proposalId,
                campaignTitle:
                  campaignResponse.campaignTitle || "Unknown Campaign",
                brandName: brandResponse.companyName || "Unknown Brand",
                status: getDisplayStatus(proposal.proposalStatus),
                submissionDate: new Date(proposal.createdAt)
                  .toISOString()
                  .split("T")[0], // Format: YYYY-MM-DD
              };
            } catch (error) {
              console.error(
                "❌ Error enriching proposal:",
                proposal.proposalId,
                error
              );
              // Return basic info if enrichment fails
              return {
                id: proposal.proposalId,
                campaignTitle: "Campaign Info Unavailable",
                brandName: "Brand Info Unavailable",
                status:
                  proposal.proposalStatus === "pending"
                    ? "Pending"
                    : proposal.proposalStatus === "accepted"
                    ? "Approved"
                    : proposal.proposalStatus === "rejected"
                    ? "Rejected"
                    : "Draft",
                submissionDate: new Date(proposal.createdAt)
                  .toISOString()
                  .split("T")[0],
              };
            }
          })
        );

        console.log("✅ Enriched applications:", enrichedApplications);
        setApplications(enrichedApplications);
      } catch (error) {
        console.error("❌ Error fetching applications:", error);

        let errorMessage = "Failed to load applications. Please try again.";

        if (error instanceof ApiError) {
          if (error.status === 404) {
            // No applications found - this is normal
            setApplications([]);
            setIsLoading(false);
            return;
          }
          errorMessage = error.message;
        }

        toast({
          title: "Error Loading Applications",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Draft":
        return <FileText className="h-5 w-5 text-gray-500" />;
      case "Signed":
        return <FileCheck className="h-5 w-5 text-blue-500" />; // Using blue for signed contracts
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-500";
      case "Rejected":
        return "text-red-500";
      case "Pending":
        return "text-yellow-500";
      case "Draft":
        return "text-gray-500";
      case "Signed":
        return "text-blue-500"; // Using blue for signed contracts
      default:
        return "text-foreground";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
              My <span className="text-primary">Applications</span>
            </h1>
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading your applications...</span>
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
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            My <span className="text-primary">Applications</span>
          </h1>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                You haven't applied to any campaigns yet.
              </p>
              <Link href="/creator/campaigns" prefetch={false}>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                >
                  Browse Campaigns
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {applications.map((app) => (
                <Card
                  key={app.id}
                  className="bg-card border-primary rounded-lg p-6 flex flex-col justify-between"
                >
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl font-bold text-foreground">
                      {app.campaignTitle}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Brand:{" "}
                      <span className="font-medium text-primary">
                        {app.brandName}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <p
                        className={cn(
                          "font-medium",
                          getStatusColor(app.status)
                        )}
                      >
                        Status: {app.status}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Submitted: {app.submissionDate}
                    </p>
                  </div>
                  {app.status === "Approved" ? (
                    <Link
                      href={`/creator/contracts/${app.id}`}
                      prefetch={false}
                      className="mt-auto"
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                      >
                        Sign the Contract
                      </Button>
                    </Link>
                  ) : app.status === "Signed" ? (
                    <Link
                      href={`/creator/contracts/${app.id}/view-signed`}
                      prefetch={false}
                      className="mt-auto"
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                      >
                        View Contract
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href={`/creator/applications/${app.id}`}
                      prefetch={false}
                      className="mt-auto"
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
