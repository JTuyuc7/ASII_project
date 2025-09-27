import axios from 'axios';

const axiosPublicClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosPublicClient;
