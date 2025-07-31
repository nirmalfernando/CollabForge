"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  TrendingUp,
} from "lucide-react";
import { creatorApi, categoryApi } from "@/lib/api";

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
  details?: Array<{ label: string; value: string }>;
  socialMedia?: Array<{
    platform: string;
    handle: string;
    url: string;
    followers?: number;
  }>;
  whatIDo?: Array<{ activity: string; experience?: string }>;
  myPeople?: Array<{ name: string; role: string; contact?: string }>;
  myContent?: Array<{ title: string; url?: string; views?: number }>;
  pastCollaborations?: Array<{
    brand: string;
    campaign: string;
    date?: string;
  }>;
}

interface Category {
  categoryId: string;
  categoryName: string;
  description?: string;
}

// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  const platformLower = platform.toLowerCase();
  switch (platformLower) {
    case "instagram":
      return Instagram;
    case "youtube":
      return Youtube;
    case "twitter":
      return Twitter;
    case "facebook":
      return Facebook;
    case "linkedin":
      return Linkedin;
    case "tiktok":
      return Monitor;
    default:
      return Globe;
  }
};

// Helper function to format follower count
const formatFollowerCount = (count: number) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`;
  }
  return count.toString();
};

export default function CreatorProfileViewPage({
  params,
}: {
  params: { id: string };
}) {
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
            // Don't set error for category fetch failure, just continue without category name
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
  const primaryPlatform = creator.socialMedia?.[0]?.platform || "Platform";

  // Prepare details array
  const creatorDetails = [
    { icon: Monitor, text: `Platform: ${primaryPlatform}` },
    { icon: Users, text: `Followers: ${formatFollowerCount(totalFollowers)}` },
    { icon: Sparkles, text: `Type: ${creator.type}` },
  ];

  // Add custom details from backend
  if (creator.details && creator.details.length > 0) {
    creator.details.forEach((detail) => {
      creatorDetails.push({
        icon: MapPin, // Default icon, you can customize this
        text: `${detail.label}: ${detail.value}`,
      });
    });
  }

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
                    {formatFollowerCount(totalFollowers)}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Followers ({primaryPlatform})
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Follow
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="mt-8 space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold">
                {creator.firstName}
                {creator.nickName && (
                  <span className="text-primary">
                    {" "}
                    &quot;{creator.nickName}&quot;
                  </span>
                )}{" "}
                {creator.lastName}
              </h1>

              {creator.bio && (
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {creator.bio}
                </p>
              )}

              {/* Display Category and Creator Type */}
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-lg">
                {category && (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Category: {category.categoryName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Type: {creator.type}</span>
                </div>
              </div>

              {/* Creator Details */}
              <div className="space-y-3">
                {creatorDetails.map((detail, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <detail.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">{detail.text}</span>
                  </div>
                ))}
              </div>

              {/* Social Media Platforms */}
              {creator.socialMedia && creator.socialMedia.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Official Platforms:</h3>
                  <ul className="space-y-2 list-inside">
                    {creator.socialMedia.map((platform, index) => {
                      const IconComponent = getPlatformIcon(platform.platform);
                      return (
                        <li key={index} className="flex items-center gap-3">
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
                                ({formatFollowerCount(platform.followers)}{" "}
                                followers)
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* What I Do Section */}
              {creator.whatIDo && creator.whatIDo.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    What <span className="text-primary">I Do</span>
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-lg">
                    {creator.whatIDo.map((item, index) => (
                      <li key={index}>
                        {item.activity}
                        {item.experience && (
                          <span className="text-muted-foreground">
                            {" "}
                            - {item.experience}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* My People Section */}
              {creator.myPeople && creator.myPeople.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    My <span className="text-primary">People</span>
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-lg">
                    {creator.myPeople.map((person, index) => (
                      <li key={index}>
                        {person.role}: {person.name}
                        {person.contact && (
                          <span className="text-muted-foreground">
                            {" "}
                            - {person.contact}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* My Content Section */}
              {creator.myContent && creator.myContent.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    My <span className="text-primary">Content</span>
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-lg">
                    {creator.myContent.map((content, index) => (
                      <li key={index}>
                        {content.url ? (
                          <Link
                            href={content.url}
                            className="hover:underline text-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {content.title}
                          </Link>
                        ) : (
                          content.title
                        )}
                        {content.views && (
                          <span className="text-muted-foreground ml-2">
                            ({content.views.toLocaleString()} views)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Past Collaborations Section */}
              {creator.pastCollaborations &&
                creator.pastCollaborations.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold">
                      I&apos;ve{" "}
                      <span className="text-primary">Worked With</span>
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-lg">
                      {creator.pastCollaborations.map((collab, index) => (
                        <li key={index}>
                          {collab.brand} - {collab.campaign}
                          {collab.date && (
                            <span className="text-muted-foreground">
                              {" "}
                              ({collab.date})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
