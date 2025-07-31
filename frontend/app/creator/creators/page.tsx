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
import { Menu, Users, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
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
  socialMedia?: Array<{
    platform: string;
    handle: string;
    url: string;
    followers?: number;
  }>;
  // Add other fields as needed
}

interface Category {
  categoryId: string;
  categoryName: string;
  // Add other category fields as needed
}

export default function CreatorBrowseCreatorsPage() {
  const [activeCreatorType, setActiveCreatorType] = useState("Content Creator");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const creatorTypes = ["Content Creator", "Model", "Live Streamer"];

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAllCategories();
        setCategories(response || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch creators when component mounts or filters change
  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (selectedCategory === "All") {
          // Fetch all creators, then filter by type
          response = await creatorApi.getAllCreators();
        } else {
          // Find the selected category ID
          const selectedCategoryObj = categories.find(
            (cat) => cat.categoryName === selectedCategory
          );
          if (selectedCategoryObj) {
            response = await creatorApi.getCreatorsByCategory(
              selectedCategoryObj.categoryId
            );
          } else {
            response = await creatorApi.getAllCreators();
          }
        }

        setCreators(response || []);
      } catch (error) {
        console.error("Error fetching creators:", error);
        setError("Failed to load creators");
        setCreators([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if categories are loaded (to get category IDs)
    if (categories.length > 0 || selectedCategory === "All") {
      fetchCreators();
    }
  }, [selectedCategory, categories]);

  // Get category names for dropdown
  const categoryNames = ["All", ...categories.map((cat) => cat.categoryName)];

  // Filter creators based on active type and search query
  const filteredCreators = creators.filter((creator) => {
    const matchesType = creator.type === activeCreatorType;
    const matchesSearch =
      creator.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.nickName &&
        creator.nickName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (creator.bio &&
        creator.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Helper function to get creator's display name
  const getCreatorDisplayName = (creator: Creator) => {
    return `${creator.firstName} ${creator.lastName}`;
  };

  // Helper function to get creator's handle
  const getCreatorHandle = (creator: Creator) => {
    if (creator.nickName) return `@${creator.nickName}`;
    if (creator.socialMedia && creator.socialMedia.length > 0) {
      return creator.socialMedia[0].handle;
    }
    return `@${creator.firstName.toLowerCase()}`;
  };

  // Helper function to get follower count
  const getFollowerCount = (creator: Creator) => {
    if (creator.socialMedia && creator.socialMedia.length > 0) {
      const totalFollowers = creator.socialMedia.reduce((sum, social) => {
        return sum + (social.followers || 0);
      }, 0);
      if (totalFollowers > 1000000) {
        return `${(totalFollowers / 1000000).toFixed(1)}M`;
      } else if (totalFollowers > 1000) {
        return `${(totalFollowers / 1000).toFixed(0)}K`;
      }
      return totalFollowers.toString();
    }
    return "N/A";
  };

  // Helper function to get platforms
  const getPlatforms = (creator: Creator) => {
    if (creator.socialMedia && creator.socialMedia.length > 0) {
      return creator.socialMedia.map((social) => social.platform);
    }
    return [];
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />
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
                className="w-48 bg-card border-2 border-primary rounded-lg p-4"
                align="end"
              >
                {categoryNames.map((category) => (
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
                {type}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-foreground">Loading creators...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Try Again
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
                        alt={getCreatorDisplayName(creator)}
                      />
                      <AvatarFallback className="bg-primary text-white font-bold">
                        {creator.firstName[0]}
                        {creator.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {getCreatorDisplayName(creator)}
                      </h3>
                      <p className="text-primary font-medium">
                        {getCreatorHandle(creator)}
                      </p>
                    </div>
                  </div>

                  {/* Creator Stats */}
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

                  {/* Creator Description */}
                  <p className="text-foreground text-sm leading-relaxed">
                    {creator.bio || "No bio available"}
                  </p>

                  {/* Platforms */}
                  <div className="flex flex-wrap gap-2">
                    {getPlatforms(creator).map((platform, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>

                  {/* View Profile Button */}
                  <Link
                    href={`/creator/creators/${creator.creatorId}`}
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

          {/* No Results Message */}
          {!loading && !error && filteredCreators.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No creators found matching your criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
