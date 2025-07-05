// Production Environment Configuration
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8000/api', // For demo purposes, using localhost
  endpoints: {
    runApi: '/runApi',
    logError: '/logError',
    getAllAPIData: '/getAllAPIData',
    getAPIHistory: '/getAPIHistory'
  }
};
