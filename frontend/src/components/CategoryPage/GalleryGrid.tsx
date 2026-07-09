import Link from "next/link";
import { MainSiteNewsItem } from "@/lib/newsApi";

export function GalleryGrid({ items }: { items: MainSiteNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
      {items.map((item) => (
        <div key={item.id} className="break-inside-avoid mb-4 group relative">
          <Link href={`/article/${item.id}`}>
            <div className="relative overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-all">
              <img
                src={item.thumbnail?.path_webp || "/placeholder-news.jpg"}
                alt={item.title}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-3 drop-shadow-md">
                  {item.title}
                </h3>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
