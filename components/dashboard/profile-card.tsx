"use client"

import { useState } from "react"
import { User, BookOpen, Heart, Edit2, Camera, Loader2 } from "lucide-react"
import { NeuCard, NeuCardContent } from "@/components/ui/neu-card"
import { NeuButton } from "@/components/ui/neu-button"
import { NeuInput } from "@/components/ui/neu-input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"

interface ProfileCardProps {
  user: SupabaseUser
  profile: Profile | null
  recipesCount: number
  favoritesCount: number
}

export function ProfileCard({ user, profile, recipesCount, favoritesCount }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [bio, setBio] = useState(profile?.bio || "")

  const handleSave = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          display_name: displayName.trim() || null,
          bio: bio.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setIsEditing(false)
    } catch (err) {
      console.error("Failed to update profile:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <NeuCard>
      <NeuCardContent className="p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-orange/10 border-[3px] border-charcoal flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={displayName || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-orange" />
              )}
            </div>
            <button
              className="absolute bottom-0 right-0 p-2 bg-teal text-white rounded-full border-2 border-charcoal shadow-[2px_2px_0px_0px_#0f1724]"
              aria-label="Change avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {isEditing ? (
            <div className="w-full space-y-3">
              <div>
                <Label htmlFor="displayName" className="text-sm font-bold">
                  Display Name
                </Label>
                <NeuInput
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="bio" className="text-sm font-bold">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full p-2 rounded-lg border-2 border-charcoal bg-cream text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
              <div className="flex gap-2">
                <NeuButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </NeuButton>
                <NeuButton variant="primary" size="sm" onClick={handleSave} disabled={isLoading} className="flex-1">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </NeuButton>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-charcoal text-center">
                {profile?.display_name || user.email?.split("@")[0]}
              </h2>
              <p className="text-sm text-muted-foreground text-center">{user.email}</p>
              {profile?.bio && <p className="text-sm text-center mt-2 text-charcoal">{profile.bio}</p>}
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 flex items-center gap-1 text-sm text-orange hover:underline font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 border-t border-charcoal/20 pt-6">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <BookOpen className="w-5 h-5 mx-auto mb-1 text-orange" />
            <p className="text-2xl font-bold text-charcoal">{recipesCount}</p>
            <p className="text-xs text-muted-foreground">Recipes</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Heart className="w-5 h-5 mx-auto mb-1 text-teal" />
            <p className="text-2xl font-bold text-charcoal">{favoritesCount}</p>
            <p className="text-xs text-muted-foreground">Favorites</p>
          </div>
        </div>
      </NeuCardContent>
    </NeuCard>
  )
}
