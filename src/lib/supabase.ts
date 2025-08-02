
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anonymous key are required in .env.local and must be prefixed with NEXT_PUBLIC_')
}

// This is the public client, for use in browser-side code.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
