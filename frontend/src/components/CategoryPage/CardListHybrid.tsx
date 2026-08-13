import Link from "next/link";
import { MainSiteNewsItem } from "@/lib/newsApi";

function safeImg(url: string | null | undefined) {
  if (!url || url === "undefined" || url === "") return "/placeholder-news.jpg";
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

export function CardListHybrid({ items }: { items: MainSiteNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      {items.map((item) => (
        <article key={item.id} className="group flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white border border-zinc-100 rounded-xl p-4 hover:shadow-md transition-shadow">
          <Link href={item.link} className="block w-full sm:w-48 shrink-0 aspect-[16/9] sm:aspect-square md:aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100 relative">
            <img
              src={safeImg(item.image)}
              alt={item.headline}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          <div className="flex flex-col flex-grow justify-center py-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                {item.category}
              </span>
              <span className="text-xs text-zinc-400">
                {new Date(item.published_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <Link href={item.link} className="group-hover:text-red-600 transition-colors">
              <h3 className="font-bold text-xl leading-tight mb-2 line-clamp-2">
                {item.headline}
              </h3>
            </Link>
            <p className="text-sm text-zinc-500 line-clamp-2">
              {item.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
