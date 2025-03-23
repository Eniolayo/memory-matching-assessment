"use client";

import { memo } from "react";
import Image from "next/image";

export type CardType = {
  id: number;
  pairId: number;
  imageUrl: string;
};

type CardProps = {
  card: CardType;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
};

function Card({ card, isFlipped, isMatched, onClick }: CardProps) {
  return (
    <div
      className={`relative h-32 cursor-pointer transition-transform duration-300 ease-in-out md:h-40 ${isMatched ? "scale-95 opacity-80" : "hover:scale-105"} `}
      onClick={onClick}
      role="button"
      aria-label={isFlipped ? `Card with image ${card.pairId}` : "Hidden card"}
      aria-pressed={isFlipped}
    >
      <div
        className={`perspective-2000 transform-style-preserve-3d h-full w-full rounded-lg shadow-md ${isFlipped ? "flipped" : ""} `}
      >
        {/* Card Back (Question Mark) */}
        <div
          className={`bg-primary absolute flex h-full w-full items-center justify-center rounded-lg transition-transform duration-1000 backface-hidden`}
        >
          <div className="text-4xl text-gray-800">?</div>
        </div>

        {/* Card Front (Image) */}
        <div
          className={`absolute h-full w-full rotate-y-180 overflow-hidden rounded-lg bg-white transition-transform duration-1000 backface-hidden`}
        >
          {/* Only load the image if the card is or has been flipped to optimize performance */}
          {isFlipped && (
            <Image
              src={card.imageUrl || "/placeholder.svg"}
              alt={`Card ${card.id}`}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
              priority={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(Card);
