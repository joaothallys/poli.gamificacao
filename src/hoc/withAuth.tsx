import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent: React.ComponentType, isPublic: boolean = false) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const userData = localStorage.getItem("user_data");
      if (!userData && !isPublic) {
        router.push("/");
      } else {
        const parsedUserData = JSON.parse(userData || "{}");
        const isAdmin = parsedUserData.roles?.some((role: { name: string }) => role.name === "adm");

        if (!isAdmin && !isPublic) {
          router.push("/");
        } else {
          setIsLoading(false);
        }
      }
    }, [router, isPublic]);

    if (isLoading) {
      return null; // Ou um componente de carregamento
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;