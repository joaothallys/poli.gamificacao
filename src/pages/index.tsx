import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import authService from "~/services/authService";
import withAuth from "~/hoc/withAuth";
import LoadingSpinner from "~/components/LoadingSpinner";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/img3.svg";
import rewardsIllustration from "../../public/img4.svg";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    _poli?: any;
    userGuiding?: any;
  }
}

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      router.push("/home").catch(console.error);
    }
  }, [router]);

  // Função para disparar o UserGuiding
  function triggerGuiding() {
    if (typeof window !== "undefined" && window.userGuiding && window._poli) {
      window.userGuiding.identify(window._poli.id, {
        userId: window._poli.id,
        name: window._poli.name,
        email: window._poli.email,
        company_name: window._poli.account?.name,
        user_role: window._poli.user_permission,
        company_id: window._poli.account?.id,
        created_at: window._poli.user_created_at,
        user_age_days: window._poli.user_age_days,
        company_created_at: window._poli.account?.created_at,
      });
    }
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.authorized) {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        window._poli = {
          id: userData.user_uuid,
          name: userData.name,
          email: userData.email,
          account: {
            name: userData.company_name,
            id: userData.company_id,
            created_at: userData.company_created_at,
          },
          user_permission: userData.roles_uuid,
          user_created_at: userData.created_at,
          user_age_days: userData.user_age_days,
        };
        setTimeout(triggerGuiding, 5000);

        await router.push("/home");
      } else {
        setError("Email/Senha inválidos");
      }
    } catch (err) {
      setError("Erro ao autenticar. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0000C8] text-white p-4">
      <div className="flex flex-col md:flex-row w-full max-w-[1120px] h-auto md:h-[616px] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full md:w-[50%] h-auto md:h-full bg-[#6666DE] flex flex-col items-center p-8">
          <div className="w-full flex flex-col items-center mt-8">
            <Image src={logo} alt="Logo" width={150} height={150} />
            <h2 className="text-center text-xl font-bold mt-4">Programa de recompensas da Poli.</h2>
            <p className="text-center text-lg text-[#B6FF00] font-semibold">Acompanhe seus Policoins.</p>
            <div className="hidden md:block mt-6">
              <Image src={rewardsIllustration} alt="Recompensas" width={300} height={200} />
            </div>
          </div>
        </div>
        <div className="w-full md:w-[50%] p-8 flex flex-col justify-center text-black">
          <h4 className="text-center text-3xl font-semibold text-gray-700">Seja bem-vindo!</h4>
          <form
            className="mt-4"
            onSubmit={e => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className={`relative ${error ? 'border-red-500' : 'border-gray-300'} border rounded-lg`}>
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <AlertCircle className="absolute right-3 top-3.5 text-red-500" size={20} />}
            </div>
            <div className={`relative mt-3 ${error ? 'border-red-500' : 'border-gray-300'} border rounded-lg`}>
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                className={`w-full pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex justify-between mt-2">
              <span></span>
              <Link href="https://app-spa.poli.digital/recover-password" target="_blank" className="text-blue-500">Esqueci minha senha</Link>
            </div>
            <button
              type="submit"
              className="w-full mt-4 rounded-lg bg-[#0000C8] py-3 font-bold text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : "Acessar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default withAuth(Login, true);
