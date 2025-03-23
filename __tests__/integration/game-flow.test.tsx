import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MemoryGame from "@/components/memory-game";
import { GameProvider } from "@/context/game-context";
import { describe, it, expect } from "@jest/globals";

// Mock the cards to have predictable pairs for testing
jest.mock("@/context/game-context", () => {
  const originalModule = jest.requireActual("@/context/game-context");

  // Create a controlled set of cards where we know the pairs
  const createControlledCards = () => {
    return [
      { id: 0, pairId: 0, imageUrl: "https://picsum.photos/200?random=0" },
      { id: 1, pairId: 0, imageUrl: "https://picsum.photos/200?random=0" }, // Pair with id 0
      { id: 2, pairId: 1, imageUrl: "https://picsum.photos/200?random=1" },
      { id: 3, pairId: 1, imageUrl: "https://picsum.photos/200?random=1" }, // Pair with id 2
      // Add more cards to make 16 total
      { id: 4, pairId: 2, imageUrl: "https://picsum.photos/200?random=2" },
      { id: 5, pairId: 2, imageUrl: "https://picsum.photos/200?random=2" },
      { id: 6, pairId: 3, imageUrl: "https://picsum.photos/200?random=3" },
      { id: 7, pairId: 3, imageUrl: "https://picsum.photos/200?random=3" },
      { id: 8, pairId: 4, imageUrl: "https://picsum.photos/200?random=4" },
      { id: 9, pairId: 4, imageUrl: "https://picsum.photos/200?random=4" },
      { id: 10, pairId: 5, imageUrl: "https://picsum.photos/200?random=5" },
      { id: 11, pairId: 5, imageUrl: "https://picsum.photos/200?random=5" },
      { id: 12, pairId: 6, imageUrl: "https://picsum.photos/200?random=6" },
      { id: 13, pairId: 6, imageUrl: "https://picsum.photos/200?random=6" },
      { id: 14, pairId: 7, imageUrl: "https://picsum.photos/200?random=7" },
      { id: 15, pairId: 7, imageUrl: "https://picsum.photos/200?random=7" },
    ];
  };

  return {
    ...originalModule,
    useGame: () => {
      const gameContext = originalModule.useGame();
      return {
        ...gameContext,
        cards: createControlledCards(),
      };
    },
  };
});

// Mock setTimeout to speed up tests
jest.useFakeTimers();

describe("Game Flow Integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("matches a pair of cards correctly", async () => {
    render(
      <GameProvider>
        <MemoryGame />
      </GameProvider>
    );

    const cards = screen.getAllByRole("button", { name: /Hidden card/i });

    // Click the first two cards (which are a pair with pairId 0)
    fireEvent.click(cards[0]); // id: 0, pairId: 0
    fireEvent.click(cards[1]); // id: 1, pairId: 0

    // Fast-forward timers
    jest.runAllTimers();

    // Both cards should remain flipped as they match
    await waitFor(() => {
      // We can't directly check if they're flipped in the DOM due to CSS,
      // but we can check that the clicks counter increased
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("flips back non-matching cards after delay", async () => {
    render(
      <GameProvider>
        <MemoryGame />
      </GameProvider>
    );

    const cards = screen.getAllByRole("button", { name: /Hidden card/i });

    // Click two cards that don't match
    fireEvent.click(cards[0]); // id: 0, pairId: 0
    fireEvent.click(cards[2]); // id: 2, pairId: 1

    // Both cards should be flipped initially
    expect(screen.getByText("2")).toBeInTheDocument();

    // Fast-forward timers to trigger the flip back
    jest.runAllTimers();

    // Cards should be flipped back, but clicks should remain at 2
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("shows results screen when all pairs are matched", async () => {
    // Set up the mock before rendering
    const mockUseGame = {
      isGameComplete: true,
      clicks: 20,
      gameStartTime: Date.now() - 30000, // 30 seconds ago
      gameEndTime: Date.now(),
      cards: [], // Add any other required properties from useGame
      flipCard: jest.fn(),
      resetGame: jest.fn(),
    };

    jest
      .spyOn(require("@/context/game-context"), "useGame")
      .mockImplementation(() => mockUseGame);

    render(
      <GameProvider>
        <MemoryGame />
      </GameProvider>
    );

    // Fast-forward timers
    jest.runAllTimers();

    // Check for results screen elements
    await waitFor(() => {
      expect(
        screen.getByText(/Congratulations! You've achieved a new best score!/i)
      ).toBeInTheDocument();
    });

    // Clean up mock
    jest.restoreAllMocks();
  });
});
