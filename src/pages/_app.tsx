import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import withAuth from "~/hoc/withAuth";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const publicPages = ["/"]; // Adicione aqui as rotas das páginas públicas
  const isPublicPage = publicPages.includes(router.pathname);

  const AuthComponent = withAuth(Component, isPublicPage);

  return (
    <>
      <Head>
        <title>React Duolingo Clone</title>
        <meta
          name="description"
          content="Duolingo web app clone written with React"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0A0" />
        <link rel="manifest" href="/app.webmanifest" />
      </Head>
      <AuthComponent {...pageProps} />
    </>
  );
};

export default MyApp;