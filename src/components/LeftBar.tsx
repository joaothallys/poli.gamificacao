import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { Tab } from "./BottomBar";
import { LoginScreen, type LoginScreenState } from "./LoginScreen";
import LogoSvg from "../../public/Logo.svg";
import ShopGraySvg from "../../public/shop-gray.svg";
import ShopBlueSvg from "../../public/shop-blue.svg";
import HomeGraySvg from "../../public/home-gray.svg";
import HomeBlueSvg from "../../public/home-blue.svg";
import TransacoesGraySvg from "../../public/transacoes-gray.svg";
import TransacoesBlueSvg from "../../public/transacoes-blue.svg";
import LogoutSvg from "../../public/logout.svg";

const APP_VERSION = "1.0.4";

const bottomBarItems = [
  {
    name: "Home",
    href: "/home", // não mudar
    icon: (isActive: boolean) => (
      <Image
        src={isActive ? HomeBlueSvg : HomeGraySvg}
        alt="Home"
        width={50}
        height={50}
      />
    ),
  },
  {
    name: "Loja",
    href: "/shop",
    icon: (isActive: boolean) => (
      <Image
        src={isActive ? ShopBlueSvg : ShopGraySvg}
        alt="Loja"
        width={50}
        height={50}
      />
    ),
  },
  {
    name: "Transações",
    href: "/leaderboard",
    icon: (isActive: boolean) => (
      <Image
        src={isActive ? TransacoesBlueSvg : TransacoesGraySvg}
        alt="Transações"
        width={50}
        height={50}
      />
    ),
  },
];

export const LeftBar = ({ selectedTab }: { selectedTab: Tab | null }) => {
  const [moreMenuShown, setMoreMenuShown] = useState(false);
  const [loginScreenState, setLoginScreenState] = useState<LoginScreenState>("HIDDEN");
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        const parsedData = JSON.parse(userData);
        const roles = parsedData.roles_deprecated_id?.split(",") || [];
        setHasAccess(roles.includes("1"));
      }
    } catch (error) {
      console.error("Failed to parse user_data from localStorage:", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_data");
    router.push("/");
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 top-0 hidden flex-col gap-5 border-r-2 border-[#e5e5e5] bg-white p-3 md:flex lg:w-64 lg:p-5">
        <div className="flex flex-col items-start mb-5 mt-5">
          <Image src={LogoSvg} alt="Logo" width={70} height={70} className="mb-2" />
          <Link href="/home" className="mt-4 text-3xl font-bold text-[#0000CB] lg:block">
            Gamificação
          </Link>
        </div>
        <ul className="flex flex-col items-stretch gap-3">
          {bottomBarItems.map((item) => {
            if (item.name === "Transações" && !hasAccess) return null;
            const isActive = router.pathname === item.href;
            return (
              <li key={item.href} className="flex flex-1">
                <Link
                  href={item.href}
                  className={`flex grow items-center gap-3 rounded-xl px-2 py-1 text-sm font-bold uppercase ${item.name === selectedTab
                      ? "text-[#9CA3AF]"
                      : "text-gray-400 hover:bg-gray-100"
                    }`}
                >
                  {item.icon(isActive)}
                  <span className="sr-only lg:not-sr-only">{item.name}</span>
                </Link>
              </li>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex grow items-center gap-3 rounded-xl px-2 py-1 text-sm font-bold uppercase text-gray-400 hover:bg-gray-100"
          >
            <Image src={LogoutSvg} alt="Logout" width={50} height={50} />
            <span className="hidden lg:inline">Sair</span>
          </button>
        </ul>
        <p className="mt-auto text-xs text-gray-500 lg:text-sm">
          Versão: {APP_VERSION}
        </p>
      </nav>
      <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      />
    </>
  );
};