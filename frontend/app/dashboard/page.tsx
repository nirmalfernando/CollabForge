import Header from "@/components/header"
import Footer from "@/components/footer"
import WelcomeDashboard from "@/components/welcome-dashboard"

export default function DashboardPage() {
  // In a real application, you would fetch the user's name from your authentication context or API
  const userName = "CollabUser" // Placeholder for the logged-in user's name

  return (
    <div className="flex flex-col min-h-screen bg-collab-dark">
      <Header />
      <main className="flex-1">
        <WelcomeDashboard userName={userName} />
        {/* Additional dashboard content can go here */}
      </main>
      <Footer />
    </div>
  )
}
