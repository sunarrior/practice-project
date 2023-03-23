import "@/styles/globals.css";
import type { AppProps } from "next/app";
// import { useRouter } from "next/router";

import NavBar from "@/components/navbar";

export default function App({ Component, pageProps }: AppProps) {
  // const router = useRouter();
  return (
    <>
      <NavBar>
        <Component {...pageProps} />
      </NavBar>
    </>
  );
}
