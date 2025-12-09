import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import LevelSelect from "@/pages/LevelSelect";
import Play from "@/pages/Play";
import Diploma from "@/pages/Diploma";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/levels" component={LevelSelect} />
      <Route path="/play/:id" component={Play} />
      <Route path="/diploma" component={Diploma} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
