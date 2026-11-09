import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { VenueRoutes } from "route/route";
import { DEFAULT_VENUE_ID } from "config";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  // The editor is always scoped to a venue and a floor; open the demo venue
  // when the URL does not specify one.
  useEffect(() => {
    if (!searchParams.get("id") || !searchParams.get("floor")) {
      setSearchParams(
        {
          id: searchParams.get("id") || DEFAULT_VENUE_ID,
          floor: searchParams.get("floor") || "1",
        },
        { replace: true }
      );
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="chartdesigner svgContainer">
      <VenueRoutes />
    </div>
  );
}

export default App;
