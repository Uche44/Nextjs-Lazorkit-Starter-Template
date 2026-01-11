# LazorKit Authentication System - Setup Guide

This project implements a complete authentication system using LazorKit passkeys, Next.js, Prisma ORM, and PostgreSQL.

## Features

- ✨ **Passkey Authentication**: WebAuthn-based signup with biometric authentication
- 🔐 **Message Signing Login**: Cryptographic signature verification for secure login
- 🍪 **Session Management**: JWT tokens stored in httpOnly cookies
- 💾 **Data Persistence**: All user data and transactions stored in PostgreSQL
- 🎯 **Protected Routes**: Server-side authentication checks
- 📊 **Transaction History**: Track all gasless transfers

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- npm or yarn package manager

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/lazorkit?schema=public"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important**: Replace the DATABASE_URL with your actual PostgreSQL connection string.

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
createdb lazorkit

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

## License

MIT
