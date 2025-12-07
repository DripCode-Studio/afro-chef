import { redirect } from "next/navigation"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { NeuCard, NeuCardContent } from "@/components/ui/neu-card"

async function getUserData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user recipes count
  const { count: recipesCount } = await supabase
    .from("user_recipes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Get favorites count
  const { count: favoritesCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  return {
    user,
    profile,
    recipesCount: recipesCount || 0,
    favoritesCount: favoritesCount || 0,
  }
}

export default async function MyKitchenPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams
  const userData = await getUserData()

  if (!userData) {
    redirect("/auth/login?redirect=/my")
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">My Kitchen</h1>
            <p className="text-muted-foreground">Manage your recipes, favorites, and profile</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileCard
                user={userData.user}
                profile={userData.profile}
                recipesCount={userData.recipesCount}
                favoritesCount={userData.favoritesCount}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Suspense
                fallback={
                  <NeuCard>
                    <NeuCardContent className="p-8">
                      <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-muted rounded w-1/3" />
                        <div className="h-32 bg-muted rounded" />
                      </div>
                    </NeuCardContent>
                  </NeuCard>
                }
              >
                <DashboardTabs userId={userData.user.id} activeTab={params.tab || "recipes"} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
