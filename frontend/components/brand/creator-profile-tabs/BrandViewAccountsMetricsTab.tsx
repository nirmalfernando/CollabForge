"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Youtube,
  Instagram,
  Twitter,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share,
  ExternalLink,
} from "lucide-react";

interface BrandViewAccountsMetricsTabProps {
  creatorData: {
    socialMedia?: Array<{
      platform: string;
      handle: string;
      url: string;
      followers?: number;
    }>;
  };
}

export default function BrandViewAccountsMetricsTab({
  creatorData,
}: BrandViewAccountsMetricsTabProps) {
  // Mock analytics data - in real app, this would come from API or creator's connected accounts
  const analyticsData = {
    totalFollowers:
      creatorData.socialMedia?.reduce(
        (sum, platform) => sum + (platform.followers || 0),
        0
      ) || 0,
    engagementRate: 4.2,
    avgViews: 125000,
    topPlatform: creatorData.socialMedia?.[0]?.platform || "Unknown",
    monthlyGrowth: 8.5,
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground mb-1">
              {formatNumber(analyticsData.totalFollowers)}
            </div>
            <div className="text-sm text-muted-foreground">Total Followers</div>
          </CardContent>
        </Card>

        <Card className="bg-card border">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground mb-1">
              {analyticsData.engagementRate}%
            </div>
            <div className="text-sm text-muted-foreground">Engagement Rate</div>
          </CardContent>
        </Card>

        <Card className="bg-card border">
          <CardContent className="p-6 text-center">
            <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground mb-1">
              {formatNumber(analyticsData.avgViews)}
            </div>
            <div className="text-sm text-muted-foreground">Avg. Views</div>
          </CardContent>
        </Card>

        <Card className="bg-card border">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground mb-1">
              +{analyticsData.monthlyGrowth}%
            </div>
            <div className="text-sm text-muted-foreground">Monthly Growth</div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card className="bg-card border">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            Platform Performance
          </h3>
          <div className="space-y-4">
            {creatorData.socialMedia?.map((platform, index) => {
              const percentage =
                ((platform.followers || 0) / analyticsData.totalFollowers) *
                100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-foreground">
                        {platform.platform}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{platform.handle}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">
                        {formatNumber(platform.followers || 0)} followers
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-foreground">
              Engagement Overview
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-foreground">Average Likes</span>
                </div>
                <span className="font-medium text-foreground">5.2K</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-foreground">
                    Average Comments
                  </span>
                </div>
                <span className="font-medium text-foreground">312</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-foreground">
                    Average Shares
                  </span>
                </div>
                <span className="font-medium text-foreground">89</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-foreground">
              Audience Demographics
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">Age 18-24</span>
                  <span className="text-muted-foreground">35%</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">Age 25-34</span>
                  <span className="text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">Age 35+</span>
                  <span className="text-muted-foreground">20%</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="bg-card border">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 text-foreground">
            Growth Trend (Last 6 Months)
          </h4>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Performance analytics visualization</p>
              <p className="text-sm">Available to premium brand accounts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Analytics Access */}
      <Card className="bg-card border border-primary/50">
        <CardContent className="p-6 text-center">
          <h4 className="font-semibold mb-2 text-foreground">
            Want More Detailed Analytics?
          </h4>
          <p className="text-muted-foreground mb-4">
            Request access to detailed performance metrics and audience insights
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Request Analytics Access
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
