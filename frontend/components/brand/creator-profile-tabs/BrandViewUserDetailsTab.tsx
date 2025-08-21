"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  Users,
  MapPin,
  Sparkles,
  Instagram,
  Youtube,
  Mail,
  Globe,
  MessageCircle,
  Heart,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface BrandViewUserDetailsTabProps {
  creatorData: {
    creatorId: string;
    firstName: string;
    lastName: string;
    nickName?: string;
    bio?: string;
    type: "Content Creator" | "Model" | "Live Streamer";
    profilePicUrl?: string;
    backgroundImgUrl?: string;
    categoryId: string;
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
    status: boolean;
  };
  category?: { categoryName: string };
  onContact: () => void;
  onFollow: () => void;
  onHire: () => void;
}

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

// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  const platformLower = platform.toLowerCase();
  switch (platformLower) {
    case "instagram":
      return Instagram;
    case "youtube":
      return Youtube;
    case "twitter":
      return MessageCircle;
    case "facebook":
      return Users;
    case "linkedin":
      return Users;
    case "tiktok":
      return Monitor;
    default:
      return Globe;
  }
};

// Helper function to format follower count
const formatFollowerCount = (followers?: number) => {
  if (!followers) return "N/A";
  if (followers >= 1000000) {
    return `${(followers / 1000000).toFixed(1)}M`;
  } else if (followers >= 1000) {
    return `${(followers / 1000).toFixed(0)}K`;
  }
  return followers.toString();
};

export default function BrandViewUserDetailsTab({
  creatorData,
  category,
  onContact,
  onFollow,
  onHire,
}: BrandViewUserDetailsTabProps) {
  return (
    <div className="space-y-8">
      {/* Creator Name and Basic Info */}
      <Card className="bg-card border">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {creatorData.firstName}
              {creatorData.nickName && (
                <span className="text-primary mx-2">
                  "{creatorData.nickName}"
                </span>
              )}
              {creatorData.lastName}
            </h1>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {category && (
                <Badge variant="secondary" className="text-sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {category.categoryName}
                </Badge>
              )}
              <Badge variant="outline" className="text-sm">
                <Users className="h-4 w-4 mr-2" />
                {creatorData.type}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Button
              onClick={onContact}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <Button
              onClick={onFollow}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Follow
            </Button>
            <Button
              onClick={onHire}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Heart className="h-4 w-4 mr-2" />
              Hire Creator
            </Button>
          </div>

          {/* Bio */}
          {creatorData.bio && (
            <div className="text-center">
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line max-w-3xl mx-auto">
                {creatorData.bio}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Creator Details */}
      {creatorData.details && creatorData.details.length > 0 && (
        <Card className="bg-card border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              Creator Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creatorData.details.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <Monitor className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">
                      {detail.label}:
                    </span>
                    <span className="ml-2 text-muted-foreground">
                      {detail.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Media Platforms */}
      {creatorData.socialMedia && creatorData.socialMedia.length > 0 && (
        <Card className="bg-card border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              Social Media Presence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creatorData.socialMedia.map((platform, index) => {
                const IconComponent = getPlatformIcon(platform.platform);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-medium text-foreground">
                          {platform.platform}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          @{platform.handle}
                        </div>
                        {platform.followers && (
                          <div className="text-sm text-primary font-medium">
                            {formatFollowerCount(platform.followers)} followers
                          </div>
                        )}
                      </div>
                    </div>
                    <Link
                      href={platform.url || "#"}
                      className="text-primary hover:text-primary/80"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* What They Do */}
      {creatorData.whatIDo && creatorData.whatIDo.length > 0 && (
        <Card className="bg-card border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-4">
              What <span className="text-primary">They Do</span>
            </h3>
            <div className="space-y-3">
              {creatorData.whatIDo.map((item, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="font-medium text-foreground">
                    {item.activity}
                  </div>
                  {item.experience && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.experience}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Their Team */}
      {creatorData.myPeople && creatorData.myPeople.length > 0 && (
        <Card className="bg-card border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-4">
              Their <span className="text-primary">Team</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creatorData.myPeople.map((person, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="font-medium text-foreground">
                    {person.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {person.role}
                  </div>
                  {person.contact && (
                    <div className="text-sm text-primary mt-1">
                      {person.contact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Highlights */}
      {creatorData.myContent && creatorData.myContent.length > 0 && (
        <Card className="bg-card border">
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-4">
              Content <span className="text-primary">Highlights</span>
            </h3>
            <div className="space-y-3">
              {creatorData.myContent.map((content, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted rounded-lg flex items-center justify-between"
                >
                  <div>
                    {content.url ? (
                      <Link
                        href={content.url}
                        className="font-medium text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {content.title}
                      </Link>
                    ) : (
                      <div className="font-medium text-foreground">
                        {content.title}
                      </div>
                    )}
                    {content.views && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {content.views.toLocaleString()} views
                      </div>
                    )}
                  </div>
                  {content.url && (
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Collaborations */}
      {creatorData.pastCollaborations &&
        creatorData.pastCollaborations.length > 0 && (
          <Card className="bg-card border">
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold mb-4">
                Past <span className="text-primary">Collaborations</span>
              </h3>
              <div className="space-y-3">
                {creatorData.pastCollaborations.map((collab, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="font-medium text-foreground">
                      {collab.brand}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {collab.campaign}
                    </div>
                    {collab.date && (
                      <div className="text-sm text-primary mt-1">
                        {collab.date}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
