"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Heart,
  Eye,
  MessageCircle,
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

// Accounts & Metrics Tab Component
function AccountsMetricsTab({ creator }: { creator: Creator }) {
  const totalFollowers = creator.socialMedia?.reduce(
    (sum, social) => sum + (social.followers || 0),
    0
  ) || 0;
  const primaryPlatform = creator.socialMedia?.[0]?.platform || "N/A";

  return (
    <div className="mt-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Social Media Accounts</h2>
        <p className="text-muted-foreground mb-6">
          {creator.firstName}'s social media presence across various platforms.
        </p>
      </div>
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Youtube className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{creator.socialMedia?.[0]?.handle || "N/A"}</h3>
            <p className="text-muted-foreground">{primaryPlatform}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-2">{formatFollowerCount(totalFollowers)}</div>
          <div className="text-sm text-muted-foreground">Total Followers</div>
        </div>
      </div>
    </div>
  );
}

// Past Works Tab Component
function PastWorksTab({ creator }: { creator: Creator }) {
  const pastWorks = creator.pastCollaborations?.map((collab, index) => ({
    id: index.toString(),
    title: collab.campaign || collab.brand || "Untitled Collaboration",
    description: collab.description || "No description provided.",
    thumbnail: collab.thumbnail || "/placeholder.svg?height=200&width=300",
    views: collab.views || "0",
    likes: collab.likes || "0",
    comments: collab.comments || "0",
    date: collab.date || "Unknown date",
  })) || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">
          Past <span className="text-primary">Works</span>
        </h2>
        <p className="text-muted-foreground">Showcase of {creator.firstName}'s previous collaborations and content.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastWorks.map((work) => (
          <div key={work.id} className="relative">
            <div className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden h-[360px] flex flex-col bg-card rounded-lg border">
              <div className="relative flex-shrink-0">
                <Image
                  src={work.thumbnail}
                  alt={work.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 overflow-hidden">
                  {work.title}
                </h3>
                <div
                  className="text-muted-foreground text-sm mb-4 flex-grow overflow-y-auto max-h-[80px]"
                  dangerouslySetInnerHTML={{ __html: work.description }}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{work.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{work.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{work.comments}</span>
                    </div>
                  </div>
                  <span>{work.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CreatorProfileViewPage({ params }: { params: { id: string } }) {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iconComponents: { [key: string]: any } = {
    Monitor,
    Instagram,
    Youtube,
    Mail,
    Globe,
    Users,
    MapPin,
    Sparkles,
  };

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
  const primaryPlatform = creator.socialMedia?.[0]?.platform || "Platform";

  // Prepare details array
  const creatorDetails = creator.details?.map((detail) => {
    const IconComponent = iconComponents[detail.icon ?? ""] || MapPin;
    return {
      icon: IconComponent,
      text: `${detail.label}: ${detail.value}`,
    };
  }) || [];

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
                    Followers
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

                <TabsContent value="user-details" className="space-y-8">
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

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg">
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

                  {creatorDetails.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold">Details:</h3>
                      {creatorDetails.map((detail, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <detail.icon className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-lg">{detail.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {creator.socialMedia && creator.socialMedia.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Official Platforms:</h3>
                      <ul className="space-y-2 list-inside">
                        {creator.socialMedia.map((platform, index) => {
                          const IconComponent = iconComponents[platform.icon ?? ""] || getPlatformIcon(platform.platform);
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
                                    ({formatFollowerCount(platform.followers)} followers)
                                  </span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {creator.whatIDo && creator.whatIDo.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        What <span className="text-primary">I Do</span>
                      </h2>
                      <ul className="list-disc list-inside space-y-2 text-lg">
                        {creator.whatIDo.map((item, index) => (
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

                  {creator.myPeople && creator.myPeople.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        My <span className="text-primary">People</span>
                      </h2>
                      <ul className="list-disc list-inside space-y-2 text-lg">
                        {creator.myPeople.map((item, index) => (
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
                        ))}
                      </ul>
                    </div>
                  )}

                  {creator.myContent && creator.myContent.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        My <span className="text-primary">Content</span>
                      </h2>
                      <ul className="list-disc list-inside space-y-2 text-lg">
                        {creator.myContent.map((item, index) => (
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
                        ))}
                      </ul>
                    </div>
                  )}

                  {creator.pastCollaborations && creator.pastCollaborations.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        I&apos;ve <span className="text-primary">Worked With</span>
                      </h2>
                      <ul className="list-disc list-inside space-y-2 text-lg">
                        {creator.pastCollaborations.map((item, index) => (
                          <li key={index}>
                            {item.brand}
                            {item.campaign && (
                              <span className="ml-2">- {item.campaign}</span>
                            )}
                            {item.date && (
                              <span className="text-muted-foreground ml-2">
                                ({item.date})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="accounts-metrics">
                  <AccountsMetricsTab creator={creator} />
                </TabsContent>

                <TabsContent value="past-works">
                  <PastWorksTab creator={creator} />
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