"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Eye,
  Heart,
  MessageCircle,
  X,
  Pencil,
  Loader2,
} from "lucide-react";
import ContentCreationInterface from "@/components/creator/content-creation-interface";
import { creatorWorkApi } from "@/lib/api";

interface PastWorksTabProps {
  creatorData: any;
  setCreatorData: React.Dispatch<React.SetStateAction<any>>;
}

interface CreatorWork {
  workId: string;
  title: string;
  content: string;
  contentType: string;
  thumbnailUrl: string | null;
  mediaUrls: string[];
  metrics: {
    views: number | string;
    likes: number | string;
    comments: number | string;
    shares: number | string;
  };
  publishedDate: string | null;
  collaborationBrand: string | null;
  campaignName: string | null;
  tags: string[];
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PastWorksTab({
  creatorData,
  setCreatorData,
}: PastWorksTabProps) {
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [creatorWorks, setCreatorWorks] = useState<CreatorWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch creator works from backend
  useEffect(() => {
    const fetchCreatorWorks = async () => {
      if (!creatorData?.creatorId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await creatorWorkApi.getWorksByCreatorId(
          creatorData.creatorId,
          {
            isVisible: true, // Only fetch visible works
            page: 1,
            limit: 50, // Adjust as needed
          }
        );

        if (response && response.works) {
          setCreatorWorks(response.works);
        } else {
          setCreatorWorks([]);
        }
      } catch (err) {
        console.error("Error fetching creator works:", err);
        setError("Failed to load works. Please try again.");
        setCreatorWorks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorWorks();
  }, [creatorData?.creatorId]);

  // Transform backend data to match the expected format
  const pastWorks = creatorWorks.map((work, index) => ({
    id: work.workId,
    title: work.title || "Untitled Work",
    description: work.content || "No description provided.",
    thumbnail: work.thumbnailUrl || "/placeholder.svg?height=200&width=300",
    views: work.metrics?.views?.toString() || "0",
    likes: work.metrics?.likes?.toString() || "0",
    comments: work.metrics?.comments?.toString() || "0",
    date: work.publishedDate
      ? new Date(work.publishedDate).toLocaleDateString()
      : new Date(work.createdAt).toLocaleDateString(),
    contentType: work.contentType,
    collaborationBrand: work.collaborationBrand,
    campaignName: work.campaignName,
    tags: work.tags,
    originalWork: work, // Keep reference to original work data
  }));

  const handleSaveWork = async (data: {
    title: string;
    content: string;
    thumbnail?: string;
    contentType: string;
    views: string;
    likes: string;
    comments: string;
    date: string;
    collaborationBrand?: string;
    campaignName?: string;
    tags?: string[];
  }) => {
    try {
      const workData = {
        creatorId: creatorData.creatorId,
        title: data.title,
        content: data.content,
        contentType: data.contentType as
          | "image"
          | "text"
          | "grid"
          | "video"
          | "embed",
        thumbnailUrl: data.thumbnail,
        metrics: {
          views: parseInt(data.views) || 0,
          likes: parseInt(data.likes) || 0,
          comments: parseInt(data.comments) || 0,
          shares: 0,
        },
        publishedDate: data.date || new Date().toISOString(),
        collaborationBrand: data.collaborationBrand,
        campaignName: data.campaignName,
        tags: data.tags || [],
        isVisible: true,
      };

      if (editingIndex !== null) {
        // Update existing work
        const workToEdit = creatorWorks[editingIndex];
        const updatedWork = await creatorWorkApi.updateWork(
          workToEdit.workId,
          workData
        );

        // Update local state
        const updatedWorks = [...creatorWorks];
        updatedWorks[editingIndex] = { ...updatedWork };
        setCreatorWorks(updatedWorks);

        toast({
          title: "Work Updated",
          description: "Your work has been updated successfully.",
        });
      } else {
        // Create new work
        const newWork = await creatorWorkApi.createWork(workData);
        setCreatorWorks((prev) => [newWork, ...prev]);

        toast({
          title: "Work Added",
          description: "Your new work has been added successfully.",
        });
      }

      setShowCreationModal(false);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving work:", error);
      toast({
        title: "Error",
        description: "Failed to save work. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveWork = async (index: number) => {
    try {
      const workToRemove = creatorWorks[index];
      await creatorWorkApi.deleteWork(workToRemove.workId);

      // Update local state
      setCreatorWorks((prev) => prev.filter((_, i) => i !== index));

      toast({
        title: "Work Removed",
        description: "The work has been removed from your profile.",
      });
    } catch (error) {
      console.error("Error removing work:", error);
      toast({
        title: "Error",
        description: "Failed to remove work. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditWork = (index: number) => {
    setEditingIndex(index);
    setShowCreationModal(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Past <span className="text-primary">Works</span>
            </h2>
            <p className="text-muted-foreground">
              Showcase your previous collaborations and content.
            </p>
          </div>
          <Button disabled>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[400px] animate-pulse">
              <div className="bg-gray-300 h-48 w-full"></div>
              <CardContent className="p-4">
                <div className="bg-gray-300 h-4 w-3/4 mb-2 rounded"></div>
                <div className="bg-gray-300 h-3 w-full mb-1 rounded"></div>
                <div className="bg-gray-300 h-3 w-2/3 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Past <span className="text-primary">Works</span>
            </h2>
            <p className="text-muted-foreground">
              Showcase your previous collaborations and content.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Past <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground">
            Showcase your previous collaborations and content.
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => {
            setEditingIndex(null);
            setShowCreationModal(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Work
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastWorks.map((work: any, index: number) => (
          <div key={work.id} className="relative">
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden h-[400px] flex flex-col">
              {/* Fixed Image Section */}
              <div className="relative flex-shrink-0 h-48">
                <Image
                  src={work.thumbnail}
                  alt={work.title}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src =
                      "/placeholder.svg?height=200&width=300";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />

                {/* Content type badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-full capitalize">
                    {work.contentType}
                  </span>
                </div>
              </div>

              {/* Fixed Content Section */}
              <CardContent className="p-4 flex flex-col flex-grow h-[152px]">
                {/* Title - Fixed height */}
                <div className="h-12 mb-2">
                  <h3 className="font-semibold text-white text-lg group-hover:text-primary transition-colors line-clamp-2 overflow-hidden">
                    {work.title}
                  </h3>
                </div>

                {/* Collaboration info - Fixed height */}
                <div className="h-5 mb-2">
                  {work.collaborationBrand && (
                    <p className="text-primary text-sm truncate">
                      {work.collaborationBrand}
                      {work.campaignName && ` • ${work.campaignName}`}
                    </p>
                  )}
                </div>

                {/* Description - Fixed height with scroll */}
                <div className="h-12 mb-3 flex-shrink-0">
                  <div
                    className="text-muted-foreground text-sm line-clamp-2 overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html:
                        work.description.length > 80
                          ? work.description.substring(0, 80) + "..."
                          : work.description,
                    }}
                  />
                </div>

                {/* Tags - Fixed height */}
                <div className="h-6 mb-3 flex-shrink-0">
                  {work.tags && work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {work.tags
                        .slice(0, 2)
                        .map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      {work.tags.length > 2 && (
                        <span className="text-muted-foreground text-xs py-1">
                          +{work.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Metrics and Date - Fixed at bottom */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span className="text-xs">{work.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span className="text-xs">{work.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span className="text-xs">{work.comments}</span>
                    </div>
                  </div>
                  <span className="text-xs">{work.date}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Action buttons - Positioned outside card */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditWork(index)}
                className="text-blue-500 hover:text-blue-700 bg-white/80 hover:bg-white/90 h-8 w-8 p-0"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveWork(index)}
                className="text-red-500 hover:text-red-700 bg-white/80 hover:bg-white/90 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add new work card - Same height as other cards */}
        <Card
          className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-muted hover:border-primary h-[400px]"
          onClick={() => {
            setEditingIndex(null);
            setShowCreationModal(true);
          }}
        >
          <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center">
            <Plus className="h-12 w-12 text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
            <h3 className="font-medium text-white text-lg mb-2 group-hover:text-primary transition-colors">
              Add New Work
            </h3>
            <p className="text-muted-foreground text-sm">
              Share your latest collaboration or project
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Show empty state if no works */}
      {pastWorks.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No works yet</h3>
          <p className="text-muted-foreground mb-4">
            Start showcasing your work by adding your first project.
          </p>
          <Button
            onClick={() => {
              setEditingIndex(null);
              setShowCreationModal(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Work
          </Button>
        </div>
      )}

      {showCreationModal && (
        <ContentCreationInterface
          onSave={handleSaveWork}
          onCancel={() => {
            setShowCreationModal(false);
            setEditingIndex(null);
          }}
          initialData={
            editingIndex !== null
              ? {
                  title: pastWorks[editingIndex].title,
                  content: pastWorks[editingIndex].description,
                  thumbnail: pastWorks[editingIndex].thumbnail,
                  views: pastWorks[editingIndex].views,
                  likes: pastWorks[editingIndex].likes,
                  comments: pastWorks[editingIndex].comments,
                  date:
                    pastWorks[editingIndex].originalWork.publishedDate ||
                    pastWorks[editingIndex].originalWork.createdAt,
                  contentType: pastWorks[editingIndex].contentType,
                  collaborationBrand:
                    pastWorks[editingIndex].collaborationBrand,
                  campaignName: pastWorks[editingIndex].campaignName,
                  tags: pastWorks[editingIndex].tags,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}