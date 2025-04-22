const { writeFileSync } = require('fs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const targetPath = './src/environments/environment.ts';

const envConfigFile = `export const environment = {
  production: true,
  base: '${process.env['NG_APP_API_BASE_URL']}',
  dom: '${process.env['NG_APP_API_BASE_URL_DOM']}'
};`;

writeFileSync(targetPath, envConfigFile, { encoding: 'utf-8' });

console.log('✔️ Archivo environment.ts actualizado correctamente');
