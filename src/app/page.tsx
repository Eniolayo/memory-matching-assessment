import MemoryGame from "@/components/memory-game";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <h1 className="mb-8 text-3xl font-bold text-slate-800">
        Memory Matching Game
      </h1>

      <MemoryGame />
    </main>
  );
}
