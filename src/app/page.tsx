import MemoryGame from "@/components/memory-game";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100">
        Memory Matching Game
      </h1>
      <MemoryGame />
    </main>
  );
}
