# @cli4ai/lib API Reference

Core utilities for building cli4ai packages.

## CLI Setup

### cli(name, version, description)

Create a Commander.js program with cli4ai branding:

```typescript
import { cli } from '@cli4ai/lib';

const program = cli('my-package', '1.0.0', 'Package description');

program
  .command('list')
  .action(async () => { /* ... */ });

program.parse();
```

## Output Functions

### output(data)

Emit JSON to stdout. This is what AI agents parse.

```typescript
import { output } from '@cli4ai/lib';

output({ items: [...], count: 10 });
// Outputs: {"items":[...],"count":10}
```

Always use for final results. Keep structure flat and predictable.

### outputError(code, message, details?, exitCode?)

Emit error JSON to stderr and exit process.

```typescript
import { outputError } from '@cli4ai/lib';

outputError('NOT_FOUND', 'User not found', { userId: '123' });
// Outputs to stderr: {"error":"NOT_FOUND","message":"User not found","userId":"123"}
// Exits with code 2

outputError('API_ERROR', 'Request failed', {}, 1);
// Custom exit code
```

### log(message)

Log progress to stderr. Doesn't pollute JSON output.

```typescript
import { log } from '@cli4ai/lib';

log('Fetching data...');       // Fetching data...
log('Processing 50 items');    // Processing 50 items
```

Use for human-readable progress, not data.

## Environment Functions

### env(name)

Get required environment variable. Exits with error if missing.

```typescript
import { env } from '@cli4ai/lib';

const token = env('API_KEY');
// Returns value or exits with ENV_MISSING error
```

### envOr(name, defaultValue)

Get environment variable with fallback.

```typescript
import { envOr } from '@cli4ai/lib';

const url = envOr('API_URL', 'https://api.example.com');
// Returns env value or default
```

## Error Handling

### withErrorHandling(fn)

Wrap async action to catch uncaught errors.

```typescript
import { withErrorHandling } from '@cli4ai/lib';

program
  .command('fetch')
  .action(withErrorHandling(async () => {
    // Uncaught errors become API_ERROR
    const data = await fetchData();
    output(data);
  }));
```

## Utility Functions

### parseJson<T>(str, context?)

Safe JSON parsing with error handling.

```typescript
import { parseJson } from '@cli4ai/lib';

const data = parseJson<MyType>(jsonString, 'API response');
// Throws descriptive error on parse failure
```

### sleep(ms)

Promise-based delay.

```typescript
import { sleep } from '@cli4ai/lib';

await sleep(1000); // Wait 1 second
```

### formatBytes(bytes)

Human-readable file sizes.

```typescript
import { formatBytes } from '@cli4ai/lib';

formatBytes(1024);      // "1 KB"
formatBytes(1048576);   // "1 MB"
```

### formatDate(date)

ISO date string (YYYY-MM-DD).

```typescript
import { formatDate } from '@cli4ai/lib';

formatDate(new Date()); // "2024-01-15"
```

### formatDateTime(date)

ISO datetime string.

```typescript
import { formatDateTime } from '@cli4ai/lib';

formatDateTime(new Date()); // "2024-01-15T10:30:00Z"
```

## Complete Import Example

```typescript
#!/usr/bin/env npx tsx
import {
  cli,
  output,
  outputError,
  log,
  env,
  envOr,
  withErrorHandling,
  parseJson,
  sleep,
  formatBytes,
  formatDate,
  formatDateTime
} from '@cli4ai/lib';
```

## Typical Command Pattern

```typescript
program
  .command('fetch <id>')
  .description('Fetch item by ID')
  .option('-f, --format <type>', 'Output format', 'json')
  .action(withErrorHandling(async (id: string, opts: { format: string }) => {
    const apiKey = env('API_KEY');
    const baseUrl = envOr('API_URL', 'https://api.example.com');

    log(`Fetching item ${id}...`);

    const res = await fetch(`${baseUrl}/items/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    if (res.status === 401) {
      outputError('AUTH_FAILED', 'Invalid API key');
    }
    if (res.status === 404) {
      outputError('NOT_FOUND', `Item ${id} not found`, { id });
    }
    if (!res.ok) {
      outputError('API_ERROR', `HTTP ${res.status}`);
    }

    const item = await res.json();
    output({ item, fetchedAt: formatDateTime(new Date()) });
  }));
```
