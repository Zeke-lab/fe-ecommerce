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

export { apiClient };
