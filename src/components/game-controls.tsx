"use client";
import { Icon } from "@iconify/react";

type GameControlsProps = {
  clicks: number;
  bestScore: number | null;
  onRestart: () => void;
};

export default function GameControls({
  clicks,
  bestScore,
  onRestart,
}: GameControlsProps) {
  return (
    <div className="mb-6 flex flex-col items-center justify-between rounded-lg p-4 text-gray-800 shadow-sm sm:flex-row">
      <div className="mb-4 flex flex-col gap-8 sm:mb-0 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="border-b text-sm text-gray-900">Clicks</p>
          <p className="text-2xl font-bold">{clicks}</p>
        </div>

        {bestScore !== null && (
          <div className="text-center sm:text-left">
            <p className="border-b text-sm text-gray-900">Best Score</p>
            <p className="text-2xl font-bold">{bestScore}</p>
          </div>
        )}
      </div>

      <button onClick={onRestart} className="flex items-center gap-2">
        <Icon icon="mynaui:refresh" width="24" height="24" />
        Restart Game
      </button>
    </div>
  );
}
