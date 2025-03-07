import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { GlobeSvg } from "~/components/Svgs"; // Removido CloseSvg não utilizado
import { LanguageHeader } from "~/components/LanguageHeader";
import _bgSnow from "../../public/bg-snow.svg";
import type { StaticImageData } from "next/image";
import { LanguageCarousel } from "~/components/LanguageCarousel";
import authService from "~/services/authService";
import withAuth from "~/hoc/withAuth";

const bgSnow = _bgSnow as StaticImageData;

const Home: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      router.push("/learn").catch(console.error);
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      const response = await authService.login(email, password);
      if (response.authorized) {
        await router.push("/learn");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Erro ao autenticar. Por favor, tente novamente.");
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-[#235390] text-white"
      style={{ backgroundImage: `url(${bgSnow.src})` }}
    >
      <LanguageHeader />
      <div className="flex w-full flex-col items-center justify-center gap-3 px-4 py-16 md:flex-row md:gap-36">
        <GlobeSvg className="h-fit w-7/12 md:w-[360px]" />
        <div>
          <p className="mb-6 max-w-[600px] text-center text-3xl font-bold md:mb-12">
            A maneira gratuita, divertida e eficaz de aprender um idioma!
          </p>
          <div className="mx-auto mt-4 flex w-fit flex-col items-center gap-3">
            <Link
              href="/register"
              className="w-full rounded-2xl border-b-4 border-green-700 bg-green-600 px-10 py-3 text-center font-bold uppercase transition hover:border-green-600 hover:bg-green-500 md:min-w-[320px]"
            >
              Começar
            </Link>
            <button
              className="w-full rounded-2xl border-2 border-b-4 border-[#042c60] bg-[#235390] px-8 py-3 font-bold uppercase transition hover:bg-[#204b82] md:min-w-[320px]"
            >
              Já tenho uma conta
            </button>
          </div>
        </div>
      </div>
      <LanguageCarousel />
      <article
        className={[
          "fixed inset-0 z-30 flex flex-col bg-white p-7 transition duration-300",
          "opacity-100",
        ].join(" ")}
        aria-hidden={false}
      >
        <div className="flex grow items-center justify-center">
          <div className="flex w-full flex-col gap-5 sm:w-96">
            <h2 className="text-center text-2xl font-bold text-gray-800">
              Entrar
            </h2>
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="flex flex-col gap-2 text-black">
              <input
                className="grow rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3"
                placeholder="Email ou nome de usuário (opcional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative flex grow">
                <input
                  className="grow rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3"
                  placeholder="Senha (opcional)"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute bottom-0 right-0 top-0 flex items-center justify-center pr-5">
                  <Link
                    className="font-bold uppercase text-gray-400 hover:brightness-75"
                    href="https://app-spa.poli.digital/recover-password"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Esqueceu?
                  </Link>
                </div>
              </div>
            </div>
            <button
              className="rounded-2xl border-b-4 border-blue-500 bg-blue-400 py-3 font-bold uppercase text-white transition hover:brightness-110"
              onClick={handleLogin}
            >
              Entrar
            </button>
          </div>
        </div>
      </article>
    </main>
  );
};

export default withAuth(Home, true);