# Skill Template

Use this template to create new cli4ai-related skills.

## Quick Start

1. Copy this folder to create your skill:
   ```bash
   cp -r template skills/your-skill-name
   ```

2. Edit `SKILL.md`:
   - Update the `name` field (use gerund form: `creating-x`, `managing-y`)
   - Write a clear `description` with trigger keywords
   - Add your instructions and examples

3. Add supporting files as needed:
   - Use intention-revealing names (`./workflow-patterns.md` not `./helpers.md`)
   - Reference them in SKILL.md with relative paths

## Skill Structure

```
your-skill-name/
├── SKILL.md              # Required - main instructions
├── examples.md           # Optional - detailed examples
├── templates/            # Optional - starter templates
│   └── example.json
└── scripts/              # Optional - helper scripts (Node.js)
    └── helper.js
```

## Guidelines

- **Name**: Use gerund form (`creating-routines`, not `routine-helper`)
- **Description**: Include trigger keywords users would say
- **Instructions**: Be specific and actionable
- **Examples**: Show concrete usage patterns
- **Keep it focused**: One skill = one capability
