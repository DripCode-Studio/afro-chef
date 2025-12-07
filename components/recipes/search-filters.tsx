"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, X } from "lucide-react"
import { NeuButton } from "@/components/ui/neu-button"
import { NeuInput } from "@/components/ui/neu-input"
import { NeuBadge } from "@/components/ui/neu-badge"

const REGIONS = ["West Africa", "East Africa", "North Africa", "Southern Africa"]
const DIFFICULTIES = [
  { value: "1", label: "Easy" },
  { value: "2", label: "Medium" },
  { value: "3", label: "Intermediate" },
  { value: "4", label: "Advanced" },
  { value: "5", label: "Expert" },
]
const TAGS = [
  "main dish",
  "soup",
  "breakfast",
  "snack",
  "vegetarian",
  "grilled",
  "street food",
  "traditional",
  "spicy",
  "rice",
]

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const currentSearch = searchParams.get("q") || ""
  const currentRegion = searchParams.get("region") || ""
  const currentDifficulty = searchParams.get("difficulty") || ""
  const currentTag = searchParams.get("tag") || ""

  const [search, setSearch] = useState(currentSearch)

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page") // Reset to first page
    router.push(`/recipes?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters("q", search)
  }

  const clearAllFilters = () => {
    router.push("/recipes")
    setSearch("")
  }

  const hasActiveFilters = currentSearch || currentRegion || currentDifficulty || currentTag

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <NeuInput
            type="search"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <NeuButton type="submit" variant="primary">
          Search
        </NeuButton>
        <NeuButton
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-orange text-white" : ""}
        >
          <Filter className="h-5 w-5" />
        </NeuButton>
      </form>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {currentSearch && (
            <NeuBadge variant="secondary" className="gap-1">
              Search: {currentSearch}
              <button onClick={() => updateFilters("q", "")} aria-label="Clear search">
                <X className="h-3 w-3" />
              </button>
            </NeuBadge>
          )}
          {currentRegion && (
            <NeuBadge variant="secondary" className="gap-1">
              {currentRegion}
              <button onClick={() => updateFilters("region", "")} aria-label="Clear region filter">
                <X className="h-3 w-3" />
              </button>
            </NeuBadge>
          )}
          {currentDifficulty && (
            <NeuBadge variant="secondary" className="gap-1">
              Difficulty: {DIFFICULTIES.find((d) => d.value === currentDifficulty)?.label}
              <button onClick={() => updateFilters("difficulty", "")} aria-label="Clear difficulty filter">
                <X className="h-3 w-3" />
              </button>
            </NeuBadge>
          )}
          {currentTag && (
            <NeuBadge variant="secondary" className="gap-1">
              {currentTag}
              <button onClick={() => updateFilters("tag", "")} aria-label="Clear tag filter">
                <X className="h-3 w-3" />
              </button>
            </NeuBadge>
          )}
          <button onClick={clearAllFilters} className="text-sm text-orange hover:underline font-medium">
            Clear all
          </button>
        </div>
      )}

      {/* Filter Panel - replaced neu-card with inline styles */}
      {showFilters && (
        <div className="bg-card border-[3px] border-charcoal shadow-[4px_4px_0px_0px_#0f1724] rounded-lg p-5 space-y-5">
          {/* Region Filter */}
          <div>
            <h4 className="font-bold text-charcoal mb-3">Region</h4>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => updateFilters("region", currentRegion === region ? "" : region)}
                  className={`px-3 py-1.5 rounded-lg border-2 border-charcoal font-medium text-sm transition-all ${
                    currentRegion === region ? "bg-orange text-white" : "bg-cream text-charcoal hover:bg-muted"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h4 className="font-bold text-charcoal mb-3">Difficulty</h4>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => updateFilters("difficulty", currentDifficulty === diff.value ? "" : diff.value)}
                  className={`px-3 py-1.5 rounded-lg border-2 border-charcoal font-medium text-sm transition-all ${
                    currentDifficulty === diff.value ? "bg-teal text-white" : "bg-cream text-charcoal hover:bg-muted"
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <h4 className="font-bold text-charcoal mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => updateFilters("tag", currentTag === tag ? "" : tag)}
                  className={`px-3 py-1.5 rounded-lg border-2 border-charcoal font-medium text-sm transition-all ${
                    currentTag === tag ? "bg-charcoal text-cream" : "bg-cream text-charcoal hover:bg-muted"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
