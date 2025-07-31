"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, Clock, DollarSign, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import {
  contractApi,
  brandApi,
  campaignApi,
  creatorApi,
  getAuthData,
} from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface Contract {
  contractId: string;
  contractTitle: string;
  contractStatus:
    | "Pending"
    | "Active"
    | "Awaiting Payment"
    | "Completed"
    | "Cancelled";
  createdAt: string;
  campaignId: string;
  creatorId: string;
  brandId: string;
}

interface EnrichedContract {
  id: string;
  campaignTitle: string;
  creatorName: string;
  status: string;
  creationDate: string;
}

export default function BrandContractsPage() {
  const [contracts, setContracts] = useState<EnrichedContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);

        // Get current user data
        const authData = getAuthData();
        if (!authData || authData.user.role !== "brand") {
          throw new Error("Please log in as a brand to view contracts");
        }

        // Get brand data for current user
        const brandData = await brandApi.getBrandByUserId(authData.user.userId);
        console.log("Brand data:", brandData);

        // Fetch contracts for this brand
        const contractsData: Contract[] = await contractApi.getContractsByBrand(
          brandData.brandId
        );
        console.log("Contracts data:", contractsData);

        // Enrich contracts with campaign and creator information
        const enrichedContracts = await Promise.all(
          contractsData.map(async (contract) => {
            try {
              // Fetch campaign details
              const campaign = await campaignApi.getCampaignById(
                contract.campaignId
              );

              // Fetch creator details
              const creator = await creatorApi.getCreatorById(
                contract.creatorId
              );

              const creatorName =
                creator.nickName || `${creator.firstName} ${creator.lastName}`;

              return {
                id: contract.contractId,
                campaignTitle: campaign.campaignTitle,
                creatorName: creatorName,
                status:
                  contract.contractStatus === "Completed"
                    ? "Complete"
                    : contract.contractStatus,
                creationDate: new Date(contract.createdAt)
                  .toISOString()
                  .split("T")[0], // Format as YYYY-MM-DD
              };
            } catch (err) {
              console.error(
                "Error enriching contract:",
                contract.contractId,
                err
              );
              return {
                id: contract.contractId,
                campaignTitle: "Unknown Campaign",
                creatorName: "Unknown Creator",
                status:
                  contract.contractStatus === "Completed"
                    ? "Complete"
                    : contract.contractStatus,
                creationDate: new Date(contract.createdAt)
                  .toISOString()
                  .split("T")[0],
              };
            }
          })
        );

        setContracts(enrichedContracts);
      } catch (err) {
        console.error("Error fetching contracts:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load contracts";
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

    fetchContracts();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Awaiting Payment":
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      case "Complete":
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-500";
      case "Pending":
        return "text-yellow-500";
      case "Awaiting Payment":
        return "text-blue-500";
      case "Complete":
        return "text-purple-500";
      default:
        return "text-foreground";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
              My <span className="text-primary">Contracts</span>
            </h1>
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Loading contracts...
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
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
              My <span className="text-primary">Contracts</span>
            </h1>
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">{error}</p>
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
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            My <span className="text-primary">Contracts</span>
          </h1>

          {contracts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                You don't have any contracts yet.
              </p>
              <Link href="/brand/campaigns" prefetch={false}>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                >
                  Create a Campaign
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {contracts.map((contract) => (
                <Card
                  key={contract.id}
                  className="bg-card border-primary rounded-lg p-6 flex flex-col justify-between"
                >
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl font-bold text-foreground">
                      {contract.campaignTitle}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Creator:{" "}
                      <span className="font-medium text-primary">
                        {contract.creatorName}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(contract.status)}
                      <p
                        className={cn(
                          "font-medium",
                          getStatusColor(contract.status)
                        )}
                      >
                        Status: {contract.status}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Created: {contract.creationDate}
                    </p>
                  </div>
                  <Link
                    href={`/brand/contracts/${contract.id}/view`}
                    prefetch={false}
                    className="mt-auto"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      View Details
                    </Button>
                  </Link>
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
