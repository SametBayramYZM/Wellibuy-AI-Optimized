/**
 * API Routes Handler
 * Proxies requests to the backend server
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Get the backend URL from environment
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  try {
    // Get the pathname after /api/
    const pathname = request.nextUrl.pathname.replace('/api/', '');
    const query = request.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/${pathname}${query}`;

    // Prepare request options
    const options: RequestInit = {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    };

    // Add body for POST, PUT, PATCH
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    }

    // Make the request to backend
    const response = await fetch(targetUrl, options);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
