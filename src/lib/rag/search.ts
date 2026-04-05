import type { SearchResult } from '@/types'

export async function searchDocuments(
  query: string,
  matchCount: number = 5,
  matchThreshold: number = 0.7,
): Promise<SearchResult[]> {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, matchCount, matchThreshold }),
  })

  if (!response.ok) {
    throw new Error(`Search API error: ${response.status}`)
  }

  const data = await response.json()
  return data.results
}
