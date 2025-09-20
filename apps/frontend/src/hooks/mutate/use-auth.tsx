import authApis from "@/services/auth-services";
import type { SignUpResponse, UserRegister } from "@/types/api";
import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { useToast } from "../logic/use-toast";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

export const useSignUp = (cb?: () => void) => {
  const router = useRouter();
  const { toast } = useToast();
  const signupMutation = createMutation<
    SignUpResponse,
    UserRegister,
    AxiosError<string>
  >({
    mutationFn: async (variables: UserRegister) => {
      const res = await authApis.signUp(variables);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("onSuccess data", data);
      console.log("onSuccess data", data?.data);
      router.push(routes.auth.login);
      toast({
        description: data?.message,
      });
    },
    onError: (error) => {
      toast({
        description: error?.response?.data,
        variant: "destructive",
      });
    },
    onSettled: () => {
      cb?.();
    },
  });

  return signupMutation();
};
