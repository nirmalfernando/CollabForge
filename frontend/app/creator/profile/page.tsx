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
  Star,
} from "lucide-react";
import { creatorApi, getAuthData, brandReviewApi, brandApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import AccountsMetricsTab from "@/components/creator/edit-tabs/accounts-metrics-tab";
import PastWorksTab from "@/components/creator/edit-tabs/past-works-tab";

const iconComponents: { [key: string]: any } = {
  Monitor,
  Instagram,
  Youtube,
  Mail,
  Globe,
  Users,
  MapPin,
  Sparkles,
  PlusCircle,
};

export default function CreatorProfilePage() {
  const router = useRouter();
  const [creatorData, setCreatorData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authData, setAuthDataState] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

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
        const profileResponse = await creatorApi.getCreatorByUserId(
          auth.user.userId
        );

        if (!profileResponse) {
          router.push("/creator/profile/new");
          return;
        }

        setCreatorData(profileResponse);

        try {
          const reviewsData = await brandReviewApi.getBrandReviewsByCreator(
            auth.user.userId
          );
          // Filter to only show reviews with isShown = true
          const shownReviews = reviewsData.filter(
            (review: any) => review.isShown
          );

          const reviewsWithCompanyNames = await Promise.all(
            shownReviews.map(async (review: any) => {
              try {
                const brand = await brandApi.getBrandById(review.brandId);
                return {
                  ...review,
                  companyName: brand.companyName || "Unknown Brand",
                };
              } catch (error) {
                console.error(
                  `Failed to fetch brand for ID ${review.brandId}:`,
                  error
                );
                return {
                  ...review,
                  companyName: "Unknown Brand",
                };
              }
            })
          );
          setReviews(reviewsWithCompanyNames || []);
        } catch (error: any) {
          console.error("Failed to load reviews:", error);
          setReviews([]); // Set empty reviews array if fetching reviews fails
        }
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

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  // Build creator details without adding any data from socialMedia
  const creatorDetails: { icon: string; text: string }[] = [];

  if (creatorData.details && creatorData.details.length > 0) {
    creatorData.details.forEach((detail: any) => {
      creatorDetails.push({
        icon: detail.icon || "MapPin",
        text: `${detail.label}: ${detail.value}`,
      });
    });
  }

  const totalFollowers =
    creatorData.socialMedia?.reduce(
      (sum: number, social: any) => sum + (social.followers || 0),
      0
    ) || 0;
  const primaryPlatform = creatorData.socialMedia?.[0]?.platform || "N/A";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1">
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
          <div className="absolute inset-0 bg-black/20 z-5"></div>
        </section>

        <div className="relative bg-background pt-8 pb-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start gap-6 relative -mt-16 z-10">
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

              <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4 w-full mt-6">
                <div className="text-left">
                  <p className="text-4xl font-bold text-foreground">
                    {formatFollowerCount(totalFollowers)}
                  </p>
                  <p className="text-lg text-muted-foreground">Followers</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Link href="/creator/profile/edit" prefetch={false}>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent px-6 py-2"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

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
                  <h1 className="text-3xl md:text-5xl font-bold">
                    {creatorData.firstName}
                    {creatorData.nickName && (
                      <span className="text-primary">
                        {" "}
                        &quot;{creatorData.nickName}&quot;
                      </span>
                    )}{" "}
                    {creatorData.lastName}
                  </h1>

                  {creatorData.bio && (
                    <p className="text-lg leading-relaxed whitespace-pre-line">
                      {creatorData.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg">
                    {creatorData.category && (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span>Category: {creatorData.category}</span>
                      </div>
                    )}
                    {creatorData.type && (
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Type: {creatorData.type}</span>
                      </div>
                    )}
                  </div>

                  {creatorDetails.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold">Details:</h3>
                      {creatorDetails.map((detail, index) => {
                        const IconComponent =
                          iconComponents[detail.icon] || Monitor;
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-lg">{detail.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {creatorData.socialMedia &&
                    creatorData.socialMedia.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">
                          Official Platforms:
                        </h3>
                        <ul className="space-y-2 list-inside">
                          {creatorData.socialMedia.map(
                            (platform: any, index: number) => {
                              const IconComponent =
                                iconComponents[platform.icon] || Monitor;
                              return (
                                <li
                                  key={index}
                                  className="flex items-center gap-3"
                                >
                                  <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                                  <Link
                                    href={platform.url || "#"}
                                    className="text-lg hover:underline"
                                    prefetch={false}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {platform.platform} - {platform.handle}
                                    {platform.followers && (
                                      <span className="text-muted-foreground ml-2">
                                        (
                                        {formatFollowerCount(
                                          platform.followers
                                        )}{" "}
                                        followers)
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    )}

                  {creatorData.whatIDo && creatorData.whatIDo.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        What <span className="text-primary">I Do</span>
                      </h2>
                      <ul className="list-disc list-inside space-y-2 text-lg">
                        {creatorData.whatIDo.map((item: any, index: number) => (
                          <li key={index}>
                            {item.activity}
                            {item.experience && (
                              <span className="text-muted-foreground ml-2">
                                - {item.experience}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {creatorData.myPeople && creatorData.myPeople.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        My <span className="text-primary">People</span>
                      </h2>
                      <ul className="list-disc list-inside space-y-2 text-lg">
                        {creatorData.myPeople.map(
                          (item: any, index: number) => (
                            <li key={index}>
                              {item.name}
                              {item.role && (
                                <span className="text-muted-foreground ml-2">
                                  - {item.role}
                                </span>
                              )}
                              {item.contact && (
                                <span className="text-muted-foreground ml-2">
                                  - {item.contact}
                                </span>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {creatorData.myContent &&
                    creatorData.myContent.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold">
                          My <span className="text-primary">Content</span>
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-lg">
                          {creatorData.myContent.map(
                            (item: any, index: number) => (
                              <li key={index}>
                                {item.url ? (
                                  <Link
                                    href={item.url}
                                    className="hover:underline text-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.title}
                                  </Link>
                                ) : (
                                  item.title
                                )}
                                {item.views && (
                                  <span className="text-muted-foreground ml-2">
                                    ({item.views.toLocaleString()} views)
                                  </span>
                                )}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {creatorData.pastCollaborations &&
                    creatorData.pastCollaborations.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold">
                          I&apos;ve{" "}
                          <span className="text-primary">Worked With</span>
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-lg">
                          {creatorData.pastCollaborations.map(
                            (item: any, index: number) => (
                              <li key={index}>
                                {item.brand}
                                {item.campaign && (
                                  <span className="ml-2">
                                    - {item.campaign}
                                  </span>
                                )}
                                {item.date && (
                                  <span className="text-muted-foreground ml-2">
                                    ({item.date})
                                  </span>
                                )}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      My <span className="text-primary">Reviews</span>
                    </h2>
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="rounded-lg p-4 bg-muted/50"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            {review.comment && (
                              <p className="text-lg">{review.comment}</p>
                            )}
                            <p className="text-sm mt-2">
                              Reviewed by: {review.companyName}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-lg text-muted-foreground">
                        No reviews available.
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="accounts-metrics">
                  <AccountsMetricsTab />
                </TabsContent>

                <TabsContent value="past-works">
                  <PastWorksTab
                    creatorData={creatorData}
                    setCreatorData={() => {}}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

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
