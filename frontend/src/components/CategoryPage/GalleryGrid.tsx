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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[250px] grid-flow-row-dense">
      {items.map((item, index) => {
        const i = index % 8;
        let spanClass = "col-span-1 row-span-1";
        switch (i) {
          case 0: spanClass = "col-span-2 row-span-2"; break;
          case 1: spanClass = "col-span-1 row-span-1"; break;
          case 2: spanClass = "col-span-1 row-span-1"; break;
          case 3: spanClass = "col-span-2 row-span-1 md:col-span-2 md:row-span-1"; break;
          case 4: spanClass = "col-span-1 row-span-2 md:col-span-1 md:row-span-2"; break;
          case 5: spanClass = "col-span-1 row-span-1"; break;
          case 6: spanClass = "col-span-2 row-span-2"; break;
          case 7: spanClass = "col-span-1 row-span-1"; break;
        }

        return (
          <div key={item.id} className={`${spanClass} group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all`}>
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
        );
      })}
    </div>
  );
}
