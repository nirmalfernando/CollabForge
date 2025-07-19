import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-collab-dark text-white">
      <Header />
      <main className="flex-1 container mx-auto px-6 md:px-8 py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-collab-primary hover:text-collab-secondary transition-colors font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-collab-primary mb-6">User Profile</h1>
        <div className="bg-collab-dark-light p-8 rounded-xl shadow-lg border border-collab-dark-border">
          <p className="text-lg text-collab-text-muted">
            This is where users can view and edit their personal information.
          </p>
          {/* Add profile details and edit forms here */}
        </div>
      </main>
      <Footer />
    </div>
  )
}
