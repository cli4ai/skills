# cli4ai Routine Examples

Complete working examples demonstrating routine patterns.

## Example 1: Dev Briefing

Fetches trending GitHub repos and finds related YouTube tutorials.

**File**: `~/.cli4ai/routines/dev-briefing.routine.json`

```json
{
  "version": 1,
  "name": "dev-briefing",
  "description": "Morning dev briefing: trending repos + related YouTube content",
  "vars": {
    "lang": {
      "description": "Programming language filter",
      "default": ""
    }
  },
  "steps": [
    {
      "id": "trending",
      "type": "cli4ai",
      "package": "github",
      "command": "trending",
      "args": ["{{vars.lang}}"],
      "capture": "json"
    },
    {
      "id": "pick_repo",
      "type": "set",
      "vars": {
        "top_repo": "{{steps.trending.json.0.fullName}}"
      }
    },
    {
      "id": "videos",
      "type": "cli4ai",
      "package": "youtube",
      "command": "find",
      "args": ["{{vars.top_repo}} tutorial", "3"],
      "capture": "json"
    },
    {
      "id": "location",
      "type": "cli4ai",
      "package": "ipinfo",
      "command": "me",
      "args": [],
      "capture": "json"
    }
  ],
  "result": "{{steps}}"
}
```

**Usage:**
```bash
cli4ai routines run dev-briefing
cli4ai routines run dev-briefing --var lang=rust
cli4ai routines run dev-briefing --var lang=python
```

**Output structure:**
- `steps.trending.json` - Array of trending repos
- `vars.top_repo` - Name of top trending repo
- `steps.videos.json` - Related YouTube videos
- `steps.location.json` - Your IP location info

---

## Example 2: Repository Deep Dive

Gets comprehensive info about a specific GitHub repository.

**File**: `~/.cli4ai/routines/repo-dive.routine.json`

```json
{
  "version": 1,
  "name": "repo-dive",
  "description": "Deep dive into a GitHub repository",
  "vars": {
    "repo": {
      "description": "Repository in owner/name format",
      "required": true
    }
  },
  "steps": [
    {
      "id": "issues",
      "type": "cli4ai",
      "package": "github",
      "command": "issues",
      "args": ["{{vars.repo}}"],
      "capture": "json"
    },
    {
      "id": "prs",
      "type": "cli4ai",
      "package": "github",
      "command": "prs",
      "args": ["{{vars.repo}}"],
      "capture": "json"
    },
    {
      "id": "releases",
      "type": "cli4ai",
      "package": "github",
      "command": "releases",
      "args": ["{{vars.repo}}"],
      "capture": "json"
    },
    {
      "id": "videos",
      "type": "cli4ai",
      "package": "youtube",
      "command": "find",
      "args": ["{{vars.repo}}", "5"],
      "capture": "json",
      "continueOnError": true
    }
  ],
  "result": "{{steps}}"
}
```

**Usage:**
```bash
cli4ai routines run repo-dive --var repo=anthropics/claude-code
cli4ai routines run repo-dive --var repo=facebook/react
```

---

## Example 3: Video Research

Searches YouTube and extracts transcripts for research.

**File**: `~/.cli4ai/routines/video-research.routine.json`

```json
{
  "version": 1,
  "name": "video-research",
  "description": "Search YouTube and get transcript from top result",
  "vars": {
    "query": {
      "description": "Search query",
      "required": true
    }
  },
  "steps": [
    {
      "id": "search",
      "type": "cli4ai",
      "package": "youtube",
      "command": "find",
      "args": ["{{vars.query}}", "1"],
      "capture": "json"
    },
    {
      "id": "pick_video",
      "type": "set",
      "vars": {
        "video_url": "{{steps.search.json.0.url}}"
      }
    },
    {
      "id": "transcript",
      "type": "cli4ai",
      "package": "youtube",
      "command": "transcript",
      "args": ["{{vars.video_url}}", "text"],
      "capture": "json"
    }
  ],
  "result": "{{steps}}"
}
```

**Usage:**
```bash
cli4ai routines run video-research --var query="react server components explained"
```

---

## Example 4: Channel Monitor

Lists recent videos from a YouTube channel.

**File**: `~/.cli4ai/routines/channel-check.routine.json`

```json
{
  "version": 1,
  "name": "channel-check",
  "description": "Check recent videos from a YouTube channel",
  "vars": {
    "channel": {
      "description": "YouTube channel handle (e.g., @fireship)",
      "required": true
    },
    "limit": {
      "description": "Number of videos to fetch",
      "default": "5"
    }
  },
  "steps": [
    {
      "id": "videos",
      "type": "cli4ai",
      "package": "youtube",
      "command": "channel",
      "args": ["{{vars.channel}}", "{{vars.limit}}"],
      "capture": "json"
    }
  ],
  "result": "{{steps.videos.json}}"
}
```

**Usage:**
```bash
cli4ai routines run channel-check --var channel=@fireship
cli4ai routines run channel-check --var channel=@ThePrimeagen --var limit=10
```

---

## Example 5: Multi-IP Lookup

Look up multiple IPs with a single routine.

**File**: `~/.cli4ai/routines/ip-check.routine.json`

```json
{
  "version": 1,
  "name": "ip-check",
  "description": "Look up information for multiple IP addresses",
  "vars": {
    "ips": {
      "description": "Comma-separated IP addresses",
      "required": true
    }
  },
  "steps": [
    {
      "id": "lookup",
      "type": "cli4ai",
      "package": "ipinfo",
      "command": "bulk",
      "args": ["{{vars.ips}}"],
      "capture": "json"
    }
  ],
  "result": "{{steps.lookup.json}}"
}
```

**Usage:**
```bash
cli4ai routines run ip-check --var ips="8.8.8.8,1.1.1.1,208.67.222.222"
```

---

## Pattern: Data Extraction Chain

A common pattern is fetching data, extracting a value, then using it:

```json
{
  "steps": [
    {
      "id": "fetch",
      "type": "cli4ai",
      "package": "some-package",
      "command": "get-data",
      "args": [],
      "capture": "json"
    },
    {
      "id": "extract",
      "type": "set",
      "vars": {
        "needed_value": "{{steps.fetch.json.path.to.value}}"
      }
    },
    {
      "id": "use",
      "type": "cli4ai",
      "package": "another-package",
      "command": "process",
      "args": ["{{vars.needed_value}}"],
      "capture": "json"
    }
  ]
}
```

## Pattern: Parallel-ish Data Gathering

Gather multiple independent pieces of data:

```json
{
  "steps": [
    {
      "id": "source_a",
      "type": "cli4ai",
      "package": "github",
      "command": "trending",
      "args": [],
      "capture": "json"
    },
    {
      "id": "source_b",
      "type": "cli4ai",
      "package": "ipinfo",
      "command": "me",
      "args": [],
      "capture": "json"
    },
    {
      "id": "source_c",
      "type": "cli4ai",
      "package": "youtube",
      "command": "find",
      "args": ["tech news today", "3"],
      "capture": "json"
    }
  ],
  "result": {
    "github": "{{steps.source_a.json}}",
    "location": "{{steps.source_b.json}}",
    "videos": "{{steps.source_c.json}}"
  }
}
```

## Pattern: Error-Tolerant Steps

Use `continueOnError` for non-critical steps:

```json
{
  "id": "optional_data",
  "type": "cli4ai",
  "package": "some-package",
  "command": "might-fail",
  "args": [],
  "capture": "json",
  "continueOnError": true
}
```

The routine continues even if this step fails, and subsequent steps can check if data exists.
