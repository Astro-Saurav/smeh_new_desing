'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Link as LinkIcon, Presentation, Download, FileCode } from 'lucide-react';
import { PixelCanvas } from '@/components/ui/pixel-canvas';

export type MaterialCardProps = {
  id: string;
  title: string;
  subject: string;
  type: 'PDF' | 'Slides' | 'Link' | 'Code';
  link: string;
};

const typeIcons = {
  PDF: <FileText className="w-5 h-5" />,
  Slides: <Presentation className="w-5 h-5" />,
  Link: <LinkIcon className="w-5 h-5" />,
  Code: <FileCode className="w-5 h-5" />,
};

export default function MaterialCard({ title, subject, type, link }: MaterialCardProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
      <PixelCanvas
        colors={["#fca5a5", "#f87171", "#ef4444"]}
        speed={25}
      />
      <Card className="relative z-10 bg-card/80 backdrop-blur-sm group-hover:bg-card/70 border-none shadow-none transition-colors duration-300 h-full">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="text-primary flex-shrink-0">{typeIcons[type]}</div>
            <div className="flex-grow overflow-hidden">
              <p className="font-bold truncate" title={title}>{title}</p>
              <p className="text-xs text-muted-foreground">{subject}</p>
            </div>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link href={link} download={type !== 'Link'} target={type === 'Link' ? '_blank' : '_self'}>
              <Download className="w-4 h-4 mr-2" />
              {type === 'Link' ? 'View' : 'Download'}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
