import Link from "next/link";
import { MainSiteNewsItem } from "@/lib/newsApi";

function safeImg(url: string | null | undefined) {
  if (!url || url === "undefined" || url === "") return "/placeholder-news.jpg";
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

export function PhotoGrid({ items }: { items: MainSiteNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all aspect-square">
          <Link href={item.link} className="block w-full h-full">
            <img
              src={safeImg(item.image)}
              alt={item.headline}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider mb-1 block text-red-400">
                  {item.category}
                </span>
                <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-3 drop-shadow-md">
                  {item.headline}
                </h3>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
