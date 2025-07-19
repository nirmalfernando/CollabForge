import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  isAuthenticated?: boolean
}

export default function HeroSection({ isAuthenticated = false }: HeroSectionProps) {
  return (
    <section className="relative bg-collab-dark text-white py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl text-center lg:text-left z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Find <span className="text-collab-primary">Your People</span>
          </h1>
          <p className="text-lg md:text-xl text-collab-text-muted mb-10">
            We're the app where creators and brands{" "}
            <span className="text-collab-primary font-semibold">connect naturally</span>, build authentic partnerships,
            and create <span className="text-collab-primary font-semibold">content that matters</span>. No more awkward
            DMs or endless emails—just the right matches that{" "}
            <span className="text-collab-primary font-semibold">help everyone grow</span>.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                variant="outline"
                className="border-collab-primary text-collab-primary hover:bg-collab-primary hover:text-white rounded-full px-8 py-3 text-lg transition-colors bg-transparent"
              >
                <Link href="/signup">Sign-Up</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-collab-primary text-collab-primary hover:bg-collab-primary hover:text-white rounded-full px-8 py-3 text-lg transition-colors bg-transparent"
              >
                <Link href="/login">Log-In</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Large blue arc visual element */}
        <div className="hidden lg:block relative w-[400px] h-[400px] xl:w-[500px] xl:h-[500px] flex-shrink-0">
          <div className="absolute inset-0 rounded-full border-[30px] border-collab-primary opacity-70 animate-pulse-slow"></div>
          <div className="absolute inset-0 rounded-full border-[30px] border-collab-blue-darker opacity-50 transform scale-90 animate-pulse-slow-reverse"></div>
        </div>
      </div>
    </section>
  )
}
