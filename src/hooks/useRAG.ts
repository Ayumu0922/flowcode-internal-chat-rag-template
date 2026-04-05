import { useState, useCallback } from 'react'
import type { SearchResult } from '@/types'
import { searchDocuments } from '@/lib/rag/search'

export function useRAG() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  const search = useCallback(async (query: string) => {
    setSearching(true)

    try {
      const data = await searchDocuments(query)
      setResults(data)
      return data
    } catch (err) {
      console.error('Search failed:', err)
      setResults([])
      return []
    } finally {
      setSearching(false)
    }
  }, [])

  const clear = useCallback(() => {
    setResults([])
  }, [])

  return {
    results,
    searching,
    search,
    clear,
  }
}
