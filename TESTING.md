# Testing Guide

This project uses [Vitest](https://vitest.dev/) for unit and component testing, along with [Vue Test Utils](https://test-utils.vuejs.org/) for Vue component testing.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (recommended for development)
```bash
npm test -- --watch
```

### Run tests with UI (visual test runner)
```bash
npm run test:ui
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

Tests are organized alongside the source code:

```
src/
├── composables/
│   ├── __tests__/
│   │   ├── useCart.test.js
│   │   ├── useAlgolia.test.js
│   │   └── useToast.test.js
│   ├── useCart.js
│   ├── useAlgolia.js
│   └── useToast.js
└── components/
    ├── __tests__/
    │   └── ProductCard.test.js
    └── ProductCard.vue
```

## Test Coverage

Current test coverage includes:

### Composables
- ✅ **useCart.js** - Cart management functionality
  - Adding/removing items
  - Quantity updates
  - Price calculations (subtotal, tax, total)
  - Cart state management
  - localStorage persistence

- ✅ **useToast.js** - Toast notification system
  - Different toast types (success, error, warning, info)
  - Auto-removal after duration
  - Manual removal
  - Multiple toasts handling

- ✅ **useAlgolia.js** - Algolia search integration
  - Client initialization
  - Search functionality
  - Get object by ID
  - Error handling
  - Environment variable configuration

### Components
- ✅ **ProductCard.vue** - Product card display
  - Product information rendering
  - Image loading and error handling
  - Add to cart functionality
  - Navigation to product detail
  - Stock availability display
  - Rating display

## Writing New Tests

### Test File Naming
- Test files should be named `*.test.js`
- Place test files in `__tests__` directory next to the source files

### Example Test Structure

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  })

  it('should do something', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = someFunction(input)
    
    // Assert
    expect(result).toBe('expected')
  })
})
```

### Mocking

#### Mock a composable
```javascript
vi.mock('../composables/useCart', () => ({
  useCart: () => ({
    addItem: vi.fn()
  })
}))
```

#### Mock vue-router
```javascript
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))
```

#### Mock localStorage
```javascript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how it does it
2. **Use descriptive test names** - Test names should clearly describe what is being tested
3. **Arrange-Act-Assert pattern** - Structure tests in three clear phases
4. **Mock external dependencies** - Isolate the code under test
5. **Test edge cases** - Don't just test the happy path
6. **Keep tests simple** - Each test should test one thing
7. **Use beforeEach for common setup** - Reduce duplication in test code

## CI/CD Integration

Tests should be run as part of your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage
```

## Debugging Tests

### Run a specific test file
```bash
npm test useCart.test.js
```

### Run tests matching a pattern
```bash
npm test -- --grep "should add item"
```

### Debug in VS Code
Add this configuration to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Coverage Goals

Aim for:
- **80%+ line coverage** for critical business logic
- **100% coverage** for utility functions
- **Focus on meaningful tests** rather than arbitrary coverage numbers

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils Documentation](https://test-utils.vuejs.org/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
