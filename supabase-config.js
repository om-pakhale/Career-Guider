// supabase-config.js
const SUPABASE_URL = 'https://ivujvxtzexiqrfvmwcik.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWp2eHR6ZXhpcXJmdm13Y2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMzkxNzMsImV4cCI6MjEwMDgxNTE3M30.AfQUADQ34FLa59BQWSEHceGQNuvT7KlOFqSQISOvzEI';

// Global Supabase client instance
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);