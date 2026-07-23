import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { StartClient } from "@tanstack/react-start-client";
import "./styles.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Suspense fallback={<div className="min-h-screen bg-[#141414]" />}>
        <StartClient />
      </Suspense>
    </React.StrictMode>
  );
}
