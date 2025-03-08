import { type NextPage } from "next";

import { LeftBar } from "~/components/LeftBar";
import { RightBar } from "~/components/RightBar";
import { LoginScreen, useLoginScreen } from "~/components/LoginScreen";

//type TileStatus = "LOCKED" | "ACTIVE" | "COMPLETE";

const Learn: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();

  return (
    <>
      {/* Remova a referência comentada ao TopBar */}
      {/* <TopBar backgroundColor="bg-[#58cc02]" borderColor="border-[#46a302]" /> */}
      <LeftBar selectedTab="Learn" />

      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <RightBar />
      </div>

      <div className="pt-[90px]"></div>

      <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      />
    </>
  );
};

export default Learn;