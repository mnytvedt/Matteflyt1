import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Plus, Minus, X as Multiply, Star, Trophy, Settings, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LEVELS } from "@/lib/levels";
import { getProgress } from "@/lib/progress";
import heroImage from "@assets/generated_images/colorful_3d_math_symbols_floating_playfully.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [multiplicationUnlocked, setMultiplicationUnlocked] = useState(false);

  useEffect(() => {
    // Check if all addition/subtraction levels are completed
    const progress = getProgress();
    const addSubLevels = LEVELS.filter(l => l.category === 'addition_subtraction');
    
    const allCompleted = addSubLevels.every(level => {
      const p = progress[level.id];
      return p && p.accuracy >= level.passingScore;
    });
    
    setMultiplicationUnlocked(allCompleted);
  }, []);

  const handleMultiplicationClick = () => {
    if (multiplicationUnlocked) {
      setLocation('/levels?category=multiplication');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto z-10 w-full"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8 relative inline-block"
        >
          <img 
            src={heroImage} 
            alt="Math Dash Hero" 
            className="w-48 h-48 mx-auto object-contain drop-shadow-2xl animate-float"
          />
        </motion.div>

        <h1 className="text-6xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary mb-4 drop-shadow-sm">
          MatteFlyt
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 font-body max-w-md mx-auto">
          Velg tema og mestre matematikk med fart og presisjon!
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          {/* Addition & Subtraction Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card 
              className="p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 group"
              onClick={() => setLocation('/levels?category=addition_subtraction')}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Minus className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <h2 className="text-2xl font-display font-bold mb-2 text-primary">Addisjon & Subtraksjon</h2>
              <p className="text-muted-foreground mb-4">Pluss og minus opp til 20</p>
              <Button className="w-full" size="lg">
                Start Øving
              </Button>
            </Card>
          </motion.div>

          {/* Multiplication Category */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card 
              className={`p-8 transition-all duration-300 border-2 relative ${
                multiplicationUnlocked 
                  ? 'cursor-pointer hover:shadow-2xl hover:border-purple-500/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 group'
                  : 'cursor-not-allowed bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-300 opacity-70'
              }`}
              onClick={handleMultiplicationClick}
            >
              {/* Lock Overlay */}
              {!multiplicationUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg backdrop-blur-[1px]">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-xl">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform ${
                  multiplicationUnlocked 
                    ? 'bg-purple-500/10 group-hover:scale-110' 
                    : 'bg-gray-400/10'
                }`}>
                  <Multiply className={`w-8 h-8 ${
                    multiplicationUnlocked 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : 'text-gray-400'
                  }`} />
                </div>
              </div>
              <h2 className={`text-2xl font-display font-bold mb-2 ${
                multiplicationUnlocked 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-gray-400'
              }`}>
                Multiplikasjon
              </h2>
              <p className={`mb-4 ${
                multiplicationUnlocked 
                  ? 'text-muted-foreground' 
                  : 'text-gray-400'
              }`}>
                {multiplicationUnlocked 
                  ? 'Gangetabellene 1-10' 
                  : 'Fullfør alle addisjon/subtraksjonsnivåer først'}
              </p>
              <Button 
                className={`w-full ${
                  multiplicationUnlocked 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`} 
                size="lg"
                disabled={!multiplicationUnlocked}
              >
                {multiplicationUnlocked ? 'Start Øving' : 'Låst'}
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Quick Access Leaderboard */}
        <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full btn-pop font-display border-2 hover:bg-accent/10">
          <Trophy className="mr-2 w-5 h-5 text-accent" />
          Toppliste
        </Button>
      </motion.div>

      {/* Footer / Stats preview */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 flex gap-8 text-sm text-muted-foreground font-display"
      >
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span>Samle stjerner</span>
        </div>
        <button onClick={() => setLocation('/admin-login')} className="flex items-center gap-2 hover:text-primary transition-colors">
          <Settings className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </motion.div>
    </div>
  );
}
