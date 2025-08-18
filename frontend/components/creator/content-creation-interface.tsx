"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  ImageIcon,
  Type,
  Grid3X3,
  Video,
  Code,
  Save,
  Upload,
  X,
  Loader2,
  AlertCircle,
  Heart,
  Building,
  Tag,
} from "lucide-react";

interface ContentCreationInterfaceProps {
  onSave?: (workData: any) => void;
  onCancel: () => void;
  creatorId?: string;
  initialData?: {
    workId?: string;
    title?: string;
    content?: string;
    contentType?: string;
    thumbnailUrl?: string;
    metrics?: {
      views?: string;
      likes?: string;
      comments?: string;
      shares?: string;
    };
    publishedDate?: string;
    collaborationBrand?: string;
    campaignName?: string;
    tags?: string[];
    isVisible?: boolean;
  };
}

export default function ContentCreationInterface({
  onSave,
  onCancel,
  creatorId: propCreatorId,
  initialData,
}: ContentCreationInterfaceProps) {
  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnailUrl || ""
  );
  const [selectedContentType, setSelectedContentType] = useState<string>(
    initialData?.contentType || ""
  );
  const [isVisible, setIsVisible] = useState(initialData?.isVisible ?? true);

  // Metrics
  const [views, setViews] = useState(initialData?.metrics?.views || "");
  const [likes, setLikes] = useState(initialData?.metrics?.likes || "");
  const [comments, setComments] = useState(
    initialData?.metrics?.comments || ""
  );
  const [shares, setShares] = useState(initialData?.metrics?.shares || "");

  // Campaign info
  const [publishedDate, setPublishedDate] = useState(
    initialData?.publishedDate || ""
  );
  const [collaborationBrand, setCollaborationBrand] = useState(
    initialData?.collaborationBrand || ""
  );
  const [campaignName, setCampaignName] = useState(
    initialData?.campaignName || ""
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") || ""
  );

  // Upload state
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [error, setError] = useState<string>("");
  const [creatorId, setCreatorId] = useState<string>(propCreatorId || "");

  // File input refs
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const contentTypes = [
    { id: "image", label: "Image", icon: ImageIcon, color: "#2196f3" },
    { id: "text", label: "Text", icon: Type, color: "#2196f3" },
    { id: "grid", label: "Grid", icon: Grid3X3, color: "#2196f3" },
    { id: "video", label: "Video", icon: Video, color: "#2196f3" },
    { id: "embed", label: "Embed", icon: Code, color: "#2196f3" },
  ];

  // Get creator ID from localStorage following your pattern
  useEffect(() => {
    if (!creatorId) {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          // Following your pattern from the browse creators page
          if (userData?.creatorId) {
            setCreatorId(userData.creatorId);
          }
        }
      } catch (error) {
        console.error("Error getting creator ID from localStorage:", error);
      }
    }
  }, [creatorId]);

  // Cloudinary upload function using your existing API pattern
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary configuration is missing");
    }

    try {
      // Generate timestamp for signature
      const timestamp = Math.round(new Date().getTime() / 1000);

      // Create signature for secure upload
      const paramsToSign = `timestamp=${timestamp}`;
      const signature = await generateSignature(paramsToSign, apiSecret);

      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);

      // Upload directly to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Failed to upload image to Cloudinary"
        );
      }

      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  // Helper function to generate Cloudinary signature
  const generateSignature = async (
    paramsToSign: string,
    apiSecret: string
  ): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(paramsToSign + apiSecret);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    setIsUploadingThumbnail(true);
    setError("");

    try {
      const url = await uploadToCloudinary(file);
      setThumbnailUrl(url);
    } catch (error: any) {
      setError(error.message || "Failed to upload thumbnail");
    } finally {
      setIsUploadingThumbnail(false);
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = "";
      }
    }
  };

  const parseMetricValue = (value: string): number => {
    if (!value) return 0;

    const numStr = value.toLowerCase().replace(/[^\d.kmb]/g, "");
    const num = parseFloat(numStr);

    if (value.toLowerCase().includes("k")) {
      return Math.round(num * 1000);
    } else if (value.toLowerCase().includes("m")) {
      return Math.round(num * 1000000);
    } else if (value.toLowerCase().includes("b")) {
      return Math.round(num * 1000000000);
    }

    return Math.round(num);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title for your work");
      return;
    }

    if (!selectedContentType) {
      setError("Please select a content type");
      return;
    }

    if (!creatorId) {
      setError(
        "Creator ID is required. Please make sure you're logged in as a creator."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Parse tags
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Prepare metrics - your backend expects numbers
      const metrics = {
        views: parseMetricValue(views),
        likes: parseMetricValue(likes),
        comments: parseMetricValue(comments),
        shares: parseMetricValue(shares),
      };

      // Combine uploaded images with thumbnail for mediaUrls
      const allMediaUrls = [...uploadedImageUrls];
      if (thumbnailUrl && !allMediaUrls.includes(thumbnailUrl)) {
        allMediaUrls.push(thumbnailUrl);
      }

      // Prepare work data matching your backend structure
      const workData = {
        creatorId,
        title: title.trim(),
        content, // HTML content from TipTap
        contentType: selectedContentType as
          | "image"
          | "text"
          | "grid"
          | "video"
          | "embed",
        thumbnailUrl: thumbnailUrl || undefined,
        mediaUrls: allMediaUrls,
        metrics,
        publishedDate: publishedDate ? publishedDate : undefined,
        collaborationBrand: collaborationBrand.trim() || undefined,
        campaignName: campaignName.trim() || undefined,
        tags,
        isVisible,
      };

      console.log("Saving work data:", workData);

      // Make API call to your backend
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://collabforge.onrender.com/api";
      const token = localStorage.getItem("token");

      let response;
      if (initialData?.workId) {
        // Update existing work
        response = await fetch(
          `${API_BASE_URL}/creator-works/${initialData.workId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(workData),
          }
        );
      } else {
        // Create new work
        response = await fetch(`${API_BASE_URL}/creator-works`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(workData),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save work");
      }

      console.log("Work saved successfully:", result);

      // Call parent callback if provided
      if (onSave) {
        onSave(result);
      } else {
        // Default success handling
        alert("Work saved successfully!");
        onCancel(); // Close the interface
      }
    } catch (error: any) {
      console.error("Error saving work:", error);
      setError(error.message || "Failed to save work. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[90vh] bg-white rounded-xl shadow-2xl flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">
              {initialData?.workId ? "Edit Your Work" : "Share Your Past Work"}
            </h1>
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
          </div>

          {/* Content Creation Area */}
          <div className="flex-1 overflow-auto p-6">
            <Card className="h-full border-0 shadow-none bg-white">
              <CardContent className="p-0 h-full">
                {!selectedContentType ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-medium text-gray-900 mb-8">
                      Choose your content type:
                    </h2>
                    <div className="flex flex-wrap justify-center gap-8 mb-8">
                      {contentTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setSelectedContentType(type.id)}
                            className="flex flex-col items-center gap-3 p-6 rounded-lg hover:bg-blue-50 transition-colors group border border-gray-200"
                          >
                            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-50">
                              <IconComponent className="w-10 h-10 text-blue-500" />
                            </div>
                            <span className="text-base font-medium text-gray-900 group-hover:text-blue-500">
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col space-y-6">
                    {/* Title Input */}
                    <div>
                      <Label
                        htmlFor="title"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Work Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter your work title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg font-semibold border-gray-200 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
                        required
                      />
                    </div>

                    {/* Thumbnail Upload Section */}
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2 block">
                        Thumbnail Image
                      </Label>
                      <div className="space-y-3">
                        {thumbnailUrl && (
                          <div className="relative inline-block">
                            <img
                              src={thumbnailUrl}
                              alt="Thumbnail preview"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              onClick={() => setThumbnailUrl("")}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleThumbnailUpload(e.target.files)
                            }
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => thumbnailInputRef.current?.click()}
                            disabled={isUploadingThumbnail}
                            className="border-blue-500 bg-gray-50 text-blue-500 hover:bg-blue-50"
                          >
                            {isUploadingThumbnail ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Thumbnail
                              </>
                            )}
                          </Button>
                          <Input
                            placeholder="Or paste image URL"
                            value={thumbnailUrl}
                            onChange={(e) => setThumbnailUrl(e.target.value)}
                            className="flex-1 border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content Textarea */}
                    <div className="flex-1 min-h-0">
                      <Label className="text-sm font-medium text-gray-900 mb-2 block">
                        Content Description
                      </Label>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell the story of your work, collaboration, or creative process..."
                        className="min-h-[200px] bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    </div>

                    {/* Back to Content Types */}
                    <Button
                      variant="outline"
                      onClick={() => setSelectedContentType("")}
                      className="border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-50 w-fit"
                    >
                      ← Back to Content Types
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          {/* Performance Metrics Section */}
          <div className="p-6 border-b border-gray-200 overflow-auto">
            <h3 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label
                    htmlFor="views"
                    className="text-xs text-gray-600 mb-1 block"
                  >
                    Views
                  </Label>
                  <Input
                    id="views"
                    placeholder="e.g., 2.1M"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="text-sm bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="likes"
                    className="text-xs text-gray-600 mb-1 block"
                  >
                    Likes
                  </Label>
                  <Input
                    id="likes"
                    placeholder="e.g., 45K"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                    className="text-sm bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="comments"
                    className="text-xs text-gray-600 mb-1 block"
                  >
                    Comments
                  </Label>
                  <Input
                    id="comments"
                    placeholder="e.g., 1.2K"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="text-sm border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="shares"
                    className="text-xs text-gray-600 mb-1 block"
                  >
                    Shares
                  </Label>
                  <Input
                    id="shares"
                    placeholder="e.g., 500"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    className="text-sm bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Collaboration Details */}
          <div className="p-6 border-b border-gray-200 overflow-auto">
            <h3 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Collaboration Details
            </h3>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="brand"
                  className="text-xs text-gray-600 mb-1 block"
                >
                  Brand/Company
                </Label>
                <Input
                  id="brand"
                  placeholder="Brand you collaborated with"
                  value={collaborationBrand}
                  onChange={(e) => setCollaborationBrand(e.target.value)}
                  className="text-sm bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="campaign"
                  className="text-xs text-gray-600 mb-1 block"
                >
                  Campaign Name
                </Label>
                <Input
                  id="campaign"
                  placeholder="Campaign or project name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="text-sm bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="date"
                  className="text-xs text-gray-600 mb-1 block"
                >
                  Published Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.target.value)}
                  className="text-sm bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tags and Visibility */}
          <div className="p-6 border-b border-gray-200 overflow-auto">
            <h3 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags & Visibility
            </h3>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="tags"
                  className="text-xs text-gray-600 mb-1 block"
                >
                  Tags (comma separated)
                </Label>
                <Textarea
                  id="tags"
                  placeholder="fashion, lifestyle, brand collaboration"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="text-sm min-h-[60px] bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="visibility" className="text-sm text-gray-900">
                  Visible to public
                </Label>
                <Switch
                  id="visibility"
                  checked={isVisible}
                  onCheckedChange={setIsVisible}
                  className="data-[state=checked]:to-blue-400 data-[state=unchecked]:bg-gray-300"
                  thumbClassName="bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto p-6 space-y-3">
            <Button
              onClick={handleSave}
              disabled={isSubmitting || !title.trim() || !selectedContentType}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {initialData?.workId ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {initialData?.workId ? "Update Work" : "Publish Work"}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
