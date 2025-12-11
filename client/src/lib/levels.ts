export type Operator = 'add' | 'subtract';

export type LevelType = 
  | 'tutorial_buttons' // Tutorial: Learn the button interface
  | 'add_1_0_within_10'
  | 'sub_1_0_within_10'
  | 'add_5_x_within_10'
  | 'doubles_within_10'
  | 'add_2_within_10'
  | 'sub_2_within_10'
  | 'sub_5_x'
  | 'sub_result_1_2'
  | 'sub_10_x'
  | 'bonds_5'
  | 'bonds_10'
  // New levels
  | 'add_three_numbers_bridging' // Tiervenn og litt til (6+5+5 or similar)
  | 'add_10_x' // 10+x
  | 'doubles_within_20' // 6+6...10+10
  | 'bonds_20' // 13 + _ = 20
  | 'double_text_1_5' // Dobbelt av 3 er... (1-5)
  | 'double_text_6_10' // Dobbelt av 6 er... (6-10)
  | 'half_text' // Halvparten av 8 er...
  | 'add_9_x'; // 9+x

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  type: LevelType;
  operator: Operator; // Main operator for UI color/icon
  questionCount: number;
  timeLimitPerQuestion: number;
  passingScore: number;
  locked?: boolean;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 0,
    name: "Bli kjent med knappene",
    description: "Lær deg å bruke knappene - trykk på tallene",
    type: 'tutorial_buttons',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 30,
    passingScore: 100,
    locked: false,
  },
  {
    id: 1,
    name: "Addisjon +1, +0",
    description: "Pluss 1 og 0 med tall opp til 10",
    type: 'add_1_0_within_10',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 2,
    name: "Subtraksjon -1, -0",
    description: "Minus 1, 0 og 'alt' opp til 10",
    type: 'sub_1_0_within_10',
    operator: 'subtract',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 3,
    name: "Addisjon med 5",
    description: "5 + tall opp til 10",
    type: 'add_5_x_within_10',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 4,
    name: "Doblinger",
    description: "Doblinger opp til 10 (eks 2+2)",
    type: 'doubles_within_10',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 5,
    name: "Addisjon +2",
    description: "Pluss 2 med tall opp til 10",
    type: 'add_2_within_10',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 6,
    name: "Subtraksjon -2",
    description: "Minus 2 med tall opp til 10",
    type: 'sub_2_within_10',
    operator: 'subtract',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 7,
    name: "Subtraksjon fra 5",
    description: "5 minus tall",
    type: 'sub_5_x',
    operator: 'subtract',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 8,
    name: "Nesten Alt",
    description: "Subtraksjon hvor svaret blir 1 eller 2",
    type: 'sub_result_1_2',
    operator: 'subtract',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 9,
    name: "Subtraksjon fra 10",
    description: "10 minus tall",
    type: 'sub_10_x',
    operator: 'subtract',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 10,
    name: "Tallvenner til 5",
    description: "Hva må du legge til for å få 5?",
    type: 'bonds_5',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 11,
    name: "Tallvenner til 10",
    description: "Hva må du legge til for å få 10?",
    type: 'bonds_10',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  // New Levels
  {
    id: 12,
    name: "Tiervenn og litt til",
    description: "Regn ut med tre tall (f.eks 6+5+5)",
    type: 'add_three_numbers_bridging',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 12,
    passingScore: 80,
    locked: false,
  },
  {
    id: 13,
    name: "10 + x",
    description: "10 pluss et ensifret tall",
    type: 'add_10_x',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 8,
    passingScore: 80,
    locked: false,
  },
  {
    id: 14,
    name: "Doblinger til 20",
    description: "Doble tall fra 6 til 10",
    type: 'doubles_within_20',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 15,
    name: "Tiervenner til 20",
    description: "Hva mangler for å få 20?",
    type: 'bonds_20',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 16,
    name: "Doble (1-5)",
    description: "Dobbelt av et tall (1-5)",
    type: 'double_text_1_5',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 17,
    name: "Doble (6-10)",
    description: "Dobbelt av et tall (6-10)",
    type: 'double_text_6_10',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 18,
    name: "Halvparten",
    description: "Halvparten av et partall",
    type: 'half_text',
    operator: 'subtract',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  },
  {
    id: 19,
    name: "9 + x",
    description: "9 pluss et ensifret tall",
    type: 'add_9_x',
    operator: 'add',
    questionCount: 10,
    timeLimitPerQuestion: 10,
    passingScore: 80,
    locked: false,
  }
];

export interface Question {
  id: string;
  num1: number;
  num2: number;
  num3?: number; // Optional third number
  operator: Operator;
  answer: number;
  missingPosition: 'result' | 'num2' | 'num3'; // 'result' is standard (1+2=?), 'num2' is (1+?=3)
  textPrompt?: string; // For text-based questions
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateQuestion = (config: LevelConfig): Question => {
  let num1 = 0, num2 = 0, num3: number | undefined;
  let answer = 0;
  let missingPosition: 'result' | 'num2' | 'num3' = 'result';
  let operator: Operator = config.operator;
  let textPrompt: string | undefined;

  switch (config.type) {
    case 'tutorial_buttons': {
      // Tutorial: Handled specially in GameEngine.tsx with shuffled digits 0-9
      num1 = 0;
      num2 = 0;
      answer = 0;
      textPrompt = "Trykk på 0";
      break;
    }
    case 'add_1_0_within_10': {
      // +1 or +0. Sum <= 10.
      const isOne = Math.random() > 0.5;
      const addend = isOne ? 1 : 0;
      const other = randomInt(0, 10 - addend);
      if (Math.random() > 0.5) { num1 = other; num2 = addend; }
      else { num1 = addend; num2 = other; }
      answer = num1 + num2;
      break;
    }
    case 'sub_1_0_within_10': {
      // -1, -0, or -all (x-x). Min 0, Max 10.
      const mode = Math.random();
      if (mode < 0.33) {
        // -0
        num1 = randomInt(0, 10);
        num2 = 0;
      } else if (mode < 0.66) {
        // -1
        num1 = randomInt(1, 10);
        num2 = 1;
      } else {
        // -all (x-x)
        num1 = randomInt(0, 10);
        num2 = num1;
      }
      answer = num1 - num2;
      break;
    }
    case 'add_5_x_within_10': {
      // 5 + x <= 10 -> x is 0-5
      const x = randomInt(0, 5);
      if (Math.random() > 0.5) { num1 = 5; num2 = x; }
      else { num1 = x; num2 = 5; }
      answer = num1 + num2;
      break;
    }
    case 'doubles_within_10': {
      // 0+0 to 5+5
      const half = randomInt(1, 5);
      num1 = half;
      num2 = half;
      answer = num1 + num2;
      break;
    }
    case 'add_2_within_10': {
      // +2, sum <= 10.
      const x = randomInt(0, 8);
      if (Math.random() > 0.5) { num1 = x; num2 = 2; }
      else { num1 = 2; num2 = x; }
      answer = num1 + num2;
      break;
    }
    case 'sub_2_within_10': {
      // x - 2, x <= 10
      num1 = randomInt(2, 10);
      num2 = 2;
      answer = num1 - num2;
      break;
    }
    case 'sub_5_x': {
      // 5 - x
      num1 = 5;
      num2 = randomInt(0, 5);
      answer = num1 - num2;
      break;
    }
    case 'sub_result_1_2': {
      // x - y = 1 or 2. x <= 10.
      const target = Math.random() > 0.5 ? 1 : 2;
      answer = target;
      // answer = num1 - num2 => num2 = num1 - answer
      // we need num1 >= answer.
      num1 = randomInt(answer, 10);
      num2 = num1 - answer;
      break;
    }
    case 'sub_10_x': {
      // 10 - x
      num1 = 10;
      num2 = randomInt(0, 10);
      answer = num1 - num2;
      break;
    }
    case 'bonds_5': {
      // x + _ = 5
      missingPosition = 'num2';
      answer = 5;
      num1 = randomInt(0, 5);
      num2 = 5 - num1;
      break;
    }
    case 'bonds_10': {
      // x + _ = 10
      missingPosition = 'num2';
      answer = 10;
      num1 = randomInt(0, 10);
      num2 = 10 - num1;
      break;
    }
    // New Implementations
    case 'add_three_numbers_bridging': {
      // e.g. 6+5+5 or 8+2+5. Let's make it simpler: two numbers sum to 10.
      // 6 + 4 + x (where x is 1-5 usually)
      const pair = randomInt(1, 9);
      const complement = 10 - pair;
      const extra = randomInt(1, 9);
      
      // Shuffle positions
      const pattern = Math.random();
      if (pattern < 0.33) {
        num1 = pair; num2 = complement; num3 = extra;
      } else if (pattern < 0.66) {
        num1 = extra; num2 = pair; num3 = complement;
      } else {
        num1 = pair; num2 = extra; num3 = complement;
      }
      
      answer = num1 + num2 + num3!;
      break;
    }
    case 'add_10_x': {
      // 10 + x
      num1 = 10;
      num2 = randomInt(0, 9);
      answer = num1 + num2;
      break;
    }
    case 'doubles_within_20': {
      // 6+6 to 10+10
      const half = randomInt(6, 10);
      num1 = half;
      num2 = half;
      answer = num1 + num2;
      break;
    }
    case 'bonds_20': {
      // 13 + _ = 20
      missingPosition = 'num2';
      answer = 20;
      // usually start with something > 10 for simplicity or just any
      num1 = randomInt(11, 19);
      num2 = 20 - num1;
      break;
    }
    case 'double_text_1_5': {
      // "Dobbelt av 3 er..."
      const base = randomInt(1, 5);
      num1 = base;
      num2 = base;
      answer = base * 2;
      textPrompt = `Dobbelt av ${base} er`;
      break;
    }
    case 'double_text_6_10': {
      // "Dobbelt av 7 er..."
      const base = randomInt(6, 10);
      num1 = base;
      num2 = base;
      answer = base * 2;
      textPrompt = `Dobbelt av ${base} er`;
      break;
    }
    case 'half_text': {
      // "Halvparten av 8 er..." (Evens only)
      const base = randomInt(1, 5) * 2; // 2, 4, 6, 8, 10
      num1 = base;
      num2 = base / 2;
      answer = num2; // Answer is the half
      textPrompt = `Halvparten av ${base} er`;
      break;
    }
    case 'add_9_x': {
      // 9 + x
      num1 = 9;
      num2 = randomInt(0, 9);
      answer = num1 + num2;
      break;
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    num1,
    num2,
    num3,
    operator,
    answer,
    missingPosition,
    textPrompt
  };
};
