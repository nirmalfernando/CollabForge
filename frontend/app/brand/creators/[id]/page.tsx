"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "@/hooks/use-toast";
import { creatorApi, categoryApi, getAuthData } from "@/lib/api";
import ViewUserDetailsTab from "@/components/creator/view-tabs/ViewUserDetailsTab";
import ViewAccountsMetricsTab from "@/components/creator/view-tabs/ViewAccountsMetricsTab";
import ViewPastWorksTab from "@/components/creator/view-tabs/ViewPastWorksTab";

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
  const [contactingCreator, setContactingCreator] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ensure params.id is valid before making API calls
        if (!params?.id) {
          throw new Error("Creator ID is missing");
        }

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

    fetchCreatorData();
  }, [params?.id]);

  const handleContact = async () => {
    try {
      setContactingCreator(true);
      
      const currentUser = getAuthData()?.user;
      
      if (!currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please log in to start a conversation.",
          variant: "destructive",
        });
        return;
      }

      // Check if creator has a user account
      if (!creator.creatorId) {
        toast({
          title: "Contact Unavailable",
          description: "This creator cannot be contacted at the moment.",
          variant: "destructive",
        });
        return;
      }

      // Show success message
      toast({
        title: "Opening Chat",
        description: `Starting conversation with ${creator.firstName}...`,
      });

      // Navigate to chat page with creator info
      const creatorName = `${creator.firstName} ${creator.lastName}`;
      router.push(`/brand/chat?contactUserId=${creator.creatorId}&contactName=${encodeURIComponent(creatorName)}&autoMessage=true`);
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to open chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setContactingCreator(false);
    }
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
    // You can extend this to navigate to a campaign creation page
    // router.push(`/brand/campaigns/create?creatorId=${creator.creatorId}`);
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Loading creator profile...</p>
          </div>
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
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-gradient-to-r from-primary/20 to-primary/10">
          {creator.backgroundImgUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${creator.backgroundImgUrl})` }}
            />
          )}
        </section>

        <div className="relative bg-background pt-8 pb-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
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
                      disabled={contactingCreator}
                      variant="outline"
                      className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                    >
                      {contactingCreator ? "Opening Chat..." : "Contact"}
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
              <ViewUserDetailsTab
                creatorData={creator}
                category={category}
                onContact={handleContact}
                onFollow={handleFollow}
                onHire={handleHire}
              />
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <ViewAccountsMetricsTab creatorData={creator} />
            </TabsContent>

            <TabsContent value="works" className="space-y-6">
              <ViewPastWorksTab creatorData={creator} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}