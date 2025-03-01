import Link from "next/link";
import type { ComponentProps } from "react";
import React, { useState } from "react";
import type { Tab } from "./BottomBar";
import { LoginScreen, type LoginScreenState } from "./LoginScreen"; // Adicione a importação do tipo LoginScreenState
import { GlobeIconSvg, PodcastIconSvg } from "./Svgs";

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

const bottomBarItems = [
  {
    name: "Home",
    href: "/learn",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="h-[50px] w-[50px]"
      >
        <path
          d="M24.5852 25.2658C24.2883 26.8243 22.9257 27.9519 21.3392 27.9519H10.6401C9.05354 27.9519 7.69094 26.8243 7.39408 25.2658L4.98096 12.5969L15.9001 4.52225L26.9988 12.5941L24.5852 25.2658Z"
          fill="#FFC800"
        />
        <path
          opacity="0.5"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.1558 23.1111C13.1558 22.522 13.6333 22.0444 14.2224 22.0444H18.4891C19.0782 22.0444 19.5558 22.522 19.5558 23.1111C19.5558 23.7002 19.0782 24.1778 18.4891 24.1778H14.2224C13.6333 24.1778 13.1558 23.7002 13.1558 23.1111Z"
          fill="#945151"
        />
        <path
          d="M19.4785 16.2998C19.4785 18.2208 17.9212 19.778 16.0002 19.778C14.0792 19.778 12.522 18.2208 12.522 16.2998C12.522 14.3788 14.0792 12.8215 16.0002 12.8215C17.9212 12.8215 19.4785 14.3788 19.4785 16.2998Z"
          fill="#945151"
        />
        <path
          d="M16.1685 2.84462C16.6431 2.84231 17.1233 2.98589 17.5361 3.28558L17.5368 3.2861L29.9455 12.2319C30.9781 12.9822 31.207 14.4275 30.4568 15.4601C29.7067 16.4924 28.262 16.7215 27.2294 15.9719L27.2286 15.9714L16.1602 7.99185L5.09208 15.9712L5.09121 15.9719C4.05865 16.7213 2.61395 16.4923 1.86391 15.4599C1.11367 14.4273 1.34258 12.982 2.3752 12.2318L2.37679 12.2306L14.7839 3.28596L14.7846 3.28544C15.2022 2.98229 15.6887 2.83889 16.1685 2.84462Z"
          fill="#FF4B4B"
        />
      </svg>
    ),
  },
  {
    name: "Loja",
    href: "/shop",
    icon: (
      <svg
        width="46"
        height="46"
        viewBox="0 0 46 46"
        fill="none"
        className="h-[50px] w-[50px]"
      >
        <path
          d="M40 36V17H6V36C6 38.2091 7.73969 40 9.88571 40H36.1143C38.2603 40 40 38.2091 40 36Z"
          fill="#A56644"
        />
        <path d="M4 10C4 7.79086 5.79086 6 8 6H17V17H4V10Z" fill="#EA2B2B" />
        <path
          d="M4 17H17V17.5C17 21.0899 14.0899 24 10.5 24C6.91015 24 4 21.0899 4 17.5V17Z"
          fill="#FF4945"
        />
        <path
          d="M17 17H29V17.5C29 21.0899 26.3137 24 23 24C19.6863 24 17 21.0899 17 17.5V17Z"
          fill="white"
        />
        <path
          d="M29 17H42V17.5C42 21.0899 39.0899 24 35.5 24C31.9101 24 29 21.0899 29 17.5V17Z"
          fill="#FF4945"
        />
        <path d="M17 6H29V17H17V6Z" fill="#D0D0D0" />
        <path
          d="M29 6H38C40.2091 6 42 7.79086 42 10V17H29V6Z"
          fill="#EA2B2B"
        />
        <path
          d="M11 30C11 28.8954 11.8954 28 13 28H18C19.1046 28 20 28.8954 20 30V40H11V30Z"
          fill="#B9E8FF"
        />
        <path
          d="M24 30C24 28.8954 24.8954 28 26 28H34C35.1046 28 36 28.8954 36 30V34C36 35.1046 35.1046 36 34 36H26C24.8954 36 24 35.1046 24 34V30Z"
          fill="#B9E8FF"
        />
      </svg>
    ),
  },
  {
    name: "Leaderboards",
    href: "/leaderboard",
    icon: (
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
        <path
          d="M7 9.5C7 7.84314 8.34315 6.5 10 6.5H36C37.6569 6.5 39 7.84315 39 9.5V23.5C39 32.3366 31.8366 39.5 23 39.5C14.1634 39.5 7 32.3366 7 23.5V9.5Z"
          fill="#FEC701"
        />
        <path
          opacity="0.3"
          d="M39.0001 13.3455V9.5C39.0001 7.84315 37.657 6.5 36.0001 6.5H31.5706L8.30957 29.8497C9.68623 33.0304 12.0656 35.6759 15.0491 37.3877L39.0001 13.3455Z"
          fill="white"
        />
      </svg>
    ),
  },
];

export const LeftBar = ({ selectedTab }: { selectedTab: Tab | null }) => {
  const [moreMenuShown, setMoreMenuShown] = useState(false);
  const [loginScreenState, setLoginScreenState] =
    useState<LoginScreenState>("HIDDEN");

  return (
    <>
      <nav className="fixed bottom-0 left-0 top-0 hidden flex-col gap-5 border-r-2 border-[#e5e5e5] bg-white p-3 md:flex lg:w-64 lg:p-5">
        <Link
          href="/learn"
          className="mb-5 ml-5 mt-5 hidden text-3xl font-bold text-[#0000CB] lg:block"
        >
          Gamificação
        </Link>
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
            className="relative flex grow cursor-default items-center gap-3 rounded-xl px-2 py-1 font-bold uppercase text-gray-400 hover:bg-gray-100"
            onClick={() => setMoreMenuShown((x) => !x)}
            onMouseEnter={() => setMoreMenuShown(true)}
            onMouseLeave={() => setMoreMenuShown(false)}
            role="button"
            tabIndex={0}
          >
            <LeftBarMoreMenuSvg />{" "}
            <span className="hidden text-sm lg:inline">More</span>
            <div
              className={[
                "absolute left-full top-[-10px] min-w-[300px] rounded-2xl border-2 border-gray-300 bg-white text-left text-gray-400",
                moreMenuShown ? "" : "hidden",
              ].join(" ")}
            >
              <div className="flex flex-col py-2">
                <Link
                  className="flex items-center gap-4 px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href="https://schools.duolingo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GlobeIconSvg className="h-10 w-10" />
                  Schools
                </Link>
                <Link
                  className="flex items-center gap-4 px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href="https://podcast.duolingo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PodcastIconSvg className="h-10 w-10" />
                  Podcast
                </Link>
              </div>
              <div className="flex flex-col border-t-2 border-gray-300 py-2">
                <Link
                  className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href="/settings/account"
                >
                  Settings
                </Link>
                <Link
                  className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href="https://support.duolingo.com/hc/en-us"
                >
                  Help
                </Link>
              </div>
            </div>
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