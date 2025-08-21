"use client";

import { useState, useEffect } from "react";
import {
  X,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Tag,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { creatorWorkApi } from "@/lib/api";
import TipTapViewer from "./tiptap-viewer";

interface WorkDetailModalProps {
  workId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface WorkDetail {
  workId: string;
  creatorId: string;
  title: string;
  content: string;
  contentType: "image" | "text" | "grid" | "video" | "embed";
  thumbnailUrl: string | null;
  mediaUrls: string[];
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  publishedDate: string | null;
  collaborationBrand: string | null;
  campaignName: string | null;
  tags: string[];
  isVisible: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  creator: {
    creatorId: string;
    firstName: string;
    lastName: string;
    profilePicUrl: string | null;
  };
}

export default function WorkDetailModal({
  workId,
  isOpen,
  onClose,
}: WorkDetailModalProps) {
  const [work, setWork] = useState<WorkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && workId) {
      fetchWorkDetail();
    }
  }, [workId, isOpen]);

  const fetchWorkDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await creatorWorkApi.getWorkById(workId);
      setWork(response);
    } catch (err) {
      console.error("Error fetching work detail:", err);
      setError("Failed to load work details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (url: string) => {
    setImageError((prev) => ({ ...prev, [url]: true }));
  };

  const getOptimizedImageUrl = (
    url: string,
    width: number = 800,
    quality: number = 80
  ) => {
    if (!url) return "/placeholder.svg?height=400&width=600";

    // Check if it's a Cloudinary URL
    if (url.includes("cloudinary.com")) {
      // Insert transformation parameters
      return url.replace("/upload/", `/upload/w_${width},q_${quality},f_auto/`);
    }

    return url;
  };

  const getThumbnailUrl = (url: string) => {
    return getOptimizedImageUrl(url, 400, 70);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatMetrics = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={work?.creator.profilePicUrl || undefined}
                alt={`${work?.creator.firstName} ${work?.creator.lastName}`}
              />
              <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                {work?.creator.firstName?.[0]}
                {work?.creator.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {loading ? "Loading..." : work?.title || "Untitled Work"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                by {work?.creator.firstName} {work?.creator.lastName}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchWorkDetail} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : work ? (
            <div className="p-6">
              {/* Work Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {/* Featured Image/Media */}
                  {work.thumbnailUrl && (
                    <div className="mb-6">
                      <img
                        src={
                          imageError[work.thumbnailUrl]
                            ? "/placeholder.svg?height=400&width=600"
                            : getOptimizedImageUrl(work.thumbnailUrl, 800, 85)
                        }
                        alt={work.title}
                        className="w-full h-auto rounded-lg shadow-lg"
                        onError={() => handleImageError(work.thumbnailUrl!)}
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Media Gallery */}
                  {work.mediaUrls && work.mediaUrls.length > 1 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                        Media Gallery
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {work.mediaUrls.slice(1).map((url, index) => (
                          <img
                            key={index}
                            src={
                              imageError[url]
                                ? "/placeholder.svg?height=200&width=200"
                                : getThumbnailUrl(url)
                            }
                            alt={`Media ${index + 2}`}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onError={() => handleImageError(url)}
                            loading="lazy"
                            onClick={() => {
                              // Open in full size
                              window.open(
                                getOptimizedImageUrl(url, 1200, 90),
                                "_blank"
                              );
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rich Text Content */}
                  {work.content && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                        Description
                      </h3>
                      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardContent className="p-4">
                          <TipTapViewer content={work.content} />
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Metrics */}
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                        Performance
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatMetrics(work.metrics.views)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatMetrics(work.metrics.likes)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatMetrics(work.metrics.comments)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatMetrics(work.metrics.shares)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Details */}
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4 space-y-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Details
                      </h3>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="capitalize border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                        >
                          {work.contentType}
                        </Badge>
                      </div>

                      {work.publishedDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Published {formatDate(work.publishedDate)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Created {formatDate(work.createdAt)}
                        </span>
                      </div>

                      {work.collaborationBrand && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Brand:</span>{" "}
                          {work.collaborationBrand}
                        </div>
                      )}

                      {work.campaignName && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Campaign:</span>{" "}
                          {work.campaignName}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  {work.tags && work.tags.length > 0 && (
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                          <Tag className="h-4 w-4" />
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {work.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end bg-white dark:bg-gray-900">
          <Button
            onClick={onClose}
            variant="outline"
            className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
