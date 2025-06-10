# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing Commands
- `npm test` - Run unit/integration tests with Jest
- `npm run test:watch` - Run Jest tests in watch mode
- `npm run test:coverage` - Run Jest tests with coverage report
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with interactive UI
- `npm run test:e2e:headed` - Run E2E tests in headed mode (visible browser)
- `npm run test:e2e:debug` - Debug E2E tests step-by-step

## Architecture Overview

DineEasy is a restaurant table session management system built with Next.js 15 and React 19. The application enables customers to join table sessions via QR codes, collaborate on orders, and request services.

### Core System Components

**Session Management (`src/lib/session-management.ts`)**
- Handles table session lifecycle (create, extend, cleanup)
- Implements smart session creation/joining logic
- Manages session expiration based on restaurant type
- Provides activity tracking and automatic extension

**Database Layer (`src/lib/supabase.ts`)**
- Comprehensive TypeScript types for all database tables
- Supabase client with full type safety
- Core entities: restaurants, tables, sessions, participants, orders, menu items, service requests

**Real-time Features**
- Multi-participant table sessions with live updates
- Shared cart functionality across participants
- Activity tracking for session management
- Service request notifications

### Key Application Flows

**Table Session Flow**
1. Customer scans QR code → `/[restaurantSlug]/table/[tableId]`
2. System creates or joins existing active session
3. Customer joins session with display name
4. Real-time collaboration on orders and cart

**Session Lifecycle**
- Sessions auto-expire based on restaurant type (fast-casual: 45min, casual: 90min, fine-dining: 180min)
- Sessions auto-extend with recent activity (orders, service requests, participant activity)
- Staff can manually reset tables via API endpoints

### API Structure

- `/api/sessions/[sessionId]` - Session details and termination
- `/api/sessions/cleanup` - Cleanup expired sessions
- `/api/sessions/extend` - Manual session extension
- `/api/sessions/heartbeat` - Activity tracking
- `/api/staff/reset-table` - Staff table reset functionality

### Key Hooks

- `useTableSession` - Main session state management
- `useSharedCart` - Multi-participant cart functionality
- `useActivityTracker` - Automatic activity tracking
- `useRealTime` - Supabase real-time subscriptions

### Database Schema Highlights

- **table_sessions**: Core session management with status tracking
- **session_participants**: Multi-user session support with activity timestamps
- **orders/order_items**: Order management with participant attribution
- **service_requests**: Waiter calls and service notifications
- **session_analytics**: Performance tracking and insights

### Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Technology Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL + Real-time)
- Radix UI components
- React Hook Form + Zod validation

### Testing

The project uses Jest with React Testing Library for comprehensive testing:

- **Test Configuration**: `jest.config.js` with Next.js integration
- **Component Tests**: Form validation, user interactions, rendering logic
- **Hook Tests**: Custom hook behavior and state management (mocked implementations)
- **Library Tests**: Session management utilities and business logic
- **API Tests**: Currently disabled due to NextRequest mocking complexity

**Jest Test Commands:**
- `npm test` - Run all unit/integration tests
- `npm run test:watch` - Watch mode for development
- `npm run test:coverage` - Generate coverage reports

**Jest Test Structure:**
- Unit tests in `__tests__` folders alongside source files
- Comprehensive mocking of Supabase, Next.js, and external dependencies
- Focus on testing public APIs and user-facing functionality
- 85 tests covering session management, components, and user workflows

### End-to-End Testing (Playwright)

**E2E Test Commands:**
- `npm run test:e2e` - Run all E2E tests
- `npm run test:e2e:ui` - Interactive test debugging UI
- `npm run test:e2e:headed` - Run with visible browser
- `npm run test:e2e:debug` - Step-by-step debugging

**E2E Test Coverage:**
- **Complete User Journeys** (`e2e/user-journey.spec.ts`): QR scan to order completion, form validation, mobile experience
- **Multi-Participant Scenarios** (`e2e/multi-participant.spec.ts`): Real-time collaboration, shared cart sync, concurrent modifications
- **Staff Workflows** (`e2e/staff-workflows.spec.ts`): Dashboard management, service requests, menu administration, analytics
- **Cross-browser Testing**: Chromium, Firefox, WebKit, Mobile Chrome/Safari

**E2E Test Features:**
- Mocked Supabase responses for consistent testing
- Multi-context testing for participant collaboration
- Network failure simulation
- Mobile device testing
- Visual regression prevention