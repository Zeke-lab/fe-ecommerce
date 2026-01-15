import { config } from '../../../config/register';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: config.endpoint,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  // success response
  function (response) {
    console.log('API CALLED SUCCESSFULLY: ', response);
    return response.data;
  },
  function (error) {
    const res = error.response;
    console.log('API CALL FAILED: ', res);
    return Promise.reject(res);
  },
);

export { apiClient };
