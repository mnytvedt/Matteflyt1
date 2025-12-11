import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, Clock, RefreshCw, Home, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { LevelConfig, Question, generateQuestion } from "@/lib/levels";
import { saveProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

interface GameEngineProps {
  level: LevelConfig;
}

export default function GameEngine({ level }: GameEngineProps) {
  const [, setLocation] = useLocation();
  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [results, setResults] = useState<{correct: boolean, time: number, question: Question}[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

  // Initialize questions
  useEffect(() => {
    let newQuestions: Question[];
    
    if (level.type === 'tutorial_buttons') {
      // Tutorial: Create questions for digits 0-9 in shuffled order
      const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      // Shuffle the digits
      for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
      }
      
      newQuestions = digits.map((digit, index) => ({
        id: `tutorial_${index}`,
        num1: digit,
        num2: 0,
        operator: 'add' as const,
        answer: digit,
        missingPosition: 'result' as const,
        textPrompt: `${digit}`
      }));
    } else {
      newQuestions = Array.from({ length: level.questionCount }).map(() => generateQuestion(level));
    }
    
    setQuestions(newQuestions);
    setStartTime(Date.now());
  }, [level]);

  const handleInput = (num: number) => {
    if (feedback !== 'none') return; // Block input during feedback
    if (currentInput.length >= 2) return; // Limit to 2 digits
    setCurrentInput(prev => prev + num.toString());
  };

  const handleBackspace = () => {
    if (feedback !== 'none') return;
    setCurrentInput(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (currentInput === "") return;
    
    const inputVal = parseInt(currentInput);
    const currentQuestion = questions[currentIndex];
    
    let isCorrect = false;
    // Check based on what was missing
    if (currentQuestion.missingPosition === 'num2') {
      isCorrect = inputVal === currentQuestion.num2;
    } else {
      isCorrect = inputVal === currentQuestion.answer;
    }

    const timeTaken = (Date.now() - startTime) / 1000;

    // Show feedback
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4ade80', '#22c55e'] // Greens
      });
    } else {
      // Shake effect logic handled by framer-motion via key prop change or state
    }

    // Wait for animation then proceed
    setTimeout(() => {
      setResults(prev => [...prev, { correct: isCorrect, time: timeTaken, question: currentQuestion }]);
      setFeedback('none');
      setCurrentInput("");
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setStartTime(Date.now()); // Reset timer for next Q
      } else {
        setGameState('completed');
        playCompletionConfetti();
      }
    }, 1000); // 1s delay for feedback
  };

  const playCompletionConfetti = () => {
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
  };

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) return <div>Loading...</div>;

  if (gameState === 'completed') {
    const accuracy = Math.round((score / level.questionCount) * 100);
    const avgTime = results.reduce((acc, curr) => acc + curr.time, 0) / results.length;
    const isSuccess = accuracy >= level.passingScore;
    
    // Save progress with speed
    saveProgress(level.id, accuracy, avgTime);

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="relative">
          <div className={cn(
            "w-32 h-32 rounded-full flex items-center justify-center text-5xl border-8 shadow-xl",
            isSuccess ? "bg-green-100 border-green-500 text-green-600" : "bg-red-100 border-red-500 text-red-600"
          )}>
            {isSuccess ? "🎉" : "💪"}
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card px-4 py-1 rounded-full shadow-md border text-sm font-bold whitespace-nowrap">
            {isSuccess ? "Nivå Fullført!" : "Prøv Igjen!"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <Card className="p-4 flex flex-col items-center bg-blue-50/50 border-blue-100">
            <span className="text-muted-foreground text-sm uppercase font-bold tracking-wider">Nøyaktighet</span>
            <span className="text-3xl font-display font-bold text-blue-600">{accuracy}%</span>
          </Card>
          <Card className="p-4 flex flex-col items-center bg-orange-50/50 border-orange-100">
            <span className="text-muted-foreground text-sm uppercase font-bold tracking-wider">Fart</span>
            <span className="text-3xl font-display font-bold text-orange-600">{avgTime.toFixed(1)}s</span>
          </Card>
        </div>

        {/* Review section for incorrect answers */}
        {results.filter(r => !r.correct).length > 0 && (
          <div className="w-full max-w-2xl space-y-4">
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-center mb-4">Øv på disse før neste runde</h3>
              <div className="space-y-3">
                {results.map((result, idx) => {
                  if (result.correct) return null;
                  const q = result.question;
                  let questionText = '';
                  let correctAnswer = '';

                  if (q.textPrompt) {
                    questionText = q.textPrompt;
                  } else {
                    // Build equation based on missing position
                    if (q.missingPosition === 'num2') {
                      questionText = `${q.num1} ${q.operator === 'add' ? '+' : '-'} ___ = ${q.answer}`;
                      correctAnswer = q.num2.toString();
                    } else {
                      if (q.operator === 'add') {
                        if (q.num3) {
                          questionText = `${q.num1} + ${q.num2} + ${q.num3} = ___`;
                          correctAnswer = q.answer.toString();
                        } else {
                          questionText = `${q.num1} + ${q.num2} = ___`;
                          correctAnswer = q.answer.toString();
                        }
                      } else {
                        questionText = `${q.num1} - ${q.num2} = ___`;
                        correctAnswer = q.answer.toString();
                      }
                    }
                  }

                  return (
                    <Card key={idx} className="p-4 bg-red-50/30 border-red-200 space-y-2">
                      <p className="font-semibold text-foreground">{questionText}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Riktig svar:</span>
                        <span className="text-lg font-bold text-green-600 bg-green-100/50 px-3 py-1 rounded">{correctAnswer}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button variant="outline" size="lg" onClick={() => setLocation('/levels')} className="rounded-full">
            <Home className="mr-2 w-5 h-5" /> Nivåer
          </Button>
          <Button size="lg" onClick={() => window.location.reload()} className="rounded-full bg-primary hover:bg-primary/90">
            <RefreshCw className="mr-2 w-5 h-5" /> Spill om igjen
          </Button>
        </div>
      </div>
    );
  }

  // Helper to render the input box
  const InputBox = () => (
    <div className={cn(
      "w-32 h-20 rounded-xl border-4 flex items-center justify-center text-5xl font-display font-bold bg-background shadow-inner mx-2",
      feedback === 'correct' ? "border-green-400 text-green-600" :
      feedback === 'incorrect' ? "border-red-400 text-red-600" :
      "border-muted focus-within:border-primary text-primary"
    )}>
      {currentInput}
      <span className="animate-pulse text-muted-foreground/30">|</span>
    </div>
  );

  return (
    <div className="max-w-md mx-auto w-full">
      {/* Progress Header */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-sm font-bold text-muted-foreground">
          <span>Level {level.id}: {level.name}</span>
          <span>{currentIndex + 1} / {level.questionCount}</span>
        </div>
        <Progress value={((currentIndex) / level.questionCount) * 100} className="h-3 rounded-full" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className={cn(
            "p-8 mb-6 flex flex-col items-center justify-center min-h-[200px] border-4 shadow-xl transition-colors duration-300 relative",
            feedback === 'correct' ? "border-green-400 bg-green-50" :
            feedback === 'incorrect' ? "border-red-400 bg-red-50" :
            "border-primary/20"
          )}>
            {currentQuestion.textPrompt ? (
               // Text Question Mode
               <div className="flex flex-col items-center gap-4">
                 <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-4 text-foreground">
                   {currentQuestion.textPrompt}
                 </h2>
                 <InputBox />
               </div>
            ) : (
              // Standard Math Equation Mode
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-5xl sm:text-6xl md:text-8xl font-display font-bold text-foreground">
                {/* First Number */}
                <span>{currentQuestion.num1}</span>
                
                {/* Operator */}
                <span className="text-primary">{currentQuestion.operator === 'add' ? '+' : '-'}</span>
                
                {/* Second Number or Input */}
                {currentQuestion.missingPosition === 'num2' ? (
                  <InputBox />
                ) : (
                  <span>{currentQuestion.num2}</span>
                )}

                {/* Optional Third Number */}
                {currentQuestion.num3 !== undefined && (
                  <>
                    <span className="text-primary">+</span>
                    <span>{currentQuestion.num3}</span>
                  </>
                )}
                
                {/* Equals Sign */}
                <span className="text-muted-foreground mx-2">=</span>
                
                {/* Answer or Input */}
                {currentQuestion.missingPosition === 'num2' ? (
                  <span className="text-primary">{currentQuestion.answer}</span>
                ) : (
                  <InputBox />
                )}
              </div>
            )}
            
            {feedback === 'correct' && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute top-2 right-2 text-green-500"
              >
                <CheckCircle className="w-8 h-8 fill-green-100" />
              </motion.div>
            )}
            {feedback === 'incorrect' && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute top-2 right-2 text-red-500"
              >
                <XCircle className="w-8 h-8 fill-red-100" />
              </motion.div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-16 text-3xl font-display font-bold rounded-2xl border-b-4 hover:-translate-y-0.5 active:translate-y-0 active:border-b-0 transition-all bg-white hover:bg-white hover:border-primary/50 text-foreground"
            onClick={() => handleInput(num)}
            disabled={feedback !== 'none'}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          className="h-16 text-xl font-bold rounded-2xl border-b-4 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          onClick={handleBackspace}
          disabled={feedback !== 'none'}
        >
          ⌫
        </Button>
        <Button
          variant="outline"
          className="h-16 text-3xl font-display font-bold rounded-2xl border-b-4 hover:-translate-y-0.5 active:translate-y-0 active:border-b-0 transition-all bg-white hover:bg-white hover:border-primary/50 text-foreground"
          onClick={() => handleInput(0)}
          disabled={feedback !== 'none'}
        >
          0
        </Button>
        <Button
          className="h-16 text-xl font-bold rounded-2xl border-b-4 bg-primary hover:bg-primary/90 border-primary-foreground/20 active:translate-y-0"
          onClick={handleSubmit}
          disabled={feedback !== 'none' || currentInput === ""}
        >
          SVAR
        </Button>
      </div>
    </div>
  );
}
