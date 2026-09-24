import { createBrowserRouter } from "react-router-dom";
import { routes } from "./router/routes";

export const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  },
});
