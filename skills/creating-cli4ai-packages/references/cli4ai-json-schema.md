# cli4ai.json Schema Reference

Complete schema for package manifests.

## Required Fields

```json
{
  "name": "my-package",        // lowercase, alphanumeric, hyphens
  "version": "1.0.0",          // semver (x.y.z)
  "entry": "run.ts",           // relative path to main file
  "description": "What it does"
}
```

## Full Example

```json
{
  "name": "github",
  "version": "1.0.10",
  "entry": "run.ts",
  "description": "GitHub CLI wrapper for notifications, repos, and activity",
  "author": "Your Name",
  "license": "BUSL-1.1",
  "runtime": "node",
  "keywords": ["cli4ai", "github", "git"],

  "commands": {
    "notifs": {
      "description": "Your GitHub notifications"
    },
    "repos": {
      "description": "List repositories",
      "args": [
        {
          "name": "user",
          "description": "GitHub username",
          "required": false,
          "type": "string"
        }
      ]
    },
    "activity": {
      "description": "Recent activity for a user",
      "args": [
        {
          "name": "user",
          "description": "GitHub username",
          "required": true
        }
      ],
      "options": [
        {
          "name": "limit",
          "short": "l",
          "type": "number",
          "default": 20,
          "description": "Max results"
        }
      ]
    }
  },

  "env": {
    "GITHUB_TOKEN": {
      "required": true,
      "secret": true,
      "description": "GitHub personal access token"
    },
    "GITHUB_API_URL": {
      "required": false,
      "default": "https://api.github.com",
      "description": "GitHub API base URL"
    }
  },

  "dependencies": {
    "@cli4ai/lib": "^1.0.0",
    "commander": "^14.0.0"
  },

  "mcp": {
    "enabled": true,
    "transport": "stdio"
  },

  "files": [
    "run.ts",
    "cli4ai.json",
    "README.md",
    "LICENSE"
  ]
}
```

## Commands Schema

### args (Positional Arguments)

```json
"args": [
  {
    "name": "id",           // Argument name
    "description": "...",   // Help text
    "required": true,       // Default: false
    "type": "string"        // "string" | "number" | "boolean"
  }
]
```

In Commander.js:
- Required: `<id>`
- Optional: `[id]`

### options (Flags)

```json
"options": [
  {
    "name": "limit",        // Full name (--limit)
    "short": "l",           // Short flag (-l)
    "type": "number",       // "string" | "number" | "boolean"
    "default": 20,          // Default value
    "description": "..."    // Help text
  }
]
```

## Environment Variables Schema

```json
"env": {
  "VAR_NAME": {
    "required": true,       // Must be set
    "secret": true,         // Hide from logs, use cli4ai secrets
    "description": "...",   // Help text
    "default": "value"      // Fallback (if not required)
  }
}
```

Naming convention: `PACKAGENAME_VARNAME`

Examples:
- `SLACK_BOT_TOKEN`
- `POSTGRES_URL`
- `GITHUB_TOKEN`

## MCP Configuration

```json
"mcp": {
  "enabled": true,          // Enable MCP server mode
  "transport": "stdio"      // Transport type
}
```

When enabled, `cli4ai start <package>` wraps the CLI as an MCP server.

## Files Field

List of files to include when publishing:

```json
"files": [
  "run.ts",
  "lib/",
  "cli4ai.json",
  "README.md",
  "LICENSE"
]
```

## Dependencies

Standard npm dependency format:

```json
"dependencies": {
  "@cli4ai/lib": "^1.0.0",
  "commander": "^14.0.0",
  "pg": "^8.11.0"
}
```

Required for all packages:
- `@cli4ai/lib` - Core utilities
- `commander` - CLI argument parsing
