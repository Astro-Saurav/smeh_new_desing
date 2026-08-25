export type EditorialMember = {
  id: string;
  name: string;
  image?: string | null;
  tagline?: string | null;
  email?: string | null;
  contact?: string | null;
  social_link?: string | null;
  display_order: number;
};

export type EditorialRole = {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  members: EditorialMember[];
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; 
  if (process.env.INTERNAL_API_URL) return process.env.INTERNAL_API_URL;
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.BACKEND_URL || 'http://127.0.0.1:8080';
};

export async function getEditorialRoles(): Promise<EditorialRole[]> {
  try {
    const url = `${getBaseUrl()}/api/v1/editorial`;
    const response = await fetch(url, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch editorial roles: ${response.status}`);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching editorial roles:', error);
    return [];
  }
}
