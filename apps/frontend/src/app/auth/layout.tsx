import { type PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-muted/30 flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
