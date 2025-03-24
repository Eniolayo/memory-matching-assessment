"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useReducer,
} from "react";

import { gameReducer, GameState, initialState } from "@/store/gameReducer";

// Create the context
interface GameContextType extends GameState {
  handleCardClick: (id: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameProviderProps = {
  children: ReactNode;
};

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Initialize game on first render
  const initializeGame = useCallback(() => {
    dispatch({ type: "INITIALIZE_GAME" });
  }, []);

  // Handle card click
  const handleCardClick = useCallback((id: number) => {
    dispatch({ type: "FLIP_CARD", id });

    // Check for match after flipping
    // We need to use setTimeout here to ensure the state has been updated
    setTimeout(() => {
      dispatch({ type: "CHECK_MATCH" });
    }, 0);
  }, []);

  // Reset the game
  const resetGame = useCallback(() => {
    dispatch({ type: "INITIALIZE_GAME" });
  }, []);

  // Initialize game on first render
  if (state.cards.length === 0) {
    initializeGame();
  }

  // Set up a timeout to reset flipped cards if they don't match
  if (state.flippedCards.length === 2) {
    const [firstId, secondId] = state.flippedCards;
    const firstCard = state.cards.find(card => card.id === firstId);
    const secondCard = state.cards.find(card => card.id === secondId);

    if (firstCard && secondCard && firstCard.pairId !== secondCard.pairId) {
      // Wait 2 seconds before flipping back non-matching cards
      setTimeout(() => {
        dispatch({ type: "RESET_FLIPPED" });
      }, 2000);
    }
  }

  return (
    <GameContext.Provider
      value={{
        ...state,
        handleCardClick,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
