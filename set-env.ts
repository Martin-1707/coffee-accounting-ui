// set-env.ts
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config(); // Lee .env o las variables de entorno inyectadas por Vercel

const targetPath = path.resolve(__dirname, './src/environments/environment.ts');
const prodPath = path.resolve(__dirname, './src/environments/environment.prod.ts');

const envConfig = `
export const environment = {
  production: false,
  base: '${process.env['NG_APP_API_BASE_URL']}',
  dom: '${process.env['NG_APP_API_BASE_URL_DOM']}'
};`;

const prodEnvConfig = `
export const environment = {
  production: true,
  base: '${process.env['NG_APP_API_BASE_URL']}',
  dom: '${process.env['NG_APP_API_BASE_URL_DOM']}'
};`;

fs.writeFileSync(targetPath, envConfig, { encoding: 'utf-8' });
fs.writeFileSync(prodPath, prodEnvConfig, { encoding: 'utf-8' });

console.log('✔ Entorno generado exitosamente ✅');
