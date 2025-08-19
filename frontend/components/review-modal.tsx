"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";

export interface ReviewData {
  rating: number;
  categories: string[];
  text: string;
}

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (review: ReviewData) => void;
  reviewType?: "creator_to_brand" | "brand_to_creator";
  title?: string;
  placeholder?: string;
  categories?: string[];
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  reviewType = "creator_to_brand",
  title,
  placeholder,
  categories,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");

  // Default categories based on review type
  const defaultCategories = {
    creator_to_brand: [
      "Delivered On Time",
      "Great Communication",
      "Fair Payment",
      "Highly Recommended",
      "Professional Experience",
    ],
    brand_to_creator: [
      "Delivered On Time",
      "Great Quality",
      "Worth The Price",
      "Highly Recommended",
      "Amazing Creative Work",
    ],
  };

  // Use provided categories or defaults based on review type
  const reviewCategories = categories || defaultCategories[reviewType];

  // Dynamic content based on review type
  const modalTitle =
    title ||
    (reviewType === "creator_to_brand" ? "Review Brand" : "Review Creator");
  const textPlaceholder =
    placeholder ||
    (reviewType === "creator_to_brand"
      ? "Share your experience working with this brand..."
      : "Share your experience working with this creator...");

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      // Could add validation here
      return;
    }

    if (onSubmit) {
      onSubmit({
        rating,
        categories: selectedCategories,
        text: reviewText,
      });
    }

    // Reset form
    setRating(0);
    setHoveredRating(0);
    setSelectedCategories([]);
    setReviewText("");

    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setRating(0);
    setHoveredRating(0);
    setSelectedCategories([]);
    setReviewText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#121212] rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[#ffffff] text-4xl font-bold">{modalTitle}</h2>
          <button
            onClick={handleClose}
            className="text-[#f5f5f5] hover:text-[#ffffff] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Star Rating */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-colors"
            >
              <Star
                size={32}
                className={`${
                  star <= (hoveredRating || rating)
                    ? "fill-[#2196f3] text-[#2196f3]"
                    : "text-[#2196f3] fill-none"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {reviewCategories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategories.includes(category)
                  ? "bg-[#2196f3] text-[#ffffff]"
                  : "bg-[#1c1c1c] text-[#f5f5f5] hover:bg-[#2196f3]/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Review Text Area */}
        <div className="mb-8">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={textPlaceholder}
            className="w-full h-32 bg-[#1c1c1c] text-[#ffffff] placeholder-[#f5f5f5]/60 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#2196f3] transition-all"
            maxLength={1000}
          />
          <div className="text-right mt-2">
            <span className="text-xs text-[#f5f5f5]/60">
              {reviewText.length}/1000
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`w-full py-3 rounded-full font-medium transition-all duration-200 ${
            rating === 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-transparent border-2 border-[#2196f3] text-[#2196f3] hover:bg-[#2196f3] hover:text-[#ffffff]"
          }`}
        >
          Add Review
        </button>
      </div>
    </div>
  );
}
