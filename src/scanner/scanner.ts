/// EvalScope Scanner — Automated discovery of evaluation tools

import * as https from 'https';
import * as fs from 'fs';

interface EvalEntry {
  name: string;
  url: string;
  description: string;
  category: string;
  language: string;
  pricing: string;
  stars?: number;
  tags: string[];
}

const SEED_URLS = [
  'https://api.github.com/search/repositories?q=ai+agent+evaluation&sort=stars&per_page=10',
  'https://api.github.com/search/repositories?q=llm+benchmark&sort=stars&per_page=10',
  'https://api.github.com/search/repositories?q=evals+framework&sort=stars&per_page=10',
];

async function fetchJSON(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'EvalScope-Scanner' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function scan(): Promise<EvalEntry[]> {
  const entries: EvalEntry[] = [];

  for (const url of SEED_URLS) {
    try {
      const result = await fetchJSON(url);
      const items = result.items || [];
      for (const item of items) {
        entries.push({
          name: item.full_name || item.name,
          url: item.html_url,
          description: item.description || '',
          category: categorize(item),
          language: item.language || 'Unknown',
          pricing: 'free',
          stars: item.stargazers_count,
          tags: item.topics || [],
        });
      }
    } catch (err) {
      console.error(`Failed to scan ${url}:`, err);
    }
  }

  return entries;
}

function categorize(item: any): string {
  const desc = (item.description || '').toLowerCase();
  const topics = (item.topics || []).join(' ').toLowerCase();

  if (desc.includes('benchmark') || topics.includes('benchmark')) return 'benchmark';
  if (desc.includes('agent') || topics.includes('agent')) return 'agent-framework';
  if (desc.includes('evaluat') || topics.includes('eval')) return 'evaluation-harness';
  if (desc.includes('safety') || topics.includes('safety')) return 'safety';
  if (desc.includes('observ') || topics.includes('observability')) return 'observability';
  return 'tool';
}

async function main() {
  console.log('EvalScope Scanner — Starting scan...\n');
  const entries = await scan();
  fs.writeFileSync('./catalog.json', JSON.stringify(entries, null, 2));
  console.log(`Scan complete. Found ${entries.length} entries.`);
  console.log(`Results saved to catalog.json`);
}

main().catch(console.error);
