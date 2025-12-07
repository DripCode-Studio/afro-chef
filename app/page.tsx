import Link from "next/link"
import { ChefHat, Utensils, Sparkles, Heart, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NeuButton } from "@/components/ui/neu-button"
import { NeuCard, NeuCardContent } from "@/components/ui/neu-card"
import { NeuBadge } from "@/components/ui/neu-badge"

const features = [
  {
    icon: Utensils,
    title: "Authentic Recipes",
    description: "Explore curated recipes from West, East, North, and Southern Africa",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Generate new recipes with AI based on your available ingredients",
  },
  {
    icon: Heart,
    title: "Make It Yours",
    description: "Customize any recipe, save your versions, and share with the community",
  },
]

const regions = [
  { name: "West Africa", dishes: "Jollof, Egusi, Suya", color: "bg-orange" },
  { name: "East Africa", dishes: "Injera, Nyama Choma, Mandazi", color: "bg-teal" },
  { name: "North Africa", dishes: "Tagine, Shakshuka, Couscous", color: "bg-charcoal" },
  { name: "Southern Africa", dishes: "Bobotie, Bunny Chow, Chakalaka", color: "bg-orange" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-cream py-16 md:py-24">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange/10 rounded-full" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal/10 rounded-full" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <NeuBadge variant="primary" className="mb-4">
                  Discover African Cuisine
                </NeuBadge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6 text-balance">
                  Cook Like a <span className="text-orange">True African</span> Chef
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 text-pretty">
                  Explore authentic recipes from across the continent. Customize ingredients, save your favorites, and
                  create new dishes with AI assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/recipes">
                    <NeuButton variant="primary" size="lg">
                      Browse Recipes
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </NeuButton>
                  </Link>
                  <Link href="/auth/sign-up">
                    <NeuButton variant="outline" size="lg">
                      Start Cooking
                    </NeuButton>
                  </Link>
                </div>
              </div>

              <div className="flex-1 w-full max-w-lg">
                <NeuCard className="relative">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img
                      src="/jollof-rice-african-dish-colorful.jpg"
                      alt="Delicious African dish"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <NeuCardContent className="bg-orange text-white">
                    <h3 className="font-bold text-lg">Featured: Jollof Rice</h3>
                    <p className="text-white/80 text-sm">The iconic West African party rice</p>
                  </NeuCardContent>
                </NeuCard>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">Everything You Need to Cook African</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From traditional recipes to AI-powered suggestions, we have the tools to help you master African
                cuisine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <NeuCard key={feature.title} hover>
                  <NeuCardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-orange/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-orange" />
                    </div>
                    <h3 className="font-bold text-xl text-charcoal mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </NeuCardContent>
                </NeuCard>
              ))}
            </div>
          </div>
        </section>

        {/* Regions Section */}
        <section className="py-16 md:py-24 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">Explore by Region</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Each region of Africa offers unique flavors, ingredients, and cooking traditions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {regions.map((region) => (
                <Link key={region.name} href={`/recipes?region=${encodeURIComponent(region.name)}`}>
                  <NeuCard hover className="h-full">
                    <div className={`h-3 ${region.color}`} />
                    <NeuCardContent className="p-5">
                      <h3 className="font-bold text-lg text-charcoal mb-1">{region.name}</h3>
                      <p className="text-sm text-muted-foreground">{region.dishes}</p>
                    </NeuCardContent>
                  </NeuCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-charcoal text-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <ChefHat className="h-16 w-16 mx-auto mb-6 text-orange" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Cooking?</h2>
            <p className="text-cream/80 max-w-xl mx-auto mb-8">
              Join AfroChef today and unlock the full experience. Save recipes, create your own, and become part of our
              cooking community.
            </p>
            <Link href="/auth/sign-up">
              <NeuButton
                variant="primary"
                size="lg"
                className="border-cream shadow-[4px_4px_0px_0px_#fbf5ef] hover:shadow-[2px_2px_0px_0px_#fbf5ef]"
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </NeuButton>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
