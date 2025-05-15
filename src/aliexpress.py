import os
import requests
from dotenv import load_dotenv

load_dotenv()

class AliExpressAPI:
    def __init__(self):
        self.base_url = "https://aliexpress-business-api.p.rapidapi.com/textsearch.php"
        self.headers = {
	        "x-rapidapi-key": os.getenv("ALIEXPRESS_API_KEY"),
	        "x-rapidapi-host": "aliexpress-business-api.p.rapidapi.com"
        }

    def search_products(self, query):
        params = {
            "keyWord": query,
        }
        try:
            response = requests.get(
                self.base_url,
                headers=self.headers,
                params=params
            )
            response.raise_for_status()
            return self._normalize_data(response.json())
        except Exception as e:
            print(f"API Error: {e}")
            return None

    def _normalize_data(self, raw_data):
        """Convert API response to standard format"""
        items = raw_data.get("data", {}).get("itemList", [])
        return [{
            "product_id": item.get("itemId"),
            "title": item.get("title"),
            "price": float(item.get("salePrice", 0)),
            "original_price": float(item.get("originalPrice", 0)),
            "currency": item.get("salePriceCurrency"),
            "discount": item.get("discount"),
            "image_url": item.get("itemMainPic"),
            "platform": "AliExpress"
        } for item in items]