"use client"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Clock, XCircle, FileText, FileCheck } from "lucide-react" // Icons for status

export default function CreatorApplicationsPage() {
  // Dummy data for creator's applied applications
  const applications = [
    {
      id: 1,
      campaignTitle: "Science, Simplified",
      brandName: "Zentro Labs",
      status: "Pending",
      submissionDate: "2024-07-15",
    },
    {
      id: 2,
      campaignTitle: "Minimal Moves",
      brandName: "Veltra",
      status: "Approved", // This one will show "Sign the Contract"
      submissionDate: "2024-07-10",
    },
    {
      id: 3,
      campaignTitle: "The GlowUp Campaign",
      brandName: "DripHaus",
      status: "Rejected",
      submissionDate: "2024-07-01",
    },
    {
      id: 4,
      campaignTitle: "Plug In. Speak Out.",
      brandName: "Loopify",
      status: "Draft",
      submissionDate: "2024-06-28",
    },
    {
      id: 5,
      campaignTitle: "Level Up with Orbiton",
      brandName: "Orbiton",
      status: "Pending",
      submissionDate: "2024-06-20",
    },
    {
      id: 6,
      campaignTitle: "Radiate Bold",
      brandName: "NovaGlow",
      status: "Signed", // New status
      submissionDate: "2024-07-20",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Draft":
        return <FileText className="h-5 w-5 text-gray-500" />
      case "Signed":
        return <FileCheck className="h-5 w-5 text-blue-500" /> // Using blue for signed contracts
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-500"
      case "Rejected":
        return "text-red-500"
      case "Pending":
        return "text-yellow-500"
      case "Draft":
        return "text-gray-500"
      case "Signed":
        return "text-blue-500" // Using blue for signed contracts
      default:
        return "text-foreground"
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            My <span className="text-primary">Applications</span>
          </h1>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">You haven't applied to any campaigns yet.</p>
              <Link href="/creator/campaigns" prefetch={false}>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                >
                  Browse Campaigns
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {applications.map((app) => (
                <Card key={app.id} className="bg-card border-primary rounded-lg p-6 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl font-bold text-foreground">{app.campaignTitle}</h3>
                    <p className="text-muted-foreground text-sm">
                      Brand: <span className="font-medium text-primary">{app.brandName}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <p className={cn("font-medium", getStatusColor(app.status))}>Status: {app.status}</p>
                    </div>
                    <p className="text-muted-foreground text-sm">Submitted: {app.submissionDate}</p>
                  </div>
                  {app.status === "Approved" ? (
                    <Link href={`/creator/contracts/${app.id}`} prefetch={false} className="mt-auto">
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                      >
                        Sign the Contract
                      </Button>
                    </Link>
                  ) : app.status === "Signed" ? (
                    <Link href={`/creator/contracts/${app.id}/view-signed`} prefetch={false} className="mt-auto">
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                      >
                        View Contract
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/creator/applications/${app.id}`} prefetch={false} className="mt-auto">
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
