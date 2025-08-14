"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useCallback } from "react"
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react"

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({
  content = "",
  onChange,
  placeholder = "Start writing your content...",
}: RichTextEditorProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkDialog, setShowLinkDialog] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#2196f3] underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
      setShowImageDialog(false)
    }
  }, [editor, imageUrl])

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setShowLinkDialog(false)
    }
  }, [editor, linkUrl])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-[#c5c5c5] rounded-lg overflow-hidden bg-white h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-[#c5c5c5] p-3 bg-[#f5f5f5] flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bold") ? "bg-[#2196f3] text-white" : "hover:bg-[#edf7ff]"}`}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("italic") ? "bg-[#2196f3] text-white" : "hover:bg-[#edf7ff]"}`}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`h-8 w-8 p-0 flex items-center justify-center ${editor.isActive("heading", { level: 1 }) ? "bg-[#2196f3] text-white" : "hover:bg-[#edf7ff]"}`}
        >
          <span className="text-xs font-bold">H1</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-8 w-8 p-0 flex items-center justify-center ${editor.isActive("heading", { level: 2 }) ? "bg-[#2196f3] text-white" : "hover:bg-[#edf7ff]"}`}
        >
          <span className="text-xs font-bold">H2</span>
        </Button>

        <div className="w-px h-6 bg-[#c5c5c5] mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: "left" }) ? "bg-[#2196f3] text-white" : "hover:bg-[#edf7ff]"}`}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: "center" }) ? "bg-[#2196f3] text-white" : "hover:bg-[#edf7ff]"}`}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: "right" }) ? "bg-[#2196f3] text-white" : "hover:bg-[#edf7ff]"}`}
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-[#c5c5c5] mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bulletList") ? "bg-[#2196f3] text-white" : "hover:bg-[#edf7ff]"}`}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("orderedList") ? "bg-[#2196f3] text-white" : "hover:bg-[#edf7ff]"}`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("blockquote") ? "bg-[#2196f3] text-white" : "hover:bg-[#edf7ff]"}`}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-[#c5c5c5] mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowImageDialog(true)}
          className="h-8 w-8 p-0 hover:bg-[#edf7ff]"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLinkDialog(true)}
          className="h-8 w-8 p-0 hover:bg-[#edf7ff]"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-[#c5c5c5] mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0 hover:bg-[#edf7ff] disabled:opacity-50"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0 hover:bg-[#edf7ff] disabled:opacity-50"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="border-b border-[#c5c5c5] p-3 bg-[#edf7ff] flex gap-2 items-center">
          <Input
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addImage} size="sm" className="bg-[#2196f3] hover:bg-[#1976d2]">
            Add
          </Button>
          <Button onClick={() => setShowImageDialog(false)} variant="outline" size="sm">
            Cancel
          </Button>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="border-b border-[#c5c5c5] p-3 bg-[#edf7ff] flex gap-2 items-center">
          <Input
            placeholder="Enter link URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addLink} size="sm" className="bg-[#2196f3] hover:bg-[#1976d2]">
            Add
          </Button>
          <Button onClick={() => setShowLinkDialog(false)} variant="outline" size="sm">
            Cancel
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-4">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none focus:outline-none h-full" 
        />
      </div>
    </div>
  )
}