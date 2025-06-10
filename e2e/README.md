# End-to-End Testing with Playwright

This directory contains comprehensive E2E tests for the DineEasy restaurant management system.

## Test Structure

### Core User Journey Tests (`user-journey.spec.ts`)
- Complete customer dining experience from QR scan to order completion
- Form validation and error handling
- Menu browsing and cart interactions
- Session timer functionality
- Mobile device compatibility
- Network error scenarios

### Multi-Participant Tests (`multi-participant.spec.ts`)
- Multiple customers joining the same table session
- Real-time cart synchronization between participants
- Concurrent cart modifications and conflict resolution
- Participant joining/leaving scenarios
- Session timer consistency across participants
- Network interruption handling

### Staff Workflow Tests (`staff-workflows.spec.ts`)
- Staff dashboard with active sessions and service requests
- Table management and session control
- Menu item management (availability toggles, new items)
- Service request completion
- Analytics dashboard
- Authentication and role-based permissions

### Setup Test (`example.spec.ts`)
- Basic smoke tests to verify E2E environment
- Homepage loading verification
- 404 handling

## Running Tests

### Prerequisites
1. Ensure your development server is running: `npm run dev`
2. Make sure Playwright browsers are installed: `npx playwright install`

### Test Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug

# Run specific test file
npx playwright test user-journey.spec.ts

# Run tests on specific browser
npx playwright test --project=chromium
```

### Test Environments

The tests are configured to run on:
- **Desktop**: Chromium, Firefox, WebKit
- **Mobile**: Chrome Mobile, Safari Mobile

## Test Data & Mocking

### Supabase Mocking
Tests use mocked Supabase responses to avoid dependencies on a real database:
- Mock restaurant data
- Mock session creation and management
- Mock participant and cart data
- Mock staff authentication

### Test Data
- Restaurant: `test-restaurant` with ID `restaurant-123`
- Table: `table-123` (Table 5)
- Test users: Various participant names for different scenarios
- Staff: `staff-123` (John Staff, Waiter role)

## Key Test Scenarios

### Customer Experience
1. **QR Code to Order**: Complete flow from scanning QR code to placing order
2. **Multi-User Collaboration**: Multiple customers sharing a cart
3. **Real-time Updates**: Cart changes reflected across all participants
4. **Service Requests**: Calling waiter, requesting check, etc.

### Staff Experience
1. **Session Management**: Monitoring active tables and extending/ending sessions
2. **Service Queue**: Managing customer service requests
3. **Menu Management**: Updating item availability and adding new items
4. **Analytics**: Viewing restaurant performance metrics

### Error Handling
1. **Network Issues**: Offline/online state handling
2. **Validation**: Form input validation and error messages
3. **Invalid URLs**: 404 handling for bad restaurant/table URLs
4. **Concurrent Access**: Multiple users modifying cart simultaneously

## Configuration

### Playwright Config (`../playwright.config.ts`)
- Base URL: `http://localhost:3000`
- Timeout: 30 seconds per test
- Retry on CI: 2 attempts
- Screenshots and videos on failure
- HTML reporter for test results

### Browser Support
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)
- Mobile browsers (iOS Safari, Android Chrome)

## Debugging Tests

### Visual Debugging
```bash
# Open Playwright UI for interactive debugging
npm run test:e2e:ui

# Run in headed mode to see browser
npm run test:e2e:headed
```

### Debug Specific Issues
```bash
# Debug a specific test
npx playwright test user-journey.spec.ts --debug

# Run with console output
npx playwright test --reporter=list

# Generate trace files
npx playwright test --trace=on
```

### Common Issues

1. **Timing Issues**: Use `waitForLoadState('networkidle')` for dynamic content
2. **Element Not Found**: Use data-testid attributes for reliable selectors
3. **Mock Data**: Ensure mocked responses match actual API structure
4. **Real-time Features**: Account for WebSocket delays in multi-participant tests

## Contributing

When adding new E2E tests:

1. **Use data-testid**: Add `data-testid` attributes to components for reliable selection
2. **Mock External Services**: Mock Supabase calls to avoid database dependencies
3. **Test Real Scenarios**: Focus on complete user workflows rather than isolated features
4. **Cross-browser**: Verify tests work across all configured browsers
5. **Mobile-first**: Ensure tests work on mobile devices

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

This provides detailed test results, screenshots of failures, and performance metrics.