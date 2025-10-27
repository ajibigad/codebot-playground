# Simple Browser Calculator - Claude Instructions

## Project Overview
This is a simple browser-based calculator application built with vanilla HTML, CSS, and JavaScript. It includes comprehensive Jest testing and uses npm for dependency management.

## Environment Setup

### Prerequisites
- Node.js and npm installed on your system

### Initial Setup
```bash
npm install
```

### Available Commands
- `npm run serve` - Start live-server on port 8080 (opens browser automatically)
- `npm test` - Run Jest test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Code Style Guidelines

### JavaScript
- Use vanilla JavaScript (no frameworks)
- Use `let` and `const` instead of `var`
- Use arrow functions for callbacks: `() => {}`
- Use template literals for string interpolation: `` `Hello ${name}` ``
- Use semicolons consistently
- Use meaningful variable names that describe their purpose
- Keep functions small and focused on single responsibility

### HTML
- Use semantic HTML5 elements
- Include proper accessibility attributes (`readonly`, `aria-label` where needed)
- Use consistent indentation (2 spaces)
- Close all tags properly

### CSS
- Use modern CSS features (Grid, Flexbox)
- Use consistent naming conventions for classes
- Use CSS custom properties for colors and spacing
- Keep styles organized by component/functionality
- Use responsive design principles

## Testing Standards

### Jest Testing
- All calculator functions MUST have comprehensive tests
- Test both happy path and edge cases
- Use descriptive test names that explain the expected behavior
- Group related tests using `describe` blocks
- Use `beforeEach` to set up clean state for each test
- Test error conditions (e.g., division by zero)
- Use `toBeCloseTo()` for floating-point number comparisons

### Test Structure
```javascript
describe('Function Name', () => {
  test('should do something specific', () => {
    // Arrange
    // Act  
    // Assert
  });
});
```

## File Structure
```
.
├── index.html          # Main HTML file
├── style.css           # Calculator styling
├── script.js           # Calculator logic
├── script.test.js      # Jest tests
├── package.json        # Dependencies and scripts
├── jest.config.js      # Jest configuration
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## Git Workflow

### Branch Naming
- Use `main` as the default branch (NOT master)
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Hotfixes: `hotfix/description`

### Commit Messages
- Use descriptive commit messages
- Start with a verb in imperative mood: "Add", "Fix", "Update", "Remove"
- Include scope when relevant: "Add calculator division tests"
- Keep first line under 50 characters

### IMPORTANT: Always run tests before committing
```bash
npm test
```

## Development Workflow

### Before Making Changes
1. Ensure all tests pass: `npm test`
2. Check current git status: `git status`

### During Development
1. Make incremental changes
2. Run tests frequently: `npm test`
3. Test manually in browser: `npm run serve`
4. Use `npm run test:watch` for continuous testing during development

### Before Committing
1. Run full test suite: `npm test`
2. Ensure code passes linting (if configured)
3. Test calculator functionality manually
4. Write descriptive commit message

## Calculator-Specific Guidelines

### Function Requirements
- `appendToDisplay(value)` - Handle number and decimal input
- `clearDisplay()` - Reset calculator state
- `deleteLast()` - Remove last character
- `calculate()` - Perform arithmetic operations

### Error Handling
- Division by zero MUST show "Error"
- Prevent multiple decimal points in same number
- Handle empty inputs gracefully
- Reset display state after calculations

### UI/UX Standards
- Buttons should have hover effects
- Display should be right-aligned
- Use consistent button sizing and spacing
- Ensure calculator is responsive on different screen sizes

## Common Issues and Solutions

### Testing Issues
- If tests fail, check that DOM is properly set up in `beforeEach`
- Ensure all global variables are reset between tests
- Use `toBeCloseTo()` for decimal number comparisons

### Calculator Logic
- Always validate input before performing calculations
- Handle edge cases like very large numbers
- Ensure operator precedence is correct
- Reset state properly after each calculation

## Performance Considerations
- Keep DOM queries to minimum (cache elements)
- Use event delegation where appropriate
- Avoid unnecessary DOM manipulations
- Test with large numbers to ensure no performance issues

## Security Notes
- This is a client-side calculator - no sensitive data handling
- Input validation prevents injection attacks
- No external dependencies beyond development tools

## Documentation Standards
- Update README.md when adding new features
- Include usage examples in documentation
- Keep comments in code concise but helpful
- Document any non-obvious business logic

## Troubleshooting

### Common Commands
```bash
# Clear npm cache if having issues
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check git status
git status

# View git log
git log --oneline
```

### Test Debugging
- Use `console.log()` in tests for debugging (remove before committing)
- Run single test: `npm test -- --testNamePattern="specific test name"`
- Use `--verbose` flag for detailed test output
