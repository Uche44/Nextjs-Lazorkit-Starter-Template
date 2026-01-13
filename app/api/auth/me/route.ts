// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';
// import { verifyToken, getTokenFromCookies } from '@/lib/auth';

// export async function GET(request: NextRequest) {
//   try {
//     console.log('=== AUTH CHECK REQUEST START ===');
//     console.log('Environment:', process.env.NODE_ENV);
//     console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
//     // Get token from cookies
//     const cookieHeader = request.headers.get('cookie');
//     console.log('Cookie header exists:', !!cookieHeader);
//     console.log('Cookie header:', cookieHeader);
    
//     const token = getTokenFromCookies(cookieHeader);
//     console.log('Token extracted:', !!token);
//     console.log('Token length:', token?.length);

//     if (!token) {
//       console.log('No token found - returning 401');
//       return NextResponse.json(
//         { error: 'Not authenticated' },
//         { status: 401 }
//       );
//     }

//     // Verify token
//     console.log('Verifying token...');
//     const payload = verifyToken(token);
//     console.log('Token payload:', payload);
    
//     if (!payload) {
//       console.log('Token verification failed - returning 401');
//       return NextResponse.json(
//         { error: 'Invalid or expired token' },
//         { status: 401 }
//       );
//     }

//     console.log('Token valid, fetching user:', payload.userId);

//     // Fetch user from database
//     const user = await prisma.users.findUnique({
//       where: { id: payload.userId },
//       select: {
//         id: true,
//         smartWalletAddress: true,
//         name: true,
//         email: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     if (!user) {
//       console.log('User not found in database');
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     console.log('User found:', user.id);
//     console.log('=== AUTH CHECK SUCCESS ===');

//     return NextResponse.json(
//       {
//         success: true,
//         user,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('=== AUTH CHECK ERROR ===');
//     console.error('Error details:', error);
//     console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Return null instead of 401 for unauthenticated users
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Get user from database
    const user = await prisma.users.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        smartWalletAddress: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}