// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "../components/ui/sonner";
import { PermissionsProvider } from "../pages/context/PermissionsContext";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PermissionsProvider>
        <div className="min-h-screen bg-gray-50">
          <Component {...pageProps} />
        </div>
        <Toaster position="top-right" richColors />
      </PermissionsProvider>
    </Provider>
  );
}
