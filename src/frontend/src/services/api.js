const BASE_URL = 'http://aggregator:5000';

export async function searchProducts(keyword) {
  const response = await fetch(`${BASE_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyWord: keyword })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}