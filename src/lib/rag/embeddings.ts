export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await fetch('/api/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts }),
  })

  if (!response.ok) {
    throw new Error(`Embedding API error: ${response.status}`)
  }

  const data = await response.json()
  return data.embeddings
}
