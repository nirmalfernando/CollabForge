"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  proposalApi,
  creatorApi,
  campaignApi,
  brandApi,
  contractApi,
  getAuthData,
} from "@/lib/api";

interface Creator {
  _id: string;
  creatorId: string; // Add the UUID field
  firstName: string;
  lastName: string;
  nickName?: string;
  bio?: string;
  profilePicUrl?: string;
}

interface Brand {
  _id: string;
  brandId: string; // Add the UUID field
  companyName: string;
  bio?: string;
  profilePicUrl?: string;
  userId: string; // Add userId field
}

interface Campaign {
  _id: string;
  campaignId: string; // Add the UUID field
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

interface ContractData {
  creator: Creator;
  campaign: Campaign;
  brand: Brand;
  proposal: Proposal;
}

export default function CreateContractPage({
  params,
}: {
  params: Promise<{ id: string; applicantId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [contractData, setContractData] = useState({
    title: "",
    details: "",
  });
  const [applicationData, setApplicationData] = useState<ContractData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        console.log(
          "Fetching data for contract creation:",
          resolvedParams.applicantId
        );

        // Validate applicantId (which is actually the proposalId)
        if (
          !resolvedParams.applicantId ||
          resolvedParams.applicantId === "undefined"
        ) {
          throw new Error("Invalid proposal ID");
        }

        // Fetch proposal details
        const proposal: Proposal = await proposalApi.getProposalById(
          resolvedParams.applicantId
        );
        console.log("Proposal data:", proposal);

        // Verify proposal is accepted
        if (proposal.proposalStatus !== "accepted") {
          throw new Error(
            "Contract can only be created for accepted proposals"
          );
        }

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

        // Pre-populate contract title with campaign and creator info
        const creatorName =
          creator.nickName || `${creator.firstName} ${creator.lastName}`;
        setContractData((prev) => ({
          ...prev,
          title: `Sponsorship Contract - ${campaign.campaignTitle} with ${creatorName}`,
        }));
      } catch (err) {
        console.error("Error fetching application data:", err);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContractData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSponsorship = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicationData) {
      toast({
        title: "Error",
        description: "Application data not loaded. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!contractData.title.trim() || !contractData.details.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Get current user data to verify permissions
    const authData = getAuthData();
    if (!authData) {
      toast({
        title: "Error",
        description: "Please log in to create a contract.",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    try {
      setSubmitting(true);

      // Use the UUID fields instead of MongoDB ObjectIds
      const contractPayload = {
        campaignId:
          applicationData.campaign.campaignId || applicationData.campaign._id,
        proposalId:
          applicationData.proposal.proposalId || resolvedParams.applicantId,
        brandId: applicationData.brand.brandId || applicationData.brand._id,
        creatorId:
          applicationData.creator.creatorId || applicationData.creator._id,
        contractTitle: contractData.title.trim(),
        contractDetails: contractData.details.trim(),
        contractStatus: "Pending" as const,
        status: true,
      };

      console.log(
        "Creating sponsorship contract with payload:",
        contractPayload
      );
      console.log("Current user:", authData.user);

      // Validate that current user is the brand owner
      if (authData.user.role !== "brand") {
        throw new Error("Only brands can create contracts");
      }

      // Create contract via API
      const response = await contractApi.createContract(contractPayload);

      console.log("Contract created successfully:", response);

      toast({
        title: "Contract Created",
        description: "The sponsorship contract has been successfully created!",
      });

      // Redirect to contracts page or success page
      router.push("/brand/contracts");
    } catch (err) {
      console.error("Error creating contract:", err);

      let errorMessage = "Failed to create contract. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      // Add more specific error handling
      if (err && typeof err === "object" && "details" in err) {
        const details = (err as any).details;
        if (details && details.errors && Array.isArray(details.errors)) {
          const validationErrors = details.errors
            .map((error: any) => error.msg)
            .join(", ");
          errorMessage = `Validation errors: ${validationErrors}`;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 flex items-center justify-center py-12 px-4 md:px-6">
          <div className="text-lg">Loading contract creation...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !applicationData) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 flex items-center justify-center py-12 px-4 md:px-6">
          <div className="text-center space-y-4">
            <div className="text-red-500">
              {error || "Failed to load application data for contract"}
            </div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { creator, campaign, brand } = applicationData;
  const creatorName =
    creator.nickName || `${creator.firstName} ${creator.lastName}`;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1 flex items-center justify-center py-12 px-4 md:px-6">
        <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-lg bg-card p-8 md:p-12">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">
              Contract
            </h1>
            <p className="text-muted-foreground">
              Creating contract for <strong>{creatorName}</strong> for campaign{" "}
              <strong>"{campaign.campaignTitle}"</strong> by{" "}
              <strong>{brand.companyName}</strong>
            </p>
          </div>

          <form onSubmit={handleCreateSponsorship} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Contract Title *
              </label>
              <Input
                id="title"
                type="text"
                name="title"
                placeholder="Enter contract title"
                value={contractData.title}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label
                htmlFor="details"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Contract Details *
              </label>
              <Textarea
                id="details"
                name="details"
                placeholder="Enter detailed contract terms, deliverables, timeline, payment terms, etc."
                value={contractData.details}
                onChange={handleChange}
                rows={12}
                className="w-full bg-[#1a1a1a] border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 resize-y"
                required
                disabled={submitting}
              />
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">
                Contract Information:
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <strong>Campaign:</strong> {campaign.campaignTitle}
                </li>
                <li>
                  <strong>Creator:</strong> {creatorName}
                </li>
                <li>
                  <strong>Brand:</strong> {brand.companyName}
                </li>
                <li>
                  <strong>Proposal Status:</strong>{" "}
                  {applicationData.proposal.proposalStatus}
                </li>
              </ul>
            </div>

            <p className="text-muted-foreground text-sm mt-4">
              Please note that the creator will be able to add their comments to
              this contract before agreeing and only then will both parties be
              able to confirm the contract.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="flex-1 rounded-full border-muted-foreground text-muted-foreground hover:bg-muted hover:text-foreground px-6 py-3 text-lg bg-transparent"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Creating Contract..." : "Create Contract"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
