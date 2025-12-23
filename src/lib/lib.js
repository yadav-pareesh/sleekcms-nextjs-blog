import SleekCMS from 'sleekcms-client';

const sleek = new SleekCMS({
  apiKey: process.env.NEXT_PUBLIC_SLEEK_API_KEY,
  prefix: process.env.NEXT_PUBLIC_SLEEK_PREFIX,
});

export default sleek;