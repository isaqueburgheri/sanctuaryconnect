import {NextResponse} from 'next/server';

// This API route has been disabled as part of the user management page deletion.
export async function POST() {
  return NextResponse.json({error: 'Not Found'}, {status: 404});
}
