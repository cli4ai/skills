#!/usr/bin/env npx tsx
/**
 * my-package - Description of what this tool does
 */

import { cli, output, outputError, log, env, withErrorHandling } from '@cli4ai/lib';

const program = cli('my-package', '1.0.0', 'Description of what this tool does');

// Example: List command
program
  .command('list [filter]')
  .description('List items')
  .option('-l, --limit <n>', 'Maximum results', '20')
  .action(withErrorHandling(async (filter?: string, options?: { limit: string }) => {
    const apiKey = env('API_KEY');
    const limit = parseInt(options?.limit || '20', 10);

    log('Fetching items...');

    // TODO: Replace with actual API call
    const items = await fetchItems(apiKey, filter, limit);

    output({
      items,
      count: items.length,
      filter: filter || null
    });
  }));

// Example: Get command
program
  .command('get <id>')
  .description('Get a single item by ID')
  .action(withErrorHandling(async (id: string) => {
    const apiKey = env('API_KEY');

    log(`Fetching item ${id}...`);

    // TODO: Replace with actual API call
    const item = await fetchItem(apiKey, id);

    if (!item) {
      outputError('NOT_FOUND', `Item ${id} not found`, { id });
    }

    output({ item });
  }));

program.parse();

// ============================================================================
// Helper Functions - Move to lib/ when this file exceeds 250 lines
// ============================================================================

interface Item {
  id: string;
  name: string;
  createdAt: string;
}

async function fetchItems(apiKey: string, filter?: string, limit = 20): Promise<Item[]> {
  // TODO: Implement actual API call
  // Example:
  // const res = await fetch('https://api.example.com/items', {
  //   headers: { Authorization: `Bearer ${apiKey}` }
  // });
  // if (!res.ok) outputError('API_ERROR', `HTTP ${res.status}`);
  // return res.json();

  return [
    { id: '1', name: 'Example Item 1', createdAt: new Date().toISOString() },
    { id: '2', name: 'Example Item 2', createdAt: new Date().toISOString() }
  ].slice(0, limit);
}

async function fetchItem(apiKey: string, id: string): Promise<Item | null> {
  // TODO: Implement actual API call
  if (id === '1') {
    return { id: '1', name: 'Example Item 1', createdAt: new Date().toISOString() };
  }
  return null;
}
