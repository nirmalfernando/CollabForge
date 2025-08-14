"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  Twitch,
  Plus,
  ChevronRight,
  ChevronUp,
  BarChart3,
} from "lucide-react";

// Custom TikTok and Kick icons as SVG components
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.26z" />
  </svg>
);

const KickIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

export default function AccountsMetricsTab() {
  const [followerInfo, setFollowerInfo] = useState("320,000 Followers (TikTok)");

  const socialPlatforms = [
    { url: "https://img.icons8.com/?size=100&id=3tuajqTRBEqf&format=png&color=000000", name: "YouTube", color: "text-red-500" },
    { url: "https://img.icons8.com/?size=100&id=EToCOnh3V4mw&format=png&color=000000", name: "Facebook", color: "text-blue-600" },
    { url: "https://img.icons8.com/?size=100&id=7QPcOVZoGlmf&format=png&color=000000", name: "Instagram", color: "text-pink-500" },
    { url: "https://img.icons8.com/?size=100&id=VGXl1VAFp8Xs&format=png&color=000000", name: "TikTok", color: "text-black" },
    { url: "https://img.icons8.com/?size=100&id=8HtzWaaC5y60&format=png&color=000000", name: "Twitter", color: "text-blue-400" },
    { url: "https://img.icons8.com/?size=100&id=F0VhNaQGnmzq&format=png&color=000000", name: "Twitch", color: "text-purple-500" },
    { url: "https://play-lh.googleusercontent.com/vHm8BQc9VWIU9y6yFcbmTF2tw8kcj1qHleE_IJ_KLQ8E2hX9k0vGL39yUJWTzfgvDw", name: "Kick", color: "text-green-500" },
  ];

  const trafficSources = [
    { name: "Channel pages", percentage: 33.3, color: "bg-blue-500" },
    { name: "Other YouTube features", percentage: 27.8, color: "bg-purple-500" },
    { name: "Browse features", percentage: 12.7, color: "bg-green-500" },
    { name: "Direct or unknown", percentage: 11.1, color: "bg-yellow-500" },
    { name: "External", percentage: 5.6, color: "bg-red-500" },
    { name: "Others", percentage: 5.6, color: "bg-gray-500" },
  ];

  return (
    <div className="mt-6 space-y-8">
      {/* Add Accounts Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Add Accounts to Your Profile</h2>
        <p className="text-muted-foreground mb-6">
          This information will not be shared outside of discord without your permission, and is used in
          accordance with Collab Forge.
        </p>

        {/* Social Media Platform Boxes */}
        <div className="flex items-center gap-4 mb-6">
          {socialPlatforms.map((platform, index) => (
            <div
              key={index}
              className="w-16 h-16 bg-white rounded-lg flex items-center justify-center hover:bg-muted/80 cursor-pointer transition-colors border"
            >
              <img src={platform.url} alt={platform.name} className={`h-8 w-8 ${platform.color}`} />
            </div>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="w-16 h-16 bg-muted rounded-lg hover:bg-muted/80 border"
          >
            <ChevronRight className="h-6 w-6 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* YouTube Account Section */}
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Youtube className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">account_username</h3>
            <p className="text-muted-foreground">YouTube</p>
          </div>
          <div className="ml-auto">
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Video Performance Card */}
          <Card className="bg-card border">
            <CardContent className="p-6">
              <h4 className="text-foreground font-semibold mb-4">
                This video has had 18 views since it was published
              </h4>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">18</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                  <div className="text-xs text-green-500">+18 from last video</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">2.9</div>
                  <div className="text-xs text-muted-foreground">Watch time (hours)</div>
                  <div className="text-xs text-green-500">2.9 from last video</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground mb-1">-1</div>
                  <div className="text-xs text-muted-foreground">Subscribers</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-xs text-muted-foreground">This video</span>
                <div className="w-2 h-2 bg-muted-foreground rounded-full ml-4"></div>
                <span className="text-xs text-muted-foreground">Typical performance</span>
              </div>

              <div className="h-32 bg-muted rounded flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>

              <Button variant="link" className="text-primary p-0 h-auto">
                See more
              </Button>
            </CardContent>
          </Card>

          {/* Impressions Card */}
          <Card className="bg-card border">
            <CardContent className="p-6">
              <h4 className="text-foreground font-semibold mb-4">
                Impressions and how they led to watch time
              </h4>
              <p className="text-xs text-muted-foreground mb-6">Last 28 days (28 Oct-24 Nov)</p>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-foreground mb-2">341</div>
                <div className="text-sm text-muted-foreground mb-4">Impressions</div>
                <div className="text-xs text-green-500 mb-2">
                  +3.7% from YouTube recommending your content
                </div>
                <div className="text-xs text-muted-foreground mb-4">1.7% click-through rate</div>
                <div className="text-xs text-muted-foreground mb-2">Views from impressions</div>
                <div className="text-2xl font-bold text-foreground mb-4">6</div>
                <div className="text-xs text-muted-foreground mb-2">
                  Watch time from impressions (hours)
                </div>
                <div className="text-xl font-bold text-foreground">0.08</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Sources */}
        <Card className="bg-card border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-foreground font-semibold mb-2">How viewers find this video</h4>
                <p className="text-sm text-muted-foreground">Views - Since published</p>
              </div>
              <div className="w-24 h-24 relative">
                <div className="w-full h-full rounded-full border-8 border-purple-500 border-t-blue-500 border-r-green-500 border-b-yellow-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground">Traffic</div>
                    <div className="text-xs text-muted-foreground">Sources</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                    <span className="text-sm text-foreground">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={source.percentage} className="w-24 h-2" />
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {source.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="link" className="text-primary p-0 h-auto mt-4">
              See more
            </Button>
          </CardContent>
        </Card>

        {/* Add More Analytics Card */}
        <Card className="bg-card border border-dashed">
          <CardContent className="p-12 text-center">
            <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Add more analytics</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
