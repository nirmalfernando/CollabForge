"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import ReviewModal from "@/components/review-modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect, use } from "react";
import { Star } from "lucide-react";
import {
  contractApi,
  campaignApi,
  creatorApi,
  brandApi,
  getAuthData,
  brandReviewApi,
  ApiError,
} from "@/lib/api";

interface ContractDetails {
  contractId: string;
  contractTitle: string;
  contractDetails: string;
  contractSuggestions?: any;
  creatorSignature?: string;
  contractStatus:
    | "Pending"
    | "Active"
    | "Awaiting Payment"
    | "Completed"
    | "Cancelled";
  campaignId: string;
  creatorId: string;
  signedDate?: string;
}

interface EnrichedContractData {
  id: string;
  campaignTitle: string;
  content: string;
  digitalSignature: string | null;
  creatorSuggestions: string | null;
  currentStatus: string;
  rawStatus: string; // Keep original status for comparison
  creatorId: string; // Add this field to preserve creator ID
}

export default function BrandContractViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [contractData, setContractData] = useState<EnrichedContractData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        setLoading(true);

        // Get current user data
        const authData = getAuthData();
        if (!authData || authData.user.role !== "brand") {
          throw new Error("Please log in as a brand to view contract details");
        }

        // Fetch contract details
        const contract: ContractDetails = await contractApi.getContractById(
          resolvedParams.id
        );
        console.log("Raw contract details from API:", contract);
        console.log("Contract creatorId specifically:", contract.creatorId);
        console.log("Type of creatorId:", typeof contract.creatorId);

        // Fetch campaign details
        const campaign = await campaignApi.getCampaignById(contract.campaignId);
        console.log("Campaign details:", campaign);

        // Fetch creator details
        const creator = await creatorApi.getCreatorById(contract.creatorId);
        console.log("Creator details:", creator);

        // Parse creator suggestions if it's a JSON object
        let creatorSuggestions = null;
        if (contract.contractSuggestions) {
          if (typeof contract.contractSuggestions === "string") {
            creatorSuggestions = contract.contractSuggestions;
          } else if (typeof contract.contractSuggestions === "object") {
            // If it's an object, try to extract meaningful text or stringify it
            creatorSuggestions =
              contract.contractSuggestions.suggestions ||
              contract.contractSuggestions.comments ||
              JSON.stringify(contract.contractSuggestions, null, 2);
          }
        }

        // Get creator name for signature
        const creatorName =
          creator.nickName || `${creator.firstName} ${creator.lastName}`;

        const enrichedData: EnrichedContractData = {
          id: contract.contractId,
          campaignTitle: campaign.campaignTitle,
          content: contract.contractDetails,
          digitalSignature: contract.creatorSignature ? creatorName : null,
          creatorSuggestions: creatorSuggestions,
          currentStatus:
            contract.contractStatus === "Completed"
              ? "Complete"
              : contract.contractStatus,
          rawStatus: contract.contractStatus, // Keep original for comparison
          creatorId: contract.creatorId, // Use the original creatorId from contract
        };

        console.log("Final enriched contract data:", enrichedData);
        console.log("Final enriched creatorId:", enrichedData.creatorId);
        console.log("Type of final creatorId:", typeof enrichedData.creatorId);

        setContractData(enrichedData);
      } catch (err) {
        console.error("Error fetching contract details:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load contract details";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchContractDetails();
    }
  }, [resolvedParams.id]);

  const handleChat = () => {
    toast({
      title: "Opening Chat",
      description: "Redirecting to chat with the creator...",
    });
    // In a real app, this would navigate to a chat interface
  };

  const handleReviewSubmit = async (review: {
    rating: number;
    categories: string[];
    text: string;
  }) => {
    if (!contractData) {
      console.error("No contract data available for review submission");
      return;
    }

    try {
      console.log("📝 Brand review submitted:", review);
      console.log("📋 Contract data:", contractData);

      // Get current user data for brandId
      const authData = getAuthData();
      if (!authData) {
        toast({
          title: "Authentication Error",
          description: "Please log in to submit a review.",
          variant: "destructive",
        });
        return;
      }

      // Get the brandId from the current user
      let brandId: string;
      try {
        const brandData = await brandApi.getBrandByUserId(authData.user.userId);
        brandId = brandData.brandId;
        console.log("🏢 Brand ID found:", brandId);
      } catch (error) {
        console.error("Error fetching brand data:", error);
        throw new Error("Could not find brand data for current user");
      }

      // Ensure we have a valid creatorId
      if (!contractData.creatorId) {
        throw new Error("Creator ID is missing from contract data");
      }

      console.log("📋 Submitting review with:", {
        creatorId: contractData.creatorId,
        brandId: brandId,
        rating: review.rating,
        comment: review.text,
      });

      // Create the brand review via API
      await brandReviewApi.createBrandReview({
        creatorId: contractData.creatorId,
        brandId: brandId,
        rating: review.rating,
        comment: review.text, // Map 'text' to 'comment' as per backend expectation
      });

      setHasReviewed(true);

      toast({
        title: "Review Submitted",
        description: "Thank you for reviewing the creator!",
      });
    } catch (error) {
      console.error("❌ Error submitting brand review:", error);

      let errorMessage = "Failed to submit review. Please try again.";

      if (error instanceof ApiError) {
        if (error.status === 400) {
          errorMessage = error.message || "Review validation failed.";
        } else if (error.status === 401) {
          errorMessage = "You don't have permission to submit this review.";
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error Submitting Review",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary">
              Contract Details
            </h1>
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Loading contract details...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !contractData) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary">
              Contract Details
            </h1>
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">
                {error || "Failed to load contract details"}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
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

  const isContractCompleted = contractData.rawStatus === "Completed";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">
            Contract Details
          </h1>
          <p className="text-2xl font-semibold text-foreground">
            &ldquo;{contractData.campaignTitle}&rdquo;
          </p>

          <div className="bg-card rounded-xl p-8 shadow-lg">
            <div className="prose prose-invert max-w-none text-foreground text-lg leading-relaxed whitespace-pre-line">
              {contractData.content}
            </div>
          </div>

          {/* Digital Signature Display */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">
              Digital Signature
            </h2>
            <p className="text-lg text-foreground font-medium">
              {contractData.digitalSignature
                ? `Signed by: ${contractData.digitalSignature}`
                : "Not yet signed"}
            </p>
          </div>

          {/* Creator Suggestions Display */}
          {contractData.creatorSuggestions && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">
                Creator's Suggestions
              </h2>
              <div className="bg-muted rounded-lg p-4 text-foreground text-lg leading-relaxed">
                {contractData.creatorSuggestions}
              </div>
            </div>
          )}

          {/* Contract Status Display (Read-only for brand) */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">Contract Status</h2>
            <p className="text-lg text-foreground font-medium">
              Current Status: {contractData.currentStatus}
            </p>
          </div>

          {/* Review Section - Show only when contract is completed */}
          {isContractCompleted && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">
                Review Creator
              </h2>
              <div className="bg-muted rounded-lg p-6">
                {hasReviewed ? (
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <Star className="h-8 w-8 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-lg text-foreground font-medium mb-2">
                      Thank you for your review!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your feedback has been submitted successfully.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg text-foreground font-medium mb-4">
                      How was your experience working with this creator?
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Your feedback helps other brands and improves the
                      platform.
                    </p>
                    <Button
                      onClick={handleOpenReviewModal}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full"
                    >
                      <Star className="h-5 w-5 mr-2" />
                      Review Creator
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 pt-8">
            <Button
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
              onClick={handleChat}
            >
              Chat with Creator
            </Button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={handleCloseReviewModal}
        onSubmit={handleReviewSubmit}
        reviewType="brand_to_creator"
        title="Review Creator"
        placeholder="Share your experience working with this creator..."
        categories={[
          "Delivered On Time",
          "Great Quality",
          "Worth The Price",
          "Highly Recommended",
          "Amazing Creative Work",
        ]}
      />
    </div>
  );
}
