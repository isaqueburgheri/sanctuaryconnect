'use server';

import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  // This API route is no longer in use. User creation is handled on the client-side
  // to bypass server-side credential issues in the App Hosting environment.
  return NextResponse.json(
    {
      error:
        'This API route is deprecated. User creation is now handled on the client.',
    },
    {status: 410}
  ); // 410 Gone
}
