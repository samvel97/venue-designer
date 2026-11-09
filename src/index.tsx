import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router";
import { Toaster } from "sonner";
import App from "@/App";
import { TooltipProvider } from "@/components/primitives/tooltip";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { store } from "@/store/store";
import "@/i18n/i18n";
import "@fontsource-variable/inter";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense>
        <HashRouter>
          <Provider store={store}>
            <TooltipProvider delayDuration={300}>
              <App />
              <Toaster position="top-right" richColors closeButton />
            </TooltipProvider>
          </Provider>
        </HashRouter>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
);
