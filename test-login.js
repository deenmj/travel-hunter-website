const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) acc[key] = value.join('=').trim();
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

supabase.auth.signInWithPassword({
  email: 'deenmj1434@gmail.com',
  password: 'AdminPassword123!'
}).then(res => {
  if (res.error) console.error('Error logging in:', res.error);
  else console.log('Successfully logged in!');
}).catch(console.error);
