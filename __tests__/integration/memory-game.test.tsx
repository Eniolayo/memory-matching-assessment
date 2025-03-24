import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";

import MemoryGame from "@/components/memory-game";

// Mock the game context to control the cards for predictable testing
jest.mock("@/context/game-context", () => {
  // Create a predictable set of cards for testing
  const createMockCards = () => {
    const cards = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 2; j++) {
        cards.push({
          id: i * 2 + j,
          pairId: i,
          imageUrl: `https://picsum.photos/200?random=${i}`,
        });
      }
    }
    return cards;
  };

  const mockCards = createMockCards();

  // Original module
  const originalModule = jest.requireActual("@/context/game-context");

  return {
    ...originalModule,
    // Override the provider to use our controlled cards
    GameProvider: ({ children }: { children: React.ReactNode }) => {
      return originalModule.GameProvider({ children });
    },
    // Make sure our mock cards are used
    useGame: () => {
      const gameContext = originalModule.useGame();
      return {
        ...gameContext,
        cards: mockCards,
      };
    },
  };
});

describe("Memory Game Integration", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  it("renders the game board with all cards", () => {
    render(<MemoryGame />);

    // Should render 16 cards (8 pairs)
    const cards = screen.getAllByRole("button", {
      name: /Hidden card|Card with image/i,
    });
    expect(cards).toHaveLength(16);
  });

  it("shows game controls with initial state", () => {
    render(<MemoryGame />);

    // Should show clicks counter at 0
    expect(screen.getByText("Clicks")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();

    // Should have restart button
    expect(screen.getByText("Restart Game")).toBeInTheDocument();
  });

  it("increments clicks when a card is clicked", async () => {
    render(<MemoryGame />);

    // Initial clicks should be 0
    expect(screen.getByText("0")).toBeInTheDocument();

    // Click the first card
    const cards = screen.getAllByRole("button", { name: /Hidden card/i });
    fireEvent.click(cards[0]);

    // Clicks should increment to 1
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("restarts the game when restart button is clicked", async () => {
    render(<MemoryGame />);

    // Click a card to increment clicks
    const cards = screen.getAllByRole("button", { name: /Hidden card/i });
    fireEvent.click(cards[0]);

    // Clicks should be 1
    expect(screen.getByText("1")).toBeInTheDocument();

    // Click restart button
    fireEvent.click(screen.getByText("Restart Game"));

    // Clicks should reset to 0
    await waitFor(() => {
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });
});
