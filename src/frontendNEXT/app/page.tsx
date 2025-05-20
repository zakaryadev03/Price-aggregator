"use client"

import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/button"
import { Card, CardContent } from "@/components/card"
import { Input } from "@/components/input"
import { PlatformSelector } from "@/components/platform-selector"
import { SearchBar } from "@/components/search-bar"
import { redirect } from "next/navigation"

export default function Home() {
  return (

    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Find the Best Deals Across the Web
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Compare prices from Amazon, AliExpress, and more to find the cheapest products online.
              </p>
            </div>
            <div className="w-full max-w-2xl space-y-2">
              <SearchBar onSearch={async (q) => {redirect("/find?q=" + q)}} />
              <PlatformSelector />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Finding the best deals has never been easier with our powerful comparison engine.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Search</h3>
                <p className="text-muted-foreground text-center">
                  Enter your product in the search bar and select the platforms you want to compare.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Compare</h3>
                <p className="text-muted-foreground text-center">
                  Our algorithm instantly compares prices across all selected platforms.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Save</h3>
                <p className="text-muted-foreground text-center">
                  Choose the best deal and save money on your purchase with direct links to sellers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="popular" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Popular Deals</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Check out what other shoppers are finding with PriceHunter.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={`/placeholder.svg?height=200&width=300`}
                      alt="Product"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">Wireless Earbuds with Noise Cancellation</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Best price at</p>
                        <p className="font-medium">Amazon</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">You save</p>
                        <p className="font-medium text-green-600">$24.99 (30%)</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="sm">
                      View Deal
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="mt-8">
              View All Deals
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Join Our Community</h2>
              <p className="text-muted-foreground md:text-xl">
                Sign up to get notified about the best deals and save even more with personalized alerts.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Input placeholder="Enter your email" className="sm:max-w-sm" />
                <Button>Subscribe</Button>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-[400px]">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Shopping illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </main>

  )
}
