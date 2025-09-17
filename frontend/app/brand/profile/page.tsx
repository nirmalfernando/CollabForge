"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { brandApi, getAuthData, reviewApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

export default function BrandProfilePage() {
  const router = useRouter();
  const [brandData, setBrandData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authData, setAuthDataState] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const auth = getAuthData();
    if (!auth || auth.user.role !== "brand") {
      router.push("/login");
      return;
    }
    setAuthDataState(auth);

    const loadBrandProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await brandApi.getBrandByUserId(auth.user.userId);
        setBrandData(profile);

        // Fetch reviews
        try {
          const reviewsData = await reviewApi.getReviewsByCreator(
            profile._id
          );
          // Filter to only show reviews with isShown = true
          const shownReviews = reviewsData.filter(
            (review: any) => review.isShown
          );
          // Map reviews to include creator's name
          const reviewsWithCreatorNames = shownReviews.map((review: any) => ({
            ...review,
            creatorName: review.Creator
              ? `${review.Creator.firstName} ${review.Creator.lastName || ""}`
              : "Unknown Creator",
          }));
          setReviews(reviewsWithCreatorNames || []);
        } catch (error: any) {
          console.error("Failed to load reviews:", error);
          setReviews([]);
        }
      } catch (error: any) {
        console.error("Failed to load brand profile:", error);
        if (error.status === 404) {
          router.push("/brand/profile/new");
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

    loadBrandProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand" />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!brandData) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header isLoggedIn={true} userRole="brand" />
        <main className="flex-1 flex items-center justify-center">
          <div>Profile not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand" />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-[#f5f5f5]">
          <Image
            src={
              brandData.backgroundImageUrl ||
              "/placeholder.svg?height=400&width=1200"
            }
            alt="Brand banner"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
        </section>

        {/* Main content area with dark background */}
        <div className="relative bg-background pt-8 pb-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Picture/Logo Container - positioned to overlap */}
              <div className="relative -mt-20 md:-mt-24 lg:-mt-28 flex-shrink-0">
                <Avatar className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-primary shadow-lg bg-black flex items-center justify-center">
                  <AvatarImage
                    src={brandData.profilePicUrl || "/placeholder.svg"}
                    alt={brandData.companyName}
                  />
                  <AvatarFallback className="bg-primary text-white text-4xl font-bold">
                    {brandData.companyName?.[0] || "B"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Brand Info */}
              <div className="flex-1 w-full pt-4 md:pt-0">
                {/* Horizontal Buttons */}
                <div className="flex items-center justify-end w-full space-x-4 mb-4">
                  <Link href="/brand/profile/edit" prefetch={false}>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 bg-transparent"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/brand/campaigns/create" prefetch={false}>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 bg-transparent"
                    >
                      Create Campaigns
                    </Button>
                  </Link>
                </div>

                {/* Tabs for profile sections */}
                <Tabs defaultValue="brand-details" className="w-full mt-8">
                  <TabsList className="grid w-full grid-cols-2 bg-muted text-foreground">
                    <TabsTrigger
                      value="brand-details"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Brand Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="what-we-look-for"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      What We Look For
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="brand-details" className="mt-6 space-y-8">
                    {/* Company Name and Bio */}
                    <div className="space-y-2">
                      <h1 className="text-4xl md:text-5xl font-bold">
                        {brandData.companyName}
                      </h1>
                      <p className="text-lg text-muted-foreground">
                        {brandData.bio}
                      </p>
                    </div>

                    {/* Description Section */}
                    {brandData.description && (
                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold">
                          About <span className="text-primary">Us</span>
                        </h3>
                        <div className="text-lg space-y-2 text-muted-foreground">
                          {brandData.description.mission && (
                            <p>
                              <strong>Mission:</strong>{" "}
                              {brandData.description.mission}
                            </p>
                          )}
                          {brandData.description.vision && (
                            <p>
                              <strong>Vision:</strong>{" "}
                              {brandData.description.vision}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reviews Section */}
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        Our <span className="text-primary">Reviews</span>
                      </h2>
                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div
                              key={review.reviewId}
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
                                Reviewed by: {review.creatorName}
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

                  <TabsContent value="what-we-look-for" className="mt-6 space-y-8">
                    {/* What We Look For Section */}
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold">
                        What We Look For in{" "}
                        <span className="text-primary">Collaborators</span>
                      </h3>
                      <div className="text-lg space-y-1 text-muted-foreground">
                        <p>Target Audience: {brandData.whatWeLookFor?.targetAudience}</p>
                        <p>Collaboration Type: {brandData.whatWeLookFor?.collaborationType}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}