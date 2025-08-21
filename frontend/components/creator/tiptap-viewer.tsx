"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import CodeBlock from "@tiptap/extension-code-block";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { useState } from "react";

interface TipTapViewerProps {
  content: string;
  className?: string;
}

export default function TipTapViewer({
  content,
  className = "",
}: TipTapViewerProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Optimize Cloudinary images for better performance
  const getOptimizedImageUrl = (
    url: string,
    width: number = 800,
    quality: number = 80
  ) => {
    if (!url) return url;

    // Check if it's a Cloudinary URL
    if (url.includes("cloudinary.com")) {
      // Insert transformation parameters
      return url.replace(
        "/upload/",
        `/upload/w_${width},q_${quality},f_auto,c_limit/`
      );
    }

    return url;
  };

  // Create the class string properly without line breaks or extra spaces
  const createClassString = () => {
    const baseClasses = [
      "prose",
      "prose-sm",
      "sm:prose",
      "lg:prose-lg",
      "xl:prose-xl",
      "max-w-none",
      "focus:outline-none",
      "prose-headings:font-bold",
      "prose-headings:text-gray-900",
      "dark:prose-headings:text-white",
      "prose-p:text-gray-800",
      "dark:prose-p:text-gray-200",
      "prose-p:leading-relaxed",
      "prose-a:text-blue-600",
      "dark:prose-a:text-blue-400",
      "prose-a:no-underline",
      "hover:prose-a:underline",
      "prose-strong:text-gray-900",
      "dark:prose-strong:text-white",
      "prose-strong:font-semibold",
      "prose-em:text-gray-800",
      "dark:prose-em:text-gray-200",
      "prose-em:italic",
      "prose-code:text-blue-600",
      "dark:prose-code:text-blue-400",
      "prose-code:bg-gray-100",
      "dark:prose-code:bg-gray-800",
      "prose-code:px-1",
      "prose-code:py-0.5",
      "prose-code:rounded",
      "prose-pre:bg-gray-100",
      "dark:prose-pre:bg-gray-800",
      "prose-pre:border",
      "prose-pre:border-gray-200",
      "dark:prose-pre:border-gray-700",
      "prose-pre:rounded-lg",
      "prose-blockquote:border-l-4",
      "prose-blockquote:border-blue-500",
      "prose-blockquote:pl-4",
      "prose-blockquote:italic",
      "prose-blockquote:text-gray-700",
      "dark:prose-blockquote:text-gray-300",
      "prose-ul:text-gray-800",
      "dark:prose-ul:text-gray-200",
      "prose-ol:text-gray-800",
      "dark:prose-ol:text-gray-200",
      "prose-li:text-gray-800",
      "dark:prose-li:text-gray-200",
      "prose-li:my-1",
      "prose-table:border",
      "prose-table:border-gray-300",
      "dark:prose-table:border-gray-600",
      "prose-th:border",
      "prose-th:border-gray-300",
      "dark:prose-th:border-gray-600",
      "prose-th:bg-gray-50",
      "dark:prose-th:bg-gray-700",
      "prose-th:text-gray-900",
      "dark:prose-th:text-white",
      "prose-td:border",
      "prose-td:border-gray-300",
      "dark:prose-td:border-gray-600",
      "prose-td:text-gray-800",
      "dark:prose-td:text-gray-200",
    ];

    // Add custom className if provided
    if (className.trim()) {
      baseClasses.push(className.trim());
    }

    return baseClasses.join(" ");
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Strike,
      Subscript,
      Superscript,
      Image.configure({
        HTMLAttributes: {
          class:
            "rounded-lg max-w-full h-auto my-4 shadow-sm cursor-pointer transition-transform hover:scale-105",
        },
        allowBase64: true,
        inline: false,
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class:
            "text-blue-500 underline cursor-pointer hover:text-blue-700 transition-colors",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class:
            "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 font-mono text-sm my-4 border border-gray-200 dark:border-gray-700 overflow-x-auto",
        },
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          class:
            "border-collapse table-auto w-full my-4 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b border-gray-200 dark:border-gray-700",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class:
            "bg-gray-50 dark:bg-gray-700 font-semibold p-3 text-left border-r border-gray-200 dark:border-gray-600 last:border-r-0 text-gray-900 dark:text-white",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class:
            "p-3 border-r border-gray-200 dark:border-gray-600 last:border-r-0 text-gray-800 dark:text-gray-200",
        },
      }),
    ],
    content: content || "<p>No content available</p>",
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: createClassString(),
      },
      handleDOMEvents: {
        // Handle image optimization and error handling
        load: (view, event) => {
          const target = event.target as HTMLElement;
          if (target.tagName === "IMG") {
            const img = target as HTMLImageElement;
            const originalSrc = img.src;

            // Optimize Cloudinary images
            if (
              originalSrc &&
              originalSrc.includes("cloudinary.com") &&
              !originalSrc.includes("/w_")
            ) {
              img.src = getOptimizedImageUrl(originalSrc);
            }

            // Add click handler for full-size viewing
            img.addEventListener("click", () => {
              const fullSizeUrl = getOptimizedImageUrl(originalSrc, 1200, 90);
              window.open(fullSizeUrl, "_blank");
            });

            // Add error handling
            img.addEventListener("error", () => {
              img.src = "/placeholder.svg?height=300&width=400";
              img.alt = "Image failed to load";
            });
          }
          return false;
        },
      },
    },
  });

  // Custom styles for better content presentation with proper dark mode support
  const viewerStyles = `
    .ProseMirror {
      outline: none !important;
      padding: 1rem;
      line-height: 1.6;
      color: rgb(31 41 55); /* gray-800 */
    }
    
    .dark .ProseMirror {
      color: rgb(229 231 235); /* gray-200 */
    }
    
    .ProseMirror img {
      display: block;
      margin: 1rem auto;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }
    
    .ProseMirror img:hover {
      transform: scale(1.02);
    }
    
    .ProseMirror blockquote {
      background: rgba(59, 130, 246, 0.05);
      border-radius: 4px;
      padding: 1rem;
      margin: 1rem 0;
      color: rgb(55 65 81); /* gray-700 */
    }
    
    .dark .ProseMirror blockquote {
      background: rgba(59, 130, 246, 0.1);
      color: rgb(209 213 219); /* gray-300 */
    }
    
    .ProseMirror pre {
      background: rgb(243 244 246); /* gray-100 */
      border: 1px solid rgb(229 231 235); /* gray-200 */
      border-radius: 6px;
      padding: 1rem;
      overflow-x: auto;
      color: rgb(17 24 39); /* gray-900 */
    }
    
    .dark .ProseMirror pre {
      background: rgb(31 41 55); /* gray-800 */
      border-color: rgb(75 85 99); /* gray-600 */
      color: rgb(243 244 246); /* gray-100 */
    }
    
    .ProseMirror table {
      border-radius: 6px;
      overflow: hidden;
      margin: 1rem 0;
    }
    
    .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: rgb(17 24 39); /* gray-900 */
    }
    
    .dark .ProseMirror h1, 
    .dark .ProseMirror h2, 
    .dark .ProseMirror h3 {
      color: rgb(255 255 255); /* white */
    }
    
    .ProseMirror h1:first-child,
    .ProseMirror h2:first-child,
    .ProseMirror h3:first-child {
      margin-top: 0;
    }
    
    .ProseMirror p:empty {
      display: none;
    }
    
    .ProseMirror ul, .ProseMirror ol {
      padding-left: 1.5rem;
    }
    
    .ProseMirror li {
      margin: 0.25rem 0;
      color: rgb(31 41 55); /* gray-800 */
    }
    
    .dark .ProseMirror li {
      color: rgb(229 231 235); /* gray-200 */
    }
    
    .ProseMirror p {
      color: rgb(31 41 55); /* gray-800 */
    }
    
    .dark .ProseMirror p {
      color: rgb(229 231 235); /* gray-200 */
    }
    
    .ProseMirror strong {
      color: rgb(17 24 39); /* gray-900 */
    }
    
    .dark .ProseMirror strong {
      color: rgb(255 255 255); /* white */
    }
    
    .ProseMirror em {
      color: rgb(31 41 55); /* gray-800 */
    }
    
    .dark .ProseMirror em {
      color: rgb(229 231 235); /* gray-200 */
    }
  `;

  if (!editor) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{ __html: viewerStyles }} />
      <div className="prose-viewer bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
