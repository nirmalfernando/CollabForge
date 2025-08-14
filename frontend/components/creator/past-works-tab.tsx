"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Plus, Eye, Heart, MessageCircle, X, Pencil } from "lucide-react";
import ContentCreationInterface from "@/components/creator/content-creation-interface";

interface PastWorksTabProps {
  creatorData: any;
  setCreatorData: React.Dispatch<React.SetStateAction<any>>;
}

export default function PastWorksTab({ creatorData, setCreatorData }: PastWorksTabProps) {
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  const handleSaveWork = (data: {
    title: string;
    content: string;
    thumbnail?: string;
    contentType: string;
    views: string;
    likes: string;
    comments: string;
    date: string;
  }) => {
    const newCollab = {
      brand: data.title,
      campaign: data.title,
      description: data.content,
      thumbnail: data.thumbnail || "/placeholder.svg?height=200&width=300",
      views: data.views || "0",
      likes: data.likes || "0",
      comments: data.comments || "0",
      date: data.date || new Date().toISOString().split("T")[0],
    };

    if (editingIndex !== null) {
      setCreatorData((prev: any) => {
        const updated = [...prev.pastCollaborations];
        updated[editingIndex] = newCollab;
        return { ...prev, pastCollaborations: updated };
      });
      toast({
        title: "Collaboration Updated",
        description: "Your collaboration has been updated successfully.",
      });
    } else {
      setCreatorData((prev: any) => ({
        ...prev,
        pastCollaborations: [...prev.pastCollaborations, newCollab],
      }));
      toast({
        title: "Collaboration Added",
        description: "Your new collaboration has been added successfully.",
      });
    }
    setShowCreationModal(false);
    setEditingIndex(null);
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
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Past <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground">Showcase your previous collaborations and content.</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => {
            setEditingIndex(null);
            setShowCreationModal(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Collaboration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastWorks.map((work: any, index: number) => (
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
                <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 overflow-hidden">
                  {work.title}
                </h3>
                <div
                  className="text-muted-foreground text-sm mb-4 flex-grow overflow-y-auto max-h-[80px]"
                  dangerouslySetInnerHTML={{ __html: work.description }}
                />
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
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingIndex(index);
                  setShowCreationModal(true);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveWork(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Card
          className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-muted hover:border-primary h-[360px]"
          onClick={() => {
            setEditingIndex(null);
            setShowCreationModal(true);
          }}
        >
          <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center">
            <Plus className="h-12 w-12 text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
            <h3 className="font-medium text-white text-lg mb-2 group-hover:text-primary transition-colors">
              Add New Work
            </h3>
            <p className="text-muted-foreground text-sm">Share your latest collaboration or project</p>
          </CardContent>
        </Card>
      </div>

      {showCreationModal && (
        <ContentCreationInterface
          onSave={handleSaveWork}
          onCancel={() => {
            setShowCreationModal(false);
            setEditingIndex(null);
          }}
          initialData={
            editingIndex !== null
              ? {
                  title: pastWorks[editingIndex].title,
                  content: pastWorks[editingIndex].description,
                  thumbnail: pastWorks[editingIndex].thumbnail,
                  views: pastWorks[editingIndex].views,
                  likes: pastWorks[editingIndex].likes,
                  comments: pastWorks[editingIndex].comments,
                  date: pastWorks[editingIndex].date,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}