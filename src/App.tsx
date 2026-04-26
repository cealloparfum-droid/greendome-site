import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Technology from "./pages/Technology";
import Solutions from "./pages/Solutions";
import Particuliers from "./pages/Particuliers";
import Contact from "./pages/Contact";
import Location from "./pages/Location";
import Jacuzzi from "./pages/Jacuzzi";
import MaisonsEnKit from "./pages/MaisonsEnKit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/qui-sommes-nous" element={<About />} />
          <Route path="/technologie" element={<Technology />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/particuliers" element={<Particuliers />} />
          <Route path="/location" element={<Location />} />
          <Route path="/jacuzzi" element={<Jacuzzi />} />
          <Route path="/maisons-en-kit" element={<MaisonsEnKit />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
