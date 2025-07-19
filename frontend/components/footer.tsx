import Link from "next/link"
import { MessageSquare, Twitter, Youtube, Facebook, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-6 md:px-8 py-6 bg-collab-dark text-white border-t border-collab-dark-border">
      <Link href="/" className="text-2xl font-bold text-collab-primary hover:text-collab-secondary transition-colors">
        CollabForge
      </Link>
      <div className="flex items-center space-x-4">
        <Link
          href="#"
          className="text-white hover:text-collab-primary transition-colors p-2 rounded-full hover:bg-collab-dark-light"
          aria-label="Messages"
        >
          <MessageSquare className="w-5 h-5" />
        </Link>
        <Link
          href="#"
          className="text-white hover:text-collab-primary transition-colors p-2 rounded-full hover:bg-collab-dark-light"
          aria-label="Twitter"
        >
          <Twitter className="w-5 h-5" />
        </Link>
        <Link
          href="#"
          className="text-white hover:text-collab-primary transition-colors p-2 rounded-full hover:bg-collab-dark-light"
          aria-label="YouTube"
        >
          <Youtube className="w-5 h-5" />
        </Link>
        <Link
          href="#"
          className="text-white hover:text-collab-primary transition-colors p-2 rounded-full hover:bg-collab-dark-light"
          aria-label="Facebook"
        >
          <Facebook className="w-5 h-5" />
        </Link>
        <Link
          href="#"
          className="text-white hover:text-collab-primary transition-colors p-2 rounded-full hover:bg-collab-dark-light"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5" />
        </Link>
      </div>
    </footer>
  )
}
