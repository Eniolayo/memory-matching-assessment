"use client";

import { CardType } from "@/components/card";
import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  useCallback,
} from "react";

// Number of pairs in the game
const PAIRS_COUNT = 8;
// Total number of cards
const TOTAL_CARDS = PAIRS_COUNT * 2;

interface GameState {
  cards: CardType[];
  flippedCards: number[];
  matchedCards: number[];
  clicks: number;
  gameStartTime: number | null;
  gameEndTime: number | null;
  isGameComplete: boolean;
}

type GameAction =
  | { type: "INITIALIZE_GAME" }
  | { type: "FLIP_CARD"; id: number }
  | { type: "CHECK_MATCH" }
  | { type: "RESET_FLIPPED" }
  | { type: "SET_GAME_COMPLETE" }
  | { type: "RESET_GAME" };

const initialState: GameState = {
  cards: [],
  flippedCards: [],
  matchedCards: [],
  clicks: 0,
  gameStartTime: null,
  gameEndTime: null,
  isGameComplete: false,
};

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INITIALIZE_GAME": {
      // Create pairs of cards with unique IDs and shared pairIds
      const newCards: CardType[] = [];

      for (let i = 0; i < PAIRS_COUNT; i++) {
        // Generate a random seed for each pair to get unique images
        const randomSeed = Math.floor(Math.random() * 1000);

        // Create two cards with the same pairId (for matching)
        for (let j = 0; j < 2; j++) {
          newCards.push({
            id: i * 2 + j,
            pairId: i,
            imageUrl: `https://picsum.photos/200?random=${randomSeed}`,
          });
        }
      }

      // Shuffle the cards
      const shuffledCards = [...newCards].sort(() => Math.random() - 0.5);

      return {
        ...initialState,
        cards: shuffledCards,
      };
    }

    case "FLIP_CARD": {
      // Start timing on first click if not already started
      const gameStartTime =
        state.gameStartTime === null ? Date.now() : state.gameStartTime;

      // Ignore clicks if:
      // 1. Card is already flipped or matched
      // 2. Two cards are already flipped and being checked
      if (
        state.flippedCards.includes(action.id) ||
        state.matchedCards.includes(action.id) ||
        state.flippedCards.length >= 2
      ) {
        return state;
      }

      // Flip the card and increment click counter
      return {
        ...state,
        flippedCards: [...state.flippedCards, action.id],
        clicks: state.clicks + 1,
        gameStartTime,
      };
    }

    case "CHECK_MATCH": {
      if (state.flippedCards.length !== 2) return state;

      const [firstId, secondId] = state.flippedCards;
      const firstCard = state.cards.find(card => card.id === firstId);
      const secondCard = state.cards.find(card => card.id === secondId);

      // If the cards match (same pairId)
      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        const newMatchedCards = [...state.matchedCards, firstId, secondId];
        const isGameComplete = newMatchedCards.length === TOTAL_CARDS;

        return {
          ...state,
          matchedCards: newMatchedCards,
          flippedCards: [],
          isGameComplete,
          gameEndTime: isGameComplete ? Date.now() : state.gameEndTime,
        };
      }

      // No match, but keep the cards flipped (will be reset by RESET_FLIPPED action)
      return state;
    }

    case "RESET_FLIPPED": {
      return {
        ...state,
        flippedCards: [],
      };
    }

    case "SET_GAME_COMPLETE": {
      return {
        ...state,
        isGameComplete: true,
        gameEndTime: Date.now(),
      };
    }

    case "RESET_GAME": {
      return initialState;
    }

    default:
      return state;
  }
}

// Create the context
interface GameContextType extends GameState {
  handleCardClick: (id: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

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
      }, 2000); // Increased from 1000ms to 2000ms as requested
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
