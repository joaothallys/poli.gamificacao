import { type NextPage } from "next";
import { TopBar } from "~/components/TopBar";
import { BottomBar } from "~/components/BottomBar";
import { RightBar } from "~/components/RightBar";
import { LeftBar } from "~/components/LeftBar";
import { LoginScreen, useLoginScreen } from "~/components/LoginScreen";

const Learn: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();

  return (
    <>
      <TopBar backgroundColor="bg-[#58cc02]" borderColor="border-[#46a302]" />
      <LeftBar />

      {/* Faixa azul com tamanho fixo e bordas arredondadas */}
      {/* <div className="bg-[#0000CB] text-white text-center flex flex-col items-center justify-center mx-auto mt-4 rounded-lg shadow-md w-[672px] h-[96px]">
        <h1 className="font-bold text-[24px] leading-[32px]">
          Faça missões e ganhe Policoins
        </h1>
        <p className="text-[16px] leading-[24px]">
          Troque em produtos e benefícios na loja.
        </p>
      </div> */}

      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <RightBar />
      </div>

      <div className="pt-[90px]"></div>

      <BottomBar />
      <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      />
    </>
  );
};

export default Learn;