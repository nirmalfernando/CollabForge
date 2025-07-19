import Image from "next/image"

export default function OurPeopleSection() {
  const profiles = [
    {
      id: 1,
      name: "Jamie L.",
      username: "@jamielifts",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Fitness Creator — 180K Followers. Jamie built a loyal fitness community on Instagram and YouTube. She partnered with sportswear brands to launch limited-edition collections that sold out within hours.",
    },
    {
      id: 2,
      name: "Alex T.",
      username: "@codewithalex",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Tech Educator — 90K on TikTok, 22K on YouTube. Alex creates bite-sized tech tutorials and productivity hacks. Their collaboration with a SaaS startup drove a 40% uptick in trial signups.",
    },
    {
      id: 3,
      name: "Chris & Mel",
      username: "@wanderlustduo",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Travel Couple — 250K Followers. This adventurous duo travel the world, creating stunning vlogs. Their recent collab with an eco-friendly tourism board resulted in a viral content series that got over 5M views.",
    },
  ]

  return (
    <section className="bg-collab-dark py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          <span className="text-collab-primary">Our</span> People
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-collab-dark-light p-6 rounded-xl border-2 border-collab-primary/50 hover:border-collab-primary transition-colors duration-300 flex flex-col items-center text-center"
            >
              <Image
                src={profile.image || "/placeholder.svg"}
                alt={`Profile of ${profile.name}`}
                width={100}
                height={100}
                className="rounded-full object-cover mb-4 border-4 border-collab-primary"
              />
              <h3 className="text-xl font-semibold text-white mb-1">{profile.name}</h3>
              <p className="text-collab-text-muted text-sm mb-4">{profile.username}</p>
              <p className="text-white text-base leading-relaxed">{profile.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
