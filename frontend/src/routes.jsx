import { Gallery, Home } from "@/pages";

export const routes = [
  {
    name: "Home",
    path: "/",
    element: <Home />,
  },
  {
    name: "Gallery",
    path: "/view",
    element: <Gallery />,
  },
];

export default routes;
