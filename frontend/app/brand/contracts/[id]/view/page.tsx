"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function BrandContractViewPage({ params }: { params: { id: string } }) {
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
    digitalSignature: "John Doe", // Dummy digital signature
    creatorSuggestions: "I suggest adding a clause about content ownership and a clear timeline for deliverables.", // Dummy creator suggestions
    currentStatus: "Active", // Dummy current status from creator
  }

  const handleChat = () => {
    toast({
      title: "Opening Chat",
      description: "Redirecting to chat with the creator...",
    })
    // In a real app, this would navigate to a chat interface
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">Contract Details</h1>
          <p className="text-2xl font-semibold text-foreground">&ldquo;{contractData.campaignTitle}&rdquo;</p>

          <div className="bg-card rounded-xl p-8 shadow-lg">
            <div className="prose prose-invert max-w-none text-foreground text-lg leading-relaxed whitespace-pre-line">
              {contractData.content}
            </div>
          </div>

          {/* Digital Signature Display */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">Digital Signature</h2>
            <p className="text-lg text-foreground font-medium">Signed by: {contractData.digitalSignature}</p>
          </div>

          {/* Creator Suggestions Display */}
          {contractData.creatorSuggestions && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">Creator's Suggestions</h2>
              <div className="bg-muted rounded-lg p-4 text-foreground text-lg leading-relaxed">
                {contractData.creatorSuggestions}
              </div>
            </div>
          )}

          {/* Contract Status Display (Read-only for brand) */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">Contract Status</h2>
            <p className="text-lg text-foreground font-medium">Current Status: {contractData.currentStatus}</p>
          </div>

          <div className="flex flex-col gap-4 pt-8">
            <Button
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
              onClick={handleChat}
            >
              Chat with Creator
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
