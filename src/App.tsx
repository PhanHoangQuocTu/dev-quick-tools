import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HubLayout } from "@/components/hub/HubLayout";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import JsonTool from "./pages/tools/JsonTool";
import EncodeTool from "./pages/tools/EncodeTool";
import TimestampTool from "./pages/tools/TimestampTool";
import RegexTool from "./pages/tools/RegexTool";
import DiffTool from "./pages/tools/DiffTool";
import MockTool from "./pages/tools/MockTool";
import SqlTool from "./pages/tools/SqlTool";
import ColorTool from "./pages/tools/ColorTool";
import JwtTool from "./pages/tools/JwtTool";
import CsvTool from "./pages/tools/CsvTool";
import UuidTool from "./pages/tools/UuidTool";
import HashTool from "./pages/tools/HashTool";
import CaseTool from "./pages/tools/CaseTool";
import UrlTool from "./pages/tools/UrlTool";
import LoremTool from "./pages/tools/LoremTool";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<HubLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/json" element={<JsonTool />} />
            <Route path="/encode" element={<EncodeTool />} />
            <Route path="/timestamp" element={<TimestampTool />} />
            <Route path="/regex" element={<RegexTool />} />
            <Route path="/diff" element={<DiffTool />} />
            <Route path="/mock" element={<MockTool />} />
            <Route path="/sql" element={<SqlTool />} />
            <Route path="/color" element={<ColorTool />} />
            <Route path="/jwt" element={<JwtTool />} />
            <Route path="/csv" element={<CsvTool />} />
            <Route path="/uuid" element={<UuidTool />} />
            <Route path="/hash" element={<HashTool />} />
            <Route path="/case" element={<CaseTool />} />
            <Route path="/url" element={<UrlTool />} />
            <Route path="/lorem" element={<LoremTool />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
