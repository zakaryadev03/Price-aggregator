"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/button"
import { Input } from "@/components/input"
type params = { onSearch: (searchQuery: string) => Promise<void>, defaultS?: string | null }
export function SearchBar({ onSearch, defaultS }: params) {
  const [searchQuery, setSearchQuery] = useState(defaultS ? defaultS : "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    onSearch(searchQuery)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for any product..."
          className="pl-10 pr-20 h-12 text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 h-10">
          Search
        </Button>
      </div>
    </form>
  )
}
