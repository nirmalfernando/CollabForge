export default function BrandSection() {
  return (
    <div className="relative flex items-center justify-center bg-collab-primary overflow-hidden min-h-full">
      {/* Curved background elements */}
      <div className="absolute -left-20 top-0 w-80 h-full bg-collab-blue-dark/30 rounded-r-full transform -skew-x-12"></div>
      <div className="absolute -left-12 top-0 w-64 h-full bg-collab-blue-dark/20 rounded-r-full transform -skew-x-6"></div>
      <div className="absolute -left-6 top-0 w-48 h-full bg-collab-blue-dark/10 rounded-r-full transform -skew-x-3"></div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full px-8">
        <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-wide text-center">CollabForge</h2>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-white/3 rounded-full blur-lg"></div>
    </div>
  )
}
