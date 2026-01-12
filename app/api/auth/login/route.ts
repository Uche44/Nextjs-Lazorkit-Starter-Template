import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateToken, verifySignature } from '@/lib/auth';
import { PublicKey } from '@solana/web3.js';

export async function POST(request: NextRequest) {
  try {
    console.log('=== LOGIN REQUEST START ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    const body = await request.json();
    const { smartWalletAddress, message, signature, signedPayload } = body;

    console.log('Wallet address:', smartWalletAddress);
    console.log('Message length:', message?.length);
    console.log('Signature length:', signature?.length);

    // Validate required fields
    if (!smartWalletAddress || !message || !signature) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Wallet address, message, and signature are required' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    try {
      new PublicKey(smartWalletAddress);
      console.log('Wallet address format valid');
    } catch (error) {
      console.log('Invalid wallet address format:', error);
      return NextResponse.json(
        { error: 'Invalid Solana wallet address' },
        { status: 400 }
      );
    }

    // Verify signature
    const messageToVerify = signedPayload || message;


    console.log('=== Login API Debug ===');
    console.log('Using message:', messageToVerify);
    console.log('Original message:', message);
    console.log('Signed payload:', signedPayload);
    console.log('=== End Debug ===');

    const isValid = verifySignature(messageToVerify, signature, smartWalletAddress);
    console.log('Signature verification result:', isValid);
    
    if (!isValid) {
      console.log('Signature verification failed - returning 401');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Check if user exists
    console.log('Checking if user exists in database...');
    const user = await prisma.user.findUnique({
      where: { smartWalletAddress },
    });

    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: 'User not found. Please sign up first.' },
        { status: 404 }
      );
    }

    console.log('User found:', user.id);

    // Generate JWT token
    console.log('Generating JWT token...');
    const token = generateToken(user.id, user.smartWalletAddress);
    console.log('Token generated, length:', token.length);

    // Create response with user data
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          smartWalletAddress: user.smartWalletAddress,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );

    // Set httpOnly cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    };
    
    console.log('Setting cookie with options:', cookieOptions);
    response.cookies.set('auth-token', token, cookieOptions);

    console.log('=== LOGIN REQUEST SUCCESS ===');
    return response;
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
