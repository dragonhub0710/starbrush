import { Diffusion, Gallery, Home } from "@/pages";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/view",
    element: <Gallery />,
  },
  {
    path: "/diffusion",
    element: <Diffusion />,
  },
];

export default routes;
