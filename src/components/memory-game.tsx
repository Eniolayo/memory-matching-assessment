"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function MemoryGame() {
  const [cards, setCards] = useState<string[]>([]);

  useEffect(() => {
    generateShuffledBoard().then(setCards);
  }, []);

  return (
    <div className="my-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((src, index) => (
        <div key={index} className="relative h-24 w-24 bg-gray-200">
          <Image src={src} alt={`Card ${index}`} width={100} height={100} />
        </div>
      ))}
    </div>
  );
}

// Utility function to shuffle an array using Fisher-Yates (Knuth) Shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]; // Clone to avoid mutating the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
  }
  return shuffled;
};

// Function to generate a shuffled board with unique images
const generateShuffledBoard = async (): Promise<string[]> => {
  const uniqueImages = Array.from(
    { length: 8 },
    (_, i) => `https://picsum.photos/200?random=${i + 1}`
  );
  const pairedImages = [...uniqueImages, ...uniqueImages]; // Each image appears twice
  return shuffleArray(pairedImages);
};
