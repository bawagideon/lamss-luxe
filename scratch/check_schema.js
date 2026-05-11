const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://frafkeczbbhijloxsqwv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYWZrZWN6YmJoaWpsb3hzcXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgzMzg5MCwiZXhwIjoyMDg5NDA5ODkwfQ.unVFDnA3FNTlD4xo7Z7mmgHIl804XqlSncM1YbpoWv4'
);

async function check() {
  // Try to insert a dummy to wishlist to see exact error
  const { error: wErr } = await supabase.from('wishlist').select('id').limit(1);
  console.log('wishlist table select error:', wErr);

  const { error: wsErr } = await supabase.from('wishlists').select('id').limit(1);
  console.log('wishlists table select error:', wsErr);

  const { data: pData, error: pErr } = await supabase.from('profiles').select('*').limit(1);
  console.log('profiles columns:', pData && pData.length > 0 ? Object.keys(pData[0]) : pErr);
}

check();
