import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rzfilfpjxfinxxfldzuv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZmlsZnBqeGZpbnh4ZmxkenV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjA0NzMsImV4cCI6MjA2Mzg5NjQ3M30.6Wf8vIJ2Bo1QS0Ie_16xqHZQhCdfsXDmNATPLT3sAfg'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testConnection() {
  console.log('Testing database connection...')
  
  // Test 1: Check if schools table exists and has data
  try {
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name, slug')
      .limit(5)
    
    if (schoolsError) {
      console.error('Error fetching schools:', schoolsError)
    } else {
      console.log(`✅ Found ${schools?.length || 0} schools in the schools table`)
      if (schools && schools.length > 0) {
        console.log('Sample school:', schools[0])
      }
    }
  } catch (error) {
    console.error('Error with schools table:', error)
  }
  
  // Test 2: Check if directory_manual_schools table exists
  try {
    const { data: manualSchools, error: manualError } = await supabase
      .from('directory_manual_schools')
      .select('id')
      .limit(1)
    
    if (manualError) {
      console.error('❌ directory_manual_schools table does not exist:', manualError.message)
    } else {
      console.log('✅ directory_manual_schools table exists')
    }
  } catch (error) {
    console.error('Error with directory_manual_schools table:', error)
  }
  
  // Test 3: Check if directory_visitors table exists
  try {
    const { data: visitors, error: visitorsError } = await supabase
      .from('directory_visitors')
      .select('id')
      .limit(1)
    
    if (visitorsError) {
      console.error('❌ directory_visitors table does not exist:', visitorsError.message)
    } else {
      console.log('✅ directory_visitors table exists')
    }
  } catch (error) {
    console.error('Error with directory_visitors table:', error)
  }
  
  // Test 4: Check if directory_ads table exists
  try {
    const { data: ads, error: adsError } = await supabase
      .from('directory_ads')
      .select('id')
      .limit(1)
    
    if (adsError) {
      console.error('❌ directory_ads table does not exist:', adsError.message)
    } else {
      console.log('✅ directory_ads table exists')
    }
  } catch (error) {
    console.error('Error with directory_ads table:', error)
  }
}

testConnection()
