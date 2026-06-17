const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) acc[key] = value.join('=').trim();
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const uid = 'e1e25f5e-9443-441c-a1bd-986a79b7d39a'; // from screenshot

supabase.auth.admin.updateUserById(uid, { password: 'AdminPassword123!' })
  .then(res => {
    if (res.error) console.error('Error:', res.error);
    else console.log('Successfully updated password for user!');
  })
  .catch(console.error);
