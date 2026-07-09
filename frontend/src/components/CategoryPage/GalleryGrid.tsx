import Link from "next/link";
import Image from "next/image";
import { MainSiteNewsItem } from "@/lib/newsApi";

function safeImg(url: string | null | undefined) {
  if (!url || url === "undefined" || url === "") return "/placeholder-news.jpg";
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

export function GalleryGrid({ items }: { items: MainSiteNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
      {items.map((item) => (
        <div key={item.id} className="break-inside-avoid mb-4 group relative">
          <Link href={item.link}>
            <div className="relative overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-all">
              <img
                src={safeImg(item.image)}
                alt={item.headline}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-3 drop-shadow-md">
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
