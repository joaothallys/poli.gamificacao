import React from "react";

export const RightBar = () => {
  return (
    <div className="flex flex-col items-start w-full lg:w-auto">
      <div className="flex justify-between w-full mb-2">
        <h2 className="text-xl font-bold text-gray-700">Seus Policoins</h2>
        <div className="text-[#0000C8] font-bold text-2xl text-right min-w-[100px]">
          10,000
        </div>
      </div>

      <div className="w-full lg:w-[300px] bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <p className="text-gray-600 text-sm text-center">
          Precisa de ajuda para realizar missões ou resgatar prêmios?
        </p>
        <a
          href="https://poli.digital/central-de-ajuda/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#0000C8] text-white font-bold py-2 rounded-lg mt-2 text-center block"
        >
          FALE CONOSCO
        </a>
      </div>
    </div>
  );
};