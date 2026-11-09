import { lazy, useEffect } from "react";
import { Route, Routes, useSearchParams } from "react-router";
import { DEFAULT_VENUE_ID } from "@/config";
import Areas from "@/Layout/Layout/Areas/Areas";

const Seats = lazy(() => import("@/Layout/Layout/Seats/Seats"));

const App = () => {
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    if (!params.get("id") || !params.get("floor")) {
      setParams({ id: params.get("id") || DEFAULT_VENUE_ID, floor: params.get("floor") || "1" }, { replace: true });
    }
  }, [params, setParams]);

  return (
    <Routes>
      <Route path="/" element={<Areas />} />
      <Route path="/seats/:id" element={<Seats />} />
      <Route path="*" element={<p className="text-muted-foreground grid h-full place-items-center">Not found</p>} />
    </Routes>
  );
};

export default App;
