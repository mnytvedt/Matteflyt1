import React, { useState, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Printer, Send, Award, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getProgress } from "@/lib/progress";
import { LEVELS } from "@/lib/levels";
import confetti from "canvas-confetti";

export default function Diploma() {
  const [name, setName] = useState("");
  const progress = getProgress();
  const printRef = useRef<HTMLDivElement>(null);

  // Calculate stats
  const totalLevels = LEVELS.length;
  const completedLevels = Object.keys(progress).length;
  const avgAccuracy = Math.round(
    Object.values(progress).reduce((acc, curr) => acc + curr.accuracy, 0) / (completedLevels || 1)
  );
  const totalStars = Object.values(progress).reduce((acc, curr) => acc + curr.stars, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    if (!name) {
      alert("Vennligst skriv inn navnet ditt først!");
      return;
    }

    try {
      const levelResults: Record<number, { name: string; accuracy: number; time: number }> = {};
      
      LEVELS.forEach(level => {
        const p = progress[level.id];
        if (p) {
          levelResults[level.id] = {
            name: level.name,
            accuracy: p.accuracy,
            time: p.avgTime,
          };
        }
      });

      const response = await fetch("/api/diplomas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: name,
          totalStars,
          avgAccuracy,
          levelResults: JSON.stringify(levelResults),
        }),
      });

      if (response.ok) {
        alert(`✅ Diplom sendt! Kjempebra, ${name}! Lærer har fått resultatet ditt.`);
        setName("");
      } else {
        alert("❌ Noe gikk galt ved sending. Prøv igjen.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Feil ved sending av diplom");
    }
  };

  React.useEffect(() => {
    // Celebration confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FF69B4', '#00BFFF']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FF69B4', '#00BFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center bg-slate-50 print:bg-white print:p-0">
      <div className="w-full max-w-4xl print:hidden mb-8 flex justify-between items-center">
        <Link href="/levels">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Tilbake til nivåer
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-400">Diplom</h1>
      </div>

      <div className="w-full max-w-4xl space-y-8 print:space-y-0">
        {/* Input Section - Hidden on Print */}
        <Card className="p-6 print:hidden">
          <label className="block text-sm font-medium mb-2">Skriv inn elevens navn:</label>
          <div className="flex gap-4">
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Skriv navnet ditt her..."
              className="text-lg"
            />
            <Button onClick={handleSendEmail} className="gap-2 bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4" /> Send til Lærer
            </Button>
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer className="w-4 h-4" /> Skriv ut
            </Button>
          </div>
        </Card>

        {/* The Diploma Certificate */}
        <div 
          ref={printRef}
          className="bg-white text-center p-12 rounded-xl shadow-2xl border-[16px] border-double border-yellow-500 relative overflow-hidden print:shadow-none print:border-8 print:w-full print:h-screen print:flex print:flex-col print:justify-center"
        >
          {/* Decorative Corner Ribbons */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500 -translate-x-16 -translate-y-16 rotate-45"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 translate-x-16 -translate-y-16 -rotate-45"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500 -translate-x-16 translate-y-16 -rotate-45"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-500 translate-x-16 translate-y-16 rotate-45"></div>

          <Award className="w-32 h-32 mx-auto text-yellow-500 mb-6 drop-shadow-md" />
          
          <h1 className="text-6xl font-display font-bold text-slate-800 mb-4 uppercase tracking-wider">Diplom</h1>
          <p className="text-2xl text-slate-500 italic mb-8 font-serif">for Matematisk Dyktighet</p>
          
          <p className="text-xl text-slate-600 mb-2">Dette bekrefter at</p>
          <div className="text-4xl font-display font-bold text-primary mb-8 border-b-2 border-slate-200 inline-block px-12 py-2 min-w-[300px]">
            {name || "Elevens Navn"}
          </div>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Har fullført alle {totalLevels} nivåer i MatteFlyt med fremragende nøyaktighet og hurtighet.
          </p>

          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-12">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-sm text-slate-500 uppercase tracking-wide font-bold mb-1">Totalt antall stjerner</div>
              <div className="text-3xl font-bold text-yellow-500 flex items-center justify-center gap-2">
                <Star className="fill-current" /> {totalStars}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-sm text-slate-500 uppercase tracking-wide font-bold mb-1">Gjennomsnittlig nøyaktighet</div>
              <div className="text-3xl font-bold text-blue-600">
                {avgAccuracy}%
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-between items-end px-12">
            <div className="text-center">
              <div className="w-48 border-b-2 border-slate-400 mb-2"></div>
              <p className="text-slate-500 font-serif italic">Dato</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b-2 border-slate-400 mb-2">
                <img src="/attached_assets/logo.png" className="h-12 mx-auto opacity-50 grayscale" alt="" />
              </div>
              <p className="text-slate-500 font-serif italic">MatteFlyt Offisiell</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
