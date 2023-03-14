/* eslint-disable @typescript-eslint/dot-notation */
import axios, { AxiosInstance } from "axios";

// const token: string | null = localStorage.getItem("token");
// const config = {
//   headers: { Authorization: `Bearer ${token}` },
// };

const API: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default API;

// export { config };
