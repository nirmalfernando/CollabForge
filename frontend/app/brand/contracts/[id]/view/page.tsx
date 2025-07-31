"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect, use } from "react";
import { contractApi, campaignApi, creatorApi, getAuthData } from "@/lib/api";

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
        console.log("Contract details:", contract);

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
        };

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
    </div>
  );
}
