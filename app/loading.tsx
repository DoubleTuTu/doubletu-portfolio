export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #ffd966 0%, #ff9500 50%, #e67300 100%)',
            boxShadow: '0 0 30px rgba(255, 107, 0, 0.6)',
          }}
        />
        <span className="font-bangers text-2xl bg-gradient-to-r from-[#ffd700] to-[#ff6b00] bg-clip-text text-transparent">
          Loading...
        </span>
      </div>
    </div>
  );
}
