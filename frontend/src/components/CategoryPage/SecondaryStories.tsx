import Link from "next/link";
import Image from "next/image";
import type { MainSiteNewsItem } from "@/lib/newsApi";

function safeImg(url: string | null | undefined) {
  if (!url || url === "undefined" || url === "") return "/logo.png";
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

export function SecondaryStories({ stories }: { stories: MainSiteNewsItem[] }) {
  if (!stories || stories.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stories.map((story, i) => (
        <div key={i} className="group">
          <Link href={story.link}>
            <div className="relative aspect-video overflow-hidden bg-zinc-50 rounded-lg shadow-sm border border-zinc-100 mb-3">
              <Image src={safeImg(story.image)} alt={story.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized={true} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-primary mb-1 block">{story.category}</span>
            <h4 className="text-[14px] font-black leading-snug group-hover:text-primary transition-colors mb-1.5 break-words hyphens-auto line-clamp-2">{story.headline}</h4>
            <p className="text-[12px] text-zinc-500 line-clamp-2 leading-relaxed">{story.description}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
