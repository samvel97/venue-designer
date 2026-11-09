import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "App";
import "./assets/style/index.scss";
import "./index.scss";
import "./i18n/i18n";
import { store } from "store/store";
import { Provider } from "react-redux";
import React, { Suspense } from "react";
import SnackBar from "components/ui/SnackBar/SnackBar";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div />}>
      <HashRouter>
        <Provider store={store}>
          <SnackBar />
          <App />
        </Provider>
      </HashRouter>
    </Suspense>
  </React.StrictMode>
);
