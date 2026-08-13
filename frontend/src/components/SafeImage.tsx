"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK = "/new_logo.png";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  unoptimized?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export function SafeImage({ src, alt, fill, width, height, className, priority, unoptimized = true, sizes, style }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      priority={priority}
      unoptimized={unoptimized}
      sizes={sizes}
      style={style}
      onError={() => {
        if (!imgSrc.includes(FALLBACK)) setImgSrc(FALLBACK);
      }}
    />
  );
}
