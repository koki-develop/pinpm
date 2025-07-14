# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

pinpm is a CLI tool that pins package versions in package.json based on the lock file. It supports npm, pnpm, and bun package managers.

## Development Commands

### Build & Format
```bash
# Format and lint code
bun run fmt

# Build the project
bun run build

# Clean build
rm -rf dist && bun run build
```

### Development Workflow
1. **Runtime**: Bun 1.2.12 (primary) or Node.js 24.4.0 (managed with mise)
2. **Formatter/Linter**: Biome 1.9.4 - used for both formatting and linting
3. **Build Tool**: Bun's built-in bundler compiles TypeScript to Node.js executable

### Running the CLI
```bash
# Development (from source)
bun run src/index.ts [options]

# Production (after build)
./dist/index.js [options]
```

## Architecture

### Code Structure
- `src/index.ts` - CLI entry point using Commander framework
- `src/main.ts` - Core logic for pinning dependencies
- `src/lib/` - Package manager implementations:
  - `package-manager.ts` - Abstract base class
  - `npm.ts`, `pnpm.ts`, `bun.ts` - Specific implementations
- `tasks/build.ts` - Custom build script using Bun

### Key Patterns
1. **Package Manager Abstraction**: Each package manager extends a common base class with methods for reading lock files and extracting dependency versions
2. **Async Processing**: All I/O operations use async/await
3. **Progress Feedback**: Uses spinner (nanospinner) for visual feedback during operations
4. **Error Handling**: Consistent error messages with proper exit codes

### Important Implementation Details
- Lock file parsing is package-manager specific:
  - npm: `package-lock.json` (JSON format)
  - pnpm: `pnpm-lock.yaml` (YAML, uses `@pnpm/lockfile-file`)
  - bun: `bun.lockb` (binary, requires `bun` command)
- Version pinning modifies `package.json` using `@npmcli/package-json`
- Support for workspaces and nested dependencies
- Preserves existing package.json formatting

## Testing
Currently, there are no automated tests. When implementing tests:
- Use Bun's built-in test runner
- Focus on package manager detection and version extraction logic
- Test workspace and monorepo scenarios