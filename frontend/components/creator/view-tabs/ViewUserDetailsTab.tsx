"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

// Define interfaces for type safety
interface ViewUserDetailsTabProps {
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

export default function ViewUserDetailsTab({
  creatorData,
  category,
  onContact,
  onFollow,
  onHire,
}: ViewUserDetailsTabProps) {
  // Prepare details array with icons
  const creatorDetails = creatorData.details?.map((detail) => ({
    icon: MapPin, // Default icon, as template uses MapPin for details
    text: `${detail.label}: ${detail.value}`,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Creator Name and Basic Info */}
      <h1 className="text-4xl md:text-5xl font-bold">
        {creatorData.firstName}
        {creatorData.nickName && (
          <span className="text-primary"> &quot;{creatorData.nickName}&quot;</span>
        )}{" "}
        {creatorData.lastName}
      </h1>

      {creatorData.bio && (
        <p className="text-lg leading-relaxed whitespace-pre-line">
          {creatorData.bio}
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
          <span>Type: {creatorData.type}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={onContact}
          variant="outline"
          className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact
        </Button>
        <Button
          onClick={onFollow}
          variant="outline"
          className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </Button>
        <Button
          onClick={onHire}
          className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Heart className="h-4 w-4 mr-2" />
          Hire Creator
        </Button>
      </div>

      {/* Creator Details */}
      {creatorDetails.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Details:</h3>
          <div className="space-y-2">
            {creatorDetails.map((detail, index) => (
              <div key={index} className="flex items-center gap-3">
                <detail.icon className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-lg">{detail.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Media Platforms */}
      {creatorData.socialMedia && creatorData.socialMedia.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Official Platforms:</h3>
          <ul className="space-y-2 list-inside">
            {creatorData.socialMedia.map((platform, index) => {
              const IconComponent = getPlatformIcon(platform.platform);
              return (
                <li key={index} className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                  <Link
                    href={platform.url || "#"}
                    className="text-lg hover:underline"
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

      {/* What They Do */}
      {creatorData.whatIDo && creatorData.whatIDo.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            What <span className="text-primary">They Do</span>
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            {creatorData.whatIDo.map((item, index) => (
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

      {/* Their Team */}
      {creatorData.myPeople && creatorData.myPeople.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            Their <span className="text-primary">Team</span>
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            {creatorData.myPeople.map((item, index) => (
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

      {/* Content Highlights */}
      {creatorData.myContent && creatorData.myContent.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            Content <span className="text-primary">Highlights</span>
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            {creatorData.myContent.map((item, index) => (
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

      {/* Past Collaborations */}
      {creatorData.pastCollaborations && creatorData.pastCollaborations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            They&apos;ve <span className="text-primary">Worked With</span>
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            {creatorData.pastCollaborations.map((item, index) => (
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
    </div>
  );
}