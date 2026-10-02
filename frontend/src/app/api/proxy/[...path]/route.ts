import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function handleProxy(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
  
  // Reconstruct the URL properly
  const url = new URL(request.url);
  const search = url.search;
  const { path } = await context.params;
  const targetUrl = `${backendUrl}/${path.join('/')}${search}`;
  
  const headers = new Headers(request.headers);
  headers.delete('host'); // prevent host mismatch
  headers.delete('cookie');
  headers.delete('origin'); // prevent CORS preflight failure from proxy origin
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : undefined,
      redirect: 'manual'
    });
    
    const responseHeaders = new Headers(res.headers);
    responseHeaders.delete('content-encoding');
    
    return new NextResponse(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Proxy connection error' }, { status: 502 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
