import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import NotificationListener from "@/components/notifications/NotificationListener";
import { UserProvider } from "@/context/UserContext";
import { NotificationProvider } from "@/context/NotificationProvider";
import DisplaySettingsProvider from "@/contexts/DisplaySettingsContext";
import { queryClient } from "@/lib/queryClient";
import { router } from "./react-router-config";

/**
 * Ordre des providers :
 * QueryClient → User (auth) → Notifications (dépend du token) → préférences d'affichage → UI.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <NotificationProvider>
        <DisplaySettingsProvider>
          <TooltipProvider>
            <Toaster />
            <SonnerToaster position="top-right" richColors closeButton theme="light" />
            <NotificationListener />
            <RouterProvider router={router} future={{ v7_startTransition: true }} />
          </TooltipProvider>
        </DisplaySettingsProvider>
      </NotificationProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
