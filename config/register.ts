import developmentCfg from './development/register-config.json';
import productionCfg from './production/register-config.json';

export type AppRegisterConfig = typeof config;

const config = {
  name: 'ecommerce',
  root: 'ecommerce-root',
  version: '1.0.0',
  baseURL: 'http://localhost:5173',
  ...(import.meta.env.VERCEL_ENV !== 'production'
    ? developmentCfg
    : productionCfg),
};

if (import.meta.env.VERCEL_ENV !== 'production') {
  console.log('Development Config:', config);
}

export { config };
