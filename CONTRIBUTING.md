# Contributing to Caldera Token Allocation Checker

Thank you for your interest in contributing to the Caldera Token Allocation Checker! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/caldera_checker.git
cd caldera_checker
```

### 2. Set Up Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Create a Branch
```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Make Changes
- Follow the existing code style and conventions
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation if needed

### 5. Submit a Pull Request
```bash
# Push your changes
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Prefer explicit return types for functions
- Use meaningful variable and function names

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices
- Use proper prop types and interfaces

### Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use semantic HTML elements

### File Structure
```
src/
├── app/                 # Next.js app router
├── components/          # Reusable components
│   └── ui/             # UI components
├── config/             # Configuration files
├── lib/                # Utility functions
├── services/           # Business logic
└── types/              # TypeScript definitions
```

## 🧪 Testing

Currently, the project focuses on manual testing. Future contributions for automated testing are welcome:

- Unit tests for utility functions
- Integration tests for blockchain interactions
- End-to-end tests for user flows

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: Browser, OS, Node.js version
6. **Screenshots**: If applicable

## ✨ Feature Requests

For feature requests, please provide:

1. **Use Case**: Why is this feature needed?
2. **Description**: Detailed description of the feature
3. **Mockups**: Visual mockups if applicable
4. **Implementation Ideas**: Any implementation suggestions

## 🌐 Blockchain Integration Guidelines

When working with blockchain functionality:

- Use ethers.js for Web3 interactions
- Implement proper error handling for network issues
- Add appropriate loading states
- Consider gas estimation and optimization
- Test with multiple wallet providers

### Supported Chains
- Edgeless Mainnet
- Zero Network
- Solo Testnet
- Rivalz Network

## 🔒 Security Considerations

- Never commit private keys or sensitive data
- Validate all user inputs
- Use environment variables for configuration
- Implement proper error handling
- Consider rate limiting for API calls

## 📱 UI/UX Guidelines

- Maintain consistent design patterns
- Ensure accessibility compliance
- Test on multiple devices and screen sizes
- Provide clear feedback for user actions
- Implement proper loading and error states

## 🚀 Performance

- Optimize bundle size
- Implement proper code splitting
- Use React.memo and useMemo where appropriate
- Optimize images and assets
- Monitor Core Web Vitals

## 📄 Documentation

When adding new features:

- Update README.md if needed
- Add inline code comments for complex logic
- Update type definitions
- Include examples in documentation

## 🏷️ Commit Convention

Use conventional commits format:

```
type(scope): description

feat(ui): add new wallet connection modal
fix(blockchain): resolve gas estimation error
docs(readme): update installation instructions
style(components): improve responsive design
refactor(services): optimize scoring algorithm
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes nor adds feature
- `test`: Adding tests
- `chore`: Maintenance

## 🎯 Priority Areas for Contribution

1. **Testing**: Add comprehensive test coverage
2. **Performance**: Optimize blockchain queries
3. **UI/UX**: Enhance user experience
4. **Documentation**: Improve code documentation
5. **Accessibility**: Ensure WCAG compliance
6. **Mobile**: Enhance mobile experience

## 📞 Getting Help

- Open an issue for questions
- Join discussions in pull requests
- Check existing issues and PRs first

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Caldera Token Allocation Checker! 🚀
