# Error Codes Reference

Standard error codes for consistent error handling across cli4ai packages.

## Error Code Table

| Code | Exit Code | When to Use |
|------|-----------|-------------|
| `ENV_MISSING` | 4 | Required environment variable not set |
| `INVALID_INPUT` | 3 | Bad command arguments or options |
| `NOT_FOUND` | 2 | Requested resource doesn't exist |
| `AUTH_FAILED` | 6 | Authentication or authorization failed |
| `API_ERROR` | 1 | External API returned an error |
| `NETWORK_ERROR` | 7 | Connection failed, DNS error, timeout |
| `RATE_LIMITED` | 8 | Too many requests (429) |
| `TIMEOUT` | 9 | Operation timed out |
| `PARSE_ERROR` | 10 | JSON or data parsing failed |

## Usage Examples

### ENV_MISSING

```typescript
// Automatic with env()
const token = env('API_KEY');
// Exits with ENV_MISSING if not set

// Manual check
if (!process.env.OPTIONAL_VAR) {
  outputError('ENV_MISSING', 'OPTIONAL_VAR required for this operation');
}
```

### INVALID_INPUT

```typescript
if (!id || id.length < 3) {
  outputError('INVALID_INPUT', 'ID must be at least 3 characters', {
    provided: id,
    hint: 'Use a valid identifier'
  });
}

if (limit < 1 || limit > 100) {
  outputError('INVALID_INPUT', 'Limit must be between 1 and 100', {
    provided: limit
  });
}
```

### NOT_FOUND

```typescript
if (res.status === 404) {
  outputError('NOT_FOUND', `User ${userId} not found`, {
    userId,
    hint: 'Check the user ID and try again'
  });
}
```

### AUTH_FAILED

```typescript
if (res.status === 401) {
  outputError('AUTH_FAILED', 'Invalid API key', {
    hint: 'Run: cli4ai secrets set API_KEY "your-key"'
  });
}

if (res.status === 403) {
  outputError('AUTH_FAILED', 'Insufficient permissions', {
    required: 'admin',
    current: 'user'
  });
}
```

### API_ERROR

```typescript
if (!res.ok) {
  const body = await res.text();
  outputError('API_ERROR', `API returned ${res.status}`, {
    status: res.status,
    body: body.slice(0, 200)
  });
}
```

### NETWORK_ERROR

```typescript
try {
  await fetch(url);
} catch (err) {
  if (err.code === 'ECONNREFUSED') {
    outputError('NETWORK_ERROR', 'Connection refused', { url });
  }
  if (err.code === 'ENOTFOUND') {
    outputError('NETWORK_ERROR', 'DNS lookup failed', { host: err.hostname });
  }
  outputError('NETWORK_ERROR', err.message);
}
```

### RATE_LIMITED

```typescript
if (res.status === 429) {
  const retryAfter = res.headers.get('Retry-After');
  outputError('RATE_LIMITED', 'Too many requests', {
    retryAfter,
    hint: `Wait ${retryAfter} seconds before retrying`
  });
}
```

### TIMEOUT

```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);

try {
  await fetch(url, { signal: controller.signal });
} catch (err) {
  if (err.name === 'AbortError') {
    outputError('TIMEOUT', 'Request timed out after 30s', { url });
  }
  throw err;
} finally {
  clearTimeout(timeout);
}
```

### PARSE_ERROR

```typescript
try {
  const data = JSON.parse(responseText);
} catch {
  outputError('PARSE_ERROR', 'Invalid JSON response', {
    preview: responseText.slice(0, 100)
  });
}
```

## Error Output Format

All errors output JSON to stderr:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable message",
  "field": "additional context",
  "hint": "Suggestion for fixing"
}
```

## Best Practices

1. **Be specific**: Use the most specific error code that applies
2. **Include context**: Add relevant fields (IDs, values, hints)
3. **Provide hints**: Help users understand how to fix the issue
4. **Don't expose secrets**: Never include tokens or passwords in errors
5. **Consistent codes**: Use standard codes, don't invent new ones
