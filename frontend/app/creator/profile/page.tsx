"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Pencil,
  Monitor,
  Users,
  MapPin,
  Sparkles,
  Instagram,
  Youtube,
  Mail,
  Globe,
  BoltIcon as Bat,
  Gem,
  Feather,
  Zap,
  Leaf,
  PlusCircle,
} from "lucide-react";
import { creatorApi, getAuthData } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import UserDetailsTab from "@/components/creator/user-details-tab";
import AccountsMetricsTab from "@/components/creator/accounts-metrics-tab";
import PastWorksTab from "@/components/creator/past-works-tab";

export default function CreatorProfilePage() {
  const router = useRouter();
  const [creatorData, setCreatorData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authData, setAuthDataState] = useState<any>(null);

  useEffect(() => {
    const auth = getAuthData();
    if (!auth || auth.user.role !== "influencer") {
      router.push("/login");
      return;
    }
    setAuthDataState(auth);

    const loadCreatorProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await creatorApi.getCreatorByUserId(auth.user.userId);
        setCreatorData(profile);
      } catch (error: any) {
        console.error("Failed to load creator profile:", error);
        if (error.status === 404) {
          router.push("/creator/profile/new");
        } else {
          toast({
            title: "Error",
            description: "Failed to load profile",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCreatorProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!creatorData) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="influencer" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg">Profile not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Map social media platforms to icons
  const platformIconMap: { [key: string]: any } = {
    TikTok: Monitor,
    Instagram: Instagram,
    YouTube: Youtube,
    Email: Mail,
    Website: Globe,
  };

  const detailsIconMap: { [key: string]: any } = {
    Platform: Monitor,
    Followers: Users,
    "Based in": MapPin,
    Vibe: Sparkles,
    Custom: PlusCircle,
  };

  // Transform data for tabs (matching the edit page structure)
  const transformedCreatorData = {
    name: creatorData.firstName || "",
    nickname: creatorData.nickName || "",
    lastName: creatorData.lastName || "",
    followerInfo: creatorData.socialMedia?.[0]?.followers
      ? `${creatorData.socialMedia[0].followers} Followers (${creatorData.socialMedia[0].platform})`
      : "",
    bio: creatorData.bio || "",
    details: creatorData.details?.map((d: any) => ({
      type: d.label,
      value: d.value,
      icon: detailsIconMap[d.label] || PlusCircle,
    })) || [],
    platforms: creatorData.socialMedia?.map((p: any) => ({
      icon: platformIconMap[p.platform] || Monitor,
      name: p.platform,
      handle: p.handle,
      link: p.url,
    })) || [],
    whatIDo: creatorData.whatIDo?.map((item: any) => item.activity) || [],
    myPeople: creatorData.myPeople?.map((item: any) => item.name) || [],
    myContent: creatorData.myContent?.map((item: any) => item.title) || [],
    workedWith: creatorData.pastCollaborations?.map((item: any) => item.brand) || [],
    bannerImageUrl: creatorData.backgroundImgUrl || null,
    profilePicUrl: creatorData.profilePicUrl || null,
    pastCollaborations: creatorData.pastCollaborations || [],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
          <Image
            src={
              creatorData.backgroundImgUrl ||
              "/placeholder.svg?height=400&width=1200"
            }
            alt="Profile banner"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20 z-5"></div>
        </section>

        {/* Main content area with floating profile section */}
        <div className="relative bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start gap-6 relative -mt-16 z-10">
              {/* Profile Picture Container */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl bg-background">
                  <AvatarImage
                    src={
                      creatorData.profilePicUrl ||
                      "/placeholder.svg?height=200&width=200"
                    }
                    alt={`${creatorData.firstName} profile picture`}
                  />
                  <AvatarFallback className="bg-primary text-white text-2xl md:text-3xl font-bold">
                    {creatorData.firstName?.[0] || "U"}
                    {creatorData.lastName?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="flex-1 w-full mt-4 md:mt-8">
                <div className="flex items-center justify-between w-full mb-4">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {creatorData.socialMedia?.find((sm: any) => sm.followers)
                        ?.followers || "320,000"}
                    </p>
                    <p className="text-lg text-muted-foreground">
                      Followers ({creatorData.socialMedia?.[0]?.platform || "TikTok"})
                    </p>
                  </div>
                  <Link href="/creator/profile/edit" prefetch={false}>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent px-6 py-2"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Profile Details and Tabs */}
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

                <TabsContent value="user-details" className="space-y-8">
                  {/* Name Section */}
                  <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                      {creatorData.firstName}{" "}
                      {creatorData.nickName && (
                        <span className="text-primary">
                          &quot;{creatorData.nickName}&quot;
                        </span>
                      )}{" "}
                      {creatorData.lastName}
                    </h1>
                    
                    {/* Bio */}
                    {creatorData.bio && (
                      <div className="mb-6">
                        <p className="text-lg leading-relaxed text-foreground">{creatorData.bio}</p>
                      </div>
                    )}

                    {/* Category and Type */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg mb-6">
                      {creatorData.category && (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <span className="font-medium">Category:</span>
                          <span>{creatorData.category}</span>
                        </div>
                      )}
                      {creatorData.type && (
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <span className="font-medium">Type:</span>
                          <span>{creatorData.type}</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    {creatorData.details && creatorData.details.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">Details:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {creatorData.details.map((detail: any, index: number) => {
                            const IconComponent = detailsIconMap[detail.label] || Sparkles;
                            return (
                              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                                <div>
                                  <span className="font-medium">{detail.label}:</span>
                                  <span className="ml-2">{detail.value}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Official Platforms */}
                    {creatorData.socialMedia && creatorData.socialMedia.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">Official Platforms:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {creatorData.socialMedia.map((platform: any, index: number) => {
                            const IconComponent = platformIconMap[platform.platform] || Monitor;
                            return (
                              <Link
                                key={index}
                                href={platform.url || "#"}
                                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                                prefetch={false}
                              >
                                <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                                <div>
                                  <div className="font-medium">{platform.platform}</div>
                                  <div className="text-muted-foreground">{platform.handle}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* What I Do Section */}
                  {creatorData.whatIDo && creatorData.whatIDo.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        What <span className="text-primary">I Do</span>
                      </h2>
                      <ul className="space-y-2">
                        {creatorData.whatIDo.map((item: any, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-lg">
                            <span className="text-primary mt-2">•</span>
                            <span>
                              {item.activity}
                              {item.experience && (
                                <span className="text-muted-foreground ml-2">({item.experience})</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* My People Section */}
                  {creatorData.myPeople && creatorData.myPeople.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        My <span className="text-primary">People</span>
                      </h2>
                      <ul className="space-y-2">
                        {creatorData.myPeople.map((item: any, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-lg">
                            <span className="text-primary mt-2">•</span>
                            <span>
                              {item.name}
                              {item.role && <span className="text-muted-foreground ml-2">- {item.role}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* My Content Section */}
                  {creatorData.myContent && creatorData.myContent.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        My <span className="text-primary">Content</span>
                      </h2>
                      <ul className="space-y-2">
                        {creatorData.myContent.map((item: any, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-lg">
                            <span className="text-primary mt-2">•</span>
                            <span>
                              {item.title}
                              {item.views && (
                                <span className="text-muted-foreground ml-2">({item.views} views)</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* I've Worked With Section */}
                  {creatorData.pastCollaborations && creatorData.pastCollaborations.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        I&apos;ve <span className="text-primary">Worked With</span>
                      </h2>
                      <ul className="space-y-2">
                        {creatorData.pastCollaborations.map((item: any, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-lg">
                            <span className="text-primary mt-2">•</span>
                            <span>
                              {item.brand}
                              {item.campaign && <span className="ml-2">- {item.campaign}</span>}
                              {item.date && (
                                <span className="text-muted-foreground ml-2">({item.date})</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="accounts-metrics">
                  <AccountsMetricsTab />
                </TabsContent>

                <TabsContent value="past-works">
                  <PastWorksTab
                    creatorData={transformedCreatorData}
                    setCreatorData={() => {}} // Read-only for profile view
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Collabs Through Us Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted mt-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-8">
              Collabs <span className="text-primary">Through Us</span>
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <Bat className="h-12 w-12 text-foreground hover:text-primary transition-colors cursor-pointer" />
              <Gem className="h-12 w-12 text-foreground hover:text-primary transition-colors cursor-pointer" />
              <Zap className="h-12 w-12 text-foreground hover:text-primary transition-colors cursor-pointer" />
              <Feather className="h-12 w-12 text-foreground hover:text-primary transition-colors cursor-pointer" />
              <Leaf className="h-12 w-12 text-foreground hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}