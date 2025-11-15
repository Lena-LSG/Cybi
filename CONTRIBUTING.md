# Contributing

Thanks for helping improve this Discord bot! Whether you are filing a bug, proposing an idea, or submitting code, please follow the guidelines below so we can keep things tidy.

## Getting Started
1. Fork the repository and clone your fork locally.
2. Install dependencies: `npm install`
3. Create a feature branch: `git checkout -b feature/my-awesome-change`
4. Copy `.env.example` → `.env` and supply your own Discord credentials (and optional Google API keys).
5. Run the bot locally: `npm run dev` and deploy slash commands with `npm run deploy:guild`.

## Development Checklist
- Lint before committing: `npm run lint`
- Keep PRs focused—one feature/bug per pull request.
- Include tests when practical (Vitest) or explain why testing isn’t feasible.
- Update documentation (README/CHANGELOG/etc.) when behaviour changes.

## Commit & PR Style
- Use descriptive commit messages (`feat: add slowmode command`).
- Reference GitHub issues when applicable.
- Fill out the PR template so reviewers understand the problem, solution, and validation steps.

## Reporting Bugs / Requesting Features
- Search existing issues before creating a new one.
- Use the provided templates under `.github/ISSUE_TEMPLATE`.
- Include reproduction steps, expected vs. actual behaviour, and environment details.

## Code of Conduct
Participating in this project means agreeing to the [Code of Conduct](./CODE_OF_CONDUCT.md). Be excellent to each other.

## Security
Please **do not file public issues** for vulnerabilities. Follow the instructions in [SECURITY.md](./SECURITY.md) instead.

Happy hacking! 🎉
