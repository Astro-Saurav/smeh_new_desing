const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser should use relative path
  if (process.env.INTERNAL_API_URL) return process.env.INTERNAL_API_URL;
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:8080'; // Default for local SSR
};

const API_BASE_URL = getBaseUrl();

export type MainSiteNewsItem = {
  id: string;
  headline: string;
  description: string;
  image: string;
  category: string;
  youtubeUrl: string;
  link: string;
  isFeatured: boolean;
  slug: string;
};

export type CategoryItem = {
  id: string;
  name: string;
};

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

function resolveCategoryName(cat: unknown, fallback: string): string {
  if (!cat) return fallback;
  if (typeof cat === 'string') return cat || fallback;
  if (typeof cat === 'object') {
    const obj = cat as { name?: string };
    return obj.name || fallback;
  }
  return fallback;
}

function normalizeNewsItem(item: Record<string, unknown>, fallbackCategory: string): MainSiteNewsItem {
  const headline = String(item.headline || item.title || 'Untitled');
  const rawDescription = String(item.description || item.content || '');
  const cleanDescription = stripHtml(rawDescription)
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const description =
    cleanDescription.length > 180
      ? `${cleanDescription.slice(0, 180)}...`
      : cleanDescription;

  const id = String(
    item._id ?? item.id ?? `${headline}-${Date.now()}`
  );

  // Prefer slug for SEO-friendly URLs
  const slug = item.slug ? String(item.slug) : id;

  const categoryName = resolveCategoryName(
    item.category,
    String(item.category_name || item.categoryName || fallbackCategory)
  );

  // Resolve thumbnail: prefer webp > thumb > original. Prepend /uploads/ for relative paths.
  let rawImage = (item.thumbnail as any)?.path_webp
    || (item.thumbnail as any)?.path_thumb
    || (item.thumbnail as any)?.file_path
    || item.image
    || item.image_url
    || item.imageUrl
    || null;

  if (rawImage && typeof rawImage === 'string' && !String(rawImage).startsWith('http') && !String(rawImage).startsWith('/')) {
    if (String(rawImage).startsWith('uploads/')) {
      rawImage = `/${rawImage}`;
    } else {
      rawImage = `/uploads/${rawImage}`;
    }
  }

  const image = rawImage ? String(rawImage) : '/logo.png';

  return {
    id,
    headline,
    description,
    image,
    category: categoryName,
    youtubeUrl: String(item.youtube_url || item.youtubeUrl || ''),
    link: item.link ? String(item.link) : `/article/${slug}`,
    isFeatured: !!(item.is_featured || item.isFeatured),
    slug,
  };
}


async function fetchJson(url: string, revalidateTime = 60): Promise<unknown> {
  const response = await fetch(url, {
    method: 'GET',
    next: { revalidate: revalidateTime },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status} for ${url}`);
  }

  return response.json();
}

function extractItems(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload as Record<string, unknown>[];
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as { items?: unknown; data?: unknown };
    if (Array.isArray(candidate.items)) {
      return candidate.items as Record<string, unknown>[];
    }
    if (Array.isArray(candidate.data)) {
      return candidate.data as Record<string, unknown>[];
    }
    const candidate2 = payload as { data?: { items?: unknown } };
    if (candidate2.data && Array.isArray(candidate2.data.items)) {
      return candidate2.data.items as Record<string, unknown>[];
    }
  }

  return [];
}

export async function getNewsByCategory(
  categoryName: string,
  limit = 10
): Promise<MainSiteNewsItem[]> {
  try {
    const url = `${API_BASE_URL}/api/v1/news?page=1&limit=${limit}&status=published&category=${encodeURIComponent(categoryName)}`;
    const payload = await fetchJson(url, 60);
    return extractItems(payload).map((item) => normalizeNewsItem(item, categoryName));
  } catch (error: any) {
    if (error?.cause?.code !== 'ECONNREFUSED') {
      console.error(`Error fetching category "${categoryName}":`, error.message || error);
    }
    return [];
  }
}

export async function getAllPublishedNews(limit = 20): Promise<MainSiteNewsItem[]> {
  try {
    const payload = await fetchJson(
      `${API_BASE_URL}/api/v1/news?page=1&limit=${limit}&status=published`,
      60
    );
    return extractItems(payload).map((item) => normalizeNewsItem(item, 'General'));
  } catch (error: any) {
    if (error?.cause?.code !== 'ECONNREFUSED') {
      console.error('Error fetching all news:', error.message || error);
    }
    return [];
  }
}

export async function listCategories(): Promise<CategoryItem[]> {
  try {
    const payload = await fetchJson(`${API_BASE_URL}/api/v1/categories`, 3600); // cache categories longer
    if (Array.isArray(payload)) {
      return payload.map((c: Record<string, unknown>) => ({
        id: String(c._id || c.id),
        name: String(c.name),
      }));
    }
    return [];
  } catch (error: any) {
    if (error?.cause?.code !== 'ECONNREFUSED') {
      console.error('Error listing categories:', error.message || error);
    }
    return [];
  }
}

export type CategoryFeedResponse = {
  category: { name: string; slug: string };
  hero: MainSiteNewsItem[];
  secondary: MainSiteNewsItem[];
  sidebar: MainSiteNewsItem[];
  older: MainSiteNewsItem[];
  pagination: { cursor: string | null; hasMore: boolean };
};

export async function getCategoryFeedAPI(slug: string, cursor?: string, limit = 12): Promise<CategoryFeedResponse | null> {
  try {
    const cursorParam = cursor ? `&cursor=${cursor}` : '';
    const url = `${API_BASE_URL}/api/v1/category/${encodeURIComponent(slug)}?limit=${limit}${cursorParam}`;
    // Fetch dynamically if cursor is used, otherwise cache for 60s
    const payload = await fetchJson(url, cursor ? 0 : 60) as any;
    
    if (!payload || !payload.category) return null;
    
    const catName = payload.category.name;
    return {
      category: payload.category,
      hero: extractItems(payload.hero).map(i => normalizeNewsItem(i, catName)),
      secondary: extractItems(payload.secondary).map(i => normalizeNewsItem(i, catName)),
      sidebar: extractItems(payload.sidebar).map(i => normalizeNewsItem(i, catName)),
      older: extractItems(payload.older).map(i => normalizeNewsItem(i, catName)),
      pagination: payload.pagination || { cursor: null, hasMore: false }
    };
  } catch (error: any) {
    if (error?.cause?.code !== 'ECONNREFUSED') {
      console.error(`Error fetching category feed for "${slug}":`, error.message || error);
    }
    return null;
  }
}

