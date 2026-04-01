import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle } from 'lucide-react';

export type VideoCardProps = {
  id: string;
  title: string;
  subject: string;
  videoUrl: string;
  thumbnailUrl: string;
  imageHint: string;
};

export default function VideoCard({ title, subject, videoUrl, thumbnailUrl, imageHint }: VideoCardProps) {
  return (
    <Link href={videoUrl} target="_blank" rel="noopener noreferrer" className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 border-2 border-transparent group-hover:border-primary group-hover:shadow-lg">
        <div className="relative w-full aspect-video">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-bold font-headline text-sm leading-snug line-clamp-2">{title}</h3>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Badge variant="outline">{subject}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
