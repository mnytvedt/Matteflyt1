export type Operator = 'add' | 'subtract';

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  operator: Operator | 'mixed';
  minNumber: number;
  maxNumber: number; // The result will also be within 0-maxNumber usually, but here we restrict operands
  questionCount: number;
  timeLimitPerQuestion: number; // seconds
  passingScore: number; // percentage (0-100)
  speedThreshold: number; // avg seconds to get the "speed" bonus
  locked?: boolean;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Number Novice",
    description: "Simple addition up to 5.",
    operator: 'add',
    minNumber: 0,
    maxNumber: 5,
    questionCount: 5,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    speedThreshold: 3,
    locked: false,
  },
  {
    id: 2,
    name: "Subtraction Starter",
    description: "Simple subtraction within 5.",
    operator: 'subtract',
    minNumber: 0,
    maxNumber: 5,
    questionCount: 5,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    speedThreshold: 3,
    locked: false,
  },
  {
    id: 3,
    name: "Addition Apprentice",
    description: "Addition up to 10.",
    operator: 'add',
    minNumber: 0,
    maxNumber: 10,
    questionCount: 10,
    timeLimitPerQuestion: 8,
    passingScore: 80,
    speedThreshold: 4,
    locked: false,
  },
  {
    id: 4,
    name: "Subtraction Scout",
    description: "Subtraction within 10.",
    operator: 'subtract',
    minNumber: 0,
    maxNumber: 10,
    questionCount: 10,
    timeLimitPerQuestion: 8,
    passingScore: 80,
    speedThreshold: 4,
    locked: false,
  },
  {
    id: 5,
    name: "Math Master",
    description: "Mixed operations up to 20.",
    operator: 'mixed',
    minNumber: 0,
    maxNumber: 20,
    questionCount: 15,
    timeLimitPerQuestion: 5,
    passingScore: 90,
    speedThreshold: 3,
    locked: false,
  }
];

export interface Question {
  id: string;
  num1: number;
  num2: number;
  operator: Operator;
  answer: number;
}

export const generateQuestion = (config: LevelConfig): Question => {
  const operator = config.operator === 'mixed' 
    ? (Math.random() > 0.5 ? 'add' : 'subtract') 
    : config.operator;

  let num1, num2, answer;

  if (operator === 'add') {
    // Ensure sum doesn't exceed 20 (or maxNumber * 2 if we wanted, but let's keep it simple 0-20)
    // Actually user said 0-20.
    answer = Math.floor(Math.random() * (config.maxNumber + 1));
    num1 = Math.floor(Math.random() * (answer + 1));
    num2 = answer - num1;
  } else {
    // Subtraction: Ensure result is not negative
    num1 = Math.floor(Math.random() * (config.maxNumber + 1));
    num2 = Math.floor(Math.random() * (num1 + 1));
    answer = num1 - num2;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    num1,
    num2,
    operator,
    answer
  };
};
