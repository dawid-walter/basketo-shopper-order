# Basketo Shopper Order Page

A customer-facing application for viewing order history built with React, TypeScript, and Vite.

## Features

- PIN-based authentication (6-digit code sent to email)
- View all orders with detailed information
- Real-time order status tracking
- Mobile-first responsive design
- Clean and modern UI with TailwindCSS v4

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Date Formatting**: date-fns

## Prerequisites

- Node.js 18+ and npm
- Backend API running at http://localhost:8080

## Installation

```bash
# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev
```

The application will be available at http://localhost:5173 (or another port if 5173 is in use).

## Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── PinLoginForm.tsx       # Two-step PIN login form
│   ├── common/
│   │   ├── Badge.tsx              # Status badge component
│   │   ├── Button.tsx             # Reusable button component
│   │   ├── Card.tsx               # Card container component
│   │   ├── Input.tsx              # Form input component
│   │   └── LoadingSpinner.tsx     # Loading indicator
│   ├── orders/
│   │   └── OrderCard.tsx          # Order display card
│   └── ProtectedRoute.tsx         # Route guard for authentication
├── hooks/
│   ├── useAuth.ts                 # Authentication hook
│   └── useOrders.ts               # Orders data fetching hook
├── pages/
│   ├── LoginPage.tsx              # Login page
│   └── OrdersPage.tsx             # Orders list page
├── services/
│   ├── api.ts                     # Axios instance with interceptors
│   ├── auth.ts                    # Authentication service
│   └── orders.ts                  # Orders service
├── types/
│   └── index.ts                   # TypeScript type definitions
├── utils/
│   └── format.ts                  # Formatting utilities
├── App.tsx                        # Main app component with routing
└── main.tsx                       # Application entry point
```

## Authentication Flow

1. User enters their email address
2. Backend sends a 6-digit PIN to the email
3. User enters the PIN within 60 seconds (resend available)
4. On successful verification, user receives a JWT token
5. Token is stored in localStorage as 'userToken'
6. Token is automatically included in subsequent API requests

## API Endpoints

### Authentication

- `POST /api/auth/login` - Request PIN for email
  ```json
  { "email": "user@example.com" }
  ```

- `POST /api/auth/verify` - Verify PIN and get access token
  ```json
  { "email": "user@example.com", "pin": "123456" }
  ```
  Response:
  ```json
  { "success": true, "accessToken": "jwt-token-here" }
  ```

### Orders

- `GET /api/orders` - Get all orders for authenticated user (requires JWT)
  Response:
  ```json
  [
    {
      "id": "order-123",
      "status": "PAID",
      "totalAmount": 99.99,
      "currency": "PLN",
      "createdAt": "2024-01-15T10:30:00Z",
      "items": [
        {
          "productName": "Product Name",
          "quantity": 2,
          "unitPrice": 49.99
        }
      ]
    }
  ]
  ```

## Order Statuses

- **CREATED**: Order has been created but not yet paid
- **PAID**: Payment successful, order is being processed
- **SHIPPED**: Order has been shipped
- **CANCELLED**: Order has been cancelled

## Environment Variables

Create a `.env.development` file (or `.env.production` for production):

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Key Features Explained

### PIN Login Form
- Two-step authentication process
- Auto-focus on inputs for better UX
- 6-digit numeric PIN validation
- Resend PIN with 60-second cooldown
- Clear error messages

### Protected Routes
- Automatic redirect to login if not authenticated
- JWT token validation
- Token stored in localStorage

### Order Display
- Grid layout with responsive design
- Status badges with color coding
- Detailed item breakdown
- Currency formatting
- Relative time display

### Error Handling
- API error interception
- Automatic logout on 401 responses
- User-friendly error messages
- Retry functionality

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

1. Follow the existing code style
2. Use TypeScript strict mode
3. Write meaningful commit messages
4. Test on multiple screen sizes

## License

This project is proprietary software for Basketo.
