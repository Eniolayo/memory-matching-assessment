"use client";

import { useState, useEffect } from "react";
import GameBoard from "./game-board";
import GameControls from "./game-controls";
import ResultsScreen from "./results-screen";
import { GameProvider, useGame } from "@/context/game-context";
import { STORAGE_KEYS } from "@/config/constant";

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

// // Utility function to shuffle an array using Fisher-Yates (Knuth) Shuffle
// const shuffleArray = <T,>(array: T[]): T[] => {
//   const shuffled = [...array]; // Clone to avoid mutating the original array
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
//   }
//   return shuffled;
// };

// // Function to generate a shuffled board with unique images
// const generateShuffledBoard = async (): Promise<string[]> => {
//   const uniqueImages = Array.from(
//     { length: 8 },
//     (_, i) => `https://picsum.photos/200?random=${i + 1}`
//   );
//   const pairedImages = [...uniqueImages, ...uniqueImages]; // Each image appears twice
//   return shuffleArray(pairedImages);
// };
