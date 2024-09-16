// config.js
const ENV = process.env.REACT_APP_ENV || 'development';

const config = {
  development: {
    apiBaseUrl: 'http://localhost:8000',
    useCache: true,
    cacheTime: 60000, 
  },
  production: {
    apiBaseUrl: 'https://equitycats.onrender.com/', 
    useCache: true,
    cacheTime: 300000, 
  },
};

export default config[ENV];