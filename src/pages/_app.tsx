// src/pages/_app.tsx
import { store } from "@/redux/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { PermissionsProvider } from "../pages/context/PermissionsContext";
import "../styles/globals.css";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PermissionsProvider>
        <div className="min-h-screen bg-gray-50">
          <Component {...pageProps} />
        </div>
      </PermissionsProvider>
      <ToastContainer />
    </Provider>
  );
}
