"use client";

import type React from "react";
import { useState, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";
import { proposalApi, creatorApi, getAuthData, ApiError } from "@/lib/api";

export default function CampaignApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Use the 'use' hook to unwrap the params Promise
  const { id } = use(params);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    proposalTitle: string;
    proposalPitch: string;
    contentPlan: string;
    timeline: DateRange | undefined;
  }>({
    proposalTitle: "",
    proposalPitch: "",
    contentPlan: "",
    timeline: undefined,
  });

  // Get creator ID when component mounts
  useEffect(() => {
    const fetchCreatorId = async () => {
      try {
        const authData = getAuthData();
        if (!authData) {
          toast({
            title: "Authentication Error",
            description: "Please log in to submit an application.",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }

        // Get creator profile by user ID
        const creatorResponse = await creatorApi.getCreatorByUserId(
          authData.user.userId
        );
        if (creatorResponse && creatorResponse.creatorId) {
          setCreatorId(creatorResponse.creatorId);
        } else {
          toast({
            title: "Profile Required",
            description: "Please complete your creator profile first.",
            variant: "destructive",
          });
          router.push("/creator/profile");
        }
      } catch (error) {
        console.error("Error fetching creator profile:", error);
        toast({
          title: "Error",
          description: "Failed to load creator profile. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchCreatorId();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🎯 Form submission started");
    console.log("📋 Current form data:", formData);
    console.log("👤 Creator ID:", creatorId);
    console.log("🎯 Campaign ID:", id);

    if (!creatorId) {
      console.error("❌ No creator ID found");
      toast({
        title: "Error",
        description: "Creator profile not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.timeline?.from || !formData.timeline?.to) {
      console.error("❌ Timeline dates missing");
      toast({
        title: "Validation Error",
        description: "Please select both start and end dates for the timeline.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare proposal data for backend - ensuring proper date formatting
      const startDate = new Date(formData.timeline.from);
      const endDate = new Date(formData.timeline.to);

      console.log("📅 Original dates:", {
        from: formData.timeline.from,
        to: formData.timeline.to,
        startDate: startDate,
        endDate: endDate,
      });

      // Validate dates
      if (startDate >= endDate) {
        console.error("❌ Invalid date range");
        toast({
          title: "Invalid Date Range",
          description: "Start date must be before end date.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Format dates as YYYY-MM-DDTHH:MM:SS.sssZ
      const proposalData = {
        campaignId: id,
        proposalTitle: formData.proposalTitle.trim(),
        proposalPitch: formData.proposalPitch.trim(),
        contentPlan: formData.contentPlan.trim()
          ? {
              description: formData.contentPlan.trim(),
              details: formData.contentPlan
                .trim()
                .split("\n")
                .filter((line) => line.trim()),
            }
          : null,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        creatorId: creatorId,
        proposalStatus: "pending",
        status: true,
      };

      // Additional validation
      if (!proposalData.campaignId || !proposalData.creatorId) {
        console.error("❌ Missing required IDs");
        toast({
          title: "Missing Information",
          description:
            "Campaign ID or Creator ID is missing. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log("📤 Final proposal data to be sent:", proposalData);
      console.log("🏗️ Proposal data validation:");
      console.log(
        "  - Campaign ID:",
        proposalData.campaignId,
        typeof proposalData.campaignId
      );
      console.log(
        "  - Creator ID:",
        proposalData.creatorId,
        typeof proposalData.creatorId
      );
      console.log("  - Title length:", proposalData.proposalTitle.length);
      console.log("  - Pitch length:", proposalData.proposalPitch.length);
      console.log("  - Content plan length:", proposalData.contentPlan.length);
      console.log("  - Start date:", proposalData.startDate);
      console.log("  - End date:", proposalData.endDate);

      // Submit proposal to backend
      const response = await proposalApi.createProposal(proposalData);

      console.log("✅ Proposal submitted successfully:", response);

      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted!",
      });

      // Redirect to creator applications page
      router.push("/creator/applications");
    } catch (error) {
      console.error("❌ Full error object:", error);

      let errorMessage = "Failed to submit application. Please try again.";

      if (error instanceof ApiError) {
        console.log("🔍 API Error details:", {
          status: error.status,
          message: error.message,
          details: error.details,
        });

        if (error.details?.errors && Array.isArray(error.details.errors)) {
          // Handle validation errors from backend
          errorMessage = error.details.errors
            .map((err: any) => err.msg || err.message)
            .join(", ");
        } else if (error.details?.message) {
          errorMessage = error.details.message;
        } else if (error.message && error.message !== "An error occurred") {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />
      <main className="flex-1 flex items-center justify-center py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl rounded-xl overflow-hidden shadow-lg">
          {/* Left Panel - Application Form */}
          <div className="bg-muted p-8 md:p-12 flex flex-col justify-center rounded-l-xl">
            <h1 className="text-4xl font-bold mb-8 text-primary">
              Application
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  name="proposalTitle"
                  placeholder="Proposal Title"
                  value={formData.proposalTitle}
                  onChange={handleChange}
                  className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Textarea
                  name="proposalPitch"
                  placeholder="Proposal Pitch"
                  value={formData.proposalPitch}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 resize-y"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Textarea
                  name="contentPlan"
                  placeholder="Content Plan"
                  value={formData.contentPlan}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 resize-y"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3",
                        !formData.timeline?.from && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.timeline?.from ? (
                        formData.timeline.to ? (
                          <>
                            {format(formData.timeline.from, "LLL dd, y")} -{" "}
                            {format(formData.timeline.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(formData.timeline.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Timeline</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-card text-foreground"
                    align="start"
                  >
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={formData.timeline?.from}
                      selected={formData.timeline}
                      onSelect={(range) =>
                        setFormData((prev) => ({
                          ...prev,
                          timeline: range || undefined,
                        }))
                      }
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Apply"}
              </Button>
            </form>
          </div>

          {/* Right Panel - Decorative */}
          <div className="hidden lg:flex items-center justify-center bg-background relative overflow-hidden rounded-r-xl">
            {/* Large blue arc */}
            <div
              className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full bg-primary"
              style={{ clipPath: "ellipse(50% 50% at 100% 50%)" }}
            />
            <h2 className="text-5xl font-bold text-white z-10">CollabForge</h2>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
