import { BoltIcon as Bat, Diamond, Zap, Target, Leaf } from "lucide-react"

export default function PartnerLogos() {
  return (
    <section className="bg-collab-dark-light py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-8 flex flex-wrap items-center justify-around gap-8">
        <Bat className="w-16 h-16 text-white opacity-70 hover:opacity-100 transition-opacity" />
        <Diamond className="w-16 h-16 text-white opacity-70 hover:opacity-100 transition-opacity" />
        <Zap className="w-16 h-16 text-white opacity-70 hover:opacity-100 transition-opacity" />
        <Target className="w-16 h-16 text-white opacity-70 hover:opacity-100 transition-opacity" />
        <Leaf className="w-16 h-16 text-white opacity-70 hover:opacity-100 transition-opacity" />
      </div>
    </section>
  )
}
