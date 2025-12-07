import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RecipeCard } from "@/components/recipes/recipe-card"
import { SearchFilters } from "@/components/recipes/search-filters"
import { NeuButton } from "@/components/ui/neu-button"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 12

async function getRecipes(searchParams: {
  q?: string
  region?: string
  difficulty?: string
  tag?: string
  page?: string
}) {
  const supabase = await createClient()
  const page = Number.parseInt(searchParams.page || "1")
  const offset = (page - 1) * ITEMS_PER_PAGE

  let query = supabase
    .from("recipes")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  // Apply filters
  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`)
  }

  if (searchParams.region) {
    query = query.eq("region", searchParams.region)
  }

  if (searchParams.difficulty) {
    query = query.eq("difficulty", Number.parseInt(searchParams.difficulty))
  }

  if (searchParams.tag) {
    query = query.contains("tags", [searchParams.tag])
  }

  // Pagination
  query = query.range(offset, offset + ITEMS_PER_PAGE - 1)

  const { data, count, error } = await query

  if (error) {
    console.error("Error fetching recipes:", error)
    return { recipes: [], totalPages: 0, currentPage: page }
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return { recipes: data || [], totalPages, currentPage: page }
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; region?: string; difficulty?: string; tag?: string; page?: string }>
}) {
  const params = await searchParams
  const { recipes, totalPages, currentPage } = await getRecipes(params)

  const buildPageUrl = (page: number) => {
    const newParams = new URLSearchParams()
    if (params.q) newParams.set("q", params.q)
    if (params.region) newParams.set("region", params.region)
    if (params.difficulty) newParams.set("difficulty", params.difficulty)
    if (params.tag) newParams.set("tag", params.tag)
    newParams.set("page", page.toString())
    return `/recipes?${newParams.toString()}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">Explore Recipes</h1>
            <p className="text-muted-foreground">Discover authentic African dishes from across the continent</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded-lg" />}>
              <SearchFilters />
            </Suspense>
          </div>

          {/* Results */}
          {recipes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link href={buildPageUrl(currentPage - 1)}>
                      <NeuButton variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </NeuButton>
                    </Link>
                  )}

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                      })
                      .map((page, index, array) => {
                        const prevPage = array[index - 1]
                        const showEllipsis = prevPage && page - prevPage > 1

                        return (
                          <span key={page} className="flex items-center">
                            {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                            <Link href={buildPageUrl(page)}>
                              <button
                                className={`w-10 h-10 rounded-lg border-2 border-charcoal font-bold text-sm transition-all ${
                                  page === currentPage
                                    ? "bg-orange text-white"
                                    : "bg-cream text-charcoal hover:bg-muted"
                                }`}
                              >
                                {page}
                              </button>
                            </Link>
                          </span>
                        )
                      })}
                  </div>

                  {currentPage < totalPages && (
                    <Link href={buildPageUrl(currentPage + 1)}>
                      <NeuButton variant="outline" size="sm">
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </NeuButton>
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🍲</span>
              </div>
              <h2 className="text-2xl font-bold text-charcoal mb-2">No recipes found</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you are looking for.
              </p>
              <Link href="/recipes">
                <NeuButton variant="primary">View All Recipes</NeuButton>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
