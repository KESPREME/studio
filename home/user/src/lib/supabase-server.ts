
// src/lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js'

// Use the public URL for consistency, as it points to the same project.
// The security is handled by the service key.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase server-side URL and service key are required.')
}

// This is the admin client, for use in server-side code (API routes, server components)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    //
    // Important: these settings prevent the admin client from trying to use
    // browser storage, which is not available in a server environment.
    //
    autoRefreshToken: false,
    persistSession: false,
  }
})
