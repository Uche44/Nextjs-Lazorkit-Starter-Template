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

// /**
//  * Generate a JWT token for a user
//  */
// export function generateToken(userId: string, smartWalletAddress: string): string {
//   return jwt.sign(
//     { userId, smartWalletAddress } as JWTPayload,
//     JWT_SECRET,
//     { expiresIn: JWT_EXPIRES_IN }
//   );
// }

// /**
//  * Verify and decode a JWT token
//  */
// export function verifyToken(token: string): JWTPayload | null {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
//     return decoded;
//   } catch (error) {
//     console.error('Token verification failed:', error);
//     return null;
//   }
// }

// /**
//  * Verify a Solana message signature
//  * @param message - The original message that was signed
//  * @param signature - The signature in base58 format
//  * @param publicKey - The public key (wallet address) that signed the message
//  */
// export function verifySignature(
//   message: string,
//   signature: string,
//   publicKey: string
// ): boolean {
//   try {
//     // Convert message to Uint8Array
//     const messageBytes = new TextEncoder().encode(message);
    
//     // Decode signature from base58
//     const signatureBytes = bs58.decode(signature);
    
//     // Get public key bytes
//     const publicKeyObj = new PublicKey(publicKey);
//     const publicKeyBytes = publicKeyObj.toBytes();
    
//     // Verify the signature
//     return nacl.sign.detached.verify(
//       messageBytes,
//       signatureBytes,
//       publicKeyBytes
//     );
//   } catch (error) {
//     console.error('Signature verification error:', error);
//     return false;
//   }
// }

// /**
//  * Generate a random authentication message
//  */
// export function generateAuthMessage(walletAddress: string): string {
//   const timestamp = new Date().toISOString();
//   const nonce = Math.random().toString(36).substring(7);
//   return `Sign this message to authenticate with LazorKit\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
// }

// /**
//  * Extract token from cookies
//  */
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

/**
 * Generate a JWT token for a user
 */
export function generateToken(userId: string, smartWalletAddress: string): string {
  return jwt.sign(
    { userId, smartWalletAddress } as JWTPayload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify and decode a JWT token
 */
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
 * Verify a Solana message signature
 * @param message - The original message that was signed
 * @param signature - The signature in base64 format
 * @param publicKey - The public key (wallet address) that signed the message
 */
export function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    // Convert message to Uint8Array
    const messageBytes = new TextEncoder().encode(message);
    
    // Decode signature from base64 (NOT base58!)
    const signatureBytes = Buffer.from(signature, 'base64');
    
    // Get public key bytes
    const publicKeyObj = new PublicKey(publicKey);
    const publicKeyBytes = publicKeyObj.toBytes();
    
    // Verify the signature
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Generate a random authentication message
 */
export function generateAuthMessage(walletAddress: string): string {
  const timestamp = new Date().toISOString();
  const nonce = Math.random().toString(36).substring(7);
  return `Sign this message to authenticate with LazorKit\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
}

/**
 * Extract token from cookies
 */
export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const authCookie = cookies.find(c => c.startsWith('auth-token='));
  
  if (!authCookie) return null;
  
  return authCookie.split('=')[1];
}