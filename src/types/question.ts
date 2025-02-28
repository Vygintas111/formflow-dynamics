// Main Question type for existing questions
export type Question = {
  id: string;
  title: string;
  description: string | null;
  type: "SINGLE_LINE" | "MULTI_LINE" | "INTEGER" | "CHECKBOX";
  required: boolean;
  showInSummary: boolean;
  visible: boolean;
  order: number;
  templateId?: string;
};

// Type for new questions that don't have an ID or order yet
export type NewQuestion = Omit<Question, "id" | "order"> & {
  id?: string;
  order?: number;
};

// Type for question type counts
export type QuestionTypeCount = {
  SINGLE_LINE: number;
  MULTI_LINE: number;
  INTEGER: number;
  CHECKBOX: number;
};
