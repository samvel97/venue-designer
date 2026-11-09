import Areas from "Layout/Layout/Areas/Areas";
import Seats from "Layout/Layout/Seats/Seats";
import { Route, Routes } from "react-router-dom";
export const VenueRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Areas />} />
      <Route path="/seats/:id" element={<Seats />} />
      <Route path="/*" element={<div>not found</div>} />
    </Routes>
  );
};
