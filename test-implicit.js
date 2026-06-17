const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) acc[key] = value.join('=').trim();
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

supabase.auth.admin.generateLink({
  type: 'recovery',
  email: 'deenmj1434@gmail.com',
  options: {
    redirectTo: 'https://travel-hunter-website.vercel.app/admin/reset-password'
  }
}).then(res => {
  const url = res.data.properties.action_link;
  console.log('Action Link:', url);
  return fetch(url, { redirect: 'manual' });
}).then(res => {
  console.log('Redirect Location:', res.headers.get('location'));
}).catch(console.error);
