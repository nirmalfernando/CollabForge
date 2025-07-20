import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PersonCardProps {
  name: string
  handle: string
  description: string
  avatarSrc: string
  avatarAlt: string
}

export default function PersonCard({ name, handle, description, avatarSrc, avatarAlt }: PersonCardProps) {
  return (
    <Card className="bg-card border-primary rounded-xl p-6 flex flex-col items-center text-center max-w-sm mx-auto">
      <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
        <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={avatarAlt} />
        <AvatarFallback>
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <CardContent className="p-0">
        <h3 className="text-xl font-semibold text-foreground">
          {name} <span className="text-muted-foreground">{handle}</span>
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}
