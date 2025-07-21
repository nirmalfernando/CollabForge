"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Leaf, ChevronDown } from "lucide-react"

export default function CampaignApplicantsPage({ params }: { params: { id: string } }) {
  // Dummy data for the campaign and applicants
  // In a real app, you would fetch this data based on params.id
  const campaignData = {
    id: params.id,
    title: "Science, Simplified",
    brand: "Zentro Labs",
    tagline:
      "We're teaming up with creators to make smart wellness cool. Show how Zentro Labs' health tech fits into your real life — whether it's your morning routine, fitness journey, or daily productivity hacks.",
  }

  const applicants = [
    {
      id: 1,
      name: "Mads Molecule",
      platform: "TikTok",
      handle: "@madsmolcule",
      followers: "320,000",
      avatarSrc: "/images/mads-molecule-avatar.png",
    },
    {
      id: 2,
      name: "Mads Molecule",
      platform: "TikTok",
      handle: "@madsmolcule",
      followers: "320,000",
      avatarSrc: "/images/mads-molecule-avatar.png",
    },
    {
      id: 3,
      name: "Mads Molecule",
      platform: "TikTok",
      handle: "@madsmolcule",
      followers: "320,000",
      avatarSrc: "/images/mads-molecule-avatar.png",
    },
    {
      id: 4,
      name: "Mads Molecule",
      platform: "TikTok",
      handle: "@madsmolcule",
      followers: "320,000",
      avatarSrc: "/images/mads-molecule-avatar.png",
    },
    {
      id: 5,
      name: "Mads Molecule",
      platform: "TikTok",
      handle: "@madsmolcule",
      followers: "320,000",
      avatarSrc: "/images/mads-molecule-avatar.png",
    },
    {
      id: 6,
      name: "Mads Molecule",
      platform: "TikTok",
      handle: "@madsmolcule",
      followers: "320,000",
      avatarSrc: "/images/mads-molecule-avatar.png",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto space-y-8">
          {/* Campaign Header Section */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h1 className="text-5xl md:text-6xl font-bold text-primary">{campaignData.title}</h1>
              <div className="flex items-center gap-3 text-foreground flex-shrink-0">
                <Leaf className="h-6 w-6" />
                <span className="text-lg">By {campaignData.brand}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1 text-sm bg-transparent ml-4"
                    >
                      Status <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-card text-foreground" align="end">
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/20">Active</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/20">Pending</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/20">Completed</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-foreground">{campaignData.tagline}</p>
          </div>

          {/* Applicants List Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Applicants List</h2>
            <div className="relative">
              <div className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {applicants.map((applicant) => (
                  <div key={applicant.id} className="flex items-center justify-between bg-card rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 border-2 border-primary">
                        <AvatarImage src={applicant.avatarSrc || "/placeholder.svg"} alt={applicant.name} />
                        <AvatarFallback className="bg-primary text-white font-bold">
                          {applicant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Name: {applicant.name}</h3>
                        <p className="text-muted-foreground">Platform: {applicant.platform}</p>
                        <p className="text-muted-foreground">Handle: {applicant.handle}</p>
                        <p className="text-muted-foreground">Followers: {applicant.followers}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/brand/creators/${applicant.id}`} prefetch={false}>
                        <Button
                          variant="outline"
                          className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2 bg-transparent"
                        >
                          Profile
                        </Button>
                      </Link>
                      <Link href={`/brand/campaigns/${campaignData.id}/applications/${applicant.id}`} prefetch={false}>
                        <Button
                          variant="outline"
                          className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2 bg-transparent"
                        >
                          Application
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {/* Custom Scrollbar */}
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #1a1a1a; /* Darker track */
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: #2196f3; /* Primary blue thumb */
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: #0088ff; /* Darker blue on hover */
                }
              `}</style>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
