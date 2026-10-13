export type ExcelLanguage = 'fr' | 'en';
export type ExcelVersion = '365' | '2021' | '2019' | '2016' | 'google-sheets';

export interface FormulaComponent {
  part: string;
  role: string;
  detail: string;
}

export interface SampleSpreadsheetData {
  headers: string[];
  rows: (string | number)[][];
  formulaCell: string;
  calculatedValue: string | number;
}

export interface FormulaGenerationResult {
  formula: string;
  formulaAlt?: string;
  formulaEnglish: string;
  explanation: string;
  components: FormulaComponent[];
  sampleData: SampleSpreadsheetData;
  tips: string[];
}

export interface FunctionExplanation {
  name: string;
  purpose: string;
  frenchName?: string;
  englishName?: string;
}

export interface FormulaExplanationResult {
  summary: string;
  translatedFormula: string;
  breakdown: string[];
  functionsUsed: FunctionExplanation[];
  edgeCases: string[];
  sampleData: SampleSpreadsheetData;
}

export interface ErrorDiagnosisResult {
  errorType: string;
  diagnosis: string;
  rootCauses: string[];
  solutionFormula: string;
  safeFormula: string;
  actionSteps: string[];
  sampleFix?: {
    problemCase: string;
    correctionExplanation: string;
  };
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedFormulas?: string[];
  shortcuts?: string[];
  nextSteps?: string[];
  timestamp: number;
}

export interface PracticalExample {
  id: string;
  title: string;
  category: 'Débutant' | 'Finance & Ventes' | 'Ressources Humaines' | 'Nettoyage & Texte' | 'Dates & Temps' | 'Recherche & Lookups';
  difficulty: 'Facile' | 'Intermédiaire' | 'Avancé';
  description: string;
  prompt: string;
  formulaFR: string;
  formulaEN: string;
  keyFunctions: string[];
  explanation: string;
  sampleData: SampleSpreadsheetData;
}

export interface SavedFormula {
  id: string;
  title: string;
  formula: string;
  category: string;
  date: number;
  notes?: string;
}

export interface FormulaHistoryItem {
  id: string;
  prompt: string;
  formula: string;
  formulaEnglish?: string;
  timestamp: number;
  language: ExcelLanguage;
}

export interface UserPreferences {
  syntaxLanguage: ExcelLanguage;
  excelVersion: ExcelVersion;
  autoCopy: boolean;
  theme: 'light' | 'excel-green';
}
