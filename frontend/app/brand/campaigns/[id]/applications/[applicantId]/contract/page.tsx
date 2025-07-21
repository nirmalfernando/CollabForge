"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function CreateContractPage({ params }: { params: { id: string; applicantId: string } }) {
  const router = useRouter()
  const [contractData, setContractData] = useState({
    title: "",
    details: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContractData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateSponsorship = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send contractData to your backend
    console.log("Creating sponsorship contract:", contractData)
    console.log("For Campaign ID:", params.id, "and Applicant ID:", params.applicantId)

    toast({
      title: "Contract Created",
      description: "The sponsorship contract has been successfully created!",
    })

    // Redirect to a confirmation page or back to the campaign applications list
    router.push("/brand/contracts")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={true} userRole="brand-manager" />

      <main className="flex-1 flex items-center justify-center py-12 px-4 md:px-6">
        <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-lg bg-card p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">Contract</h1>

          <form onSubmit={handleCreateSponsorship} className="space-y-6">
            <div>
              <Input
                type="text"
                name="title"
                placeholder="Title"
                value={contractData.title}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                required
              />
            </div>
            <div>
              <Textarea
                name="details"
                placeholder="Contract Details"
                value={contractData.details}
                onChange={handleChange}
                rows={10}
                className="w-full bg-[#1a1a1a] border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 resize-y"
                required
              />
            </div>

            <p className="text-muted-foreground text-sm mt-4">
              Please note that the user will be able to add their comments to this file before agreeing and only then
              will both parties be able to confirm the contract.
            </p>

            <Button
              type="submit"
              variant="outline"
              className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent mt-6"
            >
              Create Contract
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
