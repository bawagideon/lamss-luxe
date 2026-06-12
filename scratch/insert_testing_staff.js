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

async function insertTestingStaff() {
  const email = 'bawagideon98@gmail.com';
  console.log(`Checking if ${email} exists in admin_staff...`);
  
  const { data: existing } = await supabase
    .from('admin_staff')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    console.log(`${email} already exists in admin_staff.`);
    return;
  }

  console.log(`Inserting ${email} into admin_staff...`);
  const { data, error } = await supabase
    .from('admin_staff')
    .insert({
      name: 'Bawa Gideon',
      email: email,
      role: 'admin',
      password: 'lamsseluxe'
    })
    .select();

  if (error) {
    console.error("Error inserting staff member:", error);
  } else {
    console.log("Database insert successful! Record:", data);
  }
}

insertTestingStaff();
