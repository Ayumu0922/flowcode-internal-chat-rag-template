import express from 'express';
import cors from 'cors';
import { embedRouter } from './api/embed.js';
import { searchRouter } from './api/search.js';
import { generateRouter } from './api/generate.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/embed', embedRouter);
app.use('/api/search', searchRouter);
app.use('/api/generate', generateRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
