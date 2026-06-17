const url = "https://ywhtleexitgdfwrqqbhs.supabase.co/auth/v1/verify?token=526c56e4ef37e17b08c87fa8cb89702383da80cf4e8dadb3f3aaaaff&type=recovery&redirect_to=https%3A%2F%2Ftravel-hunter-website.vercel.app%2Fauth%2Fcallback%3Fnext%3D%2Fadmin%2Freset-password";
fetch(url, { redirect: 'manual' }).then(res => {
  console.log(res.status);
  console.log(res.headers.get('location'));
}).catch(console.error);
