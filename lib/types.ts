export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type ProgressState = "again" | "learning" | "know";
export type VocabularyCard = {
  id: string;
  dutch: string;
  english: string;
  level: CefrLevel;
  partOfSpeech: string;
  exampleDutch: string;
  exampleEnglish: string;
  category: string;
  source?: string;
};
export const levels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
