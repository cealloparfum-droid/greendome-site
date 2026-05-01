import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import AnimatedRoutes from "./components/AnimatedRoutes";
import IntroAnimation from "./components/IntroAnimation";
import Concierge from "./components/Concierge";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <IntroAnimation />
      <CustomCursor />
      <BrowserRouter>
        <AnimatedRoutes />
        <Concierge />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
