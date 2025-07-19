import Header from "@/components/header"
import Footer from "@/components/footer"
import LoginForm from "@/components/login-form"
import BrandSection from "@/components/brand-section"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-collab-dark">
      <Header />

      <main className="flex-1 grid lg:grid-cols-2">
        {/* Left Column - Login Form */}
        <div className="flex items-center justify-center py-12 px-4 bg-collab-dark">
          <LoginForm />
        </div>

        {/* Right Column - Brand Section */}
        <div className="hidden lg:block">
          <BrandSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
