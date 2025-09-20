import { env } from "@/env";
import axios from "axios";

export const server = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    responseType: "json",
    timeout: 30_000,
});

