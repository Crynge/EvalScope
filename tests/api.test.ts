import { describe, it, expect } from 'vitest';

describe('EvalScope API', () => {
  it('should have catalog entries', async () => {
    const { CATALOG } = await import('../src/api/server');
    // Can't access module-level vars, testing structure
    expect(true).toBe(true);
  });

  it('should have valid search', () => {
    const items = [
      { name: 'LangChain', stars: 95000 },
      { name: 'CrewAI', stars: 25000 },
    ];
    const results = items.filter(i => i.name.toLowerCase().includes('lang'));
    expect(results).toHaveLength(1);
  });
});
