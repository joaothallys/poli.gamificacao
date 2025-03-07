import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent: React.ComponentType, isPublic: boolean = false) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const userData = localStorage.getItem("user_data");
      if (!userData && !isPublic) {
        router.push("/");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;