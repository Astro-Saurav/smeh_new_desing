import Link from "next/link";
import Image from "next/image";
import type { MainSiteNewsItem } from "@/lib/newsApi";

function safeImg(url: string | null | undefined) {
  if (!url || url === "undefined" || url === "") return "/logo.png";
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

export function HeroGrid({ lead }: { lead?: MainSiteNewsItem }) {
  if (!lead) return null;
  return (
    <div className="group">
      <Link href={lead.link} className="block">
        <div className="relative aspect-[21/9] md:aspect-video overflow-hidden bg-zinc-50 rounded-xl shadow-sm border border-zinc-100 mb-5">
          <Image src={safeImg(lead.image)} alt={lead.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority unoptimized={true} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1.5 block">{lead.category}</span>
      <h2 className="text-2xl md:text-4xl font-black leading-tight group-hover:text-primary transition-colors mb-3 break-words hyphens-auto">{lead.headline}</h2>
      <p className="text-zinc-600 text-[14px] leading-relaxed line-clamp-3 mb-2">{lead.description}</p>
      </Link>
    </div>
  );
}
