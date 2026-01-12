# Tutorial: How to Trigger a Gasless Transaction

This tutorial shows you how to send SOL tokens without paying gas fees using LazorKit's gasless transaction feature.

## What You'll Learn

- How gasless transactions work on Solana
- How to send SOL without holding SOL for fees
- How to track transactions in your database
- How to verify transaction status

## Prerequisites

- Completed the [Passkey Wallet Creation tutorial](./TUTORIAL_PASSKEY_WALLET.md)
- Logged into your dashboard
- Your wallet address funded with some SOL (for devnet, use [Solana Faucet](https://faucet.solana.com))

---

## Step 1: Understanding Gasless Transactions

### What are Gasless Transactions?

On Solana, every transaction requires a small fee (gas) paid in SOL. This creates a problem:
- New users need SOL before they can do anything
- Chicken-and-egg problem: need SOL to get SOL

**LazorKit's Solution:**

LazorKit sponsors the transaction fees, allowing users to:
- Send transactions without holding SOL
- Onboard new users seamlessly
- Improve user experience dramatically

### How It Works

```
1. User signs transaction with their passkey
2. LazorKit's relayer pays the gas fee
3. Transaction executes on Solana
4. User's wallet balance decreases by transfer amount only
```

---

## Step 2: Navigate to the Dashboard

1. Ensure you're logged in: `http://localhost:3000/dashboard`

2. You'll see several sections:
   - **User Information**: Your wallet address and details
   - **Wallet Balance**: Current SOL balance
   - **Gasless Transfer**: The transfer interface
   - **Transaction History**: Past transactions

---

## Step 3: Fund Your Wallet (Devnet Only)

Before sending SOL, you need some in your wallet.

### 3.1 Get Your Wallet Address

Copy your smart wallet address from the dashboard:
```
Smart Wallet Address: 7xKX...9mPq
```

### 3.2 Request Devnet SOL

Visit [Solana Faucet](https://faucet.solana.com):

1. Paste your wallet address
2. Select "Devnet"
3. Click "Request Airdrop"
4. Wait ~30 seconds

### 3.3 Verify Balance

Refresh your dashboard - you should see:
```
Balance: 1.0 SOL
```

---

## Step 4: Send a Gasless Transaction

### 4.1 Locate the Gasless Transfer Section

On the dashboard, find the "Gasless Transfer" card.

### 4.2 Click "Send 0.00002 SOL (Gasless)"

When you click the button:

1. **LazorKit prompts for signature**
   - Authenticate with your biometric
   - This signs the transaction (doesn't send it yet)

2. **Transaction is sent to Solana**
   - LazorKit's relayer pays the gas fee
   - Your wallet only pays the 0.00002 SOL transfer amount

3. **Transaction is saved to database**
   - Stored in your transaction history
   - Status tracked (PENDING → SUCCESS/FAILED)

### 4.3 What Happens Behind the Scenes

```typescript
// 1. Create transfer instruction
const transferInstruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: new PublicKey(RECIPIENT_ADDRESS),
  lamports: 20000 // 0.00002 SOL
});

// 2. Send gasless transaction via LazorKit
const signature = await sendGaslessTransaction({
  instructions: [transferInstruction],
  smartWalletPubkey
});

// 3. Save to database
await fetch('/api/transactions', {
  method: 'POST',
  body: JSON.stringify({
    signature,
    type: 'TRANSFER',
    amount: '20000',
    recipient: RECIPIENT_ADDRESS,
    status: 'PENDING'
  })
});

// 4. Transaction executes on Solana
// LazorKit relayer pays ~0.000005 SOL gas fee
// Your wallet pays 0.00002 SOL transfer amount
```

---

## Step 5: Verify the Transaction

### 5.1 Check Transaction History

Scroll down to the "Transaction History" section on your dashboard.

You should see a new entry:

| Type | Amount | Recipient | Status | Date |
|------|--------|-----------|--------|------|
| TRANSFER | 0.00002 SOL | 9xQe...7Kp | SUCCESS | Just now |

### 5.2 View on Solana Explorer

Click the transaction signature to view on Solana Explorer:

```
https://explorer.solana.com/tx/[signature]?cluster=devnet
```

You'll see:
- **Fee**: Paid by LazorKit relayer (not you!)
- **Transfer**: 0.00002 SOL from your wallet
- **Status**: Success ✅

### 5.3 Check Updated Balance

Your balance should decrease by only the transfer amount:

```
Before: 1.0 SOL
After:  0.99998 SOL
```

**Note:** You didn't pay the gas fee! LazorKit covered it.

---

## Step 6: Understanding the Code

### Frontend: Gasless Transfer Component

Location: `components/gasless-transfer.tsx`

```typescript
const handleGaslessTransfer = async () => {
  try {
    setLoading(true);
    
    // Create transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: smartWalletPubkey,
      toPubkey: new PublicKey(RECIPIENT_ADDRESS),
      lamports: 20000 // 0.00002 SOL
    });
    
    // Send gasless transaction
    const signature = await sendGaslessTransaction({
      instructions: [transferInstruction],
      smartWalletPubkey
    });
    
    // Save to database
    await saveTransaction({
      signature,
      type: 'TRANSFER',
      amount: '20000',
      recipient: RECIPIENT_ADDRESS
    });
    
    setSuccess(true);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Backend: Save Transaction API

Location: `app/api/transactions/route.ts`

```typescript
export async function POST(request: NextRequest) {
  // Verify user is authenticated
  const token = request.cookies.get('auth-token')?.value;
  const payload = verifyToken(token);
  
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { signature, type, amount, recipient } = await request.json();
  
  // Save transaction to database
  const transaction = await prisma.transaction.create({
    data: {
      userId: payload.userId,
      signature,
      type,
      amount: BigInt(amount),
      recipient,
      status: 'PENDING'
    }
  });
  
  return NextResponse.json({ success: true, transaction });
}
```

### Database Schema

Location: `prisma/schema.prisma`

```prisma
model Transaction {
  id          String            @id @default(uuid())
  userId      String
  signature   String            @unique
  type        TransactionType   @default(TRANSFER)
  amount      BigInt            // Amount in lamports
  recipient   String
  status      TransactionStatus @default(PENDING)
  createdAt   DateTime          @default(now())
  
  user        User              @relation(fields: [userId], references: [id])
}

enum TransactionStatus {
  PENDING
  SUCCESS
  FAILED
}
```

---

## Step 7: Send Multiple Transactions

### 7.1 Send Another Transaction

Click "Send 0.00002 SOL (Gasless)" again to send another transaction.

### 7.2 View All Transactions

Your transaction history will show all transfers:

```
Transaction 1: 0.00002 SOL - SUCCESS
Transaction 2: 0.00002 SOL - SUCCESS
Transaction 3: 0.00002 SOL - SUCCESS
```

### 7.3 Check Database

Open Prisma Studio to see all transactions:

```bash
npx prisma studio
```

Navigate to `Transaction` model - you'll see all your transactions with:
- Unique signatures
- Amounts in lamports
- Recipient addresses
- Status updates
- Timestamps

---

## Advanced: Custom Gasless Transactions

### Send Custom Amount

Modify the transfer amount in `components/gasless-transfer.tsx`:

```typescript
// Send 0.001 SOL instead of 0.00002 SOL
const transferInstruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: new PublicKey(RECIPIENT_ADDRESS),
  lamports: 1_000_000 // 0.001 SOL (1 million lamports)
});
```

### Send to Different Recipient

Change the recipient address:

```typescript
const CUSTOM_RECIPIENT = "YourRecipientAddressHere";

const transferInstruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: new PublicKey(CUSTOM_RECIPIENT),
  lamports: 20000
});
```

### Add Transaction Metadata

Extend the Transaction model to include notes:

```prisma
model Transaction {
  // ... existing fields
  note        String?  // Add custom note
}
```

Then save with metadata:

```typescript
await saveTransaction({
  signature,
  type: 'TRANSFER',
  amount: '20000',
  recipient: RECIPIENT_ADDRESS,
  note: 'Payment for services'
});
```

---

## Troubleshooting

### "Insufficient funds"

**Cause:** Your wallet doesn't have enough SOL for the transfer.

**Solution:**
- Request more SOL from the faucet
- Reduce the transfer amount

### "Transaction failed"

**Possible causes:**
- Network congestion
- Invalid recipient address
- Wallet not properly connected

**Solution:**
```typescript
// Add better error handling
try {
  await sendGaslessTransaction(...);
} catch (error) {
  if (error.message.includes('insufficient funds')) {
    alert('Not enough SOL in wallet');
  } else if (error.message.includes('invalid address')) {
    alert('Invalid recipient address');
  } else {
    alert('Transaction failed: ' + error.message);
  }
}
```

### "Transaction not appearing in history"

**Cause:** Database save failed or page needs refresh.

**Solution:**
- Refresh the page
- Check browser console for errors
- Verify database connection

---

## Production Considerations

### Gas Fee Limits

In production, you should:

1. **Set transaction limits** per user
2. **Implement rate limiting** to prevent abuse
3. **Monitor gas costs** to ensure sustainability

Example rate limiting:

```typescript
// Check user's transaction count today
const todayTransactions = await prisma.transaction.count({
  where: {
    userId: user.id,
    createdAt: {
      gte: new Date(new Date().setHours(0, 0, 0, 0))
    }
  }
});

if (todayTransactions >= 10) {
  return NextResponse.json(
    { error: 'Daily transaction limit reached' },
    { status: 429 }
  );
}
```

### Transaction Verification

Add transaction status polling:

```typescript
// Poll Solana for transaction confirmation
const confirmTransaction = async (signature: string) => {
  const connection = new Connection(clusterApiUrl('devnet'));
  
  const confirmation = await connection.confirmTransaction(signature);
  
  // Update database with final status
  await prisma.transaction.update({
    where: { signature },
    data: { 
      status: confirmation.value.err ? 'FAILED' : 'SUCCESS' 
    }
  });
};
```

---

## Next Steps

Now that you can send gasless transactions, you can:

1. **Build a payment system** - Accept SOL payments without gas fees
2. **Create a tipping feature** - Let users tip content creators
3. **Implement token transfers** - Extend to SPL tokens
4. **Add batch transactions** - Send multiple transfers at once

---

## Key Takeaways

✅ Gasless transactions remove friction for new users  
✅ LazorKit sponsors the gas fees on your behalf  
✅ Transactions are tracked in your PostgreSQL database  
✅ Users only pay the transfer amount, not gas  
✅ Perfect for onboarding and improving UX  

**Congratulations!** You've successfully sent gasless transactions. 🚀
