// EvalScope API — REST and GraphQL endpoints

import express from 'express';

const app = express();
app.use(express.json());

const CATALOG = [
  { id: '1', name: 'LangChain', category: 'agent-framework', language: 'Python', stars: 95000, pricing: 'free', description: 'Framework for building LLM-powered applications' },
  { id: '2', name: 'CrewAI', category: 'agent-framework', language: 'Python', stars: 25000, pricing: 'free', description: 'Multi-agent orchestration framework' },
  { id: '3', name: 'Inspect AI', category: 'evaluation-harness', language: 'Python', stars: 8000, pricing: 'free', description: 'Framework for large language model evaluations' },
  { id: '4', name: 'promptfoo', category: 'evaluation-harness', language: 'TypeScript', stars: 12000, pricing: 'free', description: 'LLM evaluation and red-teaming tool' },
  { id: '5', name: 'LangSmith', category: 'observability', language: 'Python', stars: 5000, pricing: 'paid', description: 'LLM observability and evaluation platform' },
  { id: '6', name: 'GSM8K', category: 'benchmark', language: 'Python', stars: 3000, pricing: 'free', description: 'Math word problem benchmark' },
  { id: '7', name: 'HumanEval', category: 'benchmark', language: 'Python', stars: 4000, pricing: 'free', description: 'Code generation benchmark' },
  { id: '8', name: 'Guardrails', category: 'safety', language: 'Python', stars: 6000, pricing: 'free', description: 'LLM output guardrails and validation' },
  { id: '9', name: 'Langfuse', category: 'observability', language: 'TypeScript', stars: 7000, pricing: 'free', description: 'Open-source LLM observability' },
  { id: '10', name: 'AutoGen', category: 'agent-framework', language: 'Python', stars: 40000, pricing: 'free', description: 'Multi-agent conversation framework' },
];

app.get('/api/v1/entries', (_req, res) => {
  res.json({ entries: CATALOG, total: CATALOG.length });
});

app.get('/api/v1/entries/:id', (req, res) => {
  const entry = CATALOG.find(e => e.id === req.params.id);
  if (!entry) return res.status(404).json({ error: 'Not found' });
  res.json(entry);
});

app.get('/api/v1/search', (req, res) => {
  const q = (req.query.q as string || '').toLowerCase();
  const results = CATALOG.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.description.toLowerCase().includes(q) ||
    e.category.toLowerCase().includes(q)
  );
  res.json({ results, total: results.length });
});

app.get('/api/v1/compare', (req, res) => {
  const ids = (req.query.ids as string || '').split(',');
  const results = CATALOG.filter(e => ids.includes(e.id));
  res.json(results);
});

app.get('/api/v1/categories', (_req, res) => {
  const categories = [...new Set(CATALOG.map(e => e.category))];
  res.json(categories);
});

app.get('/api/v1/stats', (_req, res) => {
  res.json({
    total: CATALOG.length,
    categories: 5,
    avgStars: Math.round(CATALOG.reduce((a, e) => a + (e.stars || 0), 0) / CATALOG.length),
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`EvalScope API running on http://localhost:${PORT}`);
});
