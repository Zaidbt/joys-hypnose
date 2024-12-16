import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './settings';

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
    defaultLocale,
    locales,
    timeZone: 'Africa/Casablanca'
  };
}); 