"use client";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

type ResultsScreenProps = {
  clicks: number;
  bestScore: number | null;
  isNewBestScore: boolean;
  duration: number;
  onRestart: () => void;
};

export default function ResultsScreen({
  clicks,
  bestScore,
  isNewBestScore,
  duration,
  onRestart,
}: ResultsScreenProps) {
  // Generate encouragement message based on performance
  const getMessage = () => {
    if (isNewBestScore) {
      return "Congratulations! You've achieved a new best score!";
    } else if (bestScore && clicks <= bestScore * 1.2) {
      return "Great job! You were very close to your best score.";
    } else {
      return "Well done! Keep practicing to improve your score.";
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Header Section */}
          <div className="border-b border-gray-200 p-5">
            <h2 className="text-center text-2xl font-bold">
              {isNewBestScore ? (
                <div className="flex flex-col items-center justify-center gap-2 text-yellow-500">
                  <Icon icon="tabler:trophy" width="33" height="33" />
                  <span>New Best Score!</span>
                </div>
              ) : (
                "Game Complete!"
              )}
            </h2>
          </div>

          {/* Content Section */}
          <div className="space-y-4 p-5">
            <p className="text-center text-gray-500">{getMessage()}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center rounded-lg bg-gray-100 p-3">
                <Icon
                  icon="lucide:mouse-pointer-click"
                  width="20"
                  height="20"
                  className="mb-1 text-blue-500"
                />
                <span className="text-sm text-gray-500">Clicks</span>
                <span className="text-xl font-bold">{clicks}</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-gray-100 p-3">
                <Icon
                  icon="tabler:clock"
                  width="20"
                  height="20"
                  className="mb-1 text-blue-500"
                />
                <span className="text-sm text-gray-500">Time</span>
                <span className="text-xl font-bold">{duration}s</span>
              </div>
            </div>
            {bestScore !== null && !isNewBestScore && (
              <div className="mt-2 text-center">
                <span className="text-sm text-gray-500">Your best: </span>
                <span className="font-medium">{bestScore} clicks</span>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="border-t border-gray-200 p-5">
            <button
              onClick={onRestart}
              className="bg-primary-100 hover:bg-primary-100/80 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-white transition-colors"
            >
              <Icon icon="tabler:refresh" width="24" height="24" />
              Play Again
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
