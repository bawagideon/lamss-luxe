const fs = require('fs');
if (fs.existsSync('.env')) {
  fs.readFileSync('.env', 'utf8').split('\n').forEach(line => {
    if (line && line.includes('=')) {
      const [k, ...v] = line.split('=');
      process.env[k.trim()] = v.join('=').trim().replace(/"/g, '').replace(/\r/g, '');
    }
  });
}

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStaff() {
  const { data, error } = await supabase.from('admin_staff').select('*');
  if (error) {
    console.error("Error reading admin_staff:", error);
  } else {
    console.log("Current staff members in DB:", data);
  }
}

checkStaff();
