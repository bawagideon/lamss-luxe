const fs = require('fs');
fs.readFileSync('.env', 'utf8').split('\n').forEach(line => {
  if (line && line.includes('=')) {
    const [k, ...v] = line.split('=');
    process.env[k.trim()] = v.join('=').trim().replace(/"/g, '').replace(/\r/g, '');
  }
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testQuery() {
  console.log("Testing insert into orders...");
  const { data, error } = await supabase
    .from('orders')
    .insert({
      total_amount: 100,
    })
    .select()
    .single();
    
  if (error) {
    console.error("SUPABASE ERROR:", error);
  } else {
    console.log("SUPABASE SUCCESS:", data);
  }
}

testQuery();
