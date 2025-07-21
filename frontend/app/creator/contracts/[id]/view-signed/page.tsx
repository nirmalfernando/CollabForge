"use client"
import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreatorSignedContractViewPage({ params }: { params: { id: string } }) {
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
    initialSuggestions: "I suggest adding a clause about content ownership.", // Dummy initial suggestions
    currentStatus: "Active", // Initial status for this contract
  }

  const [contractStatus, setContractStatus] = useState(contractData.currentStatus)

  const handleUpdateStatus = (newStatus: string) => {
    setContractStatus(newStatus)
    toast({
      title: "Contract Status Updated",
      description: `Contract status changed to ${newStatus}.`,
    })
    // In a real app, you would send this status update to your backend
    console.log(`Contract ${contractData.id} status updated to: ${newStatus}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="influencer" />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">Signed Contract</h1>
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

          {/* Contract Status Update */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">Contract Progress Status</h2>
            <Select value={contractStatus} onValueChange={handleUpdateStatus}>
              <SelectTrigger className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent className="bg-card text-foreground">
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Awaiting Payment">Awaiting Payment</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
