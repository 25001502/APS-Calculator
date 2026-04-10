import { createBrowserRouter } from "react-router";
import { Welcome } from "./screens/Welcome";
import { Onboarding } from "./screens/Onboarding";
import { Home } from "./screens/Home";
import { APSInput } from "./screens/APSInput";
import { APSResult } from "./screens/APSResult";
import { UniversityMatches } from "./screens/UniversityMatches";
import { UniversityDetails } from "./screens/UniversityDetails";
import { CompareUniversities } from "./screens/CompareUniversities";
import { SavedOpportunities } from "./screens/SavedOpportunities";
import { Profile } from "./screens/Profile";
import { Root } from "./screens/Root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Welcome },
      { path: "onboarding", Component: Onboarding },
      { path: "home", Component: Home },
      { path: "calculate", Component: APSInput },
      { path: "result", Component: APSResult },
      { path: "matches", Component: UniversityMatches },
      { path: "university/:id", Component: UniversityDetails },
      { path: "compare", Component: CompareUniversities },
      { path: "saved", Component: SavedOpportunities },
      { path: "profile", Component: Profile },
    ],
  },
]);
