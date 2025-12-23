import { createClient } from 'sleekcms-client';

const sleek = createClient({
  siteToken: process.env.NEXT_PUBLIC_SLEEK_API_KEY,
  env: process.env.NEXT_PUBLIC_SLEEK_PREFIX,
});

export default sleek;