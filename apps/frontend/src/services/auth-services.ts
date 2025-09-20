import { server } from "@/lib/axios-util";
import type { SignUpResponse, UserRegister } from "@/types/api";

const authApis = {
    signUp: (data: UserRegister) =>
        server.post<SignUpResponse>("auth/signup", data),
};

export default authApis;
