import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Leaf } from "lucide-react"

// Dummy data for a single application detail
const applicationDetailData = {
  campaignId: "1", // Example campaign ID
  applicantId: "1", // Example applicant ID
  campaignTitle: "Science, Simplified",
  brandName: "Zentro Labs",
  applicantName: "Mads Molecule",
  applicantAvatar: "/images/mads-molecule-avatar.png",
  proposalTitle: "Boosting Your Summer Collection on Instagram & TikTok",
  proposalPitch:
    "I plan to create engaging short-form content that highlights the unique features of your summer collection. My audience (fashion & lifestyle enthusiasts) resonates well with seasonal product promotions. I will ensure each post links directly to your store to drive conversions.",
  contentPlan: [
    "Instagram: 3 Reels (15-30 seconds), 5 Stories with swipe-up links",
    "TikTok: 2 Trend-based short videos featuring product use",
    "Instagram Live: 1 Q&A session reviewing the collection",
    "Twitter (Optional): 3 Tweets highlighting styling tips",
  ],
  timeline: {
    startDate: "2025-08-01",
    endDate: "2025-08-20",
  },
}

// Dummy data for "You Might Also Like" section (other applicants)
const otherApplicants = [
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
]

export default function BrandApplicationDetailPage({ params }: { params: { id: string; applicantId: string } }) {
  // In a real app, you would use params.id and params.applicantId to fetch the specific application data
  const application = applicationDetailData
  const campaignId = params.id // Use the campaign ID from params

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto space-y-12">
          {/* Top Section: Campaign Title and Brand */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h1 className="text-5xl md:text-6xl font-bold text-primary">&ldquo;{application.campaignTitle}&rdquo;</h1>
              <div className="flex items-center gap-3 text-foreground flex-shrink-0">
                <Leaf className="h-6 w-6" />
                <span className="text-lg">By {application.brandName}</span>
              </div>
            </div>
          </div>

          {/* Applicant Section */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-primary">Applicant</h2>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-2 border-primary">
                <AvatarImage src={application.applicantAvatar || "/placeholder.svg"} alt={application.applicantName} />
                <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                  {application.applicantName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-4xl font-semibold text-foreground">{application.applicantName}</span>
            </div>
          </div>

          {/* Main Content Grid: Proposal Details (left) and You Might Also Like (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Application Details and Action Buttons */}
            <div className="lg:col-span-2 space-y-8">
              {/* Proposal Title */}
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">Proposal Title</h3>
                <p className="text-lg leading-relaxed text-foreground">{application.proposalTitle}</p>
              </div>

              {/* Proposal Pitch */}
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">Proposal Pitch</h3>
                <p className="text-lg leading-relaxed text-foreground">{application.proposalPitch}</p>
              </div>

              {/* Content Plan */}
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">Content Plan</h3>
                <ul className="list-disc list-inside space-y-1 text-lg text-foreground">
                  {application.contentPlan.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Content Timeline */}
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">Content Timeline</h3>
                <ul className="list-disc list-inside space-y-1 text-lg text-foreground">
                  <li>Start Date: {application.timeline.startDate}</li>
                  <li>End Date: {application.timeline.endDate}</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <div className="flex-1">
                  {" "}
                  {/* New wrapper div */}
                  <Link
                    href={`/brand/campaigns/${campaignId}/applications/${application.applicantId}/contract`}
                    prefetch={false}
                    className="w-full block" // Ensure Link fills its parent
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                    >
                      Accept
                    </Button>
                  </Link>
                </div>
                <div className="flex-1">
                  {" "}
                  {/* New wrapper div */}
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-[#f32121] text-[#f32121] hover:bg-[#ff0000]/10 hover:text-[#ff0000] px-6 py-3 text-lg bg-transparent"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: "You Might Also Like" Sidebar */}
            <div className="lg:col-span-1 bg-muted rounded-xl p-8 space-y-6 row-start-1 lg:row-start-auto">
              <h2 className="text-3xl font-bold text-foreground">
                You Might Also <span className="text-primary">Like</span>
              </h2>
              <div className="space-y-6">
                {otherApplicants.map((otherApplicant) => (
                  <div key={otherApplicant.id} className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary flex-shrink-0">
                      <AvatarImage src={otherApplicant.avatarSrc || "/placeholder.svg"} alt={otherApplicant.name} />
                      <AvatarFallback className="bg-primary text-white font-bold">
                        {otherApplicant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-bold text-foreground">{otherApplicant.name}</h3>
                      <p className="text-muted-foreground text-sm">Platform: {otherApplicant.platform}</p>
                      <p className="text-muted-foreground text-sm">Handle: {otherApplicant.handle}</p>
                      <p className="text-muted-foreground text-sm">Followers: {otherApplicant.followers}</p>
                      <div className="flex flex-row gap-2 mt-2">
                        <Link href={`/brand/creators/${otherApplicant.id}`} prefetch={false}>
                          <Button
                            variant="outline"
                            className="w-24 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1 text-sm bg-transparent"
                          >
                            Profile
                          </Button>
                        </Link>
                        <Link
                          href={`/brand/campaigns/${campaignId}/applications/${otherApplicant.id}`}
                          prefetch={false}
                        >
                          <Button
                            variant="outline"
                            className="w-24 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1 text-sm bg-transparent"
                          >
                            Application
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <Link
                  href={`/brand/campaigns/${campaignId}/applications`}
                  className="text-primary hover:underline text-lg"
                  prefetch={false}
                >
                  More...
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
