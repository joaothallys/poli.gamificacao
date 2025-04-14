import Link from "next/link";
import Image from "next/image";
import type { ComponentProps } from "react";
import React, { useState, useEffect } from "react";
import type { Tab } from "./BottomBar";
import { LoginScreen, type LoginScreenState } from "./LoginScreen";
import LogoSvg from "../../public/Logo.svg";
import router, { useRouter } from "next/router";
import LogoutSvg from "../../public/logout.svg";
import Shop from "../../public/shop.svg";
import HomeSvg from "../../public/home.svg";
import transacoes from "../../public/transacoes.svg";

const handleLogout = () => {
  localStorage.removeItem("user_data");
  router.push("/");
};

const bottomBarItems = [
  {
    name: "Home",
    href: "/learn",
    icon: (isActive: boolean) => (
      <Image
        src={HomeSvg}
        alt="Home"
        width={50}
        height={50}
        className={isActive ? "text-blue-400" : "grayscale"} // Aplica cinza quando inativo
      />
    ),
  },
  {
    name: "Loja",
    href: "/shop",
    icon: (isActive: boolean) => (
      <Image
        src={Shop}
        alt="Loja"
        width={50}
        height={50}
        className={isActive ? "text-blue-400" : "grayscale"}
      />
    ),
  },
  {
    name: "Transações",
    href: "/leaderboard",
    icon: (isActive: boolean) => (
      <Image
        src={transacoes}
        alt="Transações"
        width={50}
        height={50}
        className={isActive ? "text-blue-400" : "grayscale"}
      />
    ),
  },
];

export const LeftBar = ({ selectedTab }: { selectedTab: Tab | null }) => {
  const [moreMenuShown, setMoreMenuShown] = useState(false);
  const router = useRouter();
  const [loginScreenState, setLoginScreenState] =
    useState<LoginScreenState>("HIDDEN");
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsedData = JSON.parse(userData);
      const roles = parsedData.roles_deprecated_id.split(",");
      if (roles.includes("1")) {
        setHasAccess(true);
      }
    }
  }, []);

  return (
    <>
      <nav className="fixed bottom-0 left-0 top-0 hidden flex-col gap-5 border-r-2 border-[#e5e5e5] bg-white p-3 md:flex lg:w-64 lg:p-5">
        <div className="flex flex-col items-start mb-5 mt-5">
          <Image src={LogoSvg} alt="Logo" width={70} height={70} className="mb-2" />
          <Link
            href="/learn"
            className="mt-4 text-3xl font-bold text-[#0000CB] lg:block"
          >
            Gamificação
          </Link>
        </div>
        <ul className="flex flex-col items-stretch gap-3">
          {bottomBarItems.map((item) => {
            if (item.name === "Transações" && !hasAccess) {
              return null;
            }
            const isActive = router.pathname === item.href; // Verifica se a rota atual é a mesma do item
            return (
              <li key={item.href} className="flex flex-1">
                {item.name === selectedTab ? (
                  <Link
                    href={item.href}
                    className="flex grow items-center gap-3 rounded-xl border-2 border-[#84d8ff] bg-[#ddf4ff] px-2 py-1 text-sm font-bold uppercase text-blue-400"
                  >
                    {item.icon(isActive)}{" "}
                    <span className="sr-only lg:not-sr-only">{item.name}</span>
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className="flex grow items-center gap-3 rounded-xl px-2 py-1 text-sm font-bold uppercase text-gray-400 hover:bg-gray-100"
                  >
                    {item.icon(isActive)}{" "}
                    <span className="sr-only lg:not-sr-only">{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
          <div
            className="relative flex grow cursor-pointer items-center gap-3 rounded-xl px-2 py-1 font-bold uppercase text-gray-400 hover:bg-gray-100"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
          >
            <Image src={LogoutSvg} alt="Logout" width={50} height={50} />{" "}
            <span className="hidden text-sm lg:inline">Sair</span>
          </div>
        </ul>
      </nav>
      <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      />
    </>
  );
};