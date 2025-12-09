import React from "react";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import GameEngine from "@/components/Game/GameEngine";
import { LEVELS } from "@/lib/levels";
import NotFound from "@/pages/not-found";

export default function Play() {
  const [match, params] = useRoute("/play/:id");
  
  if (!match) return <NotFound />;
  
  const levelId = parseInt(params.id);
  const level = LEVELS.find(l => l.id === levelId);
  
  if (!level) return <NotFound />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4">
      <header className="w-full max-w-4xl mx-auto flex items-center mb-4">
        <Link href="/levels">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center">
        <GameEngine level={level} />
      </main>
    </div>
  );
}
