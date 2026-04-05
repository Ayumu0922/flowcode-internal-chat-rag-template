import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
);

export const searchRouter = Router();

searchRouter.post('/', async (req, res) => {
  try {
    const { query, matchCount = 5, matchThreshold = 0.7 } = req.body as {
      query: string;
      matchCount?: number;
      matchThreshold?: number;
    };

    if (!query) {
      res.status(400).json({ error: 'query is required' });
      return;
    }

    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Search for similar document chunks
    const { data, error } = await supabase.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
      return;
    }

    res.json({ results: data || [] });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search documents' });
  }
});
