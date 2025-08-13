// creator/profile/new/page.tsx (updated)
"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Pencil, Plus } from "lucide-react";
import { creatorApi, categoryApi, getAuthData, imageUploadApi } from "@/lib/api";
import UserDetailsTab from "@/components/creator/user-details-tab";
import AccountsMetricsTab from "@/components/creator/accounts-metrics-tab";
import PastWorksTab from "@/components/creator/past-works-tab";
import { Label } from "@radix-ui/react-label";

const MAX_FILE_SIZE_MB = 10;

export default function CreatorNewProfilePage() {
  const router = useRouter();
  const [authData] = useState(getAuthData());
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);

  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [selectedProfilePicFile, setSelectedProfilePicFile] = useState<File | null>(null);
  const [profilePicPreviewUrl, setProfilePicPreviewUrl] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCreatorType, setSelectedCreatorType] = useState("");

  const [creatorData, setCreatorData] = useState({
    name: "",
    nickname: "",
    lastName: "",
    followerInfo: "",
    bio: "",
    details: [] as any[],
    platforms: [] as any[],
    whatIDo: [""],
    myPeople: [""],
    myContent: [""],
    workedWith: [""],
    bannerImageUrl: null as string | null,
    profilePicUrl: null as string | null,
  });

  // Load categories on mount
  React.useEffect(() => {
    if (!authData || authData.user.role !== "influencer") {
      router.push("/login");
      return;
    }

    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await categoryApi.getAllCategories();
        setCategories(categoriesData);
      } catch (error: any) {
        console.error("Failed to load categories:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load categories.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [router, authData]);

  // Cleanup preview URLs
  React.useEffect(() => {
    return () => {
      if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl);
      if (profilePicPreviewUrl) URL.revokeObjectURL(profilePicPreviewUrl);
    };
  }, [bannerPreviewUrl, profilePicPreviewUrl]);

  const handleCreateProfile = async () => {
    if (!authData) return;

    if (!creatorData.name.trim() || !creatorData.lastName.trim() || !selectedCategory || !selectedCreatorType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (First Name, Last Name, Category, Creator Type).",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const apiData = {
        userId: authData.user.userId,
        firstName: creatorData.name,
        lastName: creatorData.lastName,
        nickName: creatorData.nickname || undefined,
        bio: creatorData.bio || undefined,
        details: creatorData.details.map((detail: any) => ({
          label: detail.type,
          value: detail.value,
        })),
        socialMedia: creatorData.platforms.map((platform: any) => ({
          platform: platform.name,
          handle: platform.handle,
          url: platform.link,
          followers: 0,
        })),
        whatIDo: creatorData.whatIDo
          .filter((item: string) => item.trim())
          .map((item: string) => ({
            activity: item,
            experience: "",
          })),
        myPeople: creatorData.myPeople
          .filter((item: string) => item.trim())
          .map((item: string) => ({
            name: item,
            role: "",
            contact: "",
          })),
        myContent: creatorData.myContent
          .filter((item: string) => item.trim())
          .map((item: string) => ({
            title: item,
            url: "",
            views: 0,
          })),
        pastCollaborations: creatorData.workedWith
          .filter((item: string) => item.trim())
          .map((item: string) => ({
            brand: item,
            campaign: "",
            date: "",
          })),
        categoryId: selectedCategory,
        profilePicUrl: creatorData.profilePicUrl || undefined,
        backgroundImgUrl: creatorData.bannerImageUrl || undefined,
        type: selectedCreatorType as "Content Creator" | "Model" | "Live Streamer",
      };

      await creatorApi.createCreator(apiData);

      toast({
        title: "Profile Created",
        description: "Your creator profile has been created successfully!",
      });

      router.push("/creator/profile");
    } catch (error: any) {
      console.error("Failed to create profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBannerFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (e.g., JPG, PNG, GIF).",
          variant: "destructive",
        });
        setSelectedBannerFile(null);
        setBannerPreviewUrl(null);
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `Please select an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
          variant: "destructive",
        });
        setSelectedBannerFile(null);
        setBannerPreviewUrl(null);
        return;
      }
      setSelectedBannerFile(file);
      if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl);
      setBannerPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedBannerFile(null);
      setBannerPreviewUrl(null);
    }
  };

  const handleSaveBannerImage = async () => {
    if (selectedBannerFile) {
      try {
        setIsLoading(true);
        const uploadedImage = await imageUploadApi.uploadImage(selectedBannerFile);
        setCreatorData((prev) => ({
          ...prev,
          bannerImageUrl: uploadedImage.url,
        }));
        setIsEditingBanner(false);
        setSelectedBannerFile(null);
        setBannerPreviewUrl(null);
        toast({
          title: "Banner Uploaded",
          description: "Your profile banner has been uploaded.",
        });
      } catch (error: any) {
        console.error("Failed to upload banner image:", error);
        toast({
          title: "Upload Error",
          description: error.message || "Failed to upload banner image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Please select an image file for the banner.",
        variant: "destructive",
      });
    }
  };

  const handleProfilePicFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (e.g., JPG, PNG, GIF).",
          variant: "destructive",
        });
        setSelectedProfilePicFile(null);
        setProfilePicPreviewUrl(null);
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `Please select an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
          variant: "destructive",
        });
        setSelectedProfilePicFile(null);
        setProfilePicPreviewUrl(null);
        return;
      }
      setSelectedProfilePicFile(file);
      if (profilePicPreviewUrl) URL.revokeObjectURL(profilePicPreviewUrl);
      setProfilePicPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedProfilePicFile(null);
      setProfilePicPreviewUrl(null);
    }
  };

  const handleSaveProfilePic = async () => {
    if (selectedProfilePicFile) {
      try {
        setIsLoading(true);
        const uploadedImage = await imageUploadApi.uploadImage(selectedProfilePicFile);
        setCreatorData((prev) => ({
          ...prev,
          profilePicUrl: uploadedImage.url,
        }));
        setIsEditingProfilePic(false);
        setSelectedProfilePicFile(null);
        setProfilePicPreviewUrl(null);
        toast({
          title: "Profile Picture Uploaded",
          description: "Your profile picture has been uploaded.",
        });
      } catch (error: any) {
        console.error("Failed to upload profile picture:", error);
        toast({
          title: "Upload Error",
          description: error.message || "Failed to upload profile picture. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Please select an image file for the profile picture.",
        variant: "destructive",
      });
    }
  };

  if (!authData || authData.user.role !== "influencer") {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1">
        <section className="relative w-full h-64 md:h-80 lg:h-96 bg-[#f5f5f5]">
          <Image
            src={creatorData.bannerImageUrl || "/placeholder.svg?height=400&width=1200"}
            alt="Profile banner"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          <Dialog open={isEditingBanner} onOpenChange={setIsEditingBanner}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-primary rounded-full p-2 z-10 hover:bg-primary/80"
              >
                <Pencil className="h-6 w-6 text-white" />
                <span className="sr-only">Edit banner</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
              <DialogHeader>
                <DialogTitle>Upload Banner Image</DialogTitle>
                <DialogDescription>Upload an image for your profile banner.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Label htmlFor="banner-image-upload" className="text-right">
                  Upload Image
                </Label>
                <Input
                  id="banner-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileChange}
                />
                {bannerPreviewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <Image
                      src={bannerPreviewUrl}
                      alt="Banner preview"
                      width={400}
                      height={150}
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditingBanner(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveBannerImage}
                  disabled={!selectedBannerFile || isLoading}
                >
                  {isLoading ? "Uploading..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <div className="relative bg-background pt-8 pb-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative -mt-20 md:-mt-24 lg:-mt-28 flex-shrink-0">
                <Dialog open={isEditingProfilePic} onOpenChange={setIsEditingProfilePic}>
                  <DialogTrigger asChild>
                    <Avatar className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 border-4 border-primary shadow-lg cursor-pointer group relative overflow-hidden">
                      <AvatarImage
                        src={creatorData.profilePicUrl || "/placeholder.svg?height=200&width=200"}
                        alt="Profile picture"
                      />
                      <AvatarFallback className="bg-primary text-white flex items-center justify-center text-4xl font-bold">
                        {creatorData.name[0] || "U"}
                        {creatorData.lastName[0] || ""}
                      </AvatarFallback>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="h-12 w-12 text-white" />
                        <span className="sr-only">Upload profile picture</span>
                      </div>
                    </Avatar>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
                    <DialogHeader>
                      <DialogTitle>Upload Profile Picture</DialogTitle>
                      <DialogDescription>Upload an image for your profile picture.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Label htmlFor="profile-pic-upload" className="text-right">
                        Upload Image
                      </Label>
                      <Input
                        id="profile-pic-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicFileChange}
                      />
                      {profilePicPreviewUrl && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                          <Image
                            src={profilePicPreviewUrl}
                            alt="Profile picture preview"
                            width={150}
                            height={150}
                            objectFit="cover"
                            className="rounded-full mx-auto"
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingProfilePic(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveProfilePic}
                        disabled={!selectedProfilePicFile || isLoading}
                      >
                        {isLoading ? "Uploading..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex-1 w-full pt-4 md:pt-0">
                <div className="flex items-center justify-between w-full mb-4">
                  <Input
                    type="text"
                    value={creatorData.followerInfo}
                    onChange={(e) =>
                      setCreatorData((prev) => ({
                        ...prev,
                        followerInfo: e.target.value,
                      }))
                    }
                    placeholder="e.g., 320,000 Followers (TikTok)"
                    className="flex-1 max-w-xs bg-muted border-none text-foreground text-2xl font-semibold"
                  />
                  <Button
                    onClick={handleCreateProfile}
                    disabled={isLoading}
                    variant="outline"
                    className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                  >
                    {isLoading ? "Creating..." : "Create Profile"}
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="user-details" className="w-full mt-8">
              <TabsList className="grid w-full grid-cols-3 bg-muted text-foreground">
                <TabsTrigger
                  value="user-details"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  User Details
                </TabsTrigger>
                <TabsTrigger
                  value="accounts-metrics"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Accounts & Metrics
                </TabsTrigger>
                <TabsTrigger
                  value="past-works"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Past Works
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user-details" className="mt-6 space-y-8">
                <UserDetailsTab
                  creatorData={creatorData}
                  setCreatorData={setCreatorData}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedCreatorType={selectedCreatorType}
                  setSelectedCreatorType={setSelectedCreatorType}
                />
              </TabsContent>

              <TabsContent value="accounts-metrics" className="mt-6 space-y-8">
                <AccountsMetricsTab />
              </TabsContent>

              <TabsContent value="past-works" className="mt-6 space-y-8">
                <PastWorksTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}