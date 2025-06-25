import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8082/api',
  adapter: undefined  // 🔥 Node.js adapter를 강제로 막음 (브라우저 환경용으로만)
});

export const fetchBoxes = () => axiosInstance.get('/boxes');