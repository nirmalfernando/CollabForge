import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Lightbulb, LayoutDashboard, Users, MessageSquare } from "lucide-react"

interface WelcomeDashboardProps {
  userName: string
}

export default function WelcomeDashboard({ userName }: WelcomeDashboardProps) {
  return (
    <section className="bg-collab-dark text-white py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-6 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Welcome, <span className="text-collab-primary">{userName}</span>!
        </h1>
        <p className="text-lg md:text-xl text-collab-text-muted text-center max-w-3xl mx-auto mb-12">
          Your journey to connect and collaborate starts here. Let's get you set up and ready to go!
        </p>

        {/* Onboarding/Tutorial Section */}
        <div className="bg-collab-dark-light p-8 rounded-xl shadow-lg border border-collab-dark-border mb-16">
          <div className="flex items-center justify-center mb-6">
            <Lightbulb className="w-8 h-8 text-collab-primary mr-3" />
            <h2 className="text-3xl font-bold text-white">Quick Start Guide</h2>
          </div>
          <p className="text-collab-text-muted text-center mb-8 max-w-2xl mx-auto">
            Follow these steps to get the most out of CollabForge.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-collab-dark-lighter border-collab-dark-border text-white">
              <CardHeader>
                <CardTitle className="text-collab-primary">1. Complete Your Profile</CardTitle>
                <CardDescription className="text-collab-text-muted">
                  Add details to help others find you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-collab-primary text-collab-primary hover:bg-collab-primary hover:text-white bg-transparent"
                >
                  <Link href="/profile">
                    Go to Profile <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-collab-dark-lighter border-collab-dark-border text-white">
              <CardHeader>
                <CardTitle className="text-collab-primary">2. Explore Opportunities</CardTitle>
                <CardDescription className="text-collab-text-muted">
                  Find brands or influencers to collaborate with.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-collab-primary text-collab-primary hover:bg-collab-primary hover:text-white bg-transparent"
                >
                  <Link href="/explore">
                    Explore <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-collab-dark-lighter border-collab-dark-border text-white">
              <CardHeader>
                <CardTitle className="text-collab-primary">3. Start a Project</CardTitle>
                <CardDescription className="text-collab-text-muted">Initiate your first collaboration.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-collab-primary text-collab-primary hover:bg-collab-primary hover:text-white bg-transparent"
                >
                  <Link href="/projects">
                    New Project <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Core Features Navigation */}
        <h2 className="text-3xl font-bold text-white text-center mb-8">Your Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-collab-dark-light border-collab-dark-border text-white text-center p-6 hover:border-collab-primary transition-colors">
            <Link href="/dashboard" className="flex flex-col items-center space-y-4">
              <LayoutDashboard className="w-12 h-12 text-collab-primary" />
              <CardTitle className="text-xl">Dashboard</CardTitle>
              <CardDescription className="text-collab-text-muted">Overview of your activities.</CardDescription>
            </Link>
          </Card>
          <Card className="bg-collab-dark-light border-collab-dark-border text-white text-center p-6 hover:border-collab-primary transition-colors">
            <Link href="/connections" className="flex flex-col items-center space-y-4">
              <Users className="w-12 h-12 text-collab-primary" />
              <CardTitle className="text-xl">Connections</CardTitle>
              <CardDescription className="text-collab-text-muted">Manage your network.</CardDescription>
            </Link>
          </Card>
          <Card className="bg-collab-dark-light border-collab-dark-border text-white text-center p-6 hover:border-collab-primary transition-colors">
            <Link href="/messages" className="flex flex-col items-center space-y-4">
              <MessageSquare className="w-12 h-12 text-collab-primary" />
              <CardTitle className="text-xl">Messages</CardTitle>
              <CardDescription className="text-collab-text-muted">Communicate with partners.</CardDescription>
            </Link>
          </Card>
          <Card className="bg-collab-dark-light border-collab-dark-border text-white text-center p-6 hover:border-collab-primary transition-colors">
            <Link href="/analytics" className="flex flex-col items-center space-y-4">
              <Lightbulb className="w-12 h-12 text-collab-primary" />{" "}
              {/* Reusing Lightbulb for Analytics placeholder */}
              <CardTitle className="text-xl">Analytics</CardTitle>
              <CardDescription className="text-collab-text-muted">Track your performance.</CardDescription>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  )
}
