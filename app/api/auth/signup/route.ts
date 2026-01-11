import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { PublicKey } from '@solana/web3.js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { smartWalletAddress, passkeyId, name, email } = body;

    // Validate required fields
    if (!smartWalletAddress) {
      return NextResponse.json(
        { error: 'Smart wallet address is required' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    try {
      new PublicKey(smartWalletAddress);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid Solana wallet address' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { smartWalletAddress },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this wallet address' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        smartWalletAddress,
        passkeyId,
        name,
        email,
      },
    });

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
      { status: 201 }
    );

    // Set httpOnly cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
