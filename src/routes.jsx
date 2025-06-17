// src/routes.js

import Overview from "./pages/Overview";
import Emissions from "./pages/Emissions";
import AirQuality from "./pages/AirQuality";
import SeaLevel from "./pages/SeaLevel";
import ForestLoss from "./pages/ForestLoss";
import Disasters from "./pages/Disasters";
import Energy from "./pages/Energy";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import IceLevelPage from "./pages/IceLevelPage";
const routes = [
  { path: "/", Component: Overview },
  { path: "/emissions", Component: Emissions },
  { path: "/air-quality", Component: AirQuality },
  { path: "/sea-level", Component: SeaLevel },
  { path: "/forest-loss", Component: ForestLoss },
   { path: "ice-level", Component: IceLevelPage },
  { path: "/disasters", Component: Disasters },
  { path: "/energy", Component: Energy },
  { path: "/about", Component: About },
  { path: "*", Component: NotFound }, // fallback route for unmatched paths
];

export default routes;
