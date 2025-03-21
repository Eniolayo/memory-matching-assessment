export default function MemoryGame() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-slate-200 dark:bg-slate-800 rounded-lg p-4 flex items-center justify-center text-slate-800 dark:text-slate-100"
        >
          {index}
        </div>
      ))}
    </div>
  );
}
