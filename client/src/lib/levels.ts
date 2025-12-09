export type Operator = 'add' | 'subtract';

export type LevelType = 
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
  | 'bonds_10';

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
  }
];

export interface Question {
  id: string;
  num1: number;
  num2: number;
  operator: Operator;
  answer: number;
  missingPosition: 'result' | 'num2'; // 'result' is standard (1+2=?), 'num2' is (1+?=3)
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateQuestion = (config: LevelConfig): Question => {
  let num1 = 0, num2 = 0, answer = 0;
  let missingPosition: 'result' | 'num2' = 'result';
  let operator: Operator = config.operator;

  switch (config.type) {
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
      num2 = 5 - num1; // This is the "answer" user needs to type
      break;
    }
    case 'bonds_10': {
      // x + _ = 10
      missingPosition = 'num2';
      answer = 10;
      num1 = randomInt(0, 10);
      num2 = 10 - num1; // This is the "answer" user needs to type
      break;
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    num1,
    num2,
    operator,
    answer,
    missingPosition
  };
};
