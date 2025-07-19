import Header from "@/components/header"
import Footer from "@/components/footer"
import SignUpForm from "@/components/signup-form"
import BrandSection from "@/components/brand-section"

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-collab-dark">
      <Header />

      <main className="flex-1 grid lg:grid-cols-2">
        {/* Left Column - Sign Up Form */}
        <div className="flex items-center justify-center py-12 px-4 bg-collab-dark">
          <SignUpForm />
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
