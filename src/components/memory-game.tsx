"use client";

import { useState } from "react";

import { STORAGE_KEYS } from "@/config/constant";
import { GameProvider, useGame } from "@/context/game-context";

import GameBoard from "./game-board";
import GameControls from "./game-controls";
import ResultsScreen from "./results-screen";

// Wrapper component that provides the game context
export default function MemoryGame() {
  return (
    <GameProvider>
      <MemoryGameContent />
    </GameProvider>
  );
}

// Inner component that consumes the game context
function MemoryGameContent() {
  // State to track if we've already processed this game completion
  const [processedGameId, setProcessedGameId] = useState<string | null>(null);
  // State for controlling results screen visibility
  const [showResults, setShowResults] = useState(false);
  // Lazy initialization of bestScore using a function to run only once on mount
  const [bestScore, setBestScore] = useState<number | null>(() => {
    // This runs only on the initial render
    const storedBestScore =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEYS.BEST_SCORE)
        : null;
    return storedBestScore ? Number.parseInt(storedBestScore, 10) : null;
  });

  const { clicks, isGameComplete, resetGame, gameStartTime, gameEndTime } =
    useGame();
  // Generate a unique ID for the current game completion state
  const currentGameId = isGameComplete ? `${clicks}-${gameEndTime}` : null;

  // Handle game completion logic
  if (isGameComplete && currentGameId && currentGameId !== processedGameId) {
    // Update best score if needed
    if (bestScore === null || clicks < bestScore) {
      localStorage.setItem(STORAGE_KEYS.BEST_SCORE, clicks.toString());
      setBestScore(clicks);
    }

    // Mark this game completion as processed
    setProcessedGameId(currentGameId);

    // Show results screen after a delay
    setTimeout(() => {
      setShowResults(true);
    }, 500);
  }

  const handleRestart = () => {
    setShowResults(false);
    resetGame();
  };

  // Calculate game duration in seconds
  const gameDuration =
    isGameComplete && gameStartTime && gameEndTime
      ? Math.floor((gameEndTime - gameStartTime) / 1000)
      : 0;

  return (
    <div className="w-full max-w-2xl">
      <GameControls
        clicks={clicks}
        bestScore={bestScore}
        onRestart={handleRestart}
      />

      <GameBoard />

      {showResults && (
        <ResultsScreen
          clicks={clicks}
          bestScore={bestScore}
          isNewBestScore={bestScore === clicks}
          onRestart={handleRestart}
          duration={gameDuration}
        />
      )}
    </div>
  );
}
