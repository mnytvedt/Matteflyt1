import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEVELS, LevelConfig } from "@/lib/levels";
import { getProgress, isLevelUnlocked, isAllLevelsCompleted, LevelProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export default function LevelSelect() {
  // Force re-render on mount to get latest localstorage
  const [progress, setProgress] = useState<Record<number, LevelProgress>>({});
  const [allCompleted, setAllCompleted] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setAllCompleted(isAllLevelsCompleted());
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-4xl font-display font-bold text-foreground">Velg Nivå</h1>
          </div>
          
          {allCompleted && (
            <Link href="/diploma">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full animate-bounce shadow-lg">
                <Star className="mr-2 w-5 h-5 fill-white" />
                Se Diplom
              </Button>
            </Link>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVELS.map((level, index) => {
            const unlocked = isLevelUnlocked(level.id);
            const levelData = progress[level.id];
            const stars = levelData ? levelData.stars : 0;
            
            return (
              <LevelCard 
                key={level.id} 
                level={level} 
                index={index} 
                locked={!unlocked}
                stars={stars}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LevelCard({ level, index, locked, stars }: { level: LevelConfig; index: number; locked: boolean; stars: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={locked ? "#" : `/play/${level.id}`}>
        <div className={cn(
          "group relative overflow-hidden rounded-3xl p-6 h-full border-2 transition-all duration-300",
          locked 
            ? "bg-muted/50 border-muted-foreground/20 cursor-not-allowed grayscale opacity-70" 
            : "bg-card border-border hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-card to-primary/5"
        )}>
          <div className="flex justify-between items-start mb-4">
            <span className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-display font-bold text-white shadow-lg",
              level.operator === 'add' ? "bg-blue-500" : 
              level.operator === 'subtract' ? "bg-pink-500" : "bg-purple-500"
            )}>
              {level.id}
            </span>
            {locked ? (
              <Lock className="w-6 h-6 text-muted-foreground" />
            ) : (
              <div className="flex gap-1">
                {[1, 2, 3].map((star) => (
                  <Star 
                    key={star} 
                    className={cn(
                      "w-5 h-5 transition-colors", 
                      star <= stars ? "fill-accent text-accent" : "text-muted-foreground/30"
                    )} 
                  />
                ))}
              </div>
            )}
          </div>

          <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
            {level.name}
          </h3>
          <p className="text-muted-foreground font-body mb-6">
            {level.description}
          </p>

          <div className="flex items-center justify-between text-sm font-bold text-muted-foreground/80 mt-auto">
            <span>{level.questionCount} Spørsmål</span>
            {!locked && (
              <span className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                Spill <Play className="w-4 h-4 ml-1 fill-current" />
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
