import Link from "next/link";
import { MainSiteNewsItem } from "@/lib/newsApi";

function safeImg(url: string | null | undefined) {
  if (!url || url === "undefined" || url === "") return "/placeholder-news.jpg";
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

export function MultiColumnGrid({ items }: { items: MainSiteNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <article key={item.id} className="flex flex-col group">
          <Link href={item.link} className="block w-full aspect-[4/3] overflow-hidden rounded-xl mb-4 bg-zinc-100 relative">
            <img
              src={safeImg(item.image)}
              alt={item.headline}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          <div className="flex flex-col flex-grow">
            <span className="text-[10px] font-bold uppercase tracking-wider mb-2 text-red-600">
              {item.category}
            </span>
            <Link href={item.link} className="group-hover:text-red-600 transition-colors">
              <h3 className="font-bold text-lg leading-snug mb-2 line-clamp-3">
                {item.headline}
              </h3>
            </Link>
            <p className="text-sm text-zinc-500 line-clamp-2 mt-auto">
              {item.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
