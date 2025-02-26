import Link from "next/link";
import { LightningProgressSvg, TreasureProgressSvg } from "./Svgs";

export const RightBar = () => {
  return (
    <div className="flex justify-center gap-6 p-6">
      <div className="flex flex-col w-[672px] gap-6">
        <div className="bg-[#0000CB] text-white text-center py-4 px-6 rounded-lg">
          <h1 className="text-[24px] font-bold leading-[32px]">Faça missões e ganhe Policoins</h1>
          <p className="text-sm">Troque em produtos e.</p>
        </div>

        <div className="flex flex-col gap-6">
          <MissionSectionMarketing />
          <MissionSectionSales />
        </div>
      </div>

      {/* Coluna da Direita */}
      <div className="flex flex-col items-start">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Seus Policoins</h2>
        <div className="w-[300px] bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="text-sm text-gray-500">A última atualização de seu saldo foi hoje às 17:13h</p>
          <div className="text-right text-blue-700 font-bold text-2xl">10,000</div>
          <div className="mt-6">
            <p className="text-gray-600 text-sm">Precisa de ajuda para realizar missões ou resgatar prêmios?</p>
            <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg mt-3">FALE CONOSCO</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MissionSectionMarketing = () => {
  const marketingMissions = [
    { text: "Realizar 10 campanhas na ferramenta de disparos", current: 3, total: 10, progress: 30 },
    { text: "Reaquecer 1.000 contatos com disparos", current: 0, total: 1000, progress: 0 }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-700">Missões de Marketing</h2>
        <span className="text-blue-600 text-sm font-bold cursor-pointer">Comece agora</span>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {marketingMissions.map((mission, index) => (
          <div key={index} className="flex flex-col gap-2">
            <p className="text-gray-700 font-medium">{mission.text}</p>
            <div className="relative h-4 bg-gray-200 rounded-full w-full">
              <div className="absolute left-0 top-0 h-4 bg-blue-600 rounded-full" style={{ width: `${mission.progress}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                {mission.current} / {mission.total}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MissionSectionSales = () => {
  const salesMissions = [
    { text: "Conectar 1 gateway de pagamento no Poli Pay", current: 1, total: 1, progress: 100 },
    { text: "Criar 1 carrinho pagamento no Instagram", current: 0, total: 1, progress: 0 }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-700">Missões de Venda</h2>
        <span className="text-blue-600 text-sm font-bold cursor-pointer">Comece agora</span>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {salesMissions.map((mission, index) => (
          <div key={index} className="flex flex-col gap-2">
            <p className="text-gray-700 font-medium">{mission.text}</p>
            <div className="relative h-4 bg-gray-200 rounded-full w-full">
              <div className="absolute left-0 top-0 h-4 bg-blue-600 rounded-full" style={{ width: `${mission.progress}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                {mission.current} / {mission.total}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};