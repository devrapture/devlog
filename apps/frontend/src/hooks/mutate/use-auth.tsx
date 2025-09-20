import { routes } from "@/lib/routes";
import authApis from "@/services/auth-services";
import type { SignUpResponse, UserLogin, UserRegister } from "@/types/api";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { createMutation } from "react-query-kit";
import { useToast } from "../logic/use-toast";
import { useState } from "react";
import { signIn } from "next-auth/react";

export const useSignUp = () => {
  const router = useRouter();
  const { toast } = useToast();
  const signupMutation = createMutation<
    SignUpResponse,
    UserRegister,
    AxiosError<{ message: string }>
  >({
    mutationFn: async (variables: UserRegister) => {
      const res = await authApis.signUp(variables);
      return res.data;
    },
    onSuccess: (data) => {
      router.push(routes.auth.login);
      toast({
        description: data?.message,
      });
    },
    onError: (error) => {
      toast({
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    },
  });

  return signupMutation();
};

export const useLogin = () =>
  // searchParams?: URLSearchParams
  {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onLogin = async (values: UserLogin) => {
      setIsLoading(true);
      //   const callbackUrl =
      //     searchParams?.get("callbackUrl") ?? routes.dashboard.dashboard;
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        // callbackUrl,
      });
      if (!res?.error) {
        setIsLoading(false);
        toast({
          description: "Sign In Successful",
        });
        router.push(routes.root);
      } else {
        setIsLoading(false);
        toast({
          description: res?.code ?? "unable to sign in",
          variant: "destructive",
        });
      }
    };

    return {
      isLoading,
      onLogin,
    };
  };
