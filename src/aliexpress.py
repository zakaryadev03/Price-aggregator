import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

class AliExpressAPI:
    def __init__(self):
        self.base_url = "https://aliexpress-datahub.p.rapidapi.com/item_search"
        self.headers = {
            "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
            "X-RapidAPI-Host": "aliexpress-datahub.p.rapidapi.com"
        }

    def search_products(self, query):
        params = {
            "q": query,
            "page": "1",
            "sort": "default"
        }
        try:
            response = requests.get(self.base_url, headers=self.headers, params=params)
            response.raise_for_status()
            return self._normalize_data(response.json())
        except Exception as e:
            print(f"API Error: {e}")
            return None

    def _normalize_data(self, raw_data):
        """Convert AliExpress API response to standard format"""
        items = raw_data.get("result", {}).get("items", [])
        return [{
            "product_id": item.get("itemId"),
            "title": item.get("title"),
            "price": item.get("salePrice"),
            "url": item.get("itemUrl"),
            "seller": item.get("storeName"),
            "platform": "AliExpress"
        } for item in items]