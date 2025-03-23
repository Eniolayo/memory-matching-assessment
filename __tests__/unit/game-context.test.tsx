import { renderHook, act } from "@testing-library/react";
import { GameProvider, useGame } from "@/context/game-context";
import type { ReactNode } from "react";
import { describe, it, expect } from "@jest/globals";

// Wrapper component for the hook test
const wrapper = ({ children }: { children: ReactNode }) => (
  <GameProvider>{children}</GameProvider>
);

describe("Game Context", () => {
  it("initializes the game with correct state", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    // Check initial state
    expect(result.current.cards.length).toBe(16); // 8 pairs = 16 cards
    expect(result.current.flippedCards).toEqual([]);
    expect(result.current.matchedCards).toEqual([]);
    expect(result.current.clicks).toBe(0);
    expect(result.current.isGameComplete).toBe(false);
  });

  it("flips a card when clicked", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    // Get the first card ID
    const firstCardId = result.current.cards[0].id;

    act(() => {
      result.current.handleCardClick(firstCardId);
    });

    // Check if the card is flipped
    expect(result.current.flippedCards).toContain(firstCardId);
    expect(result.current.clicks).toBe(1);
  });

  it("resets the game when resetGame is called", () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    // Flip a card first
    const firstCardId = result.current.cards[0].id;

    act(() => {
      result.current.handleCardClick(firstCardId);
    });

    // Verify card is flipped and clicks increased
    expect(result.current.flippedCards).toContain(firstCardId);
    expect(result.current.clicks).toBe(1);

    // Reset the game
    act(() => {
      result.current.resetGame();
    });

    // Check if game is reset
    expect(result.current.flippedCards).toEqual([]);
    expect(result.current.matchedCards).toEqual([]);
    expect(result.current.clicks).toBe(0);
    expect(result.current.isGameComplete).toBe(false);
  });
});
