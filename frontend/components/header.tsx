"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  isLoggedIn: boolean
  userRole?: "influencer" | "brand-manager"
}

export default function Header({ isLoggedIn, userRole }: HeaderProps) {
  // Determine the dashboard path based on user role
  const dashboardPath = userRole === "influencer" ? "/creator/dashboard" : "/brand/dashboard"

  return (
    <header className="flex items-center justify-between px-4 py-6 md:px-6 bg-background text-foreground">
      <Link href={isLoggedIn ? dashboardPath : "/"} className="text-2xl font-bold" prefetch={false}>
        CollabForge
      </Link>
      <div className="flex items-center space-x-6">
        <nav className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link
                href={dashboardPath}
                className="text-lg font-medium hover:text-primary transition-colors"
                prefetch={false}
              >
                Home
              </Link>
              {userRole === "influencer" && (
                <>
                  <Link
                    href="/creator/campaigns"
                    className="text-lg font-medium hover:text-primary transition-colors"
                    prefetch={false}
                  >
                    Campaigns
                  </Link>
                  <Link
                    href="/creator/creators" // Removed the trailing backslash
                    className="text-lg font-medium hover:text-primary transition-colors"
                    prefetch={false}
                  >
                    Creators
                  </Link>
                  <Link
                    href="/creator/applications"
                    className="text-lg font-medium hover:text-primary transition-colors"
                    prefetch={false}
                  >
                    Applications
                  </Link>
                </>
              )}
              {userRole === "brand-manager" && (
                <>
                  <Link
                    href="/brand/creators"
                    className="text-lg font-medium hover:text-primary transition-colors"
                    prefetch={false}
                  >
                    Creators
                  </Link>
                  <Link
                    href="/brand/campaigns"
                    className="text-lg font-medium hover:text-primary transition-colors"
                    prefetch={false}
                  >
                    Campaigns
                  </Link>
                  <Link
                    href="/brand/contracts"
                    className="text-lg font-medium hover:text-primary transition-colors"
                    prefetch={false}
                  >
                    Contracts
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                Home
              </Link>
              <Link href="#" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                About Us
              </Link>
              <Link href="#" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                Contact Us
              </Link>
              <Link href="#" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                Pricing
              </Link>
            </>
          )}
        </nav>
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src="/placeholder.svg?height=100&width=100" alt="@user" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card text-foreground" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User Name</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userRole === "influencer" ? "Influencer" : "Brand Manager"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-muted" />
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/20">
                <Link
                  href={userRole === "influencer" ? "/creator/profile" : "/brand/profile"}
                  className="w-full"
                  prefetch={false}
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/20">
                <Link href="#" className="w-full" prefetch={false}>
                  Chats
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-muted" />
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/20">
                <Link href="#" className="w-full" prefetch={false}>
                  Log-Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login" prefetch={false}>
            <Button
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}
