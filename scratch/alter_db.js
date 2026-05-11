const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://frafkeczbbhijloxsqwv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYWZrZWN6YmJoaWpsb3hzcXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgzMzg5MCwiZXhwIjoyMDg5NDA5ODkwfQ.unVFDnA3FNTlD4xo7Z7mmgHIl804XqlSncM1YbpoWv4'
);

async function alterDB() {
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE profiles ADD COLUMN viewed_ids text[] DEFAULT array[]::text[];' });
  console.log('rpc exec_sql error:', error);
}

alterDB();
