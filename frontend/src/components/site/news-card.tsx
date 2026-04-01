"use client";

import Image from 'next/image';
import Link from 'next/link';

export type NewsCardProps = {
  id: string;
  category: string;
  headline: string;
  description: string;
  image: string;
  imageHint: string;
  link: string;
};

export default function NewsCard({ category, headline, description, image, link }: NewsCardProps) {
  return (
    <Link href={link} className="group flex flex-col gap-4 border-b border-border pb-6">
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={image}
          alt={headline}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div>
        <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-3 block border-y border-border py-1 inline-block">
          {category}
        </span>
        <h3 className="font-headline text-xl lg:text-2xl font-black leading-tight mb-2 text-foreground group-hover:underline decoration-1 underline-offset-4">
          {headline}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 font-medium">
          {description}
        </p>
      </div>
    </Link>
  );
}
