// import jwt from 'jsonwebtoken';
// import { PublicKey } from '@solana/web3.js';
// import nacl from 'tweetnacl';
// import bs58 from 'bs58';

// const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
// const JWT_EXPIRES_IN = '7d';

// export interface JWTPayload {
//   userId: string;
//   smartWalletAddress: string;
// }

// export function generateToken(userId: string, smartWalletAddress: string): string {
//   return jwt.sign(
//     { userId, smartWalletAddress } as JWTPayload,
//     JWT_SECRET,
//     { expiresIn: JWT_EXPIRES_IN }
//   );
// }

// export function verifyToken(token: string): JWTPayload | null {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
//     return decoded;
//   } catch (error) {
//     console.error('Token verification failed:', error);
//     return null;
//   }
// }

// export function verifySignature(
//   message: string,
//   signature: string,
//   publicKey: string
// ): boolean {
//   try {
//     console.log('=== Backend Signature Verification ===');
//     console.log('Signature (first 50 chars):', signature.substring(0, 50));
//     console.log('Signature length:', signature.length);
    
//     // Convert message to Uint8Array
//     const messageBytes = new TextEncoder().encode(message);
    
//     // Try to decode as base58 first (most common for Solana)
//     let signatureBytes: Uint8Array;
//     try {
//       signatureBytes = bs58.decode(signature);
//       console.log('Decoded as base58, length:', signatureBytes.length);
//     } catch (e1) {
//       // If base58 fails, try base64
//       try {
//         signatureBytes = Buffer.from(signature, 'base64');
//         console.log('Decoded as base64, length:', signatureBytes.length);
//       } catch (e2) {
//         // If base64 fails, try hex
//         try {
//           signatureBytes = Buffer.from(signature, 'hex');
//           console.log('Decoded as hex, length:', signatureBytes.length);
//         } catch (err) {
//           console.error('Failed to decode signature in any format');
//           return false;
//         }
//       }
//     }
    
//     // Verify signature length
//     if (signatureBytes.length !== 64) {
//       console.error(`Invalid signature length: ${signatureBytes.length}, expected 64`);
//       return false;
//     }
    
//     // Get public key bytes
//     const publicKeyObj = new PublicKey(publicKey);
//     const publicKeyBytes = publicKeyObj.toBytes();
//     console.log('Public key bytes length:', publicKeyBytes.length);
    
//     // Verify the signature
//     const isValid = nacl.sign.detached.verify(
//       messageBytes,
//       signatureBytes,
//       publicKeyBytes
//     );
    
//     console.log('Signature valid:', isValid);
//     console.log('=== End Backend Verification ===');
    
//     return isValid;
//   } catch (error) {
//     console.error('Signature verification error:', error);
//     return false;
//   }
// }

// export function generateAuthMessage(walletAddress: string): string {
//   const timestamp = new Date().toISOString();
//   const nonce = Math.random().toString(36).substring(7);
//   return `Sign this message to authenticate with LazorKit\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
// }

// export function getTokenFromCookies(cookieHeader: string | null): string | null {
//   if (!cookieHeader) return null;
  
//   const cookies = cookieHeader.split(';').map(c => c.trim());
//   const authCookie = cookies.find(c => c.startsWith('auth-token='));
  
//   if (!authCookie) return null;
  
//   return authCookie.split('=')[1];
// }

import jwt from 'jsonwebtoken';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  smartWalletAddress: string;
}

export function generateToken(userId: string, smartWalletAddress: string): string {
  return jwt.sign(
    { userId, smartWalletAddress } as JWTPayload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function verifySignature(
  messageOrPayload: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    console.log('=== Backend Signature Verification ===');
    console.log('Message/Payload (first 50 chars):', messageOrPayload.substring(0, 50));
    console.log('Signature (first 50 chars):', signature.substring(0, 50));
    
    // The messageOrPayload is already base64-encoded binary data from LazorKit
    // We need to decode it to bytes, NOT encode as text
    const messageBytes = Buffer.from(messageOrPayload, 'base64');
    console.log('Message bytes length:', messageBytes.length);
    
    // Decode signature from base64
    const signatureBytes = Buffer.from(signature, 'base64');
    console.log('Signature bytes length:', signatureBytes.length);
    
    // Verify signature length
    if (signatureBytes.length !== 64) {
      console.error(`Invalid signature length: ${signatureBytes.length}, expected 64`);
      return false;
    }
    
    // Get public key bytes
    const publicKeyObj = new PublicKey(publicKey);
    const publicKeyBytes = publicKeyObj.toBytes();
    console.log('Public key bytes length:', publicKeyBytes.length);
    
    // Verify the signature
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
    
    console.log('Signature valid:', isValid);
    console.log('=== End Backend Verification ===');
    
    return isValid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export function generateAuthMessage(walletAddress: string): string {
  const timestamp = new Date().toISOString();
  const nonce = Math.random().toString(36).substring(7);
  return `Sign this message to authenticate with LazorKit\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
}

export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const authCookie = cookies.find(c => c.startsWith('auth-token='));
  
  if (!authCookie) return null;
  
  return authCookie.split('=')[1];
}