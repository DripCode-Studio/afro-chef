import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NeuButton } from "@/components/ui/neu-button"
import { Search } from "lucide-react"

export default function RecipeNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="text-center px-4">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🥘</span>
          </div>
          <h1 className="text-3xl font-bold text-charcoal mb-3">Recipe Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {"We couldn't find the recipe you're looking for. It may have been removed or the URL is incorrect."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/recipes">
              <NeuButton variant="primary">
                <Search className="h-5 w-5 mr-2" />
                Browse Recipes
              </NeuButton>
            </Link>
            <Link href="/">
              <NeuButton variant="outline">Go Home</NeuButton>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
