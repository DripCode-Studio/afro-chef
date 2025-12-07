"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChefHat, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { NeuButton } from "@/components/ui/neu-button"
import { NeuCard, NeuCardContent, NeuCardHeader } from "@/components/ui/neu-card"
import { NeuInput } from "@/components/ui/neu-input"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/my`,
          data: {
            display_name: displayName || email.split("@")[0],
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
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
        <NeuCardHeader className="bg-orange text-white">
          <h1 className="text-2xl font-bold">Join AfroChef</h1>
          <p className="text-white/80 text-sm mt-1">Create your account and start cooking</p>
        </NeuCardHeader>
        <NeuCardContent className="p-6">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="font-bold text-charcoal">
                Display Name
              </Label>
              <NeuInput
                id="displayName"
                type="text"
                placeholder="Chef Aisha"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

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
                  placeholder="At least 6 characters"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-bold text-charcoal">
                Confirm Password
              </Label>
              <NeuInput
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Repeat your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border-2 border-red-500 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <NeuButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </NeuButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-orange hover:underline">
                Sign in
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
