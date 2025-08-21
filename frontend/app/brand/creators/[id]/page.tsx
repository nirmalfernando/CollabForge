"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "@/hooks/use-toast";
import { creatorApi, categoryApi } from "@/lib/api";

// Import the brand view components
import BrandViewUserDetailsTab from "@/components/brand/creator-profile-tabs/BrandViewUserDetailsTab";
import BrandViewAccountsMetricsTab from "@/components/brand/creator-profile-tabs/BrandViewAccountsMetricsTab";
import BrandViewPastWorksTab from "@/components/brand/creator-profile-tabs/BrandViewPastWorksTab";

export default function BrandViewCreatorProfile({
  params,
}: {
  params: { id: string };
}) {
  const [creator, setCreator] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        setLoading(true);
        setError(null);

        const creatorData = await creatorApi.getCreatorById(params.id);
        setCreator(creatorData);

        if (creatorData.categoryId) {
          try {
            const categoryData = await categoryApi.getCategoryById(
              creatorData.categoryId
            );
            setCategory(categoryData);
          } catch (categoryError) {
            console.error("Error fetching category:", categoryError);
          }
        }
      } catch (error) {
        console.error("Error fetching creator:", error);
        setError("Failed to load creator profile.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCreatorData();
    }
  }, [params.id]);

  const handleContact = () => {
    toast({
      title: "Contact Request",
      description: "Contact feature will be available soon!",
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: `You are now ${
        isFollowing ? "not following" : "following"
      } ${creator?.firstName}`,
    });
  };

  const handleHire = () => {
    toast({
      title: "Hire Creator",
      description: "Redirecting to collaboration request...",
    });
    // Redirect to collaboration/campaign creation page
  };

  const getTotalFollowers = () => {
    if (!creator?.socialMedia) return "N/A";
    const total = creator.socialMedia.reduce(
      (sum: number, social: any) => sum + (social.followers || 0),
      0
    );
    if (total >= 1000000) {
      return `${(total / 1000000).toFixed(1)}M`;
    } else if (total >= 1000) {
      return `${(total / 1000).toFixed(0)}K`;
    }
    return total.toString();
  };

  const getPrimaryPlatform = () => {
    if (!creator?.socialMedia || creator.socialMedia.length === 0)
      return "Various Platforms";
    return creator.socialMedia[0].platform;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 flex justify-center items-center">
          <div className="text-lg">Loading creator profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand-manager" />
        <main className="flex-1 flex justify-center items-center">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Creator Not Found</h2>
            <p className="text-muted-foreground text-lg mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-gradient-to-r from-primary/20 to-primary/10">
          {creator.backgroundImgUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${creator.backgroundImgUrl})` }}
            />
          )}
        </section>

        {/* Profile Header */}
        <div className="relative bg-background pt-8 pb-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Picture */}
              <div className="relative -mt-24 md:-mt-32 lg:-mt-36 flex-shrink-0">
                <Avatar className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-primary shadow-lg">
                  <AvatarImage
                    src={creator.profilePicUrl || "/placeholder.svg"}
                    alt={`${creator.firstName} ${creator.lastName}`}
                  />
                  <AvatarFallback className="bg-primary text-white text-5xl font-bold">
                    {creator.firstName[0]}
                    {creator.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Follower Stats and Actions */}
              <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-6 pt-4">
                <div className="text-left">
                  <p className="text-4xl font-bold text-foreground">
                    {getTotalFollowers()}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Followers ({getPrimaryPlatform()})
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto md:ml-auto">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleContact}
                      variant="outline"
                      className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Contact
                    </Button>
                    <Button
                      onClick={handleFollow}
                      variant={isFollowing ? "default" : "outline"}
                      className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>
                  <Button
                    onClick={handleHire}
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Hire Creator
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="container px-4 md:px-6 pb-12">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="metrics"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="works"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Portfolio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <BrandViewUserDetailsTab
                creatorData={creator}
                category={category}
                onContact={handleContact}
                onFollow={handleFollow}
                onHire={handleHire}
              />
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <BrandViewAccountsMetricsTab creatorData={creator} />
            </TabsContent>

            <TabsContent value="works" className="space-y-6">
              <BrandViewPastWorksTab creatorData={creator} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
