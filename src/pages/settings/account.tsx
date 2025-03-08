import type { NextPage } from "next";
import React, { useState } from "react";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import { TopBar } from "~/components/TopBar";
import { SettingsRightNav } from "~/components/SettingsRightNav";

const Coach: NextPage = () => {
  const goalXp = 50; // Valor estático para goalXp
  const [localGoalXp, setLocalGoalXp] = useState(goalXp);

  const goalOptions = [
    { title: "Daily Goal", value: localGoalXp, setValue: setLocalGoalXp },
  ];

  return (
    <div>
      <LeftBar selectedTab={null} />
      <BottomBar selectedTab={null} />
      <div className="mx-auto flex flex-col gap-5 px-4 py-20 sm:py-10 md:pl-28 lg:pl-72">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between lg:max-w-4xl">
          <h1 className="text-lg font-bold text-gray-800 sm:text-2xl">
            Edit Daily Goal
          </h1>
          <button
            className="rounded-2xl border-b-4 border-green-600 bg-green-500 px-5 py-3 font-bold uppercase text-white transition hover:brightness-110 disabled:border-b-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:brightness-100"
            onClick={() => {
              // Ação de salvar removida, pois os valores são estáticos
            }}
            disabled={goalXp === localGoalXp}
          >
            Save changes
          </button>
        </div>
        <div className="flex justify-center gap-12">
          <div className="flex w-full max-w-xl flex-col gap-8">
            {goalOptions.map(({ title, value, setValue }) => {
              return (
                <div
                  key={title}
                  className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-10 sm:pl-10"
                >
                  <div className="font-bold sm:w-1/6">{title}</div>
                  <input
                    className="grow rounded-2xl border-2 border-gray-200 p-4 py-2"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    type="number"
                  />
                </div>
              );
            })}
          </div>
          <SettingsRightNav selectedTab="Edit Daily Goal" />
        </div>
      </div>
    </div>
  );
};

export default Coach;