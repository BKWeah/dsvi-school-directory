import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rzfilfpjxfinxxfldzuv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZmlsZnBqeGZpbnh4ZmxkenV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjA0NzMsImV4cCI6MjA2Mzg5NjQ3M30.6Wf8vIJ2Bo1QS0Ie_16xqHZQhCdfsXDmNATPLT3sAfg'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkAdminTables() {
  console.log('Checking admin-related tables in database...')
  
  const adminTables = [
    'dsvi_admins',
    'admin_profiles', 
    'admin_permissions',
    'admin_assignments',
    'user_profiles'
  ]
  
  for (const tableName of adminTables) {
    try {
      console.log(`\n=== Checking ${tableName} table ===`)
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(5)
      
      if (error) {
        console.log(`❌ ${tableName} table error:`, error.message)
      } else {
        console.log(`✅ ${tableName} table exists`)
        console.log(`   Records found: ${data?.length || 0}`)
        if (data && data.length > 0) {
          console.log('   Sample record columns:', Object.keys(data[0]))
          console.log('   Sample record:', data[0])
        }
      }
    } catch (err) {
      console.log(`❌ ${tableName} table exception:`, err.message)
    }
  }
  
  // Also check auth.users to see if your admin user exists
  console.log('\n=== Checking Supabase Auth Users ===')
  try {
    // Try to authenticate with your admin credentials
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@dsvi.org',
      password: 'your_actual_password_here'  // You'll need to provide the real password
    })
    
    if (authError) {
      console.log('❌ Admin user does not exist in auth.users or password is wrong')
      console.log('   Error:', authError.message)
    } else {
      console.log('✅ Admin user exists in auth.users')
      console.log('   User ID:', authData.user.id)
      console.log('   Email:', authData.user.email)
    }
  } catch (err) {
    console.log('❌ Auth check failed:', err.message)
  }
}

checkAdminTables()