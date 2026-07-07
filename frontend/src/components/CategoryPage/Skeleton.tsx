export function Skeleton() {
  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="border-b-4 border-zinc-900 mb-10 pb-4">
          <div className="h-14 w-64 bg-zinc-200 animate-pulse rounded" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 lg:border-r border-zinc-100 lg:pr-10">
            {/* Hero Skeleton */}
            <div className="w-full aspect-video bg-zinc-200 animate-pulse mb-5 rounded" />
            <div className="h-3 w-24 bg-zinc-200 animate-pulse mb-3 rounded" />
            <div className="h-10 w-3/4 bg-zinc-200 animate-pulse mb-4 rounded" />
            <div className="h-16 w-full bg-zinc-200 animate-pulse mb-8 rounded" />
            
            {/* Secondary Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-zinc-100">
              {[1, 2].map(i => (
                <div key={i}>
                  <div className="aspect-[16/10] bg-zinc-200 animate-pulse mb-3 rounded" />
                  <div className="h-3 w-16 bg-zinc-200 animate-pulse mb-2 rounded" />
                  <div className="h-5 w-full bg-zinc-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-5">
            <div className="h-4 w-32 bg-zinc-200 animate-pulse mb-6 rounded" />
            <div className="flex flex-col gap-5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-4 border-b border-zinc-100 pb-5">
                  <div className="h-8 w-8 bg-zinc-200 animate-pulse rounded" />
                  <div className="flex-1">
                    <div className="h-4 w-full bg-zinc-200 animate-pulse mb-2 rounded" />
                    <div className="h-3 w-2/3 bg-zinc-200 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
