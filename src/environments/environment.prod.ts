import packageInfo from '../../package.json';

export const environment = {
  production: true,
  apiURL: 'http://localhost:8080/',
  version: packageInfo.version,
};
