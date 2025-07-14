import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rzfilfpjxfinxxfldzuv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZmlsZnBqeGZpbnh4ZmxkenV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjA0NzMsImV4cCI6MjA2Mzg5NjQ3M30.6Wf8vIJ2Bo1QS0Ie_16xqHZQhCdfsXDmNATPLT3sAfg'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testFailingQueries() {
  console.log('Testing the specific queries that are failing...')
  
  const testUserId = 'c2d58fd6-089d-4f8d-9acf-24918b0d097c'
  
  // Test 1: Query that's failing - schools with admin_user_id filter
  console.log('\n1. Testing schools query with admin_user_id filter:')
  try {
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name, admin_user_id')
      .eq('admin_user_id', testUserId)
    
    if (schoolsError) {
      console.error('❌ Error:', schoolsError)
    } else {
      console.log(`✅ Success: Found ${schools?.length || 0} schools`)
      console.log('Data:', schools)
    }
  } catch (error) {
    console.error('❌ Exception:', error)
  }
  
  // Test 2: Query that's failing - directory_manual_schools with email filter
  console.log('\n2. Testing directory_manual_schools query with email filter:')
  try {
    const { data: manualSchools, error: manualError } = await supabase
      .from('directory_manual_schools')
      .select('*')
      .eq('status', 'approved')
      .contains('contact_info', { email: 'admin@dsvi.org' })
    
    if (manualError) {
      console.error('❌ Error:', manualError)
    } else {
      console.log(`✅ Success: Found ${manualSchools?.length || 0} manual schools`)
      console.log('Data:', manualSchools)
    }
  } catch (error) {
    console.error('❌ Exception:', error)
  }
  
  // Test 3: Check what columns actually exist in schools table
  console.log('\n3. Checking schools table structure:')
  try {
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('*')
      .limit(1)
    
    if (schoolsError) {
      console.error('❌ Error:', schoolsError)
    } else {
      console.log('✅ Success: Sample school record with all columns:')
      console.log(JSON.stringify(schools?.[0], null, 2))
    }
  } catch (error) {
    console.error('❌ Exception:', error)
  }
  
  // Test 4: Check what columns actually exist in directory_manual_schools table
  console.log('\n4. Checking directory_manual_schools table structure:')
  try {
    const { data: manualSchools, error: manualError } = await supabase
      .from('directory_manual_schools')
      .select('*')
      .limit(1)
    
    if (manualError) {
      console.error('❌ Error:', manualError)
    } else {
      console.log('✅ Success: Sample manual school record with all columns:')
      console.log(JSON.stringify(manualSchools?.[0], null, 2))
    }
  } catch (error) {
    console.error('❌ Exception:', error)
  }
  
  // Test 5: Simple auth test
  console.log('\n5. Testing basic authentication:')
  try {
    const { data: authUser, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('❌ No authenticated user (expected for anon key)')
    } else {
      console.log('✅ Authenticated user:', authUser)
    }
  } catch (error) {
    console.error('❌ Exception:', error)
  }
}

testFailingQueries()