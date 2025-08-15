"use client"

import { useState } from "react"
import { X, Star } from "lucide-react"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (review: { rating: number; categories: string[]; text: string }) => void
}

export default function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [reviewText, setReviewText] = useState("")

  const categories = [
    "Delivered On time",
    "Great Quality",
    "Worth The Price",
    "Highly Recommended",
    "Amazing customer service",
  ]

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        rating,
        categories: selectedCategories,
        text: reviewText,
      })
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#121212] rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[#ffffff] text-4xl font-bold">Review</h2>
          <button onClick={onClose} className="text-[#f5f5f5] hover:text-[#ffffff] transition-colors">
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
                  star <= (hoveredRating || rating) ? "fill-[#2196f3] text-[#2196f3]" : "text-[#2196f3] fill-none"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
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
            placeholder="Your Review text"
            className="w-full h-32 bg-[#1c1c1c] text-[#ffffff] placeholder-[#f5f5f5]/60 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#2196f3] transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-transparent border-2 border-[#2196f3] text-[#2196f3] py-3 rounded-full font-medium hover:bg-[#2196f3] hover:text-[#ffffff] transition-all duration-200"
        >
          Add Review
        </button>
      </div>
    </div>
  )
}
