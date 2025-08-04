import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type Handler = (request: NextRequest, ...args: any) => Promise<NextResponse>;

export function withAuth(handler: Handler) {
  return async function (request: NextRequest) {
    try {
      // Get the authorization header
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader) {
        return new NextResponse(
          JSON.stringify({ error: 'Authorization header is required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Initialize Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        return new NextResponse(
          JSON.stringify({ error: 'Server configuration error' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
      });

      // Verify the JWT token
      const token = authHeader.split(' ')[1];
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid or expired token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check if user has admin role (you might want to adjust this based on your auth setup)
      const userEmail = user.email?.toLowerCase() || '';
      if (!userEmail.includes('admin')) {
        return new NextResponse(
          JSON.stringify({ error: 'Admin access required' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // If everything is good, call the handler
      return handler(request);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}
