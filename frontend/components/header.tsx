"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  authApi,
  clearAuthData,
  getAuthData,
  creatorApi,
  brandApi,
} from "@/lib/api";
import { useState, useEffect } from "react";

interface HeaderProps {
  isLoggedIn: boolean;
  userRole?: "influencer" | "brand-manager";
}

interface UserData {
  username: string;
  profilePicUrl?: string;
}

export default function Header({ isLoggedIn, userRole }: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  // Determine the dashboard path based on user role
  const dashboardPath =
    userRole === "influencer" ? "/creator/dashboard" : "/brand/dashboard";

  // Fetch user data when component mounts and user is logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn) return;

      setIsLoadingUserData(true);
      try {
        const authData = getAuthData();
        if (!authData || !authData.user) {
          console.error("No auth data found");
          return;
        }

        const userId = authData.user.userId || authData.user.id;
        if (!userId) {
          console.error("No user ID found in auth data");
          return;
        }

        // First, get the user's basic info (username)
        const userResponse = await authApi.getUserById(userId);

        let profileData = {
          username: userResponse.username,
          profilePicUrl: undefined as string | undefined,
        };

        // Then, get profile picture based on role
        try {
          if (userRole === "influencer") {
            const creatorResponse = await creatorApi.getCreatorByUserId(userId);
            profileData.profilePicUrl = creatorResponse.profilePicUrl;
          } else if (userRole === "brand-manager") {
            const brandResponse = await brandApi.getBrandByUserId(userId);
            profileData.profilePicUrl = brandResponse.profilePicUrl;
          }
        } catch (profileError) {
          // Profile might not exist yet, which is fine
          console.warn("Profile data not found, using defaults:", profileError);
        }

        setUserData(profileData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Set fallback data if available from auth
        const authData = getAuthData();
        if (authData?.user?.username) {
          setUserData({
            username: authData.user.username,
            profilePicUrl: undefined,
          });
        }
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn, userRole]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts

    setIsLoggingOut(true);

    try {
      // Call the logout API
      await authApi.logout();

      // Clear local storage auth data
      clearAuthData();

      // Clear user data state
      setUserData(null);

      // Redirect to home page
      router.push("/");

      // Optional: You might want to trigger a page refresh to ensure all state is cleared
      // window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error);

      // Even if the API call fails, clear local data and redirect
      // This ensures the user is logged out on the frontend
      clearAuthData();
      setUserData(null);
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Helper function to get user initials for avatar fallback
  const getUserInitials = (username: string) => {
    return username
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <header className="flex items-center justify-between px-4 py-6 md:px-6 bg-background text-foreground">
      <Link
        href={isLoggedIn ? dashboardPath : "/"}
        className="text-2xl font-bold"
        prefetch={false}
      >
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
                    href="/creator/creators"
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
              <Link
                href="/"
                className="text-lg font-medium hover:text-primary transition-colors"
                prefetch={false}
              >
                Home
              </Link>
              <Link
                href="#"
                className="text-lg font-medium hover:text-primary transition-colors"
                prefetch={false}
              >
                About Us
              </Link>
              <Link
                href="#"
                className="text-lg font-medium hover:text-primary transition-colors"
                prefetch={false}
              >
                Contact Us
              </Link>
              <Link
                href="#"
                className="text-lg font-medium hover:text-primary transition-colors"
                prefetch={false}
              >
                Pricing
              </Link>
            </>
          )}
        </nav>
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
                disabled={isLoadingUserData}
              >
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage
                    src={
                      userData?.profilePicUrl ||
                      "/placeholder.svg?height=100&width=100"
                    }
                    alt={userData?.username || "User"}
                  />
                  <AvatarFallback>
                    {userData?.username
                      ? getUserInitials(userData.username)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-card text-foreground"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {isLoadingUserData
                      ? "Loading..."
                      : userData?.username || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userRole === "influencer" ? "Influencer" : "Brand Manager"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-muted" />
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/20">
                <Link
                  href={
                    userRole === "influencer"
                      ? "/creator/profile"
                      : "/brand/profile"
                  }
                  className="w-full"
                  prefetch={false}
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/20">
                <Link href={
                  userRole === "influencer"
                    ? "/creator/chat"
                    : "/brand/chat"
                } 
                className="w-full" 
                prefetch={false}
                >
                  Chats
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-muted" />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-primary/20"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <span className="w-full">
                  {isLoggingOut ? "Logging out..." : "Log-Out"}
                </span>
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
  );
}
