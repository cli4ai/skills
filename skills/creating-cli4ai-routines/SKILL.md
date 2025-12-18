---
name: creating-cli4ai-routines
description: Use this skill when creating, editing, or debugging cli4ai routines. Invoke when the user mentions cli4ai routines, workflow automation, chaining cli4ai commands, scheduling tasks, or building reusable cli4ai workflows. Also use when converting manual cli4ai command sequences into automated routines.
---

# Creating cli4ai Routines

Build reusable workflows that chain multiple cli4ai commands with automatic data piping between steps.

# Core Concepts

**Routines** are workflows that execute cli4ai commands sequentially, passing data between steps using templating. They support:
- Chaining multiple packages (github, youtube, ipinfo, etc.)
- Data extraction and piping via `{{steps.id.json}}`
- Variable parameters via `{{vars.name}}`
- Two formats: JSON (structured) and bash scripts

# Routine Locations

- **Global**: `~/.cli4ai/routines/` - Available everywhere
- **Project**: `./.cli4ai/routines/` - Project-specific

# JSON Routine Format (.routine.json)

```json
{
  "version": 1,
  "name": "routine-name",
  "description": "What this routine does",
  "vars": {
    "param_name": {
      "description": "Parameter description",
      "default": "default_value"
    }
  },
  "steps": [],
  "result": "{{steps}}"
}
```

**Required fields:**
- `version`: Must be `1`
- `name`: Routine identifier
- `steps`: Array of step objects

# Step Types

## 1. cli4ai Steps

Execute a cli4ai package command:

```json
{
  "id": "unique_step_id",
  "type": "cli4ai",
  "package": "github",
  "command": "trending",
  "args": ["{{vars.lang}}"],
  "capture": "json"
}
```

**Fields:**
- `id`: Unique identifier for referencing in templates
- `type`: Must be `"cli4ai"`
- `package`: Package name (github, youtube, ipinfo, etc.)
- `command`: Command within the package
- `args`: Array of arguments (supports templating)
- `capture`: Optional, `"json"` to parse output as JSON
- `continueOnError`: Optional boolean, continue if step fails

## 2. Set Steps

Assign variables from previous step outputs:

```json
{
  "id": "extract_data",
  "type": "set",
  "vars": {
    "top_repo": "{{steps.trending.json.0.fullName}}",
    "star_count": "{{steps.trending.json.0.stargazersCount}}"
  }
}
```

## 3. Exec Steps

Run external commands:

```json
{
  "id": "run_script",
  "type": "exec",
  "cmd": "node",
  "args": ["process.js", "{{vars.input}}"],
  "capture": "json"
}
```

# Templating Syntax

Access variables and step outputs using double braces:

| Template | Description |
|----------|-------------|
| `{{vars.name}}` | Input variable |
| `{{steps.id.json}}` | Full JSON output from step |
| `{{steps.id.json.0}}` | First array element |
| `{{steps.id.json.0.field}}` | Nested field access |
| `{{steps.id.stdout}}` | Raw stdout |
| `{{steps.id.value}}` | Value from set step |

# CLI Commands

```bash
# List routines
cli4ai routines list

# Create new routine
cli4ai routines create my-routine --type json

# Show routine definition
cli4ai routines show my-routine

# Run routine
cli4ai routines run my-routine --var key=value

# Run with multiple variables
cli4ai routines run my-routine --var lang=rust --var limit=5

# Dry run (preview without executing)
cli4ai routines run my-routine --dry-run

# Edit routine
cli4ai routines edit my-routine

# Remove routine
cli4ai routines rm my-routine
```

# Step-by-Step: Creating a Routine

## 1. Identify the Workflow

Determine what cli4ai packages and commands you need:

```bash
# List installed packages
cli4ai list

# Get package info and available commands
cli4ai info <package>
```

## 2. Create the Routine File

```bash
cli4ai routines create my-workflow --type json --global
```

## 3. Define Variables

Add input parameters users can customize:

```json
"vars": {
  "language": {
    "description": "Programming language to filter",
    "default": "javascript"
  },
  "count": {
    "description": "Number of results",
    "default": "5"
  }
}
```

## 4. Build Step Chain

Design steps that pipe data forward:

1. **Data gathering step** - Fetch initial data
2. **Extraction step** - Pull out needed values with `type: "set"`
3. **Follow-up steps** - Use extracted values in subsequent calls
4. **Output step** - Final data collection

## 5. Test the Routine

```bash
# Dry run first
cli4ai routines run my-workflow --dry-run

# Run with default vars
cli4ai routines run my-workflow

# Run with custom vars
cli4ai routines run my-workflow --var language=python
```

# Examples

See `./routine-examples.md` for complete working examples including:
- Dev briefing (GitHub trending + YouTube)
- Repository monitoring
- Multi-source research workflows

# Best Practices

- **Unique step IDs**: Use descriptive, unique IDs for each step
- **Capture JSON**: Always use `capture: "json"` when you need to access output fields
- **Extract early**: Use `set` steps to extract values before using them
- **Default variables**: Provide sensible defaults so routines work without arguments
- **Error handling**: Use `continueOnError: true` for non-critical steps
- **Test incrementally**: Build one step at a time, testing each

# Troubleshooting

## "Invalid or missing version"
Add `"version": 1` to the root of your JSON.

## "Invalid step type"
Step `type` must be exactly `"cli4ai"`, `"set"`, or `"exec"`.

## Template not resolving
- Check step ID matches exactly (case-sensitive)
- Ensure the referenced step runs before the current step
- Verify `capture: "json"` is set if accessing `.json`

## Package command not found
Run `cli4ai info <package>` to see available commands.

# Scheduling Routines

Routines can be scheduled for automatic execution:

```bash
# Start scheduler daemon
cli4ai scheduler start

# Add scheduled routine (cron syntax)
cli4ai scheduler add my-routine "0 9 * * *" --var lang=rust

# List scheduled routines
cli4ai scheduler list

# Remove scheduled routine
cli4ai scheduler remove <id>

# Stop scheduler
cli4ai scheduler stop
```

# Supporting Files

- See `./routine-examples.md` for complete working examples
- See `./templates/routine-template.json` for starter template
