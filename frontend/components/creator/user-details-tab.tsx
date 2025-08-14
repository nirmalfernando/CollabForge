"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Pencil,
  Plus,
  Monitor,
  Users,
  MapPin,
  Sparkles,
  Instagram,
  Youtube,
  Mail,
  Globe,
  PlusCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UserDetailsTabProps {
  creatorData: any;
  setCreatorData: React.Dispatch<React.SetStateAction<any>>;
  categories: any[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedCreatorType: string;
  setSelectedCreatorType: React.Dispatch<React.SetStateAction<string>>;
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
  PlusCircle,
};

export default function UserDetailsTab({
  creatorData,
  setCreatorData,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedCreatorType,
  setSelectedCreatorType,
}: UserDetailsTabProps) {
  const [isAddingDetail, setIsAddingDetail] = useState(false);
  const [newDetail, setNewDetail] = useState({ type: "Custom", value: "" });
  const [isPlatformDialogOpen, setIsPlatformDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [currentPlatform, setCurrentPlatform] = useState({
    icon: "Monitor",
    name: "",
    handle: "",
    link: "",
    followers: "",
  });

  const creatorTypeOptions = [
    { id: "Content Creator", name: "Content Creator" },
    { id: "Model", name: "Model" },
    { id: "Live Streamer", name: "Live Streamer" },
  ];

  const detailTypeMap = {
    Platform: { icon: "Monitor", placeholder: "e.g., TikTok" },
    Followers: { icon: "Users", placeholder: "e.g., 320,000 strong" },
    "Based in": { icon: "MapPin", placeholder: "e.g., Austin, TX" },
    Vibe: { icon: "Sparkles", placeholder: "e.g., Bill Nye meets highlighter" },
    Custom: { icon: "PlusCircle", placeholder: "Enter custom detail" },
  };

  const platformIconOptions = [
    { value: "Monitor", label: "TikTok" },
    { value: "Instagram", label: "Instagram" },
    { value: "Youtube", label: "YouTube" },
    { value: "Mail", label: "Email" },
    { value: "Globe", label: "Website" },
  ];

  const handleAddDetail = () => {
    if (newDetail.value.trim()) {
      const iconName = detailTypeMap[newDetail.type as keyof typeof detailTypeMap].icon;
      setCreatorData((prev: any) => ({
        ...prev,
        details: [...prev.details, { 
          type: newDetail.type, 
          value: newDetail.value, 
          icon: iconName 
        }],
      }));
      setNewDetail({ type: "Custom", value: "" });
      setIsAddingDetail(false);
      toast({
        title: "Detail Added",
        description: "Your new detail has been added successfully.",
      });
    }
  };

  const handleOpenAddPlatform = () => {
    setEditingIndex(-1);
    setCurrentPlatform({ icon: "Monitor", name: "", handle: "", link: "", followers: "" });
    setIsPlatformDialogOpen(true);
  };

  const handleOpenEditPlatform = (index: number) => {
    const platform = creatorData.platforms[index];
    setEditingIndex(index);
    setCurrentPlatform({
      icon: platform.icon,
      name: platform.name,
      handle: platform.handle,
      link: platform.link,
      followers: platform.followers.toString(),
    });
    setIsPlatformDialogOpen(true);
  };

  const handleSavePlatform = () => {
    if (currentPlatform.name.trim() && currentPlatform.handle.trim()) {
      const followersCount = parseInt(currentPlatform.followers) || 0;
      if (isNaN(followersCount) || followersCount < 0) {
        toast({
          title: "Invalid Followers Count",
          description: "Please enter a valid number for followers.",
          variant: "destructive",
        });
        return;
      }
      
      const updatedPlatform = {
        icon: currentPlatform.icon,
        name: currentPlatform.name,
        handle: currentPlatform.handle,
        link: currentPlatform.link || "#",
        followers: followersCount,
      };
      
      setCreatorData((prev: any) => ({
        ...prev,
        platforms: editingIndex === -1
          ? [...prev.platforms, updatedPlatform]
          : prev.platforms.map((p: any, i: number) => i === editingIndex ? updatedPlatform : p),
      }));
      setIsPlatformDialogOpen(false);
      toast({
        title: editingIndex === -1 ? "Platform Added" : "Platform Updated",
        description: `Your platform has been ${editingIndex === -1 ? "added" : "updated"} successfully.`,
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in the platform name and handle.",
        variant: "destructive",
      });
    }
  };

  const removeDetail = (index: number) => {
    setCreatorData((prev: any) => ({
      ...prev,
      details: prev.details.filter((_: any, i: number) => i !== index),
    }));
    toast({
      title: "Detail Removed",
      description: "The detail has been removed from your profile.",
    });
  };

  const removePlatform = (index: number) => {
    setCreatorData((prev: any) => ({
      ...prev,
      platforms: prev.platforms.filter((_: any, i: number) => i !== index),
    }));
    toast({
      title: "Platform Removed",
      description: "The platform has been removed from your profile.",
    });
  };

  return (
    <>
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Input
            type="text"
            value={creatorData.name}
            onChange={(e) =>
              setCreatorData((prev: any) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="First Name"
            className="flex-1 min-w-[100px] bg-muted border-none text-foreground text-4xl md:text-5xl font-bold p-2"
          />
          <span className="text-primary text-4xl md:text-5xl font-bold">&quot;</span>
          <Input
            type="text"
            value={creatorData.nickname}
            onChange={(e) =>
              setCreatorData((prev: any) => ({
                ...prev,
                nickname: e.target.value,
              }))
            }
            placeholder="Nickname"
            className="flex-1 min-w-[100px] bg-muted border-none text-primary text-4xl md:text-5xl font-bold p-2"
          />
          <span className="text-primary text-4xl md:text-5xl font-bold">&quot;</span>
          <Input
            type="text"
            value={creatorData.lastName}
            onChange={(e) =>
              setCreatorData((prev: any) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
            placeholder="Last Name"
            className="flex-1 min-w-[100px] bg-muted border-none text-foreground text-4xl md:text-5xl font-bold p-2"
          />
        </div>
        <Label htmlFor="bio" className="text-lg font-semibold mb-2 block">
          Bio
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={creatorData.bio}
          onChange={(e) =>
            setCreatorData((prev: any) => ({
              ...prev,
              bio: e.target.value,
            }))
          }
          className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 min-h-[120px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="category" className="text-lg font-semibold mb-2 block">
            Category/Niche *
          </Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3">
              <SelectValue placeholder="Select your category/niche" />
            </SelectTrigger>
            <SelectContent className="bg-card text-foreground max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <SelectItem key={category.categoryId} value={category.categoryId} className="hover:bg-primary/20">
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="creator-type" className="text-lg font-semibold mb-2 block">
            Creator Type *
          </Label>
          <Select value={selectedCreatorType} onValueChange={setSelectedCreatorType}>
            <SelectTrigger className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3">
              <SelectValue placeholder="Select your creator type" />
            </SelectTrigger>
            <SelectContent className="bg-card text-foreground max-h-60 overflow-y-auto">
              {creatorTypeOptions.map((type) => (
                <SelectItem key={type.id} value={type.id} className="hover:bg-primary/20">
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="contacts-toggle" className="text-lg font-semibold">
            Contacts
          </Label>
          <Switch id="contacts-toggle" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="display-activities-toggle" className="text-lg font-semibold">
            Display In App Activities
          </Label>
          <Switch id="display-activities-toggle" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="public-availability-toggle" className="text-lg font-semibold">
            Public Availability
          </Label>
          <Switch id="public-availability-toggle" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-toggle" className="text-lg font-semibold">
            Notifications
          </Label>
          <Switch id="notifications-toggle" defaultChecked />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Details:</h3>
        <ul className="space-y-2">
          {creatorData.details.map((detail: any, index: number) => {
            const IconComponent = iconComponents[detail.icon] || PlusCircle;
            return (
              <li key={index} className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">
                  {detail.type !== "Custom" ? `${detail.type}:` : ""}
                </span>
                <Input
                  type="text"
                  value={detail.value}
                  onChange={(e) => {
                    const updatedDetails = [...creatorData.details];
                    updatedDetails[index].value = e.target.value;
                    setCreatorData((prev: any) => ({
                      ...prev,
                      details: updatedDetails,
                    }));
                  }}
                  className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDetail(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>

        <Dialog open={isAddingDetail} onOpenChange={setIsAddingDetail}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="mt-4 text-primary hover:text-primary/80">
              <PlusCircle className="h-5 w-5 mr-2" /> Add New Detail
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
            <DialogHeader>
              <DialogTitle>Add New Detail</DialogTitle>
              <DialogDescription>Add a new detail to your profile. Choose a type and enter the text.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="detail-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newDetail.type}
                  onValueChange={(value) => setNewDetail((prev) => ({ ...prev, type: value, value: "" }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select detail type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(detailTypeMap).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="detail-value" className="text-right">
                  Text
                </Label>
                <Input
                  id="detail-value"
                  value={newDetail.value}
                  onChange={(e) => setNewDetail((prev) => ({ ...prev, value: e.target.value }))}
                  className="col-span-3"
                  placeholder={detailTypeMap[newDetail.type as keyof typeof detailTypeMap].placeholder}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingDetail(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleAddDetail}>
                Add Detail
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Official Platforms:</h3>
        <ul className="space-y-2">
          {creatorData.platforms.map((platform: any, index: number) => {
            const IconComponent = iconComponents[platform.icon] || Monitor;
            return (
              <li key={index} className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-primary" />
                <div
                  onClick={() => handleOpenEditPlatform(index)}
                  className="flex-1 bg-muted rounded-lg p-2 text-foreground cursor-pointer"
                >
                  {`${platform.name} - ${platform.handle} (${platform.followers} followers)`}
                </div>
                <Link href={platform.link} className="text-primary hover:underline" prefetch={false}>
                  View
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePlatform(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>

        <Dialog open={isPlatformDialogOpen} onOpenChange={setIsPlatformDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="mt-4 text-primary hover:text-primary/80" onClick={handleOpenAddPlatform}>
              <PlusCircle className="h-5 w-5 mr-2" /> Add New Platform
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
            <DialogHeader>
              <DialogTitle>{editingIndex === -1 ? "Add New Platform" : "Edit Platform"}</DialogTitle>
              <DialogDescription>
                {editingIndex === -1 ? "Add a new social media platform to your profile." : "Edit the social media platform details."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platform-icon" className="text-right">
                  Icon
                </Label>
                <Select
                  value={currentPlatform.icon}
                  onValueChange={(value) => setCurrentPlatform((prev) => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformIconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platform-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="platform-name"
                  value={currentPlatform.name}
                  onChange={(e) => setCurrentPlatform((prev) => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  placeholder="Platform name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platform-handle" className="text-right">
                  Handle
                </Label>
                <Input
                  id="platform-handle"
                  value={currentPlatform.handle}
                  onChange={(e) => setCurrentPlatform((prev) => ({ ...prev, handle: e.target.value }))}
                  className="col-span-3"
                  placeholder="Platform handle (e.g., @johndoe)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platform-followers" className="text-right">
                  Followers
                </Label>
                <Input
                  id="platform-followers"
                  type="number"
                  value={currentPlatform.followers}
                  onChange={(e) => setCurrentPlatform((prev) => ({ ...prev, followers: e.target.value }))}
                  className="col-span-3"
                  placeholder="Number of followers (e.g., 10000)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platform-link" className="text-right">
                  Link
                </Label>
                <Input
                  id="platform-link"
                  value={currentPlatform.link}
                  onChange={(e) => setCurrentPlatform((prev) => ({ ...prev, link: e.target.value }))}
                  className="col-span-3"
                  placeholder="Link to profile (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPlatformDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSavePlatform}>
                {editingIndex === -1 ? "Add Platform" : "Update Platform"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">
          What <span className="text-primary">I Do</span>
        </h2>
        {creatorData.whatIDo.map((item: string, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Input
              type="text"
              value={item}
              onChange={(e) => {
                const updated = [...creatorData.whatIDo];
                updated[index] = e.target.value;
                setCreatorData((prev: any) => ({
                  ...prev,
                  whatIDo: updated,
                }));
              }}
              placeholder="e.g., Create engaging short-form videos"
              className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCreatorData((prev: any) => ({
                  ...prev,
                  whatIDo: prev.whatIDo.filter((_: any, i: number) => i !== index),
                }))
              }
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          className="mt-2 text-primary hover:text-primary/80"
          onClick={() =>
            setCreatorData((prev: any) => ({
              ...prev,
              whatIDo: [...prev.whatIDo, ""],
            }))
          }
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Add Activity
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">
          My <span className="text-primary">People</span>
        </h2>
        {creatorData.myPeople.map((item: string, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Input
              type="text"
              value={item}
              onChange={(e) => {
                const updated = [...creatorData.myPeople];
                updated[index] = e.target.value;
                setCreatorData((prev: any) => ({
                  ...prev,
                  myPeople: updated,
                }));
              }}
              placeholder="e.g., My manager, John Doe"
              className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCreatorData((prev: any) => ({
                  ...prev,
                  myPeople: prev.myPeople.filter((_: any, i: number) => i !== index),
                }))
              }
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          className="mt-2 text-primary hover:text-primary/80"
          onClick={() =>
            setCreatorData((prev: any) => ({
              ...prev,
              myPeople: [...prev.myPeople, ""],
            }))
          }
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Add Person
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">
          My <span className="text-primary">Content</span>
        </h2>
        {creatorData.myContent.map((item: string, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Input
              type="text"
              value={item}
              onChange={(e) => {
                const updated = [...creatorData.myContent];
                updated[index] = e.target.value;
                setCreatorData((prev: any) => ({
                  ...prev,
                  myContent: updated,
                }));
              }}
              placeholder="e.g., Viral TikTok: 'Day in the life of a creator'"
              className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCreatorData((prev: any) => ({
                  ...prev,
                  myContent: prev.myContent.filter((_: any, i: number) => i !== index),
                }))
              }
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          className="mt-2 text-primary hover:text-primary/80"
          onClick={() =>
            setCreatorData((prev: any) => ({
              ...prev,
              myContent: [...prev.myContent, ""],
            }))
          }
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Add Content
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">
          I&apos;ve <span className="text-primary">Worked With</span>
        </h2>
        {creatorData.workedWith.map((item: string, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Input
              type="text"
              value={item}
              onChange={(e) => {
                const updated = [...creatorData.workedWith];
                updated[index] = e.target.value;
                setCreatorData((prev: any) => ({
                  ...prev,
                  workedWith: updated,
                }));
              }}
              placeholder="e.g., Brand X - Summer Campaign"
              className="flex-1 bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-2"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCreatorData((prev: any) => ({
                  ...prev,
                  workedWith: prev.workedWith.filter((_: any, i: number) => i !== index),
                }))
              }
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          className="mt-2 text-primary hover:text-primary/80"
          onClick={() =>
            setCreatorData((prev: any) => ({
              ...prev,
              workedWith: [...prev.workedWith, ""],
            }))
          }
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Add Collaboration
        </Button>
      </div>
    </>
  );
}