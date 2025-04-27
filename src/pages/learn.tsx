import { type NextPage } from "next";
import { useEffect, useState } from "react";
import userService from "~/services/userService";
import postUserTermsAcceptance from "~/services/userService";
import { toast } from "react-toastify";
import { LeftBar } from "~/components/LeftBar";
import { BottomBar } from "~/components/BottomBar";
import { LoginScreen, useLoginScreen } from "~/components/LoginScreen";
import Bau from "~/components/Bau";
import BauCheio from "~/components/BauCheio";
import { Mission, SubTheme, MetaProgress, LevelInfo } from "~/types/interfaces";

// Definição dos níveis e seus limites
const levels = [
  { name: "Starter", min: 0, max: 5000 },
  { name: "Bronze", min: 5001, max: 15000 },
  { name: "Prata", min: 15001, max: 50000 },
  { name: "Ouro", min: 50001, max: 100000 },
  { name: "Diamante", min: 100001, max: 500000 },
  { name: "UCE", min: 500001, max: Infinity },
];


const getLevelInfo = (points: number): LevelInfo => {
  const currentLevel = levels.find((level) => points >= level.min && points <= level.max);
  if (!currentLevel) {
    return { name: "Starter", progress: 0, current: 0, next: 5000, max: 5000 };
  }

  const nextLevel = levels[levels.indexOf(currentLevel) + 1] || currentLevel;
  const progress = ((points - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;
  return {
    name: currentLevel.name,
    progress: Math.min(progress, 100),
    current: points,
    next: nextLevel.max,
    max: currentLevel.max,
  };
};

// Mapeamento de níveis para ícones
const levelIcons: { [key: string]: string } = {
  Starter: "/starter.svg",
  Bronze: "/bronze.svg",
  Prata: "/prata.svg",
  Ouro: "/ouro.svg",
  Diamante: "/diamante.svg",
  UCE: "/uce.svg",
};

// Componente principal da página Learn
const Learn: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();
  const [metaProgress, setMetaProgress] = useState<MetaProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const token = process.env.NEXT_PUBLIC_API_TOKEN || "default_token";
  const QTD_LOGS = 40;

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setCustomerId(parsedData?.first_account ?? null);
        const logsCount = parsedData?.logs_count ?? 0;
        setShowTerms(logsCount === QTD_LOGS); // Show terms if logs_count matches QTD_LOGS
      } catch (error) {
        console.error("Erro ao parsear dados do usuário:", error);
      }
    }
  }, []);

  // Busca os dados de progresso e pontos quando o customerId muda
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

  // Função para aceitar os termos e ocultar a mensagem
  const handleAcceptTerms = async () => {
    const userData = localStorage.getItem("user_data");
    if (!userData) {
      toast.error("Dados do usuário não encontrados. Faça login novamente.");
      return;
    }

    let parsedData;
    let userUuid;
    try {
      parsedData = JSON.parse(userData);
      userUuid = parsedData?.user_uuid;
      if (!userUuid) {
        toast.error("UUID do usuário não encontrado. Faça login novamente.");
        return;
      }
    } catch (error) {
      console.error("Erro ao parsear dados do usuário:", error);
      toast.error("Erro ao processar dados do usuário");
      return;
    }

    try {
      await userService.postUserTermsAcceptance(userUuid, token);
      parsedData.logs_count = QTD_LOGS + 1;
      localStorage.setItem("user_data", JSON.stringify(parsedData));
      setShowTerms(false);
    } catch (error) {
      console.error("Erro ao aceitar termos:", error);
    }
  };

  // Formata valores monetários para o formato brasileiro
  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatNumber = (value: number) => value.toLocaleString("pt-BR", { minimumFractionDigits: 0 });

  // Obtém informações do nível atual
  const levelInfo = totalPoints !== null ? getLevelInfo(totalPoints) : { name: "Starter", progress: 0, current: 0, next: 5000, max: 5000 };


  return (
    <>
      <LeftBar selectedTab="Learn" />

      {/* Overlay de carregamento */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-[#0000C8] border-gray-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">Carregando dados...</p>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      {!isLoading && (
        <>
          <div className="flex flex-col lg:flex-row justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
            <div className="flex flex-col w-full lg:w-[672px] gap-6">
              <div className="bg-[#0000C8] text-white text-center py-4 px-6 rounded-lg">
                <h1 className="text-[24px] font-bold leading-[32px]">Faça missões e ganhe Policoins</h1>
                <p className="text-sm">Troque em produtos e benefícios na loja.</p>
              </div>

              <div className="flex flex-col gap-6">
                {metaProgress &&
                  Object.entries(metaProgress).map(([category, subThemes]) =>
                    category !== "customer_id" && (
                      <CategorySection key={category} category={category} subThemes={subThemes} />
                    )
                  )}
              </div>
            </div>

            <div className="flex flex-col items-start w-full lg:w-auto">
              {/* Seus Policoins */}
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

              {/* Novo bloco: Seu Nível */}
              <div className="w-full lg:w-[300px] bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
                <div className="flex flex-col items-center mb-2">
                  <h2 className="text-xl font-bold text-gray-700">Seu Nível</h2>
                  <div
                    className="mt-2 flex items-center justify-center gap-[10px] p-2"
                    style={{
                      width: "94px",
                      height: "80px",
                      borderRadius: "8px",
                      background: "radial-gradient(64.37% 64.37% at 69.01% 35.62%, #ACADEA 0%, #6666DE 100%)",
                    }}
                  >
                    <img
                      key={levelInfo.name}
                      src={levelIcons[levelInfo.name] || "/starter.svg"}
                      alt={`${levelInfo.name} Level Icon`}
                      style={{ width: "78px", height: "51.68278121948242px" }}
                      onError={(e) => {
                        console.error(`Failed to load image for level ${levelInfo.name}: ${levelIcons[levelInfo.name] || "/starter.svg"}`);
                        e.currentTarget.src = "/fallback.svg";
                      }}
                    />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2 text-center">
                  Incrível, você ultrapassou {formatNumber(levelInfo.max)} Policoins e se tornou <strong>nível {levelInfo.name}</strong>!
                </p>
                <div className="relative h-4 bg-gray-200 rounded-full w-full">
                  <div
                    className="absolute left-0 top-0 h-4 bg-[#0000C8] rounded-full"
                    style={{ width: `${levelInfo.progress}%` }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                    style={{ color: levelInfo.progress > 50 ? "white" : "black" }}
                  >
                    {formatNumber(levelInfo.current)} / {formatNumber(levelInfo.next)}
                  </div>
                </div>
              </div>

              {/* Fale Conosco */}
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

      {/* Footer with Terms of Use Message */}
      <div className="relative">
        <BottomBar selectedTab="Learn" />
        {showTerms && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-lg z-50">
            <div className="flex-1 text-gray-700 text-sm">
              <span className="font-bold">Termos de uso</span>
              <br />
              Para participar do programa, é necessário concordar com os termos de uso e a política de privacidade. Ao aceitar, você declara estar ciente e de acordo com as regras e condições estabelecidas. Saiba mais em nossa{" "}
              <a
                href="https://docs.google.com/document/d/1t-ng5n29UiPdDgK8mcXtCWDxidn3gNCWK7Xg9_T6Qps/edit?tab=t.0"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política do Programa
              </a>.
            </div>
            <button
              onClick={() => handleAcceptTerms()}
              className="ml-4 bg-[#0000C8] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aceitar termos
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Função para capitalizar a primeira letra de uma string
const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

// Componente para exibir uma categoria (ex.: "Pay", "Flow")
const CategorySection = ({ category, subThemes }: { category: string; subThemes: SubTheme }) => {
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);

  // Agrupa todas as missões completadas de todos os sub-temas
  const allMissions = Object.entries(subThemes).flatMap(([subTheme, missions]) => {
    if (!Array.isArray(missions)) {
      return [];
    }
    return missions.map((mission) => ({ ...mission, subTheme }));
  });
  const completedMissions = allMissions.filter((mission) => mission.percentual >= 100.0);

  // Filtra os sub-temas para mostrar apenas aqueles com missões ativas
  const activeSubThemes = Object.entries(subThemes).filter(([, missions]) => {
    if (!Array.isArray(missions)) {
      return false;
    }
    return missions.some((mission) => mission.percentual < 100.0);
  });

  // Verifica se há um erro na categoria
  const hasError = Object.values(subThemes).some(
    (missions) => !Array.isArray(missions) && typeof missions === "object" && "error" in missions
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-bold text-gray-700 mb-4">
        {capitalizeFirstLetter(category.replace(/_/g, " "))}
      </h2>

      {hasError ? (
        <p className="text-red-600 text-sm">
          Erro ao carregar missões para esta categoria. Tente novamente mais tarde.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {activeSubThemes.length > 0 ? (
              activeSubThemes.map(([subTheme, missions]) => (
                <SubThemeSection key={subTheme} subTheme={subTheme} missions={missions as Mission[]} />
              ))
            ) : (
              <p className="text-gray-600 text-sm">Nenhuma missão ativa no momento.</p>
            )}
          </div>

          {completedMissions.length > 0 && (
            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
                className="flex justify-between items-center w-full text-gray-700 font-medium text-sm"
              >
                <span>Concluídas</span>
                <span className="text-gray-500">{isCompletedExpanded ? "▲" : "▼"}</span>
              </button>
              {isCompletedExpanded && (
                <div className="flex flex-col gap-6">
                  {completedMissions.map((mission) => (
                    <div key={`${mission.subTheme}-${mission.nivel}`} className="flex flex-col gap-1">
                      <p className="text-gray-600 text-sm font-medium">
                        {capitalizeFirstLetter(mission.subTheme.replace(/_/g, " "))}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Nível {mission.nivel}: {capitalizeFirstLetter(mission.descricao)} • (Ganhe {formatNumber(mission.objetivo)} Policoins)
                      </p>
                      <div className="relative h-4 bg-gray-200 rounded-full w-full">
                        <div
                          className="absolute left-0 top-0 h-4 bg-[#0000C8] rounded-full"
                          style={{ width: "100%" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                          {formatNumber(mission.valor)} / {formatNumber(mission.objetivo)}
                        </div>
                        <div className="absolute right-[-10px] top-[-8px] h-8 w-8">
                          <BauCheio />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Componente para exibir um sub-tema (ex.: "criar_cards_flow")
const SubThemeSection = ({ subTheme, missions }: { subTheme: string; missions: Mission[] }) => {
  if (!Array.isArray(missions) || missions.length === 0) return null;

  const activeMissions = missions.filter((mission) => mission.percentual < 100);
  if (activeMissions.length === 0) return null;

  const currentMission = activeMissions[0];
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

const formatNumber = (value: number) => value.toLocaleString("pt-BR", { minimumFractionDigits: 0 });

export default Learn;