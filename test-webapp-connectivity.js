import { createClient } from '@supabase/supabase-js'

// Test if webapp can connect to database in same way as the app
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rzfilfpjxfinxxfldzuv.supabase.co'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZmlsZnBqeGZpbnh4ZmxkenV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjA0NzMsImV4cCI6MjA2Mzg5NjQ3M30.6Wf8vIJ2Bo1QS0Ie_16xqHZQhCdfsXDmNATPLT3sAfg'

console.log('Testing webapp connectivity...')
console.log('SUPABASE_URL:', SUPABASE_URL)
console.log('SUPABASE_ANON_KEY (first 20 chars):', SUPABASE_ANON_KEY.substring(0, 20) + '...')

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testWebappQueries() {
  console.log('\n1. Testing the exact queries that fail in browser with 406:')
  
  // The exact query from the error message
  const testUserId = 'c2d58fd6-089d-4f8d-9acf-24918b0d097c'
  
  try {
    console.log('\nTesting schools query...')
    const { data, error, status, statusText } = await supabase
      .from('schools')
      .select('id,name,admin_user_id')
      .eq('admin_user_id', testUserId)
    
    console.log('Status:', status)
    console.log('Status Text:', statusText)
    console.log('Error:', error)
    console.log('Data:', data)
    
    if (status === 406) {
      console.log('❌ 406 ERROR REPRODUCED!')
    } else {
      console.log('✅ Query successful')
    }
  } catch (err) {
    console.error('Exception:', err)
  }
  
  try {
    console.log('\nTesting directory_manual_schools query...')
    const { data, error, status, statusText } = await supabase
      .from('directory_manual_schools')
      .select('*')
      .eq('status', 'approved')
      .contains('contact_info', { email: 'admin@dsvi.org' })
    
    console.log('Status:', status)
    console.log('Status Text:', statusText)
    console.log('Error:', error)
    console.log('Data:', data)
    
    if (status === 406) {
      console.log('❌ 406 ERROR REPRODUCED!')
    } else {
      console.log('✅ Query successful')
    }
  } catch (err) {
    console.error('Exception:', err)
  }
  
  // Test basic connectivity
  console.log('\n2. Testing basic table access:')
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('id, name')
      .limit(1)
    
    if (error) {
      console.error('❌ Basic query failed:', error)
    } else {
      console.log('✅ Basic connectivity works')
      console.log('Sample data:', data)
    }
  } catch (err) {
    console.error('Exception:', err)
  }
}

testWebappQueries()