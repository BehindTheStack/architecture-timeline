# Contributing to Architecture Timeline

First off, thank you for considering contributing to Architecture Timeline! 🎉

## 🤝 How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, etc.)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature already exists
- Provide clear use cases
- Explain why this would be useful
- Consider implementation complexity

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the code style** (TypeScript/Python conventions)
3. **Write clear commit messages**
4. **Test your changes** locally with Docker
5. **Update documentation** if needed
6. **Submit the PR** with a clear description

## 🏗️ Development Setup

```bash
# Clone your fork
git clone git@github.com:YOUR_USERNAME/architecture-timeline.git
cd architecture-timeline

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Make your changes with hot-reload enabled!
```

## 📝 Code Style

### TypeScript/React
- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript types (avoid `any`)
- Follow existing component patterns
- Use Tailwind CSS for styling

### Python/FastAPI
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Keep routes simple and focused

## 🧪 Testing

Before submitting:
- ✅ Test all visualization modes (Cards, Magazine, Grid, Timeline)
- ✅ Test filters and search functionality
- ✅ Check responsive design on mobile
- ✅ Verify Docker builds work
- ✅ Check for console errors

## 📋 Commit Message Convention

Use clear, descriptive commit messages:

```
feat: Add export to PDF feature
fix: Resolve date range filter bug
docs: Update API documentation
style: Format code with prettier
refactor: Improve filter performance
test: Add unit tests for sorting
chore: Update dependencies
```

## 🌟 Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Credited in the UI (optional)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Questions?

Feel free to open an issue for discussion or reach out to [@BehindTheStack](https://github.com/BehindTheStack).

Thank you for making this project better! 🚀
