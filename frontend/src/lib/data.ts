import type { NewsCardProps } from '@/components/site/news-card';
import type { VideoCardProps } from '@/components/site/video-card';
import type { MaterialCardProps } from '@/components/site/material-card';

export const studentProjects: NewsCardProps[] = [
  {
    id: 'proj1',
    category: 'Manav Rachna TV',
    headline: 'Documentary: The Lifeline of a City',
    description: "A short documentary exploring the daily lives of commuters on the city's metro.",
    image: 'https://picsum.photos/seed/project1/600/400',
    imageHint: 'documentary film',
    link: '/explore/audio-visual',
  },
  {
    id: 'proj2',
    category: 'Social Buzz',
    headline: 'Interactive Report: The Urban Heat Island Effect',
    description: 'An in-depth multimedia article about the rising temperatures in urban centers.',
    image: 'https://picsum.photos/seed/project2/600/400',
    imageHint: 'city journalism',
    link: '/explore/web-journalism',
  },
  {
    id: 'proj3',
    category: 'Campus Buzz',
    headline: 'Campus Chronicle: The Anniversary Edition',
    description: 'A special edition newspaper celebrating 25 years of the university.',
    image: 'https://picsum.photos/seed/project3/600/400',
    imageHint: 'print newspaper',
    link: '/explore/print-media',
  },
    {
    id: 'proj4',
    category: 'Podcast',
      headline: 'Podcast: "Tech Talks" - Technology in Everyday Life',
      description: 'An interview with a leading researcher on the future of digital innovation.',
    image: 'https://picsum.photos/seed/project4/600/400',
    imageHint: 'podcast microphone',
    link: '/explore/audio-podcasts',
  },
    {
    id: 'proj5',
    category: 'Campaign',
    headline: 'Campaign: "Green Campus" Initiative',
    description: 'A comprehensive PR campaign to promote sustainability on campus.',
    image: 'https://picsum.photos/seed/project5/600/400',
    imageHint: 'green campus',
    link: '/explore/pr-advertising',
  },
    {
    id: 'proj6',
    category: 'Manav Rachna TV',
    headline: 'Short Film: "Crossroads"',
    description: 'A narrative short film about a life-changing decision made by a young student.',
    image: 'https://picsum.photos/seed/project6/600/400',
    imageHint: 'short film production',
    link: '/explore/audio-visual',
  },
];

export const documentaryAndShortFilms: VideoCardProps[] = [
  {
    id: '1',
    title: 'The Silent Guardians of the Himalayas',
    subject: 'Documentary',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/doc1/400/225',
    imageHint: 'himalayas mountain'
  },
  {
    id: '2',
    title: 'Short Film: "The Last Letter"',
    subject: 'Short Film',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/doc2/400/225',
    imageHint: 'old letter'
  },
  {
    id: '3',
    title: 'Beneath the Waves: A Coral Reef Story',
    subject: 'Documentary',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/doc3/400/225',
    imageHint: 'coral reef'
  },
  {
    id: '4',
    title: 'PSA: The Importance of Digital Literacy',
    subject: 'Public Service Video',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/doc4/400/225',
    imageHint: 'digital literacy'
  },
  {
    id: '5',
    title: 'Interview with a War Veteran',
    subject: 'Interview',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/doc5/400/225',
    imageHint: 'war veteran'
  },
  {
    id: '6',
    title: 'Short Film: "Echoes in the Hallway"',
    subject: 'Short Film',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/doc6/400/225',
    imageHint: 'empty hallway'
  },
  {
    id: '7',
    title: 'The Art of Street Food: A Culinary Journey',
    subject: 'Documentary',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/doc7/400/225',
    imageHint: 'street food'
  },
    {
    id: '8',
    title: 'News Package: Local Elections 2024',
    subject: 'News Package',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://picsum.photos/seed/doc8/400/225',
    imageHint: 'election day'
  },
];

export const studyMaterials: MaterialCardProps[] = [
  {
    id: '1',
    title: 'Data Structures & Algorithms Notes',
    subject: 'Computer Science',
    type: 'PDF',
    link: '#',
  },
  {
    id: '2',
    title: 'Thermodynamics Lecture Slides',
    subject: 'Mechanical Engineering',
    type: 'Slides',
    link: '#',
  },
  {
    id: '3',
    title: 'Organic Chemistry Reference Links',
    subject: 'Chemistry',
    type: 'Link',
    link: '#',
  },
  {
    id: '4',
    title: 'Modern Physics Full Course Notes',
    subject: 'Physics',
    type: 'PDF',
    link: '#',
  },
   {
    id: '5',
    title: 'Digital Signal Processing Code Samples',
    subject: 'Electronics',
    type: 'Code',
    link: '#',
  },
   {
    id: '6',
    title: 'Indian Polity Mind Maps',
    subject: 'General Studies',
    type: 'PDF',
    link: '#',
  },
];

export const competitions: { id: string; name: string; organizer: string; deadline: string; eligibility: string; link: string; }[] = [
  {
    id: '1',
    name: 'Innovate India Hackathon 2024',
    organizer: 'Ministry of Education',
    deadline: '2024-10-15',
    eligibility: 'All college students',
    link: '#',
  },
  {
    id: '2',
    name: 'National Coding Olympiad',
    organizer: 'CodeMasters Inc.',
    deadline: '2024-09-30',
    eligibility: 'Undergraduate students',
    link: '#',
  },
  {
    id: '3',
    name: 'Future Leaders Scholarship',
    organizer: 'Global Foundation',
    deadline: '2024-11-01',
    eligibility: 'Final year students',
    link: '#',
  },
    {
    id: '4',
    name: 'GATE 2025 Registration',
    organizer: 'IIT Bombay',
    deadline: '2024-09-28',
    eligibility: 'Engineering Graduates/Final Year',
    link: '#',
  },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  image: string;
}

export const achievements: Achievement[] = [
  {
    id: 'ach1',
    title: 'Best Student Film Award',
    description: "Our students won the top prize at the National Student Film Festival for their documentary \"City of Dreams\".",
    category: 'Film Production',
    year: '2023',
    image: 'https://picsum.photos/seed/award1/800/600',
  },
  {
    id: 'ach2',
    title: 'Excellence in Journalism',
    description: 'The "Campus Chronicle" was awarded "Best Student Newspaper" for its investigative reporting on university policies.',
    category: 'Print Media',
    year: '2023',
    image: 'https://picsum.photos/seed/award2/800/600',
  },
  {
    id: 'ach3',
    title: 'Top University Podcast',
    description: '"Mind Matters," a podcast on mental health awareness, was ranked #1 among university podcasts in the country.',
    category: 'Audio Podcasts',
    year: '2022',
    image: 'https://picsum.photos/seed/award3/800/600',
  },
  {
    id: 'ach4',
    title: 'National Advertising Competition Winner',
    description: 'A team of our PR & Advertising students won first place for their "Drive Safe" campaign.',
    category: 'PR & Advertising',
    year: '2022',
    image: 'https://picsum.photos/seed/award4/800/600',
  },
];

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  link: string;
}

export const announcements: Announcement[] = [
  {
    id: 'ann1',
    title: 'Innovation Summit 2024: Call for Proposals',
    date: '2024-03-20',
    category: 'Academic',
    priority: 'high',
    link: '#',
  },
  {
    id: 'ann2',
    title: 'SMEH Student Council Elections: Final Results',
    date: '2024-03-18',
    category: 'Student Life',
    priority: 'medium',
    link: '#',
  },
  {
    id: 'ann3',
    title: 'New Multimedia Lab Opening in Building 5',
    date: '2024-03-15',
    category: 'Facilities',
    priority: 'high',
    link: '#',
  },
];
