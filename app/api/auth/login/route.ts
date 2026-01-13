import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateToken, validateLazorkitSignature } from '@/lib/auth';
import { PublicKey } from '@solana/web3.js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { smartWalletAddress, message, signature, signedPayload } = body;

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
    } catch (error) {
      console.log('Invalid wallet address format:', error);
      return NextResponse.json(
        { error: 'Invalid Solana wallet address' },
        { status: 400 }
      );
    }

    // Verify signature
    

     const isValidFormat = validateLazorkitSignature(signature, signedPayload);

 if (!isValidFormat) {
      return NextResponse.json(
        { error: 'Invalid signature format' },
        { status: 401 }
      );
    }


    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { smartWalletAddress },
    });

    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: 'User not found. Please sign up first.' },
        { status: 404 }
      );
    }

    // Generate JWT token
    const token = generateToken(user.id, user.smartWalletAddress);

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
    
    response.cookies.set('auth-token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
