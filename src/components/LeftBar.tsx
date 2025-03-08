import Link from "next/link";
import Image from "next/image";
import type { ComponentProps } from "react";
import React, { useState } from "react";
import type { Tab } from "./BottomBar";
import { LoginScreen, type LoginScreenState } from "./LoginScreen";
import LogoSvg from "../../public/logo.svg";
import router, { useRouter } from "next/router";
import LogoutSvg from "../../public/logout.svg";
import ShopSvg from "../../public/loja.svg";
import HomeSvg from "../../public/home.svg";


const LeftBarMoreMenuSvg = (props: ComponentProps<"svg">) => {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" {...props}>
      <circle
        cx="23"
        cy="23"
        r="19"
        fill="#CE82FF"
        stroke="#CE82FF"
        strokeWidth="2"
      />
      <circle cx="15" cy="23" r="2" fill="white" />
      <circle cx="23" cy="23" r="2" fill="white" />
      <circle cx="31" cy="23" r="2" fill="white" />
    </svg>
  );
};

const handleLogout = () => {
  localStorage.removeItem("user_data");
  router.push("/");
};

const bottomBarItems = [
  {
    name: "Home",
    href: "/learn",
    icon: (
      <Image src={HomeSvg} alt="Home" width={50} height={50} />
    ),
  },
  {
    name: "Loja",
    href: "/shop",
    icon: (
      <Image src={ShopSvg} alt="Loja" width={50} height={50} />
    ),
  },
  // {
  //   name: "Leaderboards",
  //   href: "/leaderboard",
  //   icon: (
  //     <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
  //       <path
  //         d="M7 9.5C7 7.84314 8.34315 6.5 10 6.5H36C37.6569 6.5 39 7.84315 39 9.5V23.5C39 32.3366 31.8366 39.5 23 39.5C14.1634 39.5 7 32.3366 7 23.5V9.5Z"
  //         fill="#FEC701"
  //       />
  //       <path
  //         opacity="0.3"
  //         d="M39.0001 13.3455V9.5C39.0001 7.84315 37.657 6.5 36.0001 6.5H31.5706L8.30957 29.8497C9.68623 33.0304 12.0656 35.6759 15.0491 37.3877L39.0001 13.3455Z"
  //         fill="white"
  //       />
  //     </svg>
  //   ),
  // },
];

export const LeftBar = ({ selectedTab }: { selectedTab: Tab | null }) => {
  const [moreMenuShown, setMoreMenuShown] = useState(false);
  const router = useRouter();
  const [loginScreenState, setLoginScreenState] =
    useState<LoginScreenState>("HIDDEN");


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
            return (
              <li key={item.href} className="flex flex-1">
                {item.name === selectedTab ? (
                  <Link
                    href={item.href}
                    className="flex grow items-center gap-3 rounded-xl border-2 border-[#84d8ff] bg-[#ddf4ff] px-2 py-1 text-sm font-bold uppercase text-blue-400"
                  >
                    {item.icon}{" "}
                    <span className="sr-only lg:not-sr-only">{item.name}</span>
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className="flex grow items-center gap-3 rounded-xl px-2 py-1 text-sm font-bold uppercase text-gray-400 hover:bg-gray-100"
                  >
                    {item.icon}{" "}
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
            <span className="hidden text-sm lg:inline">Logout</span>
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