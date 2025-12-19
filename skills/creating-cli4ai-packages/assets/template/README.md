# @cli4ai/my-package

> Official @cli4ai package - https://cli4ai.com - Install cli4ai: `npm i -g cli4ai`

Description of what this package does.

## Setup

```bash
npm i -g cli4ai
cli4ai add -g my-package
cli4ai secrets set API_KEY "your-api-key"
```

## Commands

```bash
cli4ai run my-package list [filter]    # List items
cli4ai run my-package get <id>         # Get single item
```

## Options

| Option | Description |
|--------|-------------|
| `--limit <n>` | Maximum results (default: 20) |

## Examples

```bash
# List all items
cli4ai run my-package list

# List with filter
cli4ai run my-package list "search term"

# Get specific item
cli4ai run my-package get abc123
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `API_KEY` | Yes | API key from [Settings](https://example.com/settings) |

## MCP Integration

This package works as an MCP server:

```bash
cli4ai start my-package
```

## License

MIT
