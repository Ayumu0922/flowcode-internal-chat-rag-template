import type { RagSource } from '@/types'

export interface GenerateResponse {
  content: string
  sources: RagSource[]
}

export async function generateRAGResponse(
  query: string,
  channelId: string,
): Promise<GenerateResponse> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, channelId }),
  })

  if (!response.ok) {
    throw new Error(`Generate API error: ${response.status}`)
  }

  return response.json()
}
