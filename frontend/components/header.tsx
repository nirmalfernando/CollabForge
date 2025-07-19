"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface HeaderProps {
  isAuthenticated: boolean
  userName?: string
  userProfileImage?: string
}

export default function Header({
  isAuthenticated,
  userName = "User",
  userProfileImage = "/placeholder.svg?height=40&width=40",
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-collab-dark text-white">
      <Link href="/" className="text-2xl font-bold text-collab-primary hover:text-collab-secondary transition-colors">
        CollabForge
      </Link>
      <nav className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/home" className="text-sm font-medium text-white hover:text-collab-primary transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-white hover:text-collab-primary transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-medium text-white hover:text-collab-primary transition-colors">
            Contact Us
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-white hover:text-collab-primary transition-colors">
            Pricing
          </Link>
        </div>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-collab-primary">
                <Image
                  src={userProfileImage || "/placeholder.svg"}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover border-2 border-collab-primary"
                />
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-collab-dark-light border-collab-dark-border text-white p-2 rounded-lg shadow-lg"
              align="end"
              forceMount
            >
              <DropdownMenuItem className="flex flex-col items-start space-y-1 px-4 py-2 cursor-default">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-collab-text-muted">
                  @{userName.toLowerCase().replace(/\s/g, "")}
                </p>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-collab-dark-border my-2" />
              <DropdownMenuItem
                asChild
                className="px-4 py-2 cursor-pointer hover:bg-collab-dark-lighter hover:text-collab-primary rounded-md transition-colors"
              >
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="px-4 py-2 cursor-pointer hover:bg-collab-dark-lighter hover:text-collab-primary rounded-md transition-colors"
              >
                <Link href="/chats">Chats</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="px-4 py-2 cursor-pointer hover:bg-collab-dark-lighter hover:text-collab-primary rounded-md transition-colors"
              >
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-collab-dark-border my-2" />
              <DropdownMenuItem className="px-4 py-2 cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors">
                Log-Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            asChild
            variant="outline"
            className="border-collab-primary text-collab-primary hover:bg-collab-primary hover:text-white rounded-full px-6 py-2 transition-colors bg-transparent"
          >
            <Link href="/signup">Sign-Up</Link>
          </Button>
        )}
      </nav>
    </header>
  )
}
