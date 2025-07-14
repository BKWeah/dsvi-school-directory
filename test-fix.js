import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rzfilfpjxfinxxfldzuv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZmlsZnBqeGZpbnh4ZmxkenV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjA0NzMsImV4cCI6MjA2Mzg5NjQ3M30.6Wf8vIJ2Bo1QS0Ie_16xqHZQhCdfsXDmNATPLT3sAfg'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testAfterFix() {
  console.log('Testing queries after disabling RLS...')
  
  const testUserId = 'c2d58fd6-089d-4f8d-9acf-24918b0d097c'
  
  // Test the exact same queries that were failing
  console.log('\n1. Testing schools query (was failing with 406):')
  try {
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name, admin_user_id')
      .eq('admin_user_id', testUserId)
    
    if (schoolsError) {
      console.error('❌ Still failing:', schoolsError)
    } else {
      console.log(`✅ Success: Found ${schools?.length || 0} schools`)
      console.log('Query result:', schools)
    }
  } catch (error) {
    console.error('❌ Exception:', error)
  }
  
  console.log('\n2. Testing directory_manual_schools query (was failing with 406):')
  try {
    const { data: manualSchools, error: manualError } = await supabase
      .from('directory_manual_schools')
      .select('*')
      .eq('status', 'approved')
      .contains('contact_info', { email: 'admin@dsvi.org' })
    
    if (manualError) {
      console.error('❌ Still failing:', manualError)
    } else {
      console.log(`✅ Success: Found ${manualSchools?.length || 0} manual schools`)
      console.log('Query result:', manualSchools)
    }
  } catch (error) {
    console.error('❌ Exception:', error)
  }
  
  // Test general access to tables
  console.log('\n3. Testing general access to schools table:')
  try {
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name, admin_user_id')
      .limit(5)
    
    if (schoolsError) {
      console.error('❌ Error:', schoolsError)
    } else {
      console.log(`✅ Success: Can access schools table - found ${schools?.length || 0} schools`)
    }
  } catch (error) {
    console.error('❌ Exception:', error)
  }
}

testAfterFix()