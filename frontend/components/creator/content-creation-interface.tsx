"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import RichTextEditor from "@/components/tiptap";
import { Image as ImageIcon, Type, Grid3X3, Video, Code, Save, Eye, Heart, MessageCircle } from "lucide-react";

interface ContentCreationInterfaceProps {
  onSave: (data: {
    title: string
    content: string
    thumbnail?: string
    contentType: string
    views: string
    likes: string
    comments: string
    date: string
  }) => void
  onCancel: () => void
  initialData?: {
    title?: string
    content?: string
    thumbnail?: string
    views?: string
    likes?: string
    comments?: string
    date?: string
  }
}

export default function ContentCreationInterface({ onSave, onCancel, initialData }: ContentCreationInterfaceProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [views, setViews] = useState(initialData?.views || "");
  const [likes, setLikes] = useState(initialData?.likes || "");
  const [comments, setComments] = useState(initialData?.comments || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [selectedContentType, setSelectedContentType] = useState<string>("text");

  const contentTypes = [
    { id: "image", label: "Image", icon: ImageIcon, color: "#2196f3" },
    { id: "text", label: "Text", icon: Type, color: "#2196f3" },
    { id: "grid", label: "Grid", icon: Grid3X3, color: "#2196f3" },
    { id: "video", label: "Video", icon: Video, color: "#2196f3" },
    { id: "embed", label: "Embed", icon: Code, color: "#2196f3" },
  ];

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title for your work");
      return;
    }

    onSave({
      title,
      content,
      thumbnail,
      contentType: selectedContentType,
      views,
      likes,
      comments,
      date,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[90vh] bg-white rounded-xl shadow-2xl flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Creation Area */}
          <div className="flex-1 overflow-auto p-6">
            <Card className="h-full border-0 shadow-none">
              <CardContent className="p-6 h-full">
                {!selectedContentType ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-medium text-[#121212] mb-8">Start sharing your past work:</h2>
                    <div className="flex flex-wrap justify-center gap-8 mb-8">
                      {contentTypes.map((type) => {
                        const IconComponent = type.icon
                        return (
                          <button
                            key={type.id}
                            onClick={() => setSelectedContentType(type.id)}
                            className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-[#f5f5f5] transition-colors group"
                          >
                            <div
                              className="w-16 h-16 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: "#edf7ff" }}
                            >
                              <IconComponent className="w-8 h-8" style={{ color: type.color }} />
                            </div>
                            <span className="text-sm font-medium text-[#121212] group-hover:text-[#2196f3]">
                              {type.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col space-y-6">
                    {/* Title Input */}
                    <div>
                      <Input
                        placeholder="Enter your work title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-xl font-semibold border-0 border-b-2 border-[#c5c5c5] rounded-none px-0 focus:border-[#2196f3] bg-transparent"
                      />
                    </div>

                    {/* Thumbnail URL Input */}
                    <div>
                      <Input
                        placeholder="Thumbnail URL (optional)"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        className="border border-[#c5c5c5] focus:border-[#2196f3]"
                      />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="flex-1 min-h-0">
                      <RichTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Tell the story of your collaboration..."
                      />
                    </div>

                    {/* Metrics Inputs */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-[#121212]">Metrics (optional)</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Views (e.g., 2.1M)"
                          value={views}
                          onChange={(e) => setViews(e.target.value)}
                          className="border border-[#c5c5c5] focus:border-[#2196f3]"
                        />
                        <Input
                          placeholder="Likes (e.g., 45K)"
                          value={likes}
                          onChange={(e) => setLikes(e.target.value)}
                          className="border border-[#c5c5c5] focus:border-[#2196f3]"
                        />
                        <Input
                          placeholder="Comments (e.g., 1.2K)"
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          className="border border-[#c5c5c5] focus:border-[#2196f3]"
                        />
                        <Input
                          placeholder="Date (e.g., 2 weeks ago)"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="border border-[#c5c5c5] focus:border-[#2196f3]"
                        />
                      </div>
                    </div>

                    {/* Back to Content Types */}
                    <Button
                      variant="outline"
                      onClick={() => setSelectedContentType("")}
                      className="border-[#c5c5c5] text-[#8d8d8d] hover:bg-[#f5f5f5]"
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
        <div className="w-80 bg-white border-l border-[#c5c5c5] flex flex-col">
          {/* Add Content Section */}
          <div className="p-6 border-b border-[#c5c5c5]">
            <h3 className="text-sm font-medium text-[#8d8d8d] mb-4">Add Content</h3>
            <div className="grid grid-cols-2 gap-3">
              {contentTypes.slice(0, 4).map((type) => {
                const IconComponent = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedContentType(type.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                      selectedContentType === type.id
                        ? "border-[#2196f3] bg-[#edf7ff]"
                        : "border-[#c5c5c5] hover:bg-[#f5f5f5]"
                    }`}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: selectedContentType === type.id ? "#2196f3" : "#8d8d8d" }}
                    />
                    <span className="text-xs font-medium text-[#121212]">{type.label}</span>
                  </button>
                )
              })}
            </div>

            <button 
              onClick={() => setSelectedContentType("embed")}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors w-full mt-3 ${
                selectedContentType === "embed"
                  ? "border-[#2196f3] bg-[#edf7ff]"
                  : "border-[#c5c5c5] hover:bg-[#f5f5f5]"
              }`}
            >
              <Code className="w-5 h-5" style={{ color: selectedContentType === "embed" ? "#2196f3" : "#8d8d8d" }} />
              <span className="text-xs font-medium text-[#121212]">Embed</span>
            </button>
          </div>

          {/* Edit Project Section */}
          <div className="p-6 border-b border-[#c5c5c5]">
            <h3 className="text-sm font-medium text-[#8d8d8d] mb-4">Edit Project</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[#c5c5c5] hover:bg-[#f5f5f5] transition-colors">
                <Grid3X3 className="w-5 h-5 text-[#8d8d8d]" />
                <span className="text-xs font-medium text-[#121212]">Grid</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[#c5c5c5] hover:bg-[#f5f5f5] transition-colors">
                <Video className="w-5 h-5 text-[#8d8d8d]" />
                <span className="text-xs font-medium text-[#121212]">Video</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto p-6 space-y-3">
            <Button
              onClick={handleSave}
              className="w-full bg-[#2196f3] hover:bg-[#1976d2] text-white"
            >
              Publish
            </Button>
            <Button 
              variant="ghost" 
              onClick={onCancel} 
              className="w-full text-[#8d8d8d] hover:bg-[#f5f5f5]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}