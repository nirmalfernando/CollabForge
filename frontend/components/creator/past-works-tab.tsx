"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Eye, Heart, MessageCircle, X } from "lucide-react";
import { Label } from "@radix-ui/react-label";

interface PastWorksTabProps {
  creatorData: any;
  setCreatorData: React.Dispatch<React.SetStateAction<any>>;
}

export default function PastWorksTab({ creatorData, setCreatorData }: PastWorksTabProps) {
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [newWork, setNewWork] = useState({
    title: "",
    description: "",
    thumbnail: "",
    views: "",
    likes: "",
    comments: "",
    date: "",
  });

  // Sample past works data (replace with creatorData.pastCollaborations or API fetch in a real implementation)
  const pastWorks = creatorData.pastCollaborations?.map((collab: any, index: number) => ({
    id: index.toString(),
    title: collab.campaign || collab.brand || "Untitled Collaboration",
    description: collab.description || "No description provided.",
    thumbnail: collab.thumbnail || "/placeholder.svg?height=200&width=300",
    views: collab.views || "0",
    likes: collab.likes || "0",
    comments: collab.comments || "0",
    date: collab.date || "Unknown date",
  })) || [
    {
      id: "1",
      title: "Saturday Night Festival",
      description: "An incredible music festival collaboration in Colombo featuring 20+ artists...",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: "2.1M",
      likes: "45K",
      comments: "1.2K",
      date: "2 weeks ago",
    },
    {
      id: "2",
      title: "Tech Product Launch",
      description: "Behind-the-scenes content creation for a major tech product launch event...",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: "890K",
      likes: "23K",
      comments: "567",
      date: "1 month ago",
    },
    {
      id: "3",
      title: "Fashion Week Coverage",
      description: "Exclusive coverage of Colombo Fashion Week with interviews and runway highlights...",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: "1.5M",
      likes: "67K",
      comments: "2.1K",
      date: "2 months ago",
    },
  ];

  const handleAddWork = () => {
    if (newWork.title.trim() && newWork.description.trim()) {
      setCreatorData((prev: any) => ({
        ...prev,
        pastCollaborations: [
          ...prev.pastCollaborations,
          {
            brand: newWork.title,
            campaign: newWork.title,
            description: newWork.description,
            thumbnail: newWork.thumbnail || "/placeholder.svg?height=200&width=300",
            views: newWork.views || "0",
            likes: newWork.likes || "0",
            comments: newWork.comments || "0",
            date: newWork.date || new Date().toISOString().split("T")[0],
          },
        ],
      }));
      setNewWork({
        title: "",
        description: "",
        thumbnail: "",
        views: "",
        likes: "",
        comments: "",
        date: "",
      });
      setIsAddingWork(false);
      toast({
        title: "Collaboration Added",
        description: "Your new collaboration has been added successfully.",
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title and description.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveWork = (index: number) => {
    setCreatorData((prev: any) => ({
      ...prev,
      pastCollaborations: prev.pastCollaborations.filter((_: any, i: number) => i !== index),
    }));
    toast({
      title: "Collaboration Removed",
      description: "The collaboration has been removed from your profile.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Past <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground">Showcase your previous collaborations and content.</p>
        </div>
        <Dialog open={isAddingWork} onOpenChange={setIsAddingWork}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Collaboration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
            <DialogHeader>
              <DialogTitle>Add New Collaboration</DialogTitle>
              <DialogDescription>Enter details for your new collaboration.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="work-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="work-title"
                  value={newWork.title}
                  onChange={(e) => setNewWork((prev) => ({ ...prev, title: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., Saturday Night Festival"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="work-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="work-description"
                  value={newWork.description}
                  onChange={(e) => setNewWork((prev) => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                  placeholder="Describe the collaboration..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="work-thumbnail" className="text-right">
                  Thumbnail URL
                </Label>
                <Input
                  id="work-thumbnail"
                  value={newWork.thumbnail}
                  onChange={(e) => setNewWork((prev) => ({ ...prev, thumbnail: e.target.value }))}
                  className="col-span-3"
                  placeholder="Enter image URL (optional)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="work-views" className="text-right">
                  Views
                </Label>
                <Input
                  id="work-views"
                  value={newWork.views}
                  onChange={(e) => setNewWork((prev) => ({ ...prev, views: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., 2.1M (optional)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="work-likes" className="text-right">
                  Likes
                </Label>
                <Input
                  id="work-likes"
                  value={newWork.likes}
                  onChange={(e) => setNewWork((prev) => ({ ...prev, likes: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., 45K (optional)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="work-comments" className="text-right">
                  Comments
                </Label>
                <Input
                  id="work-comments"
                  value={newWork.comments}
                  onChange={(e) => setNewWork((prev) => ({ ...prev, comments: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., 1.2K (optional)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="work-date" className="text-right">
                  Date
                </Label>
                <Input
                  id="work-date"
                  value={newWork.date}
                  onChange={(e) => setNewWork((prev) => ({ ...prev, date: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., 2 weeks ago (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddingWork(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddWork}>
                Add Collaboration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastWorks.map((work: any) => (
          <div key={work.id} className="relative">
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden h-[360px] flex flex-col">
              <div className="relative flex-shrink-0">
                <Image
                  src={work.thumbnail}
                  alt={work.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              </div>
              <CardContent className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 overflow-hidden">
                  {work.title}
                </h3>
                <div className="text-muted-foreground text-sm mb-4 flex-grow overflow-y-auto max-h-[80px]">
                  {work.description}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{work.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{work.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{work.comments}</span>
                    </div>
                  </div>
                  <span>{work.date}</span>
                </div>
              </CardContent>
            </Card>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveWork(parseInt(work.id))}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Dialog open={isAddingWork} onOpenChange={setIsAddingWork}>
          <DialogTrigger asChild>
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-muted hover:border-primary h-[360px]">
              <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center">
                <Plus className="h-12 w-12 text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
                <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">
                  Add New Work
                </h3>
                <p className="text-muted-foreground text-sm">Share your latest collaboration or project</p>
              </CardContent>
            </Card>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  );
}