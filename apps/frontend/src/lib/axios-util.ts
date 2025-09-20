import { env } from "@/env";
import axios from "axios";

export const server = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    responseType: "json",
    timeout: 240_000,
    withCredentials: true,
});

// server.interceptors.request.use(
//   async (config) => {
//     const session = await getSession();
//     const token = session?.token;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       return config;
//     } else {
//       return config;
//     }
//   },
//   (error: unknown) => {
//     if (axios.isAxiosError(error)) {
//       return Promise.reject(error);
//     }
//     return Promise.reject(
//       error instanceof Error ? error : new Error(String(error)),
//     );
//   },
// );
