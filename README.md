# Memory Matching Game

![Memory Matching Game](https://picsum.photos/800/400?random=123)

A fun, interactive memory card matching game built with Next.js and React. Test your memory by finding matching pairs of cards with the fewest clicks possible!

## 📖 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [How the Game Works](#how-the-game-works)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Continuous Integration](#continuous-integration)

## 🎮 Introduction

This Memory Matching Game is a classic card-matching game where cards are placed face down, and the player needs to turn over pairs of matching cards. The goal is to find all pairs with the minimum number of clicks.

## ✨ Features

- 16 cards (8 pairs) with random images
- Click tracking to measure performance
- Best score tracking using local storage
- Responsive design that works on mobile and desktop
- Animations for card flipping
- Results screen with performance stats

## 🛠️ Technologies Used

This project uses several modern web technologies:

- **Next.js**: A React framework that provides features like server-side rendering and routing
- **React**: A JavaScript library for building user interfaces
- **TypeScript**: A typed superset of JavaScript that helps catch errors early
- **Tailwind CSS**: A utility-first CSS framework for styling
- **Jest & React Testing Library**: Tools for testing React components
- **GitHub Actions**: For continuous integration and deployment

Don't worry if you're not familiar with all of these! The README will explain the important parts.

## 📁 Project Structure

The project is organized into several key directories:

```
    src/
    ├── app/               # Next.js app router files
    │   ├── layout.tsx     # Root layout for the app
    │   └── page.tsx       # Home page
    ├── components/        # React components
    │   ├── card.tsx       # Card component
    │   ├── game-board.tsx # Game board component
    │   ├── game-controls.tsx # Game controls component
    │   ├── memory-game.tsx # Main game component
    │   └── results-screen.tsx # Results screen component
    ├── config/            # Configuration files
    │   └── constant.ts    # Constants used in the app
    ├── context/           # React context for game state
    │   └── game-context.tsx # Game context provider
    ├── store/             # State management
    │   └── gameReducer.ts  # Game state reducer & types
    └── __tests__/         # Test files
        ├── integration/   # Integration tests
        └── unit/          # Unit tests

```

## 🎲 How the Game Works

1. **Setup**: The game starts with 16 cards (8 pairs) placed face down in random positions
2. **Gameplay**:
   - Click on any card to reveal its image
   - Click on a second card to find a match
   - If the cards match, they stay face up
   - If they don't match, both cards flip face down
3. **Winning**: The game ends when all pairs are matched
4. **Scoring**: Your performance is measured by:
   - Total number of clicks
   - Time taken to complete
   - Best score is saved locally

## 🚀 Running the Project

1. Clone the repository:

```bash
git clone https://github.com/Eniolayo/memory-matching-assessment.git
cd memory-matching-assessment
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Testing

I used Jest and React Testing Library for testing. To run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 🔄 Continuous Integration

This project uses GitHub Actions for continuous integration:

- Automated testing on every push and pull request
- Code quality checks using ESLint
- Type checking with TypeScript
- Automated deployments to Vercel

The CI pipeline ensures that all code meets quality standards before being merged into the main branch.
