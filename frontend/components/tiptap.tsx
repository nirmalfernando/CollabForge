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
import { useState, useCallback, useRef } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Loader2,
  Code,
  Code2,
  Palette,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  RotateCcw,
  RotateCw,
} from "lucide-react";

// Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

const Button = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onImageUpload?: (urls: string[]) => void;
  placeholder?: string;
  height?: string;
}

// Simple image upload API simulation
const imageUploadApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    // This is a mock implementation - replace with your actual upload logic
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ url: reader.result as string });
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  },
};

export default function RichTextEditor({
  content = "",
  onChange,
  onImageUpload,
  height = "400px",
}: RichTextEditorProps) {
  // Dialog states
  const [imageUrl, setImageUrl] = useState("");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable default heading, blockquote, codeBlock to customize them
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
          class: "rounded-lg max-w-full h-auto my-4 cursor-pointer",
        },
        allowBase64: false,
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer hover:text-blue-700",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-gray-100 rounded-lg p-4 font-mono text-sm my-4",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-gray-50 font-semibold p-2 text-left border",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "p-2 border",
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none",
        style: `min-height: ${height};`,
      },
    },
  });

  // Image handling
  const addImageFromUrl = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageDialog(false);
    }
  }, [editor, imageUrl]);

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0 || !editor) return;

      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(
        (file) =>
          file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024
      );

      if (validFiles.length === 0) {
        alert("Please select valid image files (max 10MB each)");
        return;
      }

      setIsUploading(true);
      setUploadProgress(`Uploading ${validFiles.length} image(s)...`);

      try {
        const uploadPromises = validFiles.map(async (file) => {
          try {
            const result = await imageUploadApi.uploadImage(file);
            return result.url;
          } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            throw error;
          }
        });

        const uploadedUrls = await Promise.all(uploadPromises);

        // Insert images into editor
        uploadedUrls.forEach((url, index) => {
          editor.chain().focus().setImage({ src: url }).run();
          if (index < uploadedUrls.length - 1) {
            editor.chain().focus().createParagraphNear().run();
          }
        });

        onImageUpload?.(uploadedUrls);

        setUploadProgress(
          `Successfully uploaded ${uploadedUrls.length} image(s)`
        );
        setTimeout(() => setUploadProgress(""), 3000);
      } catch (error) {
        console.error("Error uploading images:", error);
        setUploadProgress("Upload failed. Please try again.");
        setTimeout(() => setUploadProgress(""), 3000);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [editor, onImageUpload]
  );

  // Link handling
  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    editor?.chain().focus().unsetLink().run();
  }, [editor]);

  // Color handling
  const setTextColor = useCallback(
    (color: string) => {
      editor?.chain().focus().setColor(color).run();
      setShowColorPicker(false);
    },
    [editor]
  );

  const setHighlight = useCallback(
    (color: string) => {
      editor?.chain().focus().setHighlight({ color }).run();
      setShowHighlightPicker(false);
    },
    [editor]
  );

  // Table handling
  const insertTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-100 rounded"></div>
      </div>
    );
  }

  const colors = [
    "#000000",
    "#374151",
    "#6B7280",
    "#9CA3AF",
    "#D1D5DB",
    "#EF4444",
    "#F97316",
    "#EAB308",
    "#22C55E",
    "#06B6D4",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F43F5E",
  ];

  const highlightColors = [
    "#FEF3C7",
    "#FED7AA",
    "#FBB6CE",
    "#DDD6FE",
    "#BFDBFE",
    "#A7F3D0",
    "#FECACA",
    "#E5E7EB",
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white flex flex-col">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50 flex flex-wrap gap-1 overflow-x-auto">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive("bold")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive("italic")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive("underline")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive("strike")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`h-8 w-8 p-0 flex items-center justify-center ${
              editor.isActive("heading", { level: 1 })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Heading 1"
          >
            <span className="text-xs font-bold">H1</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`h-8 w-8 p-0 flex items-center justify-center ${
              editor.isActive("heading", { level: 2 })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Heading 2"
          >
            <span className="text-xs font-bold">H2</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`h-8 w-8 p-0 flex items-center justify-center ${
              editor.isActive("heading", { level: 3 })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Heading 3"
          >
            <span className="text-xs font-bold">H3</span>
          </Button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="h-10 w-10 p-0 hover:bg-gray-200"
              title="Text Color"
            >
              <Type className="h-4 w-4" />
            </Button>
            {showColorPicker && (
              <div className="absolute top-full left-0 z-50 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="grid grid-cols-7 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    editor?.chain().focus().unsetColor().run();
                    setShowColorPicker(false);
                  }}
                  className="w-full mt-2 text-xs"
                >
                  Remove Color
                </Button>
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHighlightPicker(!showHighlightPicker)}
              className={`h-10 w-10 p-0 ${
                editor.isActive("highlight")
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            {showHighlightPicker && (
              <div className="absolute top-full left-0 z-50 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="grid grid-cols-4 gap-1">
                  {highlightColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setHighlight(color)}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    editor?.chain().focus().unsetHighlight().run();
                    setShowHighlightPicker(false);
                  }}
                  className="w-full mt-2 text-xs"
                >
                  Remove Highlight
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive({ textAlign: "left" })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive({ textAlign: "center" })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive({ textAlign: "right" })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive({ textAlign: "justify" })
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive("bulletList")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive("orderedList")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive("blockquote")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        {/* Special Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive("code")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive("codeBlock")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Code Block"
          >
            <Code2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive("subscript")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Subscript"
          >
            <SubscriptIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={`h-10 w-10 p-0 ${
              editor.isActive("superscript")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Superscript"
          >
            <SuperscriptIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Media & Tables */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerFileUpload}
            disabled={isUploading}
            className="h-10 w-10 p-0 hover:bg-gray-200 disabled:opacity-50"
            title="Upload Image"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageDialog(true)}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Insert Image URL"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkDialog(true)}
            className={`h-10 w-10 p-0 ${
              editor.isActive("link")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={insertTable}
            className={`h-10 w-10 p-0 ${
              editor.isActive("table")
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            title="Insert Table"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Utility */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-10 w-10 p-0 hover:bg-gray-200 disabled:opacity-50"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-10 w-10 p-0 hover:bg-gray-200 disabled:opacity-50"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="border-b border-gray-200 p-3 bg-blue-50 text-sm text-blue-600">
          {uploadProgress}
        </div>
      )}

      {/* Image URL Dialog */}
      {showImageDialog && (
        <div className="border-b border-gray-200 p-3 bg-blue-50 flex gap-2 items-center">
          <Input
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addImageFromUrl();
              }
            }}
          />
          <Button
            onClick={addImageFromUrl}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
            disabled={!imageUrl.trim()}
          >
            Add
          </Button>
          <Button
            onClick={() => setShowImageDialog(false)}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="border-b border-gray-200 p-3 bg-blue-50 flex gap-2 items-center">
          <Input
            placeholder="Enter link URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addLink();
              }
            }}
          />
          <Button
            onClick={addLink}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
            disabled={!linkUrl.trim()}
          >
            Add
          </Button>
          {editor.isActive("link") && (
            <Button onClick={removeLink} variant="outline" size="sm">
              Remove
            </Button>
          )}
          <Button
            onClick={() => setShowLinkDialog(false)}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-4" style={{ minHeight: height }}>
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none h-full"
        />
      </div>
    </div>
  );
}
