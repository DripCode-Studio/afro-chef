"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ImageUploaderProps {
  value: string | null
  onChange: (url: string | null) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      const supabase = createClient()

      // Generate unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `recipe-images/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("recipe-images").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("recipe-images").getPublicUrl(filePath)

      onChange(publicUrl)
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-charcoal">Recipe Image</h3>

      {value ? (
        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden border-[3px] border-charcoal shadow-[4px_4px_0px_0px_#0f1724]">
            <img src={value || "/placeholder.svg"} alt="Recipe preview" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg border-2 border-charcoal shadow-[2px_2px_0px_0px_#0f1724] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0f1724] transition-all"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="block cursor-pointer">
          <div className="aspect-video rounded-lg border-[3px] border-dashed border-charcoal/40 bg-muted/30 flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors">
            {isUploading ? (
              <>
                <div className="w-10 h-10 border-[3px] border-orange border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-orange/10 flex items-center justify-center">
                  <ImageIcon className="h-7 w-7 text-orange" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-charcoal">Click to upload</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  )
}
