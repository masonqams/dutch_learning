import { vocabulary } from "@/data/vocabulary";
import { levels, type CefrLevel, type ProgressState } from "@/lib/types";

export type ProgressMap = Record<string, ProgressState>;
export const progressKey = "dutch-vocab-progress-v1";

type LevelSummary = {
  total: number;
  know: number;
  learning: number;
  again: number;
};

export function summarizeProgress(progress: ProgressMap) {
  return {
    again: Object.values(progress).filter((state) => state === "again").length,
    learning: Object.values(progress).filter((state) => state === "learning")
      .length,
    know: Object.values(progress).filter((state) => state === "know").length,
  };
}

export function summarizeByLevel(progress: ProgressMap) {
  const initial = Object.fromEntries(
    levels.map((level) => [
      level,
      { total: 0, know: 0, learning: 0, again: 0 },
    ]),
  ) as Record<CefrLevel, LevelSummary>;

  return vocabulary.reduce<Record<CefrLevel, LevelSummary>>((summary, card) => {
    summary[card.level].total += 1;
    const state = progress[card.id];
    if (state) summary[card.level][state] += 1;
    return summary;
  }, initial);
}

export function saveProgress(progress: ProgressMap) {
  if (typeof window !== "undefined") {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }
}

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};

  try {
    const parsed = JSON.parse(localStorage.getItem(progressKey) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(([, state]) =>
        ["again", "learning", "know"].includes(String(state)),
      ),
    ) as ProgressMap;
  } catch {
    return {};
  }
}
