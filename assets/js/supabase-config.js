const SUPABASE_URL = 'https://ivujvxtzexiqrfvmwcik.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWp2eHR6ZXhpcXJmdm13Y2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMzkxNzMsImV4cCI6MjEwMDgxNTE3M30.AfQUADQ34FLa59BQWSEHceGQNuvT7KlOFqSQISOvzEI';

// Ensure we don't crash if the CDN is already initialized
if (window.supabase && typeof window.supabase.createClient === 'function') {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabase = window.supabaseClient;
}