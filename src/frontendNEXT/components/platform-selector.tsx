"use client"

import { useState } from "react"
import Image from "next/image"

import { Button } from "@/components/button"

type Platform = {
  id: string
  name: string
  logo: string
}

const platforms: Platform[] = [
  {
    id: "amazon",
    name: "Amazon",
    logo: "/placeholder.svg?height=30&width=30",
  },
  {
    id: "aliexpress",
    name: "AliExpress",
    logo: "/placeholder.svg?height=30&width=30",
  },
  {
    id: "walmart",
    name: "Walmart",
    logo: "/placeholder.svg?height=30&width=30",
  },
  {
    id: "ebay",
    name: "eBay",
    logo: "/placeholder.svg?height=30&width=30",
  },
]

export function PlatformSelector() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["amazon", "aliexpress"])

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platformId)) {
        // Don't allow deselecting all platforms
        if (prev.length === 1) return prev
        return prev.filter((id) => id !== platformId)
      } else {
        return [...prev, platformId]
      }
    })
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-2">
      {platforms.map((platform) => (
        <Button
          key={platform.id}
          variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
          className="flex items-center gap-2 px-4"
          onClick={() => togglePlatform(platform.id)}
        >
          <div className="relative w-5 h-5">
            <Image src={platform.logo || "/placeholder.svg"} alt={platform.name} fill className="object-contain" />
          </div>
          {platform.name}
        </Button>
      ))}
    </div>
  )
}
