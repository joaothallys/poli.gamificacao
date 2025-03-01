import Link from "next/link";
import React from "react";

type SettingsTitle = "Account" | "Sound" | "Edit Daily Goal";

const settingsPages = [
  { title: "Account", href: "/settings/account" },
  { title: "Sound", href: "/settings/sound" },
  { title: "Edit Daily Goal", href: "/settings/coach" },
];

export const SettingsRightNav = ({
  selectedTab,
}: {
  selectedTab: SettingsTitle;
}) => {
  return (
    <div className="hidden h-fit w-80 flex-col gap-1 rounded-2xl border-2 border-gray-200 p-5 lg:flex">
      {settingsPages.map(({ title, href }) => {
        return (
          <Link
            key={title}
            href={href}
            className={[
              "rounded-2xl p-4 font-bold hover:bg-gray-300",
              title === selectedTab ? "bg-gray-300" : "",
            ].join(" ")}
          >
            {title}
          </Link>
        );
      })}
    </div>
  );
};