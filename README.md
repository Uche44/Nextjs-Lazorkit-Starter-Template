# LazorKit Next.js Authentication Template

A production-ready Next.js template for Web3 authentication using LazorKit passkeys, complete with database persistence and session management.

> **Perfect for**: Web3 developers who want to add secure, passwordless authentication to their Solana dApps without building from scratch.

## Features

- ✨ **Passkey Authentication**: WebAuthn-based signup with biometric authentication
- 🔐 **Message Signing Login**: Cryptographic signature verification for secure login
- 🍪 **Session Management**: JWT tokens stored in httpOnly cookies
- 💾 **Data Persistence**: All user data and transactions stored in PostgreSQL
- 🎯 **Protected Routes**: Server-side authentication checks
- 📊 **Transaction History**: Track all gasless transfers
- 🚀 **Production Ready**: Clean code, no debug logs, fully typed with TypeScript

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted - see setup options below)
- npm or yarn package manager

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd lazorkit
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/lazorkit?schema=public"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Generate a secure JWT secret:**
```bash
# On Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create database tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

## Database Setup Options

### Option 1: Local PostgreSQL

Install PostgreSQL locally and create a database:

```bash
# Create database
CREATE DATABASE lazorkit;

# Your DATABASE_URL will be:
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/lazorkit"
```

### Option 2: Hosted Database (Recommended for Quick Start)

Use a free hosted PostgreSQL service:

- **[Supabase](https://supabase.com)**: Free tier with 500MB database
- **[Neon](https://neon.tech)**: Serverless Postgres with generous free tier
- **[Railway](https://railway.app)**: Easy deployment with PostgreSQL addon

After creating a database, copy the connection string to your `.env.local` file.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── transactions/  # Transaction management
│   │   └── user/          # User profile
│   ├── signup/            # Signup page
│   ├── login/             # Login page
│   └── dashboard/         # Protected dashboard
├── components/
│   ├── protected-route.tsx
│   ├── gasless-transfer.tsx
│   ├── transaction-history.tsx
│   └── ...
├── contexts/
│   └── auth-context.tsx   # Authentication state management
├── lib/
│   ├── prisma.ts          # Prisma Client singleton
│   └── auth.ts            # JWT and signature utilities
└── prisma/
    └── schema.prisma      # Database schema
```

## Usage Guide

### 1. Sign Up

1. Navigate to `/signup`
2. (Optional) Enter your name and email
3. Click "Create account with passkey"
4. Use your device's biometric authentication (fingerprint, Face ID, etc.)
5. You'll be automatically logged in and redirected to the dashboard

### 2. Login

1. Navigate to `/login`
2. Click "Sign in with passkey"
3. Sign the authentication message with your passkey
4. You'll be redirected to the dashboard

### 3. Dashboard

The dashboard displays:
- User information
- Wallet balance
- Gasless transfer functionality
- Message signing demo
- Transaction history

### 4. Gasless Transfers

1. From the dashboard, click "Send 0.00002 SOL (Gasless)"
2. The transaction is sent without requiring SOL for gas fees
3. Transaction is automatically saved to the database
4. View it in the transaction history table

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate existing user
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user

### Transactions

- `POST /api/transactions` - Save transaction
- `GET /api/transactions` - Get transaction history

### User Profile

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Database Schema

### User Model

```prisma
model User {
  id                  String        @id @default(uuid())
  smartWalletAddress  String        @unique
  passkeyId           String?
  name                String?
  email               String?
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt
  transactions        Transaction[]
}
```

### Transaction Model

```prisma
model Transaction {
  id          String            @id @default(uuid())
  userId      String
  signature   String            @unique
  type        TransactionType   @default(TRANSFER)
  amount      BigInt
  recipient   String
  status      TransactionStatus @default(PENDING)
  createdAt   DateTime          @default(now())
  user        User              @relation(fields: [userId], references: [id])
}
```

## Troubleshooting

### Database Connection Issues

If you see "Can't reach database server":
1. Verify your DATABASE_URL is correct
2. Ensure PostgreSQL is running
3. Check firewall settings
4. For hosted databases, verify IP whitelist settings

### Prisma Client Not Found

Run:
```bash
npx prisma generate
```

### Migration Errors

Reset the database (⚠️ deletes all data):
```bash
npx prisma migrate reset
```

## Security Notes

- JWT tokens are stored in httpOnly cookies (not accessible via JavaScript)
- Signatures are verified server-side using Solana's nacl library
- All API routes check authentication before processing requests
- Never commit `.env.local` to version control

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Authentication**: LazorKit SDK (@lazorkit/wallet)
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Solana (Devnet)
- **Styling**: Tailwind CSS

## Learn More

- [LazorKit Documentation](https://docs.lazorkit.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Documentation](https://docs.solana.com)

## Customization Guide

### Branding

1. **Update App Name**: Search and replace "LazorKit" with your app name in:
   - `README.md`
   - `package.json` (name field)
   - `app/login/page.tsx` and `app/signup/page.tsx` (UI text)
   - `lib/auth.ts` (authentication message)

2. **Styling**: Modify Tailwind classes in components to match your brand colors
   - Primary color: `purple-600` → your brand color
   - Gradients: Update in login/signup pages

### Database Schema

To add custom fields to the User model:

1. Edit `prisma/schema.prisma`:
```prisma
model User {
  // ... existing fields
  bio         String?
  avatar      String?
  // Add your custom fields
}
```

2. Create and run migration:
```bash
npx prisma migrate dev --name add_custom_fields
```

### Adding New Features

**Example: Add user profile page**

1. Create API route: `app/api/user/profile/route.ts`
2. Create page: `app/profile/page.tsx`
3. Use `ProtectedRoute` component for authentication
4. Access user via `useAuth()` hook

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
   - Deploy!

3. **Run migrations on production**:
```bash
# Install Vercel CLI
npm i -g vercel

# Run migration
vercel env pull .env.production
npx prisma migrate deploy
```

### Deploy to Other Platforms

**Railway**:
- Connect GitHub repo
- Add PostgreSQL addon (auto-sets DATABASE_URL)
- Add JWT_SECRET environment variable
- Deploy automatically

**Netlify**:
- Connect GitHub repo
- Set build command: `npm run build`
- Add environment variables
- Deploy

### Environment Variables for Production

Ensure these are set in your deployment platform:

```env
DATABASE_URL="your-production-postgres-url"
JWT_SECRET="your-production-jwt-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

## Common Customizations

### Change Session Duration

Edit `lib/auth.ts`:
```typescript
const JWT_EXPIRES_IN = '30d'; // Change from '7d' to your preference
```

And `app/api/auth/login/route.ts`:
```typescript
maxAge: 60 * 60 * 24 * 30, // 30 days instead of 7
```

### Add Email Verification

1. Add `emailVerified` field to User model
2. Create verification token system
3. Send verification emails (use Resend, SendGrid, etc.)
4. Add verification check in protected routes

### Switch to Different Blockchain

To use a different blockchain (e.g., Ethereum):

1. Replace `@solana/web3.js` with your blockchain SDK
2. Update signature verification in `lib/auth.ts`
3. Modify wallet connection in `providers/wallet-provider.tsx`
4. Update LazorKit configuration if supported

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
