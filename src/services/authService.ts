import axios from "axios";
import type { UserData } from "~/interfaces/UserData";

interface AuthResponse {
  authorized: boolean;
  message: string;
}

const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const instance = axios.create({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const params = new URLSearchParams();
      params.append("email", email);
      params.append("password", password);

      const loginResponse = await instance.post(`${process.env.NEXT_PUBLIC_API_URL}/get-me-foundation`, params);

      if (loginResponse.status === 200 || loginResponse.status === 204) {
        const userData: UserData = loginResponse.data.detail;

        const roles = userData.roles_deprecated_id.split(",");
        if (roles.includes("1") || roles.includes("3")) {
          localStorage.setItem("user_data", JSON.stringify(userData));
          
          return { authorized: true, message: "Usuário autorizado." };
        } else {
          console.error("Você não tem permissão.");
          return { authorized: false, message: "Você não tem permissão." };
        }
      } else {
        throw new Error("Credenciais inválidas.");
      }
    } catch (error: any) {
      console.error("Erro no serviço de autenticação:", error);

      if (error.response?.data?.status === "Unauthenticated") {
        return { authorized: false, message: "Usuário não autenticado." };
      }

      throw new Error(error.response?.data?.message || "Erro ao autenticar.");
    }
  },
};

export default authService;