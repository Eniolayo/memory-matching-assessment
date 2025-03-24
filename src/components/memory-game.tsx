"use client";

import { useEffect, useState } from "react";

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
  const { clicks, isGameComplete, resetGame, gameStartTime, gameEndTime } =
    useGame();

  const [bestScore, setBestScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Load best score from localStorage on mount
  useEffect(() => {
    const storedBestScore = localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
    if (storedBestScore) {
      setBestScore(Number.parseInt(storedBestScore, 10));
    }
  }, []);

  // Update best score when game is complete
  useEffect(() => {
    if (isGameComplete) {
      if (bestScore === null || clicks < bestScore) {
        localStorage.setItem(STORAGE_KEYS.BEST_SCORE, clicks.toString());
        setBestScore(clicks);
      }
      // Show results screen after a short delay
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    }
  }, [isGameComplete, clicks, bestScore]);

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
