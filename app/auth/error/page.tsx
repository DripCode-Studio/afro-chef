import Link from "next/link"
import { ChefHat, AlertTriangle, ArrowRight } from "lucide-react"
import { NeuCard, NeuCardContent, NeuCardHeader } from "@/components/ui/neu-card"
import { NeuButton } from "@/components/ui/neu-button"

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange border-[3px] border-charcoal shadow-[4px_4px_0px_0px_#0f1724] transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[2px_2px_0px_0px_#0f1724]">
          <ChefHat className="h-7 w-7 text-white" />
        </div>
        <span className="text-2xl font-bold text-charcoal">AfroChef</span>
      </Link>

      <NeuCard className="w-full max-w-md">
        <NeuCardHeader className="bg-red-600 text-white">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Something Went Wrong</h1>
              <p className="text-white/80 text-sm mt-1">Authentication error</p>
            </div>
          </div>
        </NeuCardHeader>
        <NeuCardContent className="p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>

          <h2 className="text-xl font-bold text-charcoal mb-3">Authentication Failed</h2>
          {params.error ? (
            <p className="text-muted-foreground mb-6">Error code: {params.error}</p>
          ) : (
            <p className="text-muted-foreground mb-6">
              An unexpected error occurred during authentication. Please try again.
            </p>
          )}

          <div className="space-y-3">
            <Link href="/auth/login">
              <NeuButton variant="primary" className="w-full">
                Try Again
                <ArrowRight className="ml-2 h-5 w-5" />
              </NeuButton>
            </Link>
            <Link href="/">
              <NeuButton variant="outline" className="w-full">
                Back to Home
              </NeuButton>
            </Link>
          </div>
        </NeuCardContent>
      </NeuCard>
    </div>
  )
}
