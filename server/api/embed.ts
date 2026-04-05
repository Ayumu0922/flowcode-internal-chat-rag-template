import { Router } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const embedRouter = Router();

embedRouter.post('/', async (req, res) => {
  try {
    const { texts } = req.body as { texts: string[] };

    if (!texts || texts.length === 0) {
      res.status(400).json({ error: 'texts array is required' });
      return;
    }

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });

    const embeddings = response.data.map((d) => d.embedding);
    res.json({ embeddings });
  } catch (error) {
    console.error('Embedding error:', error);
    res.status(500).json({ error: 'Failed to generate embeddings' });
  }
});
