"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChefHat, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { NeuButton } from "@/components/ui/neu-button"
import { NeuCard, NeuCardContent, NeuCardHeader } from "@/components/ui/neu-card"
import { NeuInput } from "@/components/ui/neu-input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/my"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push(redirect)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

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
        <NeuCardHeader className="bg-charcoal text-cream">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-cream/80 text-sm mt-1">Sign in to continue cooking</p>
        </NeuCardHeader>
        <NeuCardContent className="p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-charcoal">
                Email
              </Label>
              <NeuInput
                id="email"
                type="email"
                placeholder="chef@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold text-charcoal">
                Password
              </Label>
              <div className="relative">
                <NeuInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-charcoal transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border-2 border-red-500 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <NeuButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </NeuButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {"Don't have an account?"}{" "}
              <Link href="/auth/sign-up" className="font-bold text-orange hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </NeuCardContent>
      </NeuCard>

      <Link href="/" className="mt-6 text-muted-foreground hover:text-charcoal transition-colors">
        &larr; Back to home
      </Link>
    </div>
  )
}
