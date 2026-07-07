import Link from "next/link";
import Image from "next/image";
import type { MainSiteNewsItem } from "@/lib/newsApi";

function safeImg(url: string | null | undefined) {
  if (!url || url === "undefined" || url === "") return "/logo.png";
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

export function SidebarStories({ stories, title = "Latest Headlines" }: { stories: MainSiteNewsItem[], title?: string }) {
  if (!stories || stories.length === 0) return null;

  return (
    <div className="lg:col-span-5 pt-0">
      <h3 className="text-[11px] font-black uppercase tracking-[0.15em] border-b-[3px] border-black pb-2 mb-4">{title}</h3>
      <div className="flex flex-col gap-4">
        {stories.map((story, i) => (
          <div key={i} className="group flex gap-4 border-b border-zinc-200 pb-4 last:border-0">
            <span className="text-4xl font-black text-zinc-100 group-hover:text-primary shrink-0 leading-none tabular-nums tracking-tighter">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <Link href={story.link}>
                <h5 className="text-[14px] font-black leading-snug group-hover:text-primary transition-colors mb-1.5 break-words hyphens-auto line-clamp-3">{story.headline}</h5>
              </Link>
              <p className="text-[12px] text-zinc-500 line-clamp-1">{story.description}</p>
            </div>
            <Link href={story.link} className="shrink-0 hidden sm:block">
              <div className="relative w-20 h-14 overflow-hidden bg-zinc-100">
                <Image src={safeImg(story.image)} alt={story.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
