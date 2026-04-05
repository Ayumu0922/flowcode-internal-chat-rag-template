const CHUNK_SIZE = 500
const CHUNK_OVERLAP = 50

export interface TextChunk {
  content: string
  index: number
}

export function chunkText(text: string): TextChunk[] {
  const chunks: TextChunk[] = []
  const cleanedText = text.replace(/\r\n/g, '\n').trim()

  if (cleanedText.length <= CHUNK_SIZE) {
    return [{ content: cleanedText, index: 0 }]
  }

  let start = 0
  let index = 0

  while (start < cleanedText.length) {
    let end = start + CHUNK_SIZE

    // Try to break at sentence boundary
    if (end < cleanedText.length) {
      const lastPeriod = cleanedText.lastIndexOf('。', end)
      const lastDot = cleanedText.lastIndexOf('. ', end)
      const lastNewline = cleanedText.lastIndexOf('\n', end)

      const breakPoint = Math.max(lastPeriod, lastDot, lastNewline)

      if (breakPoint > start + CHUNK_SIZE * 0.3) {
        end = breakPoint + 1
      }
    }

    const chunk = cleanedText.slice(start, end).trim()

    if (chunk.length > 0) {
      chunks.push({ content: chunk, index })
      index++
    }

    start = end - CHUNK_OVERLAP
  }

  return chunks
}
