import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uequalrtodvqrpaiugfl.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlcXVhbHJ0b2R2cXJwYWl1Z2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMDMxMjksImV4cCI6MjA3ODU3OTEyOX0.U6VhUJfBwPCYfL56OxscCrne0zTtZdHAooff2GVlSJI';

let supabase = null;
try {
  if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
} catch (e) {
  supabase = null;
}

export default supabase;