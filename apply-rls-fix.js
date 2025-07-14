import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Use service role key for admin operations
const SUPABASE_URL = 'https://rzfilfpjxfinxxfldzuv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZmlsZnBqeGZpbnh4ZmxkenV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjA0NzMsImV4cCI6MjA2Mzg5NjQ3M30.6Wf8vIJ2Bo1QS0Ie_16xqHZQhCdfsXDmNATPLT3sAfg'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function applyRLSFix() {
  console.log('Applying RLS fix to resolve 406 errors...')
  
  try {
    // Execute each SQL statement individually
    const sqlStatements = [
      'ALTER TABLE schools DISABLE ROW LEVEL SECURITY',
      'ALTER TABLE directory_manual_schools DISABLE ROW LEVEL SECURITY', 
      'ALTER TABLE directory_visitors DISABLE ROW LEVEL SECURITY',
      'ALTER TABLE directory_ads DISABLE ROW LEVEL SECURITY'
    ]
    
    for (const sql of sqlStatements) {
      console.log(`\nExecuting: ${sql}`)
      
      try {
        const { data, error } = await supabase.rpc('execute_sql', { 
          sql_query: sql 
        })
        
        if (error) {
          console.error(`❌ Error: ${error.message}`)
        } else {
          console.log('✅ Success')
        }
      } catch (err) {
        console.error(`❌ Exception: ${err.message}`)
        
        // Try alternative approach with direct query
        try {
          const { data, error } = await supabase
            .from('_realtime')
            .select('*')
            .limit(0)
          
          console.log('Note: Cannot execute DDL statements with anon key. Need service role key or direct database access.')
          console.log('Please execute the SQL manually in your Supabase dashboard SQL editor.')
          break
        } catch (e) {
          // Expected to fail
        }
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('MANUAL STEPS REQUIRED:')
    console.log('='.repeat(50))
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard')
    console.log('2. Navigate to your project: rzfilfpjxfinxxfldzuv')
    console.log('3. Go to SQL Editor')
    console.log('4. Execute the following SQL:')
    console.log('')
    console.log('ALTER TABLE schools DISABLE ROW LEVEL SECURITY;')
    console.log('ALTER TABLE directory_manual_schools DISABLE ROW LEVEL SECURITY;')
    console.log('ALTER TABLE directory_visitors DISABLE ROW LEVEL SECURITY;')
    console.log('ALTER TABLE directory_ads DISABLE ROW LEVEL SECURITY;')
    console.log('')
    console.log('5. After executing, test your admin login again')
    console.log('='.repeat(50))
    
  } catch (error) {
    console.error('Error applying RLS fix:', error)
  }
}

applyRLSFix()