import type { NextPage } from "next";
import React from "react";

const Leaderboard: NextPage = () => {
  return (
    <div>
      <div className="flex justify-center gap-3 pt-14 md:ml-24 md:p-6 md:pt-10 lg:ml-64 lg:gap-12">
        <div className="flex w-full max-w-xl flex-col items-center gap-5 pb-28 md:px-5">
          <h1 className="text-center text-2xl font-bold text-gray-700">
            Leaderboard Page
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;