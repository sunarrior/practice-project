/* eslint-disable @typescript-eslint/dot-notation */
import axios, { AxiosInstance } from "axios";

// const token: string | null =
//   typeof window !== undefined ? window.localStorage.getItem("token") : null;
// const config = token ? { headers: { Authorization: `Bearer ${token}` } } : null;

const API: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default API;

// export { config };
