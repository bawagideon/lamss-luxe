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

async function testGenerateLink() {
  const email = "founder@lamsseluxe.com";
  console.log("Generating link for:", email);
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: email,
    options: {
      redirectTo: 'http://localhost:3000/api/auth/confirm?next=/admin'
    }
  });

  if (error) {
    console.error("Error generating link:", error);
  } else {
    console.log("Success! Generated link properties:", data.properties);
    console.log("User details:", data.user);
  }
}

testGenerateLink();
