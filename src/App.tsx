import React from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotificationListener from "@/components/notifications/NotificationListener";

import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserProvider } from "@/context/UserContext";
import { router } from "./react-router-config";
import { Toaster } from "@/components/ui/toaster";

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      {/* <ErrorBoundary> */}
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <UserProvider>
          <TooltipProvider>
            <NotificationListener />
            <RouterProvider router={router} />
          </TooltipProvider>
        </UserProvider>
      </QueryClientProvider>
      {/* </ErrorBoundary> */}
    </React.StrictMode>
  );
};

export default App;
