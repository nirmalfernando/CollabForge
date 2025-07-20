import Link from "next/link"
import { Twitch, Twitter, Facebook, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background text-foreground py-8 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <Link href="#" className="text-2xl font-bold" prefetch={false}>
        CollabForge
      </Link>
      <div className="flex space-x-6">
        <Link href="#" aria-label="Twitch" prefetch={false}>
          <Twitch className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
        </Link>
        <Link href="#" aria-label="Twitter" prefetch={false}>
          <Twitter className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
        </Link>
        <Link href="#" aria-label="Facebook" prefetch={false}>
          <Facebook className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
        </Link>
        <Link href="#" aria-label="Instagram" prefetch={false}>
          <Instagram className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
        </Link>
      </div>
    </footer>
  )
}
