"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Monitor,
  Users,
  MapPin,
  Sparkles,
  Instagram,
  Youtube,
  Mail,
  Globe,
  Atom,
  FlaskConical,
  Beaker,
  Wind,
  Flame,
  Loader2,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import { creatorApi, categoryApi } from "@/lib/api";
import ViewUserDetailsTab from "@/components/creator/view-tabs/ViewUserDetailsTab";
import ViewAccountsMetricsTab from "@/components/creator/view-tabs/ViewAccountsMetricsTab";
import ViewPastWorksTab from "@/components/creator/view-tabs/ViewPastWorksTab";

// Define interfaces for type safety
interface Creator {
  creatorId: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  bio?: string;
  type: "Content Creator" | "Model" | "Live Streamer";
  categoryId: string;
  profilePicUrl?: string;
  backgroundImgUrl?: string;
  accountNumber?: string;
  details?: Array<{ label: string; value: string; icon?: string }>;
  socialMedia?: Array<{
    platform: string;
    handle: string;
    url: string;
    followers?: number;
    icon?: string;
  }>;
  whatIDo?: Array<{ activity: string; experience?: string }>;
  myPeople?: Array<{ name: string; role: string; contact?: string }>;
  myContent?: Array<{ title: string; url?: string; views?: number }>;
  pastCollaborations?: Array<{
    brand: string;
    campaign: string;
    date?: string;
    thumbnail?: string;
    views?: string;
    likes?: string;
    comments?: string;
    description?: string;
  }>;
}

interface Category {
  categoryId: string;
  categoryName: string;
  description?: string;
}

export default function CreatorProfileViewPage({ params }: { params: { id: string } }) {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!params.id) {
        setError("Creator ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch creator data
        const creatorResponse = await creatorApi.getCreatorById(params.id);
        setCreator(creatorResponse);

        // Fetch category data if creator has categoryId
        if (creatorResponse.categoryId) {
          try {
            const categoryResponse = await categoryApi.getCategoryById(
              creatorResponse.categoryId
            );
            setCategory(categoryResponse);
          } catch (categoryError) {
            console.error("Error fetching category:", categoryError);
          }
        }
      } catch (error) {
        console.error("Error fetching creator:", error);
        setError("Failed to load creator profile");
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [params.id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-lg">Loading creator profile...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !creator) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">
              {error || "Creator not found"}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate total followers
  const totalFollowers =
    creator.socialMedia?.reduce(
      (sum, social) => sum + (social.followers || 0),
      0
    ) || 0;

  // Handlers for action buttons
  const handleContact = () => {
    // Implement contact functionality
    console.log("Contact button clicked");
  };

  const handleFollow = () => {
    // Implement follow functionality
    console.log("Follow button clicked");
  };

  const handleHire = () => {
    // Implement hire functionality
    console.log("Hire button clicked");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-80 lg:h-96">
          <Image
            src={creator.backgroundImgUrl || "/placeholder.svg"}
            alt="Profile banner"
            layout="fill"
            objectFit="cover"
            className="z-0"
            priority
          />
        </section>

        {/* Main content area */}
        <div className="relative bg-background pt-8 pb-12">
          <div className="container px-4 md:px-6">
            {/* Top section with Avatar, Stats, and Buttons */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Picture - Overlapping */}
              <div className="relative -mt-24 md:-mt-32 lg:-mt-36 flex-shrink-0">
                <Avatar className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-primary shadow-lg">
                  <AvatarImage
                    src={creator.profilePicUrl || "/placeholder.svg"}
                    alt={`${creator.firstName} ${creator.lastName} profile picture`}
                  />
                  <AvatarFallback className="bg-primary text-white text-5xl font-bold">
                    {creator.firstName[0]}
                    {creator.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Follower Count and Action Buttons */}
              <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4 w-full">
                <div className="text-left">
                  <p className="text-4xl font-bold text-foreground">
                    {totalFollowers >= 1000000
                      ? `${(totalFollowers / 1000000).toFixed(1)}M`
                      : totalFollowers >= 1000
                      ? `${(totalFollowers / 1000).toFixed(0)}K`
                      : totalFollowers.toString()}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Followers
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    onClick={handleContact}
                  >
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    onClick={handleFollow}
                  >
                    Follow
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="mt-8">
              <Tabs defaultValue="user-details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted text-foreground mb-8">
                  <TabsTrigger
                    value="user-details"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    User Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="accounts-metrics"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Accounts & Metrics
                  </TabsTrigger>
                  <TabsTrigger
                    value="past-works"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Past Works
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user-details">
                  <ViewUserDetailsTab
                    creatorData={{ ...creator, status: true }}
                    category={category}
                    onContact={handleContact}
                    onFollow={handleFollow}
                    onHire={handleHire}
                  />
                </TabsContent>

                <TabsContent value="accounts-metrics">
                  <ViewAccountsMetricsTab creatorData={creator} />
                </TabsContent>

                <TabsContent value="past-works">
                  <ViewPastWorksTab creatorData={creator} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Collabs Through Us Section */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Collabs <span className="text-primary">Through Us</span>
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <Atom className="h-12 w-12 text-foreground" />
              <FlaskConical className="h-12 w-12 text-foreground" />
              <Beaker className="h-12 w-12 text-foreground" />
              <Wind className="h-12 w-12 text-foreground" />
              <Flame className="h-12 w-12 text-foreground" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}