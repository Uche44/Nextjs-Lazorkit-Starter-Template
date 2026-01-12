# Contributing to LazorKit Next.js Auth Template

Thank you for your interest in contributing! This template is designed to help Web3 developers quickly implement authentication in their projects.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in [GitHub Issues](https://github.com/yourusername/lazorkit-nextjs-auth-template/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (Node version, OS, etc.)

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**:
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed
4. **Test your changes**:
   - Ensure `npm run build` succeeds
   - Test authentication flows
   - Check for TypeScript errors
5. **Commit your changes**: `git commit -m "feat: add your feature"`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks
- Keep components focused and reusable
- Remove debug console.logs before committing
- Use meaningful variable and function names

### Commit Message Format

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
- `feat: add email verification`
- `fix: resolve signature verification issue`
- `docs: update deployment guide`

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up your `.env` file (copy from `.env.example`)
4. Run migrations: `npx prisma migrate dev`
5. Start dev server: `npm run dev`

## Areas for Contribution

We welcome contributions in these areas:

- **Documentation**: Improve setup guides, add tutorials
- **Features**: Email verification, 2FA, social login integration
- **Testing**: Add unit and integration tests
- **Examples**: Create example implementations
- **Bug Fixes**: Fix reported issues
- **Performance**: Optimize database queries, reduce bundle size
- **Accessibility**: Improve a11y compliance

## Questions?

Feel free to open a discussion in GitHub Discussions or reach out to the maintainers.

Thank you for contributing! 🚀
