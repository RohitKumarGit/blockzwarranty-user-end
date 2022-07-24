import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "../components/NavBar";
import "antd/dist/antd.css";
import { MoralisProvider } from "react-moralis";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <MoralisProvider
      appId={process.env.MORALIS_APP_ID}
      serverUrl={process.env.MORALIS_APP_URL}
    >
      {(router.pathname === "/" || router.pathname === "/Gifts") && <NavBar />}
      <div className="container">
        <Component {...pageProps} />
      </div>
    </MoralisProvider>
  );
}

export default MyApp;
