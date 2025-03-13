import { type NextPage } from "next";
import { useEffect, useState } from "react";
import userService from "~/services/userService";
import LoadingSpinner from "~/components/LoadingSpinner";
import { toast } from "react-toastify";
import { LeftBar } from "~/components/LeftBar";
import { LoginScreen, useLoginScreen } from "~/components/LoginScreen";
import Bau from "~/components/Bau";
import BauCheio from "~/components/BauCheio";

const Learn: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();
  const [metaProgress, setMetaProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number | null>(null);

  const token = process.env.NEXT_PUBLIC_API_TOKEN || "default_token";

  useEffect(() => {
    // Recupera o customer_id do localStorage
    const userData = localStorage.getItem("user_data");

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const extractedCustomerId = parsedData?.active_account?.metadata?.deprecated_customer_id ?? null;
        setCustomerId(extractedCustomerId);
        console.log("customer_id", extractedCustomerId);
      } catch (error) {
        console.error("Erro ao obter customer_id:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMetaProgress = async () => {
      if (!customerId) return;

      try {
        const data = await userService.getMetaProgress(customerId, token);

        if (data) {
          setMetaProgress(data);
        } else {
          toast.error("Não foram encontradas metas.");
        }
      } catch (error) {
        console.error("Erro ao obter meta progress:", error);
        toast.error("Erro ao obter meta progress.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTotalPoints = async () => {
      if (!customerId) return;

      try {
        const data = await userService.getCustomerTotalPoints(customerId, token);
        setTotalPoints(data.total_points);
      } catch (error) {
        console.error("Erro ao obter total de pontos:", error);
        toast.error("Erro ao obter total de pontos.");
      }
    };

    fetchMetaProgress();
    fetchTotalPoints();
  }, [customerId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <>
      <LeftBar selectedTab="Learn" />

      <div className="flex flex-col lg:flex-row justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="flex flex-col w-full lg:w-[672px] gap-6">
          <div className="bg-[#0000C8] text-white text-center py-4 px-6 rounded-lg">
            <h1 className="text-[24px] font-bold leading-[32px]">Faça missões e ganhe Policoins</h1>
            <p className="text-sm">Troque em produtos e benefícios na loja.</p>
          </div>

          <div className="flex flex-col gap-6">
            {metaProgress && (
              <>
                {Object.keys(metaProgress).map((key) => (
                  <MissionSection key={key} title={key} missions={metaProgress[key]} />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Coluna da Direita */}
        <div className="flex flex-col items-start w-full lg:w-auto">
          <div className="flex justify-between w-full mb-2">
            <h2 className="text-xl font-bold text-gray-700">Seus Policoins</h2>
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

      <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      />
    </>
  );
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const MissionSection = ({ title, missions }: { title: string; missions: any[] }) => {
  if (!Array.isArray(missions)) {
    return null;
  }

  // Encontrar a meta correta com base no progresso
  const currentMission = missions.find((mission, index) => {
    const nextMission = missions[index + 1];
    return mission.valor < mission.objetivo && (!nextMission || mission.valor < nextMission.objetivo);
  }) || missions[missions.length - 1];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-700">{capitalizeFirstLetter(title.replace(/_/g, " "))}</h2>
        <span className="text-[#0000C8] text-sm font-bold cursor-pointer">Comece agora</span>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-gray-700 font-medium">Nível {currentMission.nivel}: {capitalizeFirstLetter(currentMission.descricao)}</p>
          <div className="relative h-4 bg-gray-200 rounded-full w-full">
            <div className="absolute left-0 top-0 h-4 bg-[#0000C8] rounded-full" style={{ width: `${currentMission.percentual}%` }}></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold"
              style={{ color: currentMission.percentual > 50 ? "white" : "black" }}>
              {currentMission.valor} / {currentMission.objetivo}
            </div>
            <div className="absolute right-[-10px] top-[-8px] h-8 w-8">
              {currentMission.percentual === 100 ? <BauCheio /> : <Bau />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;