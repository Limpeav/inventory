import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const oldRefreshToken = cookieStore.get('refreshToken')?.value;
    
    if (!oldRefreshToken) {
      return NextResponse.json({ success: false, message: 'No refresh token' }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    
    const res = await fetch(`${backendUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: oldRefreshToken }),
    });
    
    const data = await res.json();
    
    if (!res.ok || !data.success) {
      // Clear cookies if refresh fails
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      return NextResponse.json(data, { status: res.status });
    }
    
    const accessToken = data.data?.accessToken;
    const refreshToken = data.data?.refreshToken;
    
    if (accessToken && refreshToken) {
      const isProd = process.env.NODE_ENV === 'production';
      
      cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
        path: '/'
      });
      
      cookieStore.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      });
      
      delete data.data.accessToken;
      delete data.data.refreshToken;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
