# Clerk JavaScript Toy Project

A simple toy project demonstrating Clerk authentication functionality built with Vite, TypeScript, and Clerk.js.

## 🚀 Features

- **User Authentication**: Sign in and sign up functionality
- **User Profile Management**: View and manage account information
- **Multi-Factor Authentication (MFA)**: Enable and manage MFA for enhanced security
- **Session Management**: View active sessions
- **Email Verification**: Check email verification status
- **User Information Display**: Shows user profile image, name, email, and account details

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Clerk account ([Sign up here](https://clerk.com))

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd clerk-javascript
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Clerk

1. Create a new application in the [Clerk Dashboard](https://dashboard.clerk.com)
2. Get your **Publishable Key** from the API Keys section
3. Create a `.env` file in the root directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 4. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns).

## 📦 Project Structure

```
clerk-javascript/
├── public/
│   ├── clerk.svg          # Clerk logo
│   └── vite.svg            # Vite logo
├── src/
│   ├── main.ts            # Main application logic with Clerk integration
│   ├── counter.ts         # Simple counter component
│   ├── style.css          # Application styles
│   └── typescript.svg     # TypeScript logo
├── index.html             # HTML entry point
├── package.json         # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── .env                  # Environment variables (not committed)
```

## 🔧 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build

## 🎯 Clerk Features Implemented

### Authentication

- Sign in/Sign up modals
- Sign out functionality
- Session management

### User Profile

- Display user information (name, email, username)
- Profile image display
- Account creation date
- Email verification status
- MFA status

### Account Management

- **Manage Account**: Opens Clerk's user profile modal (password change, email update, etc.)
- **MFA Management**: Enable or manage multi-factor authentication
- **Active Sessions**: View all active sessions for the account

## ⚙️ Clerk Configuration

The project uses the following Clerk configuration:

```typescript
await clerk.load({
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  afterSignOutUrl: "/",
  localization: {
    locale: "en-US",
  },
  polling: true,
});
```

### Configuration Options

- `signInUrl`: Default URL for sign-in redirects
- `signUpUrl`: Default URL for sign-up redirects
- `afterSignOutUrl`: URL to redirect after sign out
- `localization`: Language settings
- `polling`: Enable session polling (default: true)

## 🔐 Security Notes

- Never commit your `.env` file or publishable keys to version control
- The `.env` file is already included in `.gitignore`
- Use environment variables for all sensitive configuration

## 📚 Learn More

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk.js Reference](https://clerk.com/docs/references/clerk-js/overview)
- [Vite Documentation](https://vite.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🐛 Troubleshooting

### Missing Publishable Key Error

If you see an error about missing `VITE_CLERK_PUBLISHABLE_KEY`:

1. Ensure you've created a `.env` file in the root directory
2. Verify the key starts with `pk_test_` or `pk_live_`
3. Restart the development server after adding the key

### MFA Not Working

1. Ensure MFA is enabled in your Clerk Dashboard:
   - Go to **User & Authentication** → **Multi-factor**
   - Enable the MFA strategies you want (e.g., Authenticator App)
2. Make sure the user's email is verified

## 📝 License

This is a toy project for learning purposes.

## 🤝 Contributing

This is a personal learning project, but feel free to fork and experiment!

---

Built with ❤️ using [Vite](https://vite.dev), [TypeScript](https://www.typescriptlang.org/), and [Clerk](https://clerk.com)
