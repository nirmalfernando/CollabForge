"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link" // Import Link

export default function CreatorContractViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Dummy contract data - In a real app, this would be fetched based on params.id
  const contractData = {
    id: params.id,
    campaignTitle: "Science, Simplified",
    content: `Cheesy feet cheese slices red leicester. Red leicester cheeseburger cut the cheese jarlsberg edam chalk and cheese port-salut macaroni cheese. Cheeseburger brie st. agur blue cheese cow danish fontina port-salut say cheese manchego. Croque monsieur cut the cheese st. agur blue cheese squirty cheese pepper jack macaroni cheese.

Stilton paneer danish fontina. Fromage ricotta blue castello emmental bocconcini cut the cheese halloumi. Stilton cheesecake cheese and biscuits. Roquefort jarlsberg hard cheese emmental cheese triangles the big cheese say cheese bavarian bergkase. Mozzarella cottage cheese croque monsieur squirty cheese cheeseburger emmental.

Cut the cheese cream cheese cream cheese. Parmesan pecorino red leicester cottage cheese smelly cheese blue castello roquefort goat. Gouda manchego goat everyone loves croque monsieur paneer airedale cream cheese. Smelly cheese stilton manchego st. agur blue cheese.

Cottage cheese stinking bishop boursin. Caerphilly cottage cheese roquefort jarlsberg stinking bishop pepper jack dolcelatte caerphilly. Cheeseburger pecorino pepper jack feta cheese triangles melted cheese goat lancashire. Bocconcini cream cheese jarlsberg everyone loves cheddar.

• Cheesy feet cheese slices red leicester.
• Red leicester cheeseburger cut the cheese jarlsberg edam chalk and cheese port-salut macaroni cheese. Cheeseburger brie st. agur blue cheese cow danish fontina port-salut say cheese manchego.
• Croque monsieur cut the cheese st. agur blue cheese squirty cheese pepper jack macaroni cheese.`,
  }

  const handleSendSuggestions = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions to send suggestions.",
        variant: "destructive",
      })
      return
    }
    // Simulate sending suggestions
    console.log("Suggestions:", suggestions)
    toast({
      title: "Suggestions Sent",
      description: "Your suggestions have been sent to the brand.",
    })
    // In a real app, you might redirect or update UI based on backend response
  }

  const handleChat = () => {
    // Simulate opening a chat with the brand
    toast({
      title: "Opening Chat",
      description: "Redirecting to chat with the brand for contract discussion...",
    })
    // In a real app, this would navigate to a chat interface
    // For now, just a placeholder
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">Contract</h1>
          <p className="text-2xl font-semibold text-foreground">&ldquo;{contractData.campaignTitle}&rdquo;</p>

          <div className="bg-card rounded-xl p-8 shadow-lg">
            <div className="prose prose-invert max-w-none text-foreground text-lg leading-relaxed whitespace-pre-line">
              {contractData.content}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">Content Creators Suggestions</h2>
            <Textarea
              placeholder="You can add any updates or suggestions that you have to this contract here"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              rows={8}
              className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 resize-y"
            />
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="agree-terms"
              checked={agreedToTerms}
              onCheckedChange={(checked: boolean) => setAgreedToTerms(checked)}
            />
            <Label htmlFor="agree-terms" className="text-base text-foreground">
              I agree to these terms and conditions with the changes that I have made
            </Label>
          </div>

          <div className="flex flex-col gap-4 pt-8">
            <Button
              type="submit"
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
              onClick={handleSendSuggestions}
            >
              Send Suggestions
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
              onClick={handleChat}
            >
              Chat with the Brand
            </Button>
            <Link href={`/creator/contracts/${contractData.id}/sign`} prefetch={false}>
              <Button
                variant="outline"
                className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
              >
                Sign the Contract
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
