import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
);

export const generateRouter = Router();

generateRouter.post('/', async (req, res) => {
  try {
    const { query, channelId } = req.body as {
      query: string;
      channelId: string;
    };

    if (!query || !channelId) {
      res.status(400).json({ error: 'query and channelId are required' });
      return;
    }

    // 1. Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. Search for relevant document chunks
    const { data: chunks, error: searchError } = await supabase.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.6,
      match_count: 5,
    });

    if (searchError) {
      console.error('Search error:', searchError);
    }

    const relevantChunks = chunks || [];

    // 3. Build context from relevant chunks
    const context = relevantChunks.length > 0
      ? relevantChunks
          .map((c: { document_name: string; chunk_index: number; content: string }) =>
            `[${c.document_name} - chunk ${c.chunk_index}]\n${c.content}`)
          .join('\n\n---\n\n')
      : '';

    // 4. Generate AI response with RAG context
    const systemMessage = context
      ? `You are a helpful internal AI assistant. Answer the user's question based on the following company documents. Always cite which document you referenced. If the documents don't contain relevant information, say so honestly and answer based on general knowledge.

DOCUMENTS:
${context}`
      : `You are a helpful internal AI assistant. No company documents are available yet. Answer based on general knowledge and suggest the user upload relevant documents for better answers.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: query },
      ],
      max_tokens: 1024,
    });

    const aiContent = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // 5. Save AI response as a message
    const ragSources = relevantChunks.map((c: { document_id: string; document_name: string; chunk_index: number; similarity: number }) => ({
      documentId: c.document_id,
      documentName: c.document_name,
      chunkIndex: c.chunk_index,
      similarity: c.similarity,
    }));

    const { error: insertError } = await supabase.from('messages').insert({
      channel_id: channelId,
      content: aiContent,
      is_ai_response: true,
      rag_sources: ragSources.length > 0 ? ragSources : null,
    });

    if (insertError) {
      console.error('Insert error:', insertError);
    }

    res.json({
      content: aiContent,
      sources: ragSources,
    });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});
