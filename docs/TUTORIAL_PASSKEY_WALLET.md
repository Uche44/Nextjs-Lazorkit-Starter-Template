# Tutorial: How to Create a Passkey-Based Wallet

This tutorial walks you through creating a passkey-based smart wallet using LazorKit in your Next.js application.

## What You'll Learn

- How passkey authentication works
- How to integrate LazorKit wallet creation
- How to store user data in the database
- How to manage wallet sessions

## Prerequisites

- Completed the [Quick Start guide](../README.md#quick-start)
- Development server running (`npm run dev`)
- A device with biometric authentication (fingerprint, Face ID, or security key)

---

## Step 1: Understanding Passkeys

**What are passkeys?**

Passkeys are a modern, passwordless authentication method based on WebAuthn. Instead of passwords:
- Your device generates a cryptographic key pair
- The private key never leaves your device
- You authenticate using biometrics (fingerprint, Face ID) or device PIN
- More secure than passwords (phishing-resistant)

**How LazorKit uses passkeys:**

LazorKit creates a Solana smart wallet tied to your passkey, enabling:
- Wallet creation without seed phrases
- Gasless transactions (no SOL needed for fees)
- Secure message signing for authentication

---

## Step 2: Navigate to the Signup Page

1. Open your browser and go to: `http://localhost:3000/signup`

2. You'll see the signup form with optional fields:
   - **Name** (optional)
   - **Email** (optional)

![Signup Page](../screenshots/signup-page.png)

---

## Step 3: Create Your Passkey Wallet

### 3.1 Fill in Optional Information (Optional)

```
Name: John Doe
Email: john@example.com
```

> **Note**: These fields are optional but recommended for better user experience.

### 3.2 Click "Create Account with Passkey"

When you click the button, the following happens:

1. **Browser prompts for authentication**
   - On Mac: Touch ID prompt
   - On Windows: Windows Hello prompt
   - On mobile: Fingerprint or Face ID

2. **Authenticate with your biometric**
   - Place your finger on the sensor, or
   - Look at the camera for Face ID, or
   - Enter your device PIN

### 3.3 What Happens Behind the Scenes

```typescript
// 1. LazorKit creates a passkey
const { smartWalletPubkey, passkeyId } = await createPasskey();

// 2. Your app sends data to the backend
await fetch('/api/auth/signup', {
  method: 'POST',
  body: JSON.stringify({
    smartWalletAddress: smartWalletPubkey.toBase58(),
    passkeyId: passkeyId,
    name: "John Doe",
    email: "john@example.com"
  })
});

// 3. Backend creates user in database
const user = await prisma.user.create({
  data: {
    smartWalletAddress,
    passkeyId,
    name,
    email
  }
});

// 4. Backend generates JWT token
const token = generateToken(user.id, user.smartWalletAddress);

// 5. Token stored in httpOnly cookie
response.cookies.set('auth-token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7 // 7 days
});
```

---

## Step 4: Verify Your Wallet Creation

After successful creation, you'll be automatically redirected to the dashboard.

### 4.1 Check Your Wallet Address

On the dashboard, you'll see:

```
Smart Wallet Address: 7xKX...9mPq
```

This is your unique Solana wallet address created by LazorKit.

### 4.2 Verify in Database

You can verify your user was created in the database:

```bash
# Open Prisma Studio
npx prisma studio
```

Navigate to the `User` model and you'll see your record with:
- `id`: Unique user ID
- `smartWalletAddress`: Your wallet address
- `passkeyId`: Your passkey identifier
- `name` and `email`: If you provided them
- `createdAt`: Timestamp of creation

---

## Step 5: Understanding the Code

### Frontend: Signup Component

Location: `app/signup/page.tsx`

```typescript
const handleSignup = async () => {
  try {
    // Connect wallet and create passkey
    await connect();
    
    // After connection, useEffect triggers signup
    if (isConnected && smartWalletPubkey) {
      await signup({
        smartWalletAddress: smartWalletPubkey.toBase58(),
        passkeyId: passkeyId,
        name: formData.name,
        email: formData.email
      });
    }
  } catch (error) {
    console.error('Signup failed:', error);
  }
};
```

### Backend: Signup API Route

Location: `app/api/auth/signup/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const { smartWalletAddress, passkeyId, name, email } = await request.json();
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { smartWalletAddress }
  });
  
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
  
  // Create new user
  const user = await prisma.user.create({
    data: { smartWalletAddress, passkeyId, name, email }
  });
  
  // Generate JWT and set cookie
  const token = generateToken(user.id, user.smartWalletAddress);
  response.cookies.set('auth-token', token, cookieOptions);
  
  return NextResponse.json({ success: true, user });
}
```

### Authentication Context

Location: `contexts/auth-context.tsx`

```typescript
const signup = async (data: SignupData) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include' // Important: includes cookies
  });
  
  const result = await response.json();
  setUser(result.user); // Update global auth state
};
```

---

## Step 6: Test Your Wallet

### 6.1 Logout and Login Again

1. Click "Logout" in the dashboard
2. Navigate to `/login`
3. Click "Sign in with passkey"
4. Authenticate with your biometric
5. You'll be logged back in!

### 6.2 Check Session Persistence

1. Close your browser completely
2. Reopen and go to `http://localhost:3000`
3. You should still be logged in (session persists for 7 days)

---

## Troubleshooting

### "Passkey creation failed"

**Possible causes:**
- Browser doesn't support WebAuthn (use Chrome, Safari, or Edge)
- Device doesn't have biometric authentication
- Passkey already exists for this domain

**Solution:**
- Try a different browser
- Use a device with biometric support
- Clear browser data and try again

### "User already exists"

**Cause:** You're trying to create a wallet with an address that's already registered.

**Solution:**
- Use the login page instead
- Or create a new passkey (will generate a different wallet address)

### "Database connection failed"

**Cause:** PostgreSQL is not running or DATABASE_URL is incorrect.

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Verify your .env file
cat .env | grep DATABASE_URL

# Test Prisma connection
npx prisma db pull
```

---

## Next Steps

Now that you have a passkey wallet, you can:

1. **[Send Gasless Transactions](./TUTORIAL_GASLESS_TRANSACTION.md)** - Learn how to send SOL without gas fees
2. **Customize the signup flow** - Add more fields to the User model
3. **Add email verification** - Enhance security with email confirmation
4. **Integrate with your dApp** - Use this wallet for your Solana application

---

## Key Takeaways

✅ Passkeys provide passwordless, secure authentication  
✅ LazorKit creates Solana wallets tied to passkeys  
✅ No seed phrases needed - your device is the key  
✅ Sessions persist via JWT tokens in httpOnly cookies  
✅ All user data is stored in PostgreSQL via Prisma  

**Congratulations!** You've successfully created a passkey-based wallet. 🎉
