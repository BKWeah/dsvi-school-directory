// Debug environment variables
console.log('Environment check:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DEV mode would be:', process.env.NODE_ENV !== 'production')

console.log('\nVite environment variables:')
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || 'undefined')
console.log('VITE_SUPABASE_ANON_KEY exists:', !!process.env.VITE_SUPABASE_ANON_KEY)

// In the browser, this would be:
// import.meta.env.DEV - true in development
// import.meta.env.VITE_SUPABASE_URL - the URL

const isDevelopment = !process.env.VITE_SUPABASE_URL  // simulating the logic
console.log('\nSimulated isDevelopment check:', isDevelopment)

if (isDevelopment) {
  console.log('✅ Would use hardcoded credentials (dev mode)')
} else {
  console.log('❌ Would try Supabase authentication (production mode) - THIS CAUSES 406 ERRORS')
}