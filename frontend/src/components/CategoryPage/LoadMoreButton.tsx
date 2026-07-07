export function LoadMoreButton({ onClick, loading, hasMore }: { onClick: () => void, loading: boolean, hasMore: boolean }) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-12 mb-8">
      <button 
        onClick={onClick} 
        disabled={loading}
        className="px-8 py-3 bg-zinc-950 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-colors disabled:opacity-50"
      >
        {loading ? "Loading..." : "Load More Stories"}
      </button>
    </div>
  );
}
