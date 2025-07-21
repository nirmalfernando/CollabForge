"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Clock, DollarSign, FileText } from "lucide-react" // Icons for status

export default function BrandContractsPage() {
  // Dummy data for brand's contracts
  const contracts = [
    {
      id: 1,
      campaignTitle: "Science, Simplified",
      creatorName: "Mads Molecule",
      status: "Active", // Changed from "Active"
      creationDate: "2024-07-20",
    },
    {
      id: 2,
      campaignTitle: "Minimal Moves",
      creatorName: "Maya Rodriguez",
      status: "Pending", // Changed from "Pending"
      creationDate: "2024-07-18",
    },
    {
      id: 3,
      campaignTitle: "The GlowUp Campaign",
      creatorName: "Jordan Kim",
      status: "Awaiting Payment", // Changed from "Paid" to "Awaiting Payment"
      creationDate: "2024-07-10",
    },
    {
      id: 4,
      campaignTitle: "Plug In. Speak Out.",
      creatorName: "Sam Parker",
      status: "Complete", // Changed from "Complete"
      creationDate: "2024-07-05",
    },
    {
      id: 5,
      campaignTitle: "Level Up with Orbiton",
      creatorName: "Devon Martinez",
      status: "Pending", // Changed from "Pending"
      creationDate: "2024-07-01",
    },
    {
      id: 6,
      campaignTitle: "Radiate Bold",
      creatorName: "Zoe Williams",
      status: "Active", // Changed from "Active"
      creationDate: "2024-06-25",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Awaiting Payment": // New status
        return <DollarSign className="h-5 w-5 text-blue-500" />
      case "Complete":
        return <FileText className="h-5 w-5 text-purple-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-500"
      case "Pending":
        return "text-yellow-500"
      case "Awaiting Payment": // New status
        return "text-blue-500"
      case "Complete":
        return "text-purple-500"
      default:
        return "text-foreground"
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            My <span className="text-primary">Contracts</span>
          </h1>

          {contracts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">You don't have any contracts yet.</p>
              <Link href="/brand/campaigns" prefetch={false}>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                >
                  Create a Campaign
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {contracts.map((contract) => (
                <Card key={contract.id} className="bg-card border-primary rounded-lg p-6 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl font-bold text-foreground">{contract.campaignTitle}</h3>
                    <p className="text-muted-foreground text-sm">
                      Creator: <span className="font-medium text-primary">{contract.creatorName}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(contract.status)}
                      <p className={cn("font-medium", getStatusColor(contract.status))}>Status: {contract.status}</p>
                    </div>
                    <p className="text-muted-foreground text-sm">Created: {contract.creationDate}</p>
                  </div>
                  {/* Updated link to the new brand-specific contract view page */}
                  <Link href={`/brand/contracts/${contract.id}/view`} prefetch={false} className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      View Details
                    </Button>
                  </Link>
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
