# cli4ai Skills

Claude Code Skills for [cli4ai](https://cli4ai.com) - the package manager for AI CLI tools.

These skills extend Claude Code with knowledge of cli4ai workflows, routines, and automation patterns.

## What are Skills?

Skills are modular capabilities that extend Claude Code's functionality. They package expertise into discoverable capabilities through organized folders containing instructions, scripts, and resources.

Learn more about Claude Code Skills in the [official documentation](https://docs.anthropic.com/en/docs/claude-code/skills).

## Available Skills

| Skill | Description |
|-------|-------------|
| [creating-cli4ai-routines](./skills/creating-cli4ai-routines/) | Create, edit, and debug cli4ai routines - reusable workflows that chain multiple cli4ai commands |

## Installation

### Install All Skills

Clone this repository to your Claude Code skills directory:

```bash
git clone https://github.com/cli4ai/skills.git ~/.claude/skills/cli4ai-skills
```

### Install a Single Skill

Copy just the skill folder you need:

```bash
# Example: Install only the routines skill
mkdir -p ~/.claude/skills
cp -r skills/creating-cli4ai-routines ~/.claude/skills/
```

## Usage

Once installed, skills activate automatically based on context. For example:

- "Create a cli4ai routine that..."
- "Help me build a workflow for..."
- "Debug this routine..."

## Prerequisites

These skills assume you have [cli4ai](https://cli4ai.com) installed:

```bash
npm install -g cli4ai
```

## Creating Your Own Skills

Use the [template](./template/) as a starting point for creating new cli4ai-related skills.

## Contributing

Contributions welcome! Please ensure your skill:

1. Has a clear, descriptive name (gerund form preferred)
2. Includes a compelling description with trigger keywords
3. Follows the structure in [template/](./template/)
4. Is tested with Claude Code

## Resources

- [cli4ai Documentation](https://cli4ai.com/docs)
- [cli4ai Packages](https://cli4ai.com/packages)
- [Claude Code Skills Documentation](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)

## License

MIT
