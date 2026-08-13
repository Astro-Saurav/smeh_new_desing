import Link from "next/link";
import Image from "next/image";
import type { MainSiteNewsItem } from "@/lib/newsApi";

function safeImg(url: string | null | undefined) {
  if (!url || url === "undefined" || url === "") return "/new_logo.png";
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

/**
 * SidebarStories – 4-column sidebar with stacked thumbnail cards.
 * Each card shows a small thumbnail on the left and text on the right,
 * matching the 4-column sidebar slot in the 12-column grid system.
 */
export function SidebarStories({ stories, title = "Latest Headlines" }: { stories: MainSiteNewsItem[], title?: string }) {
  if (!stories || stories.length === 0) return null;

  return (
    <div className="lg:col-span-4 pt-0">
      <h3 className="text-[11px] font-black uppercase tracking-[0.15em] border-b-[3px] border-black pb-2 mb-4">{title}</h3>
      <div className="flex flex-col gap-0">
        {stories.map((story, i) => (
          <Link
            key={i}
            href={story.link}
            className="group flex gap-3 items-start min-w-0 border-b border-zinc-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0"
          >
            {/* Thumbnail */}
            <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              <Image
                src={safeImg(story.image)}
                alt={story.headline}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized={true}
                onError={(e) => { if (!e.currentTarget.src.includes('/new_logo.png')) { e.currentTarget.srcset = ''; e.currentTarget.src = '/new_logo.png'; } }}
              />
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1 block">
                {story.category}
              </span>
              <h5 className="text-[13px] font-bold leading-snug text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-3 break-words hyphens-auto">
                {story.headline}
              </h5>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
