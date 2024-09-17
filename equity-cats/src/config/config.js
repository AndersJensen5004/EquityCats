// config.js
const ENV = process.env.REACT_APP_ENV || 'development';

const config = {
  development: {
    apiBaseUrl: 'http://localhost:8000',
    useCache: false,
    cacheTime: 60000, 
  },
  prod: {
    apiBaseUrl: 'https://equitycats.onrender.com/', 
    useCache: false,
    cacheTime: 300000, 
  },
};

export default config[ENV];