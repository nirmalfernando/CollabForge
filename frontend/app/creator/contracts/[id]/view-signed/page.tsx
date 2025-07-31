"use client";
import { useState, useEffect, use } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { contractApi, campaignApi, getAuthData, ApiError } from "@/lib/api";

interface ContractData {
  contractId: string;
  campaignId: string;
  proposalId: string;
  brandId: string;
  creatorId: string;
  contractTitle: string;
  contractDetails: string;
  contractSuggestions?: any;
  creatorSignature?: string;
  signedDate?: string;
  contractStatus: string;
  campaignTitle: string;
}

export default function CreatorSignedContractViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [contractStatus, setContractStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Unwrap the params Promise
  const { id } = use(params);

  // Helper function to extract suggestion text from JSON for display
  const extractSuggestionText = (suggestionsJson: any) => {
    if (!suggestionsJson) return "";

    if (typeof suggestionsJson === "string") {
      return suggestionsJson;
    }

    if (typeof suggestionsJson === "object") {
      // Handle single suggestion format
      if (suggestionsJson.suggestion) {
        return suggestionsJson.suggestion;
      }

      // Handle multiple suggestions format
      if (suggestionsJson.suggestions) {
        const suggestions = suggestionsJson.suggestions;
        return Object.values(suggestions).join("\n");
      }

      // Handle old format or other JSON structures
      if (suggestionsJson.rawSuggestions) {
        return suggestionsJson.rawSuggestions;
      }

      // Fallback - try to extract any meaningful text
      const values = Object.values(suggestionsJson).filter(
        (val) =>
          typeof val === "string" &&
          val !== suggestionsJson.timestamp &&
          val !== suggestionsJson.format
      );

      return values.join("\n");
    }

    return "";
  };

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        // Check authentication
        const authData = getAuthData();
        if (!authData) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view the contract.",
            variant: "destructive",
          });
          // Redirect handled by parent component or router
          return;
        }

        console.log("🔍 Fetching signed contract data for ID:", id);

        // First, try to get contract by proposal ID since the route uses proposal ID
        let contract;
        try {
          const contractsResponse = await contractApi.getContractsByProposal(
            id
          );
          if (contractsResponse && contractsResponse.length > 0) {
            contract = contractsResponse[0];
          }
        } catch (error) {
          console.warn("Could not fetch by proposal ID, trying by contract ID");
        }

        // If no contracts found by proposal ID, try by contract ID directly
        if (!contract) {
          try {
            contract = await contractApi.getContractById(id);
          } catch (error) {
            console.warn("Could not fetch by contract ID either");
          }
        }

        if (!contract) {
          toast({
            title: "Contract Not Found",
            description: "The requested contract could not be found.",
            variant: "destructive",
          });
          return;
        }

        // Check if contract is actually signed
        if (!contract.creatorSignature) {
          toast({
            title: "Contract Not Signed",
            description: "This contract has not been signed yet.",
            variant: "destructive",
          });
          return;
        }

        console.log("📄 Signed contract data retrieved:", contract);

        // Fetch campaign details to get campaign title
        let campaignTitle = "Unknown Campaign";
        try {
          const campaignResponse = await campaignApi.getCampaignById(
            contract.campaignId
          );
          campaignTitle = campaignResponse.campaignTitle || campaignTitle;
          console.log("🎯 Campaign data retrieved:", campaignResponse);
        } catch (campaignError) {
          console.warn("⚠️ Could not fetch campaign details:", campaignError);
        }

        // Set contract data with campaign title
        const enrichedContractData: ContractData = {
          contractId: contract.contractId,
          campaignId: contract.campaignId,
          proposalId: contract.proposalId,
          brandId: contract.brandId,
          creatorId: contract.creatorId,
          contractTitle: contract.contractTitle,
          contractDetails: contract.contractDetails,
          contractSuggestions: contract.contractSuggestions,
          creatorSignature: contract.creatorSignature,
          signedDate: contract.signedDate,
          contractStatus: contract.contractStatus,
          campaignTitle: campaignTitle,
        };

        setContractData(enrichedContractData);
        setContractStatus(contract.contractStatus);
      } catch (error) {
        console.error("❌ Error fetching signed contract data:", error);

        let errorMessage = "Failed to load contract details. Please try again.";

        if (error instanceof ApiError) {
          if (error.status === 404) {
            errorMessage =
              "Contract not found. It may have been removed or you don't have access to it.";
          } else if (error.status === 401) {
            errorMessage = "You don't have permission to view this contract.";
          } else {
            errorMessage = error.message;
          }
        }

        toast({
          title: "Error Loading Contract",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchContractData();
    }
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!contractData) return;

    setIsUpdatingStatus(true);

    try {
      console.log(`🔄 Updating contract status to: ${newStatus}`);

      // Update contract status via API
      const response = await contractApi.updateContract(
        contractData.contractId,
        {
          contractStatus: newStatus as any,
        }
      );

      console.log("✅ Contract status updated successfully:", response);

      setContractStatus(newStatus);

      toast({
        title: "Contract Status Updated",
        description: `Contract status changed to ${newStatus}.`,
      });

      // Update local contract data
      setContractData((prev) =>
        prev
          ? {
              ...prev,
              contractStatus: newStatus,
            }
          : null
      );
    } catch (error) {
      console.error("❌ Error updating contract status:", error);

      let errorMessage = "Failed to update contract status. Please try again.";

      if (error instanceof ApiError) {
        if (error.status === 500) {
          errorMessage =
            "Server error occurred. Please try again or contact support.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error Updating Status",
        description: errorMessage,
        variant: "destructive",
      });

      // Revert the status change in UI
      setContractStatus(contractData?.contractStatus || "");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">
                Loading signed contract details...
              </span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state - contract not found
  if (!contractData) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Signed Contract Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The signed contract you're looking for could not be found or you
              don't have access to it.
            </p>
            <Link href="/creator/applications">
              <Button
                variant="outline"
                className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
              >
                Back to Applications
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const extractedSuggestions = extractSuggestionText(
    contractData.contractSuggestions
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">
            Signed Contract
          </h1>
          <p className="text-2xl font-semibold text-foreground">
            &ldquo;{contractData.campaignTitle}&rdquo;
          </p>

          <div className="bg-card rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">
              {contractData.contractTitle}
            </h2>
            <div className="prose prose-invert max-w-none text-foreground text-lg leading-relaxed whitespace-pre-line">
              {contractData.contractDetails}
            </div>
          </div>

          {/* Show suggestions if they exist */}
          {extractedSuggestions && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">
                Your Suggestions
              </h2>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-foreground whitespace-pre-line">
                  {extractedSuggestions}
                </p>
              </div>
            </div>
          )}

          {/* Digital Signature Display */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">
              Digital Signature
            </h2>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-lg text-foreground font-medium">
                Signed by: {contractData.creatorSignature}
              </p>
              {contractData.signedDate && (
                <p className="text-sm text-muted-foreground mt-2">
                  Signed on:{" "}
                  {new Date(contractData.signedDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Contract Status Update */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">
              Contract Progress Status
            </h2>
            <Select
              value={contractStatus}
              onValueChange={handleUpdateStatus}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent className="bg-card text-foreground">
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Awaiting Payment">
                  Awaiting Payment
                </SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {isUpdatingStatus && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating status...
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
