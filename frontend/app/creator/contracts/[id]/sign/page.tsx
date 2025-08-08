"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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

export default function CreatorContractSignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [creatorSuggestions, setCreatorSuggestions] = useState("");
  const [digitalSignature, setDigitalSignature] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);

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
          router.push("/login");
          return;
        }

        console.log("🔍 Fetching contract data for signing, ID:", id);

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
          router.push("/creator/applications");
          return;
        }

        console.log("📄 Contract data retrieved for signing:", contract);

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

        // Pre-populate suggestions if they exist
        if (contract.contractSuggestions) {
          const extractedText = extractSuggestionText(
            contract.contractSuggestions
          );
          setCreatorSuggestions(extractedText);
        }

        // Pre-populate signature if already signed
        if (contract.creatorSignature) {
          setDigitalSignature(contract.creatorSignature);
        }
      } catch (error) {
        console.error("❌ Error fetching contract data:", error);

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

        router.push("/creator/applications");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchContractData();
    }
  }, [id, router]);

  const handleAgreeAndSign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description:
          "Please agree to the terms and conditions to sign the contract.",
        variant: "destructive",
      });
      return;
    }

    if (!digitalSignature.trim()) {
      toast({
        title: "Signature Required",
        description: "Please provide your digital signature (name).",
        variant: "destructive",
      });
      return;
    }

    if (!contractData) {
      toast({
        title: "Error",
        description: "Contract data not available.",
        variant: "destructive",
      });
      return;
    }

    setIsSigning(true);

    try {
      console.log("✍️ Signing contract:", contractData.contractId);

      // Update the contract with the creator signature
      const response = await contractApi.updateContract(
        contractData.contractId,
        {
          creatorSignature: digitalSignature.trim(),
          contractStatus: "Active", // Update status to Active when signed
        }
      );

      console.log("✅ Contract signed successfully:", response);

      toast({
        title: "Contract Signed",
        description:
          "You have successfully signed the contract! Redirecting to view signed contract...",
      });

      // Redirect to the view-signed page after successful signing
      setTimeout(() => {
        router.push(
          `/creator/contracts/${contractData.proposalId}/view-signed`
        );
      }, 1500);
    } catch (error) {
      console.error("❌ Error signing contract:", error);

      let errorMessage = "Failed to sign contract. Please try again.";

      if (error instanceof ApiError) {
        if (error.status === 500) {
          errorMessage =
            "Server error occurred. Please try again or contact support.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error Signing Contract",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSigning(false);
    }
  };

  const handleChat = () => {
    // Simulate opening a chat with the brand
    toast({
      title: "Opening Chat",
      description: "Redirecting to chat with the brand...",
    });
    // In a real app, this would navigate to a chat interface
    // router.push(`/creator/chat/${contractData?.brandId}`);
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
              <span className="ml-2 text-lg">Loading contract details...</span>
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
              Contract Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The contract you're looking for could not be found or you don't
              have access to it.
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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">
            Contract
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

          {/* Show existing suggestions if they exist */}
          {creatorSuggestions && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">
                Your Previous Suggestions
              </h2>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-foreground whitespace-pre-line">
                  {creatorSuggestions}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">
              Digital Signature
            </h2>
            <Input
              type="text"
              placeholder="Type your full name to sign"
              value={digitalSignature}
              onChange={(e) => setDigitalSignature(e.target.value)}
              className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
              required
              disabled={isSigning}
            />
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="agree-terms"
              checked={agreedToTerms}
              onCheckedChange={(checked: boolean) => setAgreedToTerms(checked)}
              disabled={isSigning}
            />
            <Label htmlFor="agree-terms" className="text-base text-foreground">
              I agree to these terms and conditions with the changes that I have
              made
            </Label>
          </div>

          <div className="flex flex-col gap-4 pt-8">
            <Button
              type="submit"
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
              onClick={handleAgreeAndSign}
              disabled={isSigning}
            >
              {isSigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Contract...
                </>
              ) : (
                "Agree and Sign"
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
              onClick={handleChat}
              disabled={isSigning}
            >
              Chat With Brand
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
