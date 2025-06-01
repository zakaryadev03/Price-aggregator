"use client"

import { Card, CardContent } from "@/components/card"
import { PlatformSelector } from "@/components/platform-selector"
import { SearchBar } from "@/components/search-bar"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import Loading from "@/components/Loading"
import Image from "next/image"
import { Button } from "@/components/button"
const BASE_URL = process.env.APIURL || "http://localhost:5000"


function page() {
  const q = useSearchParams().get("q")
  const [isLoading, setIsLoading] = useState(true);
  const [theError, setTheError] = useState("");
  const [results, setResults] = useState<{
    "product_id": string,
    "title": string,
    "currency": string,
    "image_url": string,
    "best_price": string,
    "best_platform": string,
    "prices":
    {
      "platform": string,
      "price": string,
      "last_updated": string
    }[]
  }[]>([]);

  const router = useRouter()
  async function handleClick(q: string) {
    router.push("/find?q=" + q)
    await handelSearch(q)
  }

  async function handelSearch(q: string) {
    setIsLoading(true)
    setTheError("")
    try {
      const res = await (await axios.post(BASE_URL + "/search", { keyWord: q })).data
      setResults(res)
    } catch (error) {
      setTheError(String(error))
    }
    setIsLoading(false)

  }

  useEffect(() => {
    if (!q) {
      redirect("/")
    }
    handelSearch(q)
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-2 mt-12">
          <SearchBar defaultS={q} onSearch={handleClick} />
          <PlatformSelector />
        </div>
        <br />
        <div className="flex justify-center gap-4 flex-wrap">
          {
            isLoading ? <Loading /> : theError ? <p className="text-red-400">{theError}</p> : !results.length ? <p>No products found</p> : (
              results.map(item =>
                <Card key={item.product_id} className="overflow-hidden w-96">
                  <div className="aspect-video flex justify-center items-center max-w-96 max-h-80 overflow-hidden relative w-full">
                    <Image
                      src={item.image_url}
                      alt="Product"
                      height={200}
                      width={300}
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Best price at</p>
                        <p className="font-medium">{item.best_platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className=" text-green-600 font-bold">{item.best_price} {item.currency}</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="sm" onClick={() => location.href = 'https://www.google.com'}>
                      View Deal
                    </Button>
                  </CardContent>
                </Card>)
            )
          }
        </div>
      </main>
    </div>
  )
}
export default page