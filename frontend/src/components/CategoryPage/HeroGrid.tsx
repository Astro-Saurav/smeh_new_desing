import Link from "next/link";
import Image from "next/image";
import type { MainSiteNewsItem } from "@/lib/newsApi";

function safeImg(url: string | null | undefined) {
  if (!url || url === "undefined" || url === "") return "/new_logo.png";
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

/**
 * HeroGrid – hero article for category pages.
 * Full-width image with text overlaid at the bottom via a dark gradient.
 * Matches the 8-column hero slot in the 12-column grid system.
 */
export function HeroGrid({ lead }: { lead?: MainSiteNewsItem }) {
  if (!lead) return null;
  return (
    <Link
      href={lead.link}
      className="group relative block overflow-hidden rounded-xl shadow-md aspect-[16/9] bg-zinc-900"
    >
      <Image
        src={safeImg(lead.image)}
        alt={lead.headline}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        priority
        unoptimized={true}
        onError={(e) => { if (!e.currentTarget.src.includes('/new_logo.png')) { e.currentTarget.srcset = ''; e.currentTarget.src = '/new_logo.png'; } }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      {/* Category badge */}
      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-[10px] rounded-sm font-bold uppercase tracking-widest shadow">
        {lead.category}
      </div>
      {/* Text overlaid at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h2 className="text-2xl md:text-4xl font-black leading-tight text-white group-hover:text-red-300 transition-colors mb-3 drop-shadow-lg break-words hyphens-auto">
          {lead.headline}
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2 drop-shadow">
          {lead.description}
        </p>
      </div>
    </Link>
  );
}
