import { CardType } from "@/components/card";

// Number of pairs in the game
const PAIRS_COUNT = 8;
// Total number of cards
const TOTAL_CARDS = PAIRS_COUNT * 2;

export interface GameState {
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

export const initialState: GameState = {
  cards: [],
  flippedCards: [],
  matchedCards: [],
  clicks: 0,
  gameStartTime: null,
  gameEndTime: null,
  isGameComplete: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
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
