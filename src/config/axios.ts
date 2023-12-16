import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    timeout: 10000,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.TMDB_TOKEN}`
    }
  });

export default AxiosInstance;