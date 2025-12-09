import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Play, Star, Trophy, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/colorful_3d_math_symbols_floating_playfully.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto z-10"
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
          Mestre addisjon og subtraksjon med fart og presisjon!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/levels">
            <Button size="lg" className="h-16 px-12 text-2xl rounded-full btn-pop font-display bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
              <Play className="mr-3 w-8 h-8 fill-current" />
              Spill Nå
            </Button>
          </Link>
          
          {/* Future feature: Leaderboard */}
          <Button variant="outline" size="lg" className="h-16 px-8 text-xl rounded-full btn-pop font-display border-2 hover:bg-accent/10">
            <Trophy className="mr-2 w-6 h-6 text-accent" />
            Toppliste
          </Button>
        </div>
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
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>v1.0.0</span>
        </div>
      </motion.div>
    </div>
  );
}
