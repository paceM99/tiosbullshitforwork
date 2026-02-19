// Aktualisiert: Alle Texte auf Deutsch übersetzt

"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const THUMB_SIZE = 44;
const PADDING = 6;

export default function Home() {
  const [confirmed, setConfirmed] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const getMaxOffset = useCallback(() => {
    if (!trackRef.current) return 0;
    return trackRef.current.offsetWidth - THUMB_SIZE - PADDING * 2;
  }, []);

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (confirmed) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
    },
    [confirmed]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - PADDING - THUMB_SIZE / 2;
      setDragOffset(clamp(x, 0, getMaxOffset()));
    },
    [isDragging, getMaxOffset]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const max = getMaxOffset();
    if (dragOffset >= max * 0.85) {
      setDragOffset(max);
      setShowModal(true);
    } else {
      setDragOffset(0);
    }
  }, [isDragging, dragOffset, getMaxOffset]);

  const handleConfirm = () => {
    setShowModal(false);
    setConfirmed(true);
    setDragOffset(getMaxOffset());
  };

  const handleCancel = () => {
    setShowModal(false);
    setDragOffset(0);
  };

  useEffect(() => {
    const onResize = () => {
      if (confirmed) setDragOffset(getMaxOffset());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [confirmed, getMaxOffset]);

  const progress = getMaxOffset() > 0 ? dragOffset / getMaxOffset() : 0;
  const isAtYes = confirmed;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 px-4">
      <main className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Altersverifizierung
          </h1>
          <p className="mb-8 text-center text-sm text-slate-500 dark:text-zinc-400">
            {confirmed
              ? "Bestätigt — Sie dürfen fortfahren"
              : "Schieben Sie den Regler nach rechts, um zu bestätigen, dass Sie 18+ sind"}
          </p>

          <div className="mb-8 flex flex-col items-center gap-5">
            <div className="flex w-full max-w-xs items-center justify-between px-2 text-sm font-semibold">
              <span
                className={`transition-colors duration-300 ${
                  !isAtYes
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-300 dark:text-zinc-600"
                }`}
              >
                Nein
              </span>
              <span
                className={`transition-colors duration-300 ${
                  isAtYes
                    ? "text-green-600 dark:text-green-400"
                    : "text-slate-300 dark:text-zinc-600"
                }`}
              >
                Ja
              </span>
            </div>

            <div
              ref={trackRef}
              className={`relative h-14 w-full max-w-xs select-none rounded-full transition-colors duration-300 ${
                isAtYes ? "bg-green-500 dark:bg-green-600" : ""
              }`}
              style={
                !isAtYes
                  ? {
                      background: `linear-gradient(to right, #22c55e ${progress * 100}%, ${progress > 0 ? "#86efac" : "#cbd5e1"} ${progress * 100}%, #cbd5e1 100%)`,
                    }
                  : undefined
              }
            >
              {!confirmed && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-500 dark:text-zinc-400 select-none">
                  {isDragging ? "" : "Zum Bestätigen schieben →"}
                </span>
              )}
              <span
                className="absolute top-1.5 h-11 w-11 rounded-full bg-white shadow-lg select-none"
                style={{
                  left: PADDING + dragOffset,
                  cursor: confirmed ? "default" : "grab",
                  transition: isDragging ? "none" : "left 0.3s ease",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              />
            </div>
          </div>

          <div
            className={`rounded-xl p-5 text-center transition-all duration-300 ${
              isAtYes
                ? "bg-green-50 dark:bg-green-950/30"
                : "bg-red-50 dark:bg-red-950/30"
            }`}
          >
            <div className="mb-1 text-3xl">{isAtYes ? "✅" : "🚫"}</div>
            <p
              className={`text-lg font-semibold ${
                isAtYes
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {isAtYes
                ? "Ja — Ich bin 18 oder älter"
                : "Nein — Ich bin unter 18"}
            </p>
            <p
              className={`mt-1 text-sm ${
                isAtYes
                  ? "text-green-600/70 dark:text-green-500/70"
                  : "text-red-600/70 dark:text-red-500/70"
              }`}
            >
              {isAtYes
                ? "Sie dürfen fortfahren."
                : "Sie müssen mindestens 18 Jahre alt sein, um fortzufahren."}
            </p>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
              Alter bestätigen
            </h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-zinc-400">
              Mit Ihrer Bestätigung erklären Sie, dass Sie mindestens 18 Jahre
              alt sind. Möchten Sie fortfahren?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Abbrechen
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Ja, ich bin 18+
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
