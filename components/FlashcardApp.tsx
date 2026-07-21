"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { vocabulary } from "@/data/vocabulary";
import { levels, type CefrLevel, type ProgressState } from "@/lib/types";
import {
  loadProgress,
  saveProgress,
  summarizeByLevel,
  summarizeProgress,
  type ProgressMap,
} from "@/lib/progress";

const selectedKey = "dutch-vocab-level-v1";
const themeKey = "dutch-vocab-theme-v1";

export default function FlashcardApp() {
  const [level, setLevel] = useState<CefrLevel | undefined>();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [dark, setDark] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState("");
  const [showProgress, setShowProgress] = useState(false);

  const cards = useMemo(
    () => vocabulary.filter((card) => card.level === level),
    [level],
  );
  const card = cards[index];
  const totals = summarizeProgress(progress);
  const byLevel = summarizeByLevel(progress);

  useEffect(() => {
    setProgress(loadProgress());

    const saved = localStorage.getItem(selectedKey) as CefrLevel | null;
    if (saved && levels.includes(saved)) setLevel(saved);

    setDark(localStorage.getItem(themeKey) === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(themeKey, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (cards.length > 0 && index >= cards.length) setIndex(0);
  }, [cards.length, index]);

  const choose = useCallback((nextLevel: CefrLevel) => {
    setLevel(nextLevel);
    localStorage.setItem(selectedKey, nextLevel);
    setIndex(0);
    setFlipped(false);
    setShowProgress(false);
    setVoiceMsg("");
  }, []);

  const mark = useCallback(
    (state: ProgressState) => {
      if (!card) return;
      const nextProgress = { ...progress, [card.id]: state };
      setProgress(nextProgress);
      saveProgress(nextProgress);
    },
    [card, progress],
  );

  const next = useCallback(() => {
    if (!cards.length) return;
    setIndex((currentIndex) => (currentIndex + 1) % cards.length);
    setFlipped(false);
    setVoiceMsg("");
  }, [cards.length]);

  const prev = useCallback(() => {
    if (!cards.length) return;
    setIndex(
      (currentIndex) => (currentIndex - 1 + cards.length) % cards.length,
    );
    setFlipped(false);
    setVoiceMsg("");
  }, [cards.length]);

  const shuffle = useCallback(() => {
    if (!cards.length) return;
    setIndex((currentIndex) => {
      if (cards.length === 1) return 0;
      let nextIndex = currentIndex;
      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * cards.length);
      }
      return nextIndex;
    });
    setFlipped(false);
    setVoiceMsg("");
  }, [cards.length]);

  const restart = useCallback(() => {
    setIndex(0);
    setFlipped(false);
    setVoiceMsg("");
  }, []);

  const pronounce = useCallback(() => {
    if (!card) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoiceMsg("Speech synthesis is not supported in this browser.");
      return;
    }

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const voice =
      voices.find((availableVoice) => availableVoice.lang === "nl-NL") ??
      voices.find((availableVoice) => availableVoice.lang.startsWith("nl"));

    if (!voice) {
      setVoiceMsg(
        "No Dutch nl-NL voice is available in this browser or operating system.",
      );
      return;
    }

    const utterance = new SpeechSynthesisUtterance(card.dutch);
    utterance.lang = "nl-NL";
    utterance.voice = voice;
    synth.cancel();
    synth.speak(utterance);
    setVoiceMsg("Playing Dutch pronunciation.");
  }, [card]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        setFlipped((current) => !current);
      } else if (event.key === "ArrowRight") {
        next();
      } else if (event.key === "ArrowLeft") {
        prev();
      } else if (event.key.toLowerCase() === "p") {
        pronounce();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev, pronounce]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition dark:bg-slate-950 dark:text-slate-100">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 p-4">
        <button
          type="button"
          onClick={() => setShowProgress(false)}
          className="text-xl font-bold"
          aria-label="Return to flashcards home"
        >
          Nederlands Flashcards
        </button>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Change CEFR level"
            value={level ?? ""}
            onChange={(event) => choose(event.target.value as CefrLevel)}
            className="rounded-xl border bg-white px-3 py-2 dark:bg-slate-900"
          >
            <option value="" disabled>
              Choose level
            </option>
            {levels.map((availableLevel) => (
              <option key={availableLevel}>{availableLevel}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowProgress(true)}
            className="rounded-xl bg-indigo-600 px-3 py-2 text-white"
          >
            Progress
          </button>
          <button
            type="button"
            onClick={() => setDark((current) => !current)}
            className="rounded-xl border px-3 py-2"
            aria-label="Toggle light and dark mode"
          >
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </nav>

      {showProgress ? (
        <ProgressView
          progress={progress}
          totals={totals}
          byLevel={byLevel}
          onReset={() => {
            setProgress({});
            saveProgress({});
          }}
        />
      ) : !level ? (
        <WelcomeView onChoose={choose} />
      ) : card ? (
        <section className="mx-auto max-w-3xl p-4">
          <div className="mb-3 flex justify-between gap-4 text-sm">
            <span>
              Selected level: <b>{level}</b>
            </span>
            <span aria-live="polite">
              Card {index + 1} of {cards.length}
            </span>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            <h1 className="text-center text-4xl font-extrabold sm:text-5xl">
              {card.dutch}
            </h1>
            <button
              type="button"
              onClick={pronounce}
              aria-label={`Pronounce ${card.dutch} in Dutch`}
              className="rounded-full bg-indigo-100 px-4 py-3 text-2xl shadow-sm transition hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900"
            >
              🔊
            </button>
          </div>

          <button
            type="button"
            onClick={() => setFlipped((current) => !current)}
            className="group h-80 w-full [perspective:1000px]"
            aria-label={
              flipped
                ? "Flip flashcard to show Dutch word"
                : "Flip flashcard to show English translation"
            }
            aria-pressed={flipped}
          >
            <div
              className={`relative h-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
            >
              <div className="absolute grid h-full w-full place-items-center rounded-3xl bg-white p-8 shadow-xl [backface-visibility:hidden] dark:bg-slate-900">
                <div>
                  <p className="text-5xl font-extrabold">{card.dutch}</p>
                  <p className="mt-4 text-slate-500 dark:text-slate-400">
                    {card.partOfSpeech} · {card.category}
                  </p>
                </div>
              </div>
              <div className="absolute h-full w-full rounded-3xl bg-indigo-600 p-8 text-white shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="text-4xl font-bold">{card.english}</p>
                <p className="mt-8 text-xl">{card.exampleDutch}</p>
                <p className="mt-2 text-indigo-100">{card.exampleEnglish}</p>
                <p className="mt-6 text-sm text-indigo-100">{card.source}</p>
              </div>
            </div>
          </button>

          {voiceMsg && (
            <p
              className="mt-3 rounded-xl bg-amber-100 p-3 text-amber-900 dark:bg-amber-950 dark:text-amber-100"
              role="status"
            >
              {voiceMsg}
            </p>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ProgressButton
              state="again"
              onMark={mark}
              current={progress[card.id]}
            />
            <ProgressButton
              state="learning"
              onMark={mark}
              current={progress[card.id]}
            />
            <ProgressButton
              state="know"
              onMark={mark}
              current={progress[card.id]}
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={prev}
              className="rounded-xl border px-4 py-2"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="rounded-xl border px-4 py-2"
            >
              Show translation
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-xl border px-4 py-2"
            >
              Next
            </button>
            <button
              type="button"
              onClick={shuffle}
              className="rounded-xl border px-4 py-2"
            >
              Shuffle
            </button>
            <button
              type="button"
              onClick={restart}
              className="rounded-xl border px-4 py-2"
            >
              Restart session
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function WelcomeView({ onChoose }: { onChoose: (level: CefrLevel) => void }) {
  return (
    <section className="mx-auto max-w-5xl p-6 text-center">
      <h1 className="mt-10 text-4xl font-extrabold">
        Learn Dutch vocabulary with CEFR-aligned flashcards
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
        Choose a level and practise common Dutch words. This demonstration
        vocabulary is CEFR-aligned, not official CEFR vocabulary.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {levels.map((availableLevel) => (
          <button
            type="button"
            key={availableLevel}
            onClick={() => onChoose(availableLevel)}
            className="rounded-2xl bg-white p-6 text-2xl font-bold shadow transition hover:-translate-y-1 dark:bg-slate-900"
          >
            {availableLevel}
          </button>
        ))}
      </div>
    </section>
  );
}

function ProgressView({
  progress,
  totals,
  byLevel,
  onReset,
}: {
  progress: ProgressMap;
  totals: ReturnType<typeof summarizeProgress>;
  byLevel: ReturnType<typeof summarizeByLevel>;
  onReset: () => void;
}) {
  const progressCards = vocabulary.filter((card) => progress[card.id]);

  return (
    <section className="mx-auto max-w-5xl p-4">
      <h1 className="text-3xl font-bold">Your progress</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Know" value={totals.know} />
        <Stat label="Learning" value={totals.learning} />
        <Stat label="Again" value={totals.again} />
      </div>

      <h2 className="mt-8 text-2xl font-bold">Progress by CEFR level</h2>
      <div className="mt-3 grid gap-3">
        {levels.map((availableLevel) => (
          <div
            key={availableLevel}
            className="rounded-2xl bg-white p-4 shadow dark:bg-slate-900"
          >
            <b>{availableLevel}</b>: {byLevel[availableLevel]?.know ?? 0} know,{" "}
            {byLevel[availableLevel]?.learning ?? 0} learning,{" "}
            {byLevel[availableLevel]?.again ?? 0} again /{" "}
            {byLevel[availableLevel]?.total ?? 0} cards
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-2xl font-bold">Marked words</h2>
      {progressCards.length ? (
        <ul className="mt-3 grid gap-2">
          {progressCards.map((progressCard) => (
            <li
              key={progressCard.id}
              className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900"
            >
              <span className="font-semibold">{progressCard.dutch}</span> —{" "}
              {progressCard.english} · {progressCard.level} ·{" "}
              <span className="capitalize">{progress[progressCard.id]}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl bg-white p-4 text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
          No words have been marked yet.
        </p>
      )}

      <button
        type="button"
        className="mt-6 rounded-xl bg-rose-600 px-4 py-2 text-white"
        onClick={onReset}
      >
        Reset progress
      </button>
    </section>
  );
}

function ProgressButton({
  state,
  current,
  onMark,
}: {
  state: ProgressState;
  current?: ProgressState;
  onMark: (state: ProgressState) => void;
}) {
  const label =
    state === "know" ? "Know" : state === "learning" ? "Learning" : "Again";
  const color =
    state === "know"
      ? "bg-emerald-600"
      : state === "learning"
        ? "bg-amber-500"
        : "bg-rose-600";

  return (
    <button
      type="button"
      onClick={() => onMark(state)}
      aria-pressed={current === state}
      className={`rounded-xl px-4 py-3 text-white ring-offset-2 transition ${color} ${current === state ? "ring-4 ring-slate-400" : ""}`}
    >
      {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow dark:bg-slate-900">
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
