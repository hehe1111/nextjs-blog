import axios from 'axios';

const client = axios.create();

client.interceptors.response.use(
  response => response,
  error => {
    switch (error.response?.status) {
      case 401:
      case 405:
        alert(error.response?.data?.message);
        break;
      case 500:
        alert('服务器错误');
        break;
    }
    return Promise.reject(error);
  }
);

export default client;
