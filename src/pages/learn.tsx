import { type NextPage } from "next";
import { useEffect, useState } from "react";
import userService from "~/services/userService";
import { toast } from "react-toastify";
import { LeftBar } from "~/components/LeftBar";
import { BottomBar } from "~/components/BottomBar";
import { LoginScreen, useLoginScreen } from "~/components/LoginScreen";
import Bau from "~/components/Bau";
import BauCheio from "~/components/BauCheio";
import BauPremio from "~/components/Container.svg";

interface Mission {
  nivel: number;
  objetivo: number;
  descricao: string;
  valor: number;
  percentual: number;
}

interface SubTheme {
  [key: string]: Mission[];
}

interface MetaProgress {
  [category: string]: SubTheme;
}

const Learn: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();
  const [metaProgress, setMetaProgress] = useState<MetaProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const token = process.env.NEXT_PUBLIC_API_TOKEN || "default_token";

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setCustomerId(parsedData?.first_account ?? null);
      } catch (error) {
        console.error("Erro ao obter customer_id:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!customerId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [progressData, pointsData] = await Promise.all([
          userService.getMetaProgress(customerId, token),
          userService.getCustomerTotalPoints(customerId, token),
        ]);
        setMetaProgress(progressData);
        setTotalPoints(pointsData.total_points);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [customerId, token]);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <LeftBar selectedTab="Learn" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-[#0000C8] border-gray-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">Carregando dados...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
        <>
          <div className="flex flex-col lg:flex-row justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
            <div className="flex flex-col w-full lg:w-[672px] gap-6">
              <div className="bg-[#0000C8] text-white text-center py-4 px-6 rounded-lg">
                <h1 className="text-[24px] font-bold leading-[32px]">Faça missões e ganhe Policoins</h1>
                <p className="text-sm">Troque em produtos e benefícios na loja.</p>
              </div>

              <div className="flex flex-col gap-6">
                {metaProgress && Object.entries(metaProgress).map(([category, subThemes]) => (
                  category !== "customer_id" && (
                    <CategorySection key={category} category={category} subThemes={subThemes} />
                  )
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start w-full lg:w-auto">
              <div className="flex justify-between w-full mb-2">
                <div className="relative flex items-center">
                  <h2 className="text-xl font-bold text-gray-700">Seus Policoins</h2>
                  <div
                    className="ml-2 w-5 h-5 bg-[#E6E6FA] rounded-full flex items-center justify-center text-[#4B0082] text-xs cursor-pointer"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    i
                  </div>
                  {showTooltip && (
                    <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-[#F5F5F5] text-gray-700 text-sm p-3 rounded-lg z-10">
                      {/* Seta do tooltip */}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[#F5F5F5] border-b-8 border-b-transparent" />
                      <div className="flex flex-col gap-0.5 max-w-[200px]">
                        <span className="whitespace-nowrap">Os seus Policoins podem levar</span>
                        <span className="whitespace-nowrap">até 1 dia para serem atualizados.</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-[#0000C8] font-bold text-2xl text-right min-w-[100px]">
                  {totalPoints !== null ? formatCurrency(totalPoints) : "Carregando..."}
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
          </div>
          <div className="pt-[90px]"></div>
          <LoginScreen loginScreenState={loginScreenState} setLoginScreenState={setLoginScreenState} />
        </>
      )}

      <BottomBar selectedTab="Learn" />
    </>
  );
};

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const CategorySection = ({ category, subThemes }: { category: string; subThemes: SubTheme }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h2 className="text-lg font-bold text-gray-700 mb-4">
      {capitalizeFirstLetter(category.replace(/_/g, " "))}
    </h2>
    <div className="flex flex-col gap-6">
      {Object.entries(subThemes).map(([subTheme, missions]) => (
        <SubThemeSection key={subTheme} subTheme={subTheme} missions={missions} />
      ))}
    </div>
  </div>
);

const SubThemeSection = ({ subTheme, missions }: { subTheme: string; missions: Mission[] }) => {
  if (!Array.isArray(missions) || missions.length === 0) return null;

  const currentMission = missions.reduce((active, mission, index) => {
    if (mission.percentual < 100) return mission;
    const nextMission = missions[index + 1];
    return nextMission && nextMission.percentual < 100 ? active : mission;
  }, missions[0]);

  if (!currentMission) return null;

  const formatNumber = (value: number) => value.toLocaleString("pt-BR", { minimumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium text-gray-600">
          {capitalizeFirstLetter(subTheme.replace(/_/g, " "))}
        </h3>
        <span className="text-[#0000C8] text-sm font-bold cursor-pointer">Comece agora</span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-gray-700 font-medium">
          Nível {currentMission.nivel}: {capitalizeFirstLetter(currentMission.descricao)}
        </p>
        <div className="relative h-4 bg-gray-200 rounded-full w-full">
          <div
            className="absolute left-0 top-0 h-4 bg-[#0000C8] rounded-full"
            style={{ width: `${Math.min(currentMission.percentual, 100)}%` }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center text-xs font-bold"
            style={{ color: currentMission.percentual > 50 ? "white" : "black" }}
          >
            {formatNumber(currentMission.valor)} / {formatNumber(currentMission.objetivo)}
          </div>
          <div className="absolute right-[-10px] top-[-8px] h-8 w-8">
            {currentMission.percentual >= 100 ? <BauCheio /> : <Bau />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;