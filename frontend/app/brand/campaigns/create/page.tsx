"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { campaignApi, categoryApi, getAuthData, brandApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Category {
  categoryId: string;
  categoryName: string;
  status: boolean;
}

export default function CreateCampaignPage() {
  const [campaignData, setCampaignData] = useState({
    campaignTitle: "",
    campaignRequirements: "",
    description: "",
    budget: "",
    campaignStatus: "draft",
    categoryId: "",
  });

  // Separate state for requirements fields
  const [requirements, setRequirements] = useState({
    minFollowers: "",
    contentType: "",
    platform: "",
    additionalRequirements: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check authentication on page load
  useEffect(() => {
    const authData = getAuthData();
    console.log("🔍 Auth check on page load:", authData);
    if (!authData) {
      console.warn("⚠️ No auth data found, user might need to login");
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      console.log("📚 Fetching categories...");
      try {
        const response = await categoryApi.getAllCategories();
        console.log("📚 Categories response:", response);
        const activeCategories = response.filter((cat: Category) => cat.status);
        setCategories(activeCategories);
        console.log("✅ Active categories loaded:", activeCategories.length);
      } catch (error) {
        console.error("❌ Failed to fetch categories:", error);
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        });
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    console.log(`📝 Field changed: ${id} = ${value}`);
    setCampaignData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRequirementChange = (
    field: keyof typeof requirements,
    value: string
  ) => {
    console.log(`📋 Requirement changed: ${field} = ${value}`);
    setRequirements((prev) => ({ ...prev, [field]: value }));
  };

  // Build JSON requirements object from individual fields
  const buildRequirementsJSON = () => {
    const jsonObj: any = {};

    if (
      requirements.minFollowers &&
      !isNaN(Number(requirements.minFollowers))
    ) {
      jsonObj.minFollowers = Number(requirements.minFollowers);
    }

    if (requirements.contentType) {
      jsonObj.contentType = requirements.contentType;
    }

    if (requirements.platform) {
      jsonObj.platform = requirements.platform;
    }

    if (requirements.additionalRequirements) {
      jsonObj.additionalRequirements = requirements.additionalRequirements;
    }

    return jsonObj;
  };

  const handleCategoryChange = (value: string) => {
    console.log("🏷️ Category changed:", value);
    setCampaignData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleStatusChange = (value: string) => {
    console.log("📊 Status changed:", value);
    setCampaignData((prev) => ({ ...prev, campaignStatus: value }));
  };

  const validateForm = () => {
    console.log("🔍 Validating form...");
    const errors: string[] = [];
    if (!campaignData.campaignTitle.trim()) {
      errors.push("Campaign title is required");
    }
    if (!campaignData.budget || parseFloat(campaignData.budget) <= 0) {
      errors.push("Budget must be a positive number");
    }
    if (!campaignData.categoryId) {
      errors.push("Category is required");
    }
    console.log("🔍 Validation errors:", errors);
    return errors;
  };

  const handleConfirmCampaign = async () => {
    console.log("🚀 Campaign creation started");
    console.log("📊 Button clicked - starting campaign creation process");
    setIsLoading(true);

    try {
      // Step 1: Validate form inputs
      console.log("📝 Current campaign data:", campaignData);
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        console.error("❌ Validation errors:", validationErrors);
        throw new Error(validationErrors.join(", "));
      }
      console.log("✅ Form validation passed");

      // Step 2: Check authentication
      const authData = getAuthData();
      console.log("🔐 Auth data:", authData);
      if (!authData || !authData.token) {
        console.error("❌ No authentication data found");
        throw new Error("User not authenticated. Please log in again.");
      }
      console.log("✅ User authenticated");

      // Step 3: Get brand data
      const { user } = authData;
      console.log("👤 User data:", user);
      console.log("🏢 Fetching brand data for userId:", user.userId);

      const brandData = await brandApi.getBrandByUserId(user.userId);
      console.log("🏢 Brand data response:", brandData);

      if (!brandData || !brandData.brandId) {
        console.error("❌ Brand not found for user:", user.userId);
        throw new Error(
          "Brand profile not found. Please complete your brand profile first."
        );
      }
      console.log("✅ Brand found:", brandData.brandId);

      // Step 4: Process requirements - Build from form fields
      const requirementsObj = buildRequirementsJSON();
      console.log("📋 Built requirements object:", requirementsObj);

      // Step 5: Prepare campaign payload
      const campaignPayload = {
        campaignTitle: campaignData.campaignTitle,
        budget: parseFloat(campaignData.budget),
        campaignStatus: campaignData.campaignStatus as
          | "draft"
          | "active"
          | "completed"
          | "cancelled",
        categoryId: campaignData.categoryId,
        description: campaignData.description,
        brandId: brandData.brandId,
        requirements: requirementsObj,
        status: true,
      };

      console.log("📦 Campaign payload:", campaignPayload);

      // Step 6: Make API call
      console.log("🌐 Making API call to create campaign...");
      const response = await campaignApi.createCampaign(campaignPayload);
      console.log("📥 API response:", response);

      if (response.message !== "Campaign created successfully") {
        console.error("❌ Unexpected response:", response);
        throw new Error(
          `Unexpected response from server: ${JSON.stringify(response)}`
        );
      }

      console.log("🎉 Campaign created successfully!");
      toast({
        title: "Campaign Created",
        description: "Your sponsorship campaign has been successfully created!",
      });

      // Navigate to campaigns page
      console.log("🧭 Navigating to campaigns page...");
      router.push("/brand/campaigns");
    } catch (error: any) {
      console.error("💥 Campaign creation failed:", error);
      console.error("Error stack:", error.stack);
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log("🏁 Campaign creation process finished");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">
              Create New Sponsorship Campaign
            </h1>
            <p className="text-muted-foreground mt-2">
              Fill out the details for your new campaign.
            </p>
          </div>

          <div className="space-y-6 rounded-lg border border-muted bg-card p-6 shadow-lg">
            <div>
              <Label htmlFor="campaignTitle" className="text-lg font-semibold">
                Campaign Name
              </Label>
              <Input
                id="campaignTitle"
                placeholder="e.g., Summer Product Launch"
                value={campaignData.campaignTitle}
                onChange={handleChange}
                className="mt-2 bg-muted border-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Label className="text-lg font-semibold">
                Campaign Requirements
              </Label>
              <div className="mt-2 space-y-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="minFollowers"
                      className="text-sm font-medium"
                    >
                      Minimum Followers
                    </Label>
                    <Input
                      id="minFollowers"
                      type="number"
                      placeholder="e.g., 1000"
                      value={requirements.minFollowers}
                      onChange={(e) =>
                        handleRequirementChange("minFollowers", e.target.value)
                      }
                      className="mt-1 bg-background border-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="platform" className="text-sm font-medium">
                      Platform
                    </Label>
                    <Select
                      value={requirements.platform}
                      onValueChange={(value) =>
                        handleRequirementChange("platform", value)
                      }
                    >
                      <SelectTrigger className="mt-1 bg-background border-none">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="any">Any Platform</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="contentType" className="text-sm font-medium">
                    Content Type
                  </Label>
                  <Select
                    value={requirements.contentType}
                    onValueChange={(value) =>
                      handleRequirementChange("contentType", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-background border-none">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="reel">Reel</SelectItem>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="live">Live Stream</SelectItem>
                      <SelectItem value="any">Any Content Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="additionalRequirements"
                    className="text-sm font-medium"
                  >
                    Additional Requirements
                  </Label>
                  <Textarea
                    id="additionalRequirements"
                    placeholder="Any additional requirements or specifications..."
                    value={requirements.additionalRequirements}
                    onChange={(e) =>
                      handleRequirementChange(
                        "additionalRequirements",
                        e.target.value
                      )
                    }
                    className="mt-1 bg-background border-none min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-lg font-semibold">
                Campaign Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign objectives, target audience, and desired outcomes."
                value={campaignData.description}
                onChange={handleChange}
                className="mt-2 min-h-[120px] bg-muted border-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Label htmlFor="budget" className="text-lg font-semibold">
                Budget ($)
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 5000"
                value={campaignData.budget}
                onChange={handleChange}
                className="mt-2 bg-muted border-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="categoryId" className="text-lg font-semibold">
                  Category/Niche
                </Label>
                <Select
                  value={campaignData.categoryId}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full mt-2 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3">
                    <SelectValue placeholder="Select campaign category/niche" />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-foreground max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.categoryId}
                        value={category.categoryId}
                        className="hover:bg-primary/20"
                      >
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="campaignStatus"
                  className="text-lg font-semibold"
                >
                  Campaign Status
                </Label>
                <Select
                  value={campaignData.campaignStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full mt-2 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3">
                    <SelectValue placeholder="Select campaign status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-foreground">
                    {["draft", "active", "completed", "cancelled"].map(
                      (status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="hover:bg-primary/20"
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleConfirmCampaign}
              className="w-full rounded-full py-3 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
