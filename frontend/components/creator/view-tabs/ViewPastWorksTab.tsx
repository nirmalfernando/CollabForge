"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Heart,
  MessageCircle,
  ExternalLink,
  Filter,
  Grid,
  List,
  Loader2,
} from "lucide-react";
import { creatorWorkApi } from "@/lib/api";
import WorkDetailModal from "@/components/creator/work-detail-modal";

interface ViewPastWorksTabProps {
  creatorData: {
    creatorId: string;
    firstName: string;
    lastName: string;
  };
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

export default function ViewPastWorksTab({
  creatorData,
}: ViewPastWorksTabProps) {
  const [creatorWorks, setCreatorWorks] = useState<CreatorWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [showWorkDetail, setShowWorkDetail] = useState(false);

  // Fetch creator works
  useEffect(() => {
    const fetchCreatorWorks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await creatorWorkApi.getWorksByCreatorId(
          creatorData.creatorId,
          {
            isVisible: true, // Only fetch visible works for brand view
            page: 1,
            limit: 50,
          }
        );

        if (response && response.works) {
          setCreatorWorks(response.works);
        } else {
          setCreatorWorks([]);
        }
      } catch (err) {
        setCreatorWorks([]);
      } finally {
        setLoading(false);
      }
    };

    if (creatorData?.creatorId) {
      fetchCreatorWorks();
    }
  }, [creatorData?.creatorId]);

  const getOptimizedThumbnail = (url: string) => {
    if (!url || url.includes("placeholder.svg")) return url;
    if (url.includes("cloudinary.com")) {
      return url.replace("/upload/", "/upload/w_300,h_200,c_fill,q_80,f_auto/");
    }
    return url;
  };

  const handleViewWork = (workId: string) => {
    setSelectedWorkId(workId);
    setShowWorkDetail(true);
  };

  const handleCloseWorkDetail = () => {
    setShowWorkDetail(false);
    setSelectedWorkId(null);
  };

  const formatMetric = (value: number | string) => {
    const num = typeof value === "string" ? parseInt(value) : value;
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {creatorData.firstName}'s{" "}
              <span className="text-primary">Works</span>
            </h2>
            <p className="text-muted-foreground">
              Explore their previous collaborations and content.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading works...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
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
            {creatorData.firstName}'s{" "}
            <span className="text-primary">Portfolio</span>
          </h2>
          <p className="text-muted-foreground">
            Browse their previous collaborations and creative work.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
           variant="outline"
            size="sm"
            >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {creatorWorks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Public Works Yet</h3>
          <p className="text-muted-foreground">
            This creator hasn't shared any public work yet.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatorWorks.map((work) => (
            <Card
              key={work.workId}
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden h-[400px] flex flex-col"
              onClick={() => handleViewWork(work.workId)}
            >
              <div className="relative flex-shrink-0 h-48">
                <Image
                  src={getOptimizedThumbnail(
                    work.thumbnailUrl || "/placeholder.svg"
                  )}
                  alt={work.title}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 left-2">
                  <Badge
                   variant="secondary"
                    className="capitalize">
                    {work.contentType}
                  </Badge>
                </div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button
                    size="sm"
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>

              <CardContent className="p-4 flex flex-col flex-grow h-[152px]">
                <div className="h-12 mb-2">
                  <h3 className="font-semibold text-white text-lg group-hover:text-primary transition-colors line-clamp-2 overflow-hidden">
                    {work.title}
                  </h3>
                </div>

                <div className="h-5 mb-2">
                  {work.collaborationBrand && (
                    <p className="text-primary text-sm truncate">
                      {work.collaborationBrand}
                      {work.campaignName && ` • ${work.campaignName}`}
                    </p>
                  )}
                </div>

                <div className="h-12 mb-3 flex-shrink-0">
                  <div
                    className="text-muted-foreground text-sm line-clamp-2 overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html:
                        work.content.length > 80
                          ? work.content.substring(0, 80) + "..."
                          : work.content,
                    }}
                  />
                </div>

                <div className="h-6 mb-3 flex-shrink-0">
                  {work.tags && work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {work.tags
                        .slice(0, 2)
                        .map((tag: string, tagIndex: number) => (
                          <Badge
                            key={tagIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      {work.tags.length > 2 && (
                        <span className="text-muted-foreground text-xs py-1">
                          +{work.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span className="text-xs">
                        {formatMetric(work.metrics.views)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span className="text-xs">
                        {formatMetric(work.metrics.likes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span className="text-xs">
                        {formatMetric(work.metrics.comments)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs">
                    {work.publishedDate
                      ? new Date(work.publishedDate).toLocaleDateString()
                      : new Date(work.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {creatorWorks.map((work) => (
            <Card
              key={work.workId}
              className="group cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => handleViewWork(work.workId)}
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-24 h-16 relative">
                    <Image
                      src={getOptimizedThumbnail(
                        work.thumbnailUrl || "/placeholder.svg"
                      )}
                      alt={work.title}
                      width={96}
                      height={64}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {work.title}
                      </h3>
                      <Badge 
                      variant="secondary" 
                      className="capitalize ml-2">
                        {work.contentType}
                      </Badge>
                    </div>

                    {work.collaborationBrand && (
                      <p className="text-primary text-sm mb-2">
                        {work.collaborationBrand}
                        {work.campaignName && ` • ${work.campaignName}`}
                      </p>
                    )}

                    <div
                      className="text-muted-foreground text-sm mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          work.content.length > 150
                            ? work.content.substring(0, 150) + "..."
                            : work.content,
                      }}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{formatMetric(work.metrics.views)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{formatMetric(work.metrics.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{formatMetric(work.metrics.comments)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {work.tags && work.tags.length > 0 && (
                          <div className="flex gap-1">
                            {work.tags
                              .slice(0, 3)
                              .map((tag: string, tagIndex: number) => (
                                <Badge
                                  key={tagIndex}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {work.publishedDate
                            ? new Date(work.publishedDate).toLocaleDateString()
                            : new Date(work.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Work Detail Modal */}
      {showWorkDetail && selectedWorkId && (
        <WorkDetailModal
          workId={selectedWorkId}
          isOpen={showWorkDetail}
          onClose={handleCloseWorkDetail}
        />
      )}
    </div>
  );
}
