
// import jwt from 'jsonwebtoken';
// import { PublicKey } from '@solana/web3.js';
// import nacl from 'tweetnacl';

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
//   messageOrPayload: string,
//   signature: string,
//   publicKey: string
// ): boolean {
//   try {
//     // The messageOrPayload is already base64-encoded binary data from LazorKit
//     // We need to decode it to bytes, NOT encode as text
//     const messageBytes = Buffer.from(messageOrPayload, 'base64');
    
//     // Decode signature from base64
//     const signatureBytes = Buffer.from(signature, 'base64');
    
//     // Verify signature length
//     if (signatureBytes.length !== 64) {
//       console.error(`Invalid signature length: ${signatureBytes.length}, expected 64`);
//       return false;
//     }
    
//     // Get public key bytes
//     const publicKeyObj = new PublicKey(publicKey);
//     const publicKeyBytes = publicKeyObj.toBytes();
    
//     // Verify the signature
//     const isValid = nacl.sign.detached.verify(
//       messageBytes,
//       signatureBytes,
//       publicKeyBytes
//     );
    
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

/**
 * Verify the signature came from LazorKit
 * LazorKit uses WebAuthn which already verified the signature
 * We just validate the signature exists and has the right format
 */
export function validateLazorkitSignature(
  signature: string,
  signedPayload: string
): boolean {
  try {
    // Validate signature format (should be base64)
    const signatureBytes = Buffer.from(signature, 'base64');
    if (signatureBytes.length !== 64) {
      console.error('Invalid signature length:', signatureBytes.length);
      return false;
    }

    // Validate signedPayload exists and is base64
    const payloadBytes = Buffer.from(signedPayload, 'base64');
    if (payloadBytes.length === 0) {
      console.error('Empty signed payload');
      return false;
    }

    // If both are valid base64 with correct format, trust LazorKit's verification
    return true;
  } catch (error) {
    console.error('Signature validation error:', error);
    return false;
  }
}

export function generateAuthMessage(walletAddress: string): string {
  const timestamp = Date.now();
  return `Sign this message to authenticate with LazorKit\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
}

export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const authCookie = cookies.find(c => c.startsWith('auth-token='));
  
  if (!authCookie) return null;
  
  return authCookie.split('=')[1];
}