import { type NextPage } from "next";
import { useEffect, useState } from "react";
import userService from "~/services/userService";
import { toast } from "react-toastify";
import { LeftBar } from "~/components/LeftBar";
import { BottomBar } from "~/components/BottomBar";
import { LoginScreen, useLoginScreen } from "~/components/LoginScreen";
import Bau from "~/components/Bau";
import BauCheio from "~/components/BauCheio";
import ProfileFormModal from "~/components/ProfileFormModal";
import { Mission, SubTheme, MetaProgress, LevelInfo } from "~/types/interfaces";

const levels = [
  { name: "Starter", min: 0, max: 4999 },
  { name: "Bronze", min: 5000, max: 14999 },
  { name: "Prata", min: 15000, max: 49999 },
  { name: "Ouro", min: 50000, max: 99999 },
  { name: "Diamante", min: 100000, max: 499999 },
  { name: "UCE", min: 500000, max: Infinity },
] as const;

const getLevelInfo = (points: number): LevelInfo => {
  const currentLevel = levels.find((level) => points >= level.min && points <= level.max) || levels[0];
  const currentLevelIndex = levels.findIndex((level) => level === currentLevel);
  const nextLevel = levels[currentLevelIndex + 1];
  const progress = nextLevel
    ? ((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;
  return {
    name: currentLevel.name,
    progress: Math.min(progress, 100),
    current: points,
    next: nextLevel ? nextLevel.min : currentLevel.max,
    max: currentLevel.max,
    min: currentLevel.min, // <-- adicione esta linha
  };
};

const levelIcons: { [key: string]: string } = {
  Starter: "/inicio.svg",
  Bronze: "/bronze.svg",
  Prata: "/prata.svg",
  Ouro: "/ouro.svg",
  Diamante: "/diamante.svg",
  UCE: "/uce.svg",
};

const Learn: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();
  const [metaProgress, setMetaProgress] = useState<MetaProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [currentPoints, setCurrentPoints] = useState<number | null>(null);

  const token = process.env.NEXT_PUBLIC_API_TOKEN || "default_token";

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setCustomerId(parsedData?.first_account ?? null);
        setUserUuid(parsedData?.user_uuid ?? null);
        const acceptTerms = parsedData?.accept_terms ?? false;
        setShowTerms(acceptTerms === false); // Modal aparece se termos não foram aceitos
      } catch (error) {
        console.error("Erro ao parsear dados do usuário:", error);
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
        setCurrentPoints(pointsData.current_points);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [customerId, token]);

  const handleAcceptTerms = () => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        parsedData.accept_terms = true;
        localStorage.setItem("user_data", JSON.stringify(parsedData));
      } catch (error) {
        console.error("Erro ao atualizar accept_terms:", error);
      }
    }
    setShowTerms(false);
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatNumber = (value: number) => value.toLocaleString("pt-BR", { minimumFractionDigits: 0 });

  const levelInfo = totalPoints !== null
    ? getLevelInfo(totalPoints)
    : { name: "Starter", progress: 0, current: 0, next: 5000, max: 5000, min: 0 };

  return (
    <>
      <LeftBar selectedTab="Home" />

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
                  {currentPoints !== null ? formatCurrency(currentPoints) : "Carregando..."}
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
                      src={levelIcons[levelInfo.name] || "/inicio.svg"}
                      alt={`${levelInfo.name} Level Icon`}
                      style={{ width: "78px", height: "51.68278121948242px" }}
                      onError={(e) => {
                        console.error(`Failed to load image for level ${levelInfo.name}: ${levelIcons[levelInfo.name] || "/inicio.svg"}`);
                        e.currentTarget.src = "/fallback.svg";
                      }}
                    />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2 text-center">
                  Incrível, você ultrapassou {formatNumber(levelInfo.min)} Policoins e se tornou <strong>nível {levelInfo.name}</strong>!
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

      {/* Footer with Terms of Use Message and Profile Form */}
      <div className="relative">
        <BottomBar selectedTab="Home" />
        <ProfileFormModal
          isOpen={showTerms}
          onClose={handleAcceptTerms}
          userUuid={userUuid}
          token={token}
        />
      </div>
    </>
  );
};

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const CategorySection = ({ category, subThemes }: { category: string; subThemes: SubTheme }) => {
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);

  const allMissions = Object.entries(subThemes).flatMap(([subTheme, missions]) => {
    if (!Array.isArray(missions)) {
      return [];
    }
    return missions.map((mission) => ({ ...mission, subTheme }));
  });
  const completedMissions = allMissions.filter((mission) => mission.percentual >= 100.0);

  const activeSubThemes = Object.entries(subThemes).filter(([subTheme, missions]) => {
    if (!Array.isArray(missions) || subTheme === "click_here") {
      return false;
    }
    return missions.some((mission) => mission.percentual < 100.0);
  });

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
                <SubThemeSection
                  key={subTheme}
                  subTheme={subTheme}
                  missions={missions as Mission[]}
                />
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
                        Nível {mission.nivel}: {capitalizeFirstLetter(mission.descricao)} • (Ganhe{" "}
                        {formatNumber(mission.objetivo)} Policoins)
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

const SubThemeSection = ({ subTheme, missions }: { subTheme: string; missions: Mission[] }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!Array.isArray(missions) || missions.length === 0) return null;

  const activeMissions = missions.filter((mission) => mission.percentual < 100);
  if (activeMissions.length === 0) return null;

  const currentMission = activeMissions[0];
  if (!currentMission) return null;

  const tooltip = missions.find((item) => "tooltip" in item)?.tooltip || "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="relative flex items-center">
          <h3 className="text-md font-medium text-gray-600">
            {capitalizeFirstLetter(subTheme.replace(/_/g, " "))}
          </h3>
          {tooltip && (
            <>
              <div
                className="ml-2 w-5 h-5 bg-[#E6E6FA] rounded-full flex items-center justify-center text-[#4B0082] text-xs cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowTooltip(true);
                  }
                }}
                role="button"
                aria-label={`Mais informações sobre ${subTheme}`}
                tabIndex={0}
              >
                i
              </div>
              {showTooltip && (
                <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-[#F5F5F5] text-gray-700 text-sm p-3 rounded-lg z-10 max-w-[200px]">
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[#F5F5F5] border-b-8 border-b-transparent" />
                  <span className="whitespace-nowrap">{tooltip}</span>
                </div>
              )}
            </>
          )}
        </div>
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

const formatNumber = (value: number) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: 0 });

export default Learn;