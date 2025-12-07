"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChefHat, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <header className="sticky top-0 z-50 bg-cream border-b-[4px] border-charcoal">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange border-[3px] border-charcoal shadow-[2px_2px_0px_0px_#0f1724] transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-charcoal">AfroChef</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/recipes" className="text-charcoal font-semibold hover:text-orange transition-colors">
              Recipes
            </Link>
            {user && (
              <>
                <Link href="/builder" className="text-charcoal font-semibold hover:text-orange transition-colors">
                  Builder
                </Link>
                <Link href="/my" className="text-charcoal font-semibold hover:text-orange transition-colors">
                  My Kitchen
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/my">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[3px] border-charcoal shadow-[2px_2px_0px_0px_#0f1724] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all bg-cream"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-[3px] border-charcoal shadow-[2px_2px_0px_0px_#0f1724] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all bg-cream"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[3px] border-charcoal shadow-[2px_2px_0px_0px_#0f1724] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all bg-cream"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button
                    size="sm"
                    className="bg-orange text-white border-[3px] border-charcoal shadow-[2px_2px_0px_0px_#0f1724] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all hover:bg-orange-light"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 border-[3px] border-charcoal shadow-[2px_2px_0px_0px_#0f1724] bg-cream rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-cream border-b-[4px] border-charcoal">
          <nav className="flex flex-col gap-2 p-4">
            <Link
              href="/recipes"
              className="p-3 font-semibold text-charcoal hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Recipes
            </Link>
            {user && (
              <>
                <Link
                  href="/builder"
                  className="p-3 font-semibold text-charcoal hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Builder
                </Link>
                <Link
                  href="/my"
                  className="p-3 font-semibold text-charcoal hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Kitchen
                </Link>
              </>
            )}
            <div className="border-t border-charcoal/20 pt-3 mt-2 flex flex-col gap-2">
              {user ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="w-full border-[3px] border-charcoal"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-[3px] border-charcoal bg-transparent">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-orange text-white border-[3px] border-charcoal hover:bg-orange-light">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
