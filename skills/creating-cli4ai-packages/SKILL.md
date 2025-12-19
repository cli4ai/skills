---
name: creating-cli4ai-packages
description: Use this skill when creating, scaffolding, or developing cli4ai CLI tool packages. Invoke when the user asks to create a new cli4ai tool, build a CLI package, add commands to a package, set up package structure, or work with cli4ai.json manifests. Also use when debugging package issues, understanding @cli4ai/lib usage, or converting scripts into cli4ai packages.
---

# Creating cli4ai Packages

Build CLI tools that work with AI agents via JSON output conventions and MCP integration.

## Quick Start

```bash
cli4ai init my-package    # Scaffold new package
cd my-package
npm install
npm test                  # Verify setup
```

## Package Structure

```
my-package/
├── cli4ai.json          # Package manifest (source of truth)
├── run.ts               # Entry point (executable via tsx)
├── run.test.ts          # Tests
├── package.json         # Node.js metadata
├── tsconfig.json        # TypeScript config
├── vitest.config.ts     # Test config
├── README.md            # Documentation
├── .gitignore
└── lib/                 # Modules (when run.ts > 250 lines)
    ├── api.ts           # HTTP/API calls
    ├── types.ts         # TypeScript interfaces
    └── *.test.ts        # Colocated tests
```

## cli4ai.json Manifest

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "entry": "run.ts",
  "description": "What this tool does",
  "commands": {
    "list": {
      "description": "List items",
      "args": [{"name": "filter", "required": false}],
      "options": [{"name": "limit", "type": "number", "default": 20}]
    }
  },
  "env": {
    "API_KEY": {"required": true, "secret": true, "description": "API key"}
  },
  "dependencies": {
    "@cli4ai/lib": "^1.0.0",
    "commander": "^14.0.0"
  }
}
```

See `references/cli4ai-json-schema.md` for complete schema.

## Entry Point Pattern

```typescript
#!/usr/bin/env npx tsx
import { cli, output, outputError, log, env, withErrorHandling } from '@cli4ai/lib';

const program = cli('my-package', '1.0.0', 'Description');

program
  .command('list [filter]')
  .description('List items')
  .option('-l, --limit <n>', 'Max results', '20')
  .action(withErrorHandling(async (filter?: string, opts?: { limit: string }) => {
    const apiKey = env('API_KEY');
    log('Fetching...');                    // Progress to stderr
    const items = await fetchItems(apiKey, filter);
    output({ items, count: items.length }); // JSON to stdout
  }));

program.parse();
```

See `references/cli4ai-lib-api.md` for all @cli4ai/lib functions.

## Output Conventions

**Critical**: JSON to stdout (for AI), logs to stderr (for humans).

```typescript
// Data output (parsed by AI agents)
output({ messages: [...], count: 10, hasMore: true });

// Progress logging (human-readable)
log('Processing 50 items...');

// Error output (exits process)
outputError('NOT_FOUND', 'User not found', { userId: '123' });
```

Keep results flat:
```typescript
// Good
output({ items: [...], count: 10, total: 100 });

// Avoid nested structures
output({ data: { results: { items: [...] } } });
```

## Error Handling

Standard error codes:

| Code | Exit | Usage |
|------|------|-------|
| `ENV_MISSING` | 4 | Required env var not set |
| `INVALID_INPUT` | 3 | Bad args/options |
| `NOT_FOUND` | 2 | Resource doesn't exist |
| `AUTH_FAILED` | 6 | Authentication failed |
| `API_ERROR` | 1 | External API error |
| `RATE_LIMITED` | 8 | Too many requests |

```typescript
if (res.status === 401) outputError('AUTH_FAILED', 'Invalid API key');
if (res.status === 429) outputError('RATE_LIMITED', 'Too many requests');
if (!res.ok) outputError('API_ERROR', `HTTP ${res.status}`);
```

See `references/error-codes.md` for complete list.

## Environment Variables

Naming: `PACKAGENAME_VARNAME` (e.g., `SLACK_BOT_TOKEN`)

```typescript
const token = env('API_KEY');           // Required (exits if missing)
const url = envOr('API_URL', 'https://api.example.com'); // With default
```

Users set credentials:
```bash
cli4ai secrets set API_KEY "sk-..."
```

## Testing Requirements

Every package must have tests:

```typescript
import { describe, test, expect, vi } from 'vitest';

process.env.API_KEY = 'test-key';

describe('my-package', () => {
  test('returns expected result', async () => {
    const result = await myFunction('input');
    expect(result).toEqual({ success: true });
  });
});
```

```bash
npm test        # Run tests
npx vitest      # Watch mode
```

## Security Checklist

- [ ] No hardcoded secrets - all via env vars
- [ ] No command injection - use `execFileSync(['cmd', arg])`
- [ ] No SQL injection - use parameterized queries
- [ ] Handle rate limits (429 responses)
- [ ] Set timeouts on requests

## Template

Copy from `assets/template/` for a complete starter package.

## Workflow

1. **Scaffold**: `cli4ai init my-package`
2. **Define commands** in cli4ai.json
3. **Implement** in run.ts using @cli4ai/lib
4. **Test**: `npm test`
5. **Document** in README.md
6. **Publish**: `npm publish` or `cli4ai publish`
