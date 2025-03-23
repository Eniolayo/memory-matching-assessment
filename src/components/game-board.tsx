"use client";

import { memo } from "react";

import { useGame } from "@/context/game-context";

import Card from "./card";

function GameBoard() {
  const { cards, flippedCards, matchedCards, handleCardClick } = useGame();

  return (
    <div className="my-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          isFlipped={
            flippedCards.includes(card.id) || matchedCards.includes(card.id)
          }
          isMatched={matchedCards.includes(card.id)}
          onClick={() => handleCardClick(card.id)}
        />
      ))}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(GameBoard);
