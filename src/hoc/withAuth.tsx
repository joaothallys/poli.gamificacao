import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent: React.ComponentType, isPublic: boolean = false) => {
  const AuthComponent = (props: Record<string, unknown>) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        const userData = localStorage.getItem("user_data");
        if (router.pathname === "/") {
          localStorage.removeItem("user_data");
          setIsLoading(false);
        } else if (!userData && !isPublic) {
          router.push("/");
        } else {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router, isPublic]);

    if (isLoading) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;