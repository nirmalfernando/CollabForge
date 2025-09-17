"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Menu, Users, TrendingUp, Loader2, Star } from "lucide-react";
import Link from "next/link";
import { creatorApi, categoryApi, ApiError, brandApi, getAuthData } from "@/lib/api";

// Define types for the creator data
interface Creator {
  creatorId: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  bio?: string;
  type: "Content Creator" | "Model" | "Live Streamer";
  profilePicUrl?: string;
  socialMedia?: Array<{
    platform: string;
    handle: string;
    url: string;
    followers?: number;
  }>;
  categoryId: string;
  status: boolean;
}

interface Category {
  categoryId: string;
  categoryName: string;
  status: boolean;
}

export default function BrandCreatorsPage() {
  const [activeCreatorType, setActiveCreatorType] = useState<
    "Recommended" | "Content Creator" | "Model" | "Live Streamer"
  >("Recommended");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const creatorTypes: Array<"Recommended" | "Content Creator" | "Model" | "Live Streamer"> = [
    "Recommended",
    "Content Creator",
    "Model",
    "Live Streamer",
  ];

  // ✅ Get user ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const authData = getAuthData();
        if (authData?.user?.userId) {
          setUserId(authData.user.userId);
        } else {
          setError("Please log in to view creators");
        }
      } catch (err) {
        console.error("Error getting auth data:", err);
        setError("Failed to retrieve user information");
      }
    };

    fetchUserId();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryApi.getAllCategories();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch creators
  useEffect(() => {
    const fetchCreators = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        let creatorsData: Creator[] = [];

        if (activeCreatorType === "Recommended") {
          const response = await brandApi.getRecommendedCreators(userId);
          // Ensure it's always an array
          creatorsData = Array.isArray(response) ? response : [];
        } else {
          try {
            const response = await creatorApi.getCreatorsByType(activeCreatorType);
            creatorsData = Array.isArray(response) ? response : [];
          } catch (typeError) {
            console.log(
              `No creators found for type ${activeCreatorType}, fetching all creators`
            );
            try {
              const allCreators = await creatorApi.getAllCreators();
              creatorsData = Array.isArray(allCreators)
                ? allCreators.filter((c: Creator) => c.type === activeCreatorType)
                : [];
            } catch (allError) {
              console.error("Error fetching all creators:", allError);
              creatorsData = [];
            }
          }
        }

        setCreators(creatorsData);
      } catch (error) {
        console.error("Error fetching creators:", error);
        if (error instanceof ApiError) {
          setError(`Failed to fetch creators: ${error.message}`);
        } else {
          setError("Failed to fetch creators. Please try again later.");
        }
        setCreators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [activeCreatorType, userId]);

  // Helper functions
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category?.categoryName || "Unknown";
  };

  const getPrimarySocialHandle = (creator: Creator) => {
    if (creator.socialMedia && creator.socialMedia.length > 0) {
      return `@${creator.socialMedia[0].handle}`;
    }
    return `@${creator.firstName.toLowerCase()}${creator.lastName.toLowerCase()}`;
  };

  const getFollowerCount = (creator: Creator) => {
    if (creator.socialMedia && creator.socialMedia.length > 0) {
      const totalFollowers = creator.socialMedia.reduce(
        (sum, social) => sum + (social.followers || 0),
        0
      );
      if (totalFollowers > 0) {
        if (totalFollowers >= 1000000) {
          return `${(totalFollowers / 1000000).toFixed(1)}M`;
        } else if (totalFollowers >= 1000) {
          return `${(totalFollowers / 1000).toFixed(0)}K`;
        }
        return totalFollowers.toString();
      }
    }
    return "N/A";
  };

  const getPlatforms = (creator: Creator) => {
    if (creator.socialMedia && creator.socialMedia.length > 0) {
      return creator.socialMedia.map((social) => social.platform);
    }
    return [];
  };

  // ✅ Protect against non-array creators
  const safeCreators = Array.isArray(creators) ? creators : [];

  const filteredCreators = safeCreators.filter((creator) => {
    const matchesCategory =
      selectedCategory === "All" ||
      getCategoryName(creator.categoryId) === selectedCategory;
    const matchesSearch =
      creator.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.nickName &&
        creator.nickName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (creator.bio &&
        creator.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
      getPrimarySocialHandle(creator)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryOptions = [
    "All",
    ...Array.from(new Set(categories.map((cat) => cat.categoryName))),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Input
              type="text"
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-4 pr-16 text-lg"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground hover:text-primary"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Filter menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 bg-background border-2 border-primary rounded-lg p-4"
                align="end"
              >
                {categoryOptions.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    className="cursor-pointer hover:bg-primary/20 text-foreground text-lg py-3 px-4 rounded-none border-none focus:bg-primary/20"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex justify-end mb-4">
            <span className="text-sm text-muted-foreground">
              Category:{" "}
              <span className="font-semibold text-primary">
                {selectedCategory}
              </span>
            </span>
          </div>

          {/* Creator Type Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {creatorTypes.map((type) => (
              <Button
                key={type}
                variant="outline"
                className={`rounded-full px-8 py-3 text-lg transition-colors ${
                  activeCreatorType === type
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                }`}
                onClick={() => setActiveCreatorType(type)}
              >
                {type === "Recommended" ? (
                  <Star className="h-5 w-5 mr-2" />
                ) : null}
                {type}
                {type === "Recommended" ? "" : "s"}
              </Button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-foreground">Loading creators...</span>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Creators Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredCreators.map((creator) => (
                <div
                  key={creator.creatorId}
                  className="bg-card rounded-lg p-6 space-y-4 flex flex-col"
                >
                  {/* Creator Header */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary">
                      <AvatarImage
                        src={creator.profilePicUrl || "/placeholder.svg"}
                        alt={`${creator.firstName} ${creator.lastName}`}
                      />
                      <AvatarFallback className="bg-primary text-white font-bold">
                        {creator.firstName[0]}
                        {creator.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {creator.nickName ||
                          `${creator.firstName} ${creator.lastName}`}
                      </h3>
                      <p className="text-primary font-medium">
                        {getPrimarySocialHandle(creator)}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-foreground">
                        {getFollowerCount(creator)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-foreground">N/A</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-foreground text-sm leading-relaxed">
                    {creator.bio || "No bio available"}
                  </p>

                  {/* Platforms */}
                  <div className="flex flex-wrap gap-2">
                    {getPlatforms(creator).length > 0 ? (
                      getPlatforms(creator).map((platform) => (
                        <span
                          key={platform}
                          className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                        >
                          {platform}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        No platforms listed
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <div className="text-xs text-muted-foreground">
                    Category: {getCategoryName(creator.categoryId)}
                  </div>

                  {/* View Profile */}
                  <Link
                    href={`/brand/creators/${creator.creatorId}`}
                    prefetch={false}
                    className="mt-4 block mt-auto"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      View Profile
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading &&
            !error &&
            filteredCreators.length === 0 &&
            safeCreators.length > 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No creators found matching your criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}

          {/* No Creators */}
          {!loading && !error && safeCreators.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {activeCreatorType === "Recommended"
                  ? "No recommendations available at this time."
                  : `No ${activeCreatorType.toLowerCase()}s are currently available.`}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
