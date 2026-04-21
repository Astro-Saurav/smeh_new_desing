const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://smeh-new-desing.vercel.app');

export type MainSiteNewsItem = {
  id: string;
  headline: string;
  description: string;
  image: string;
  category: string;
  youtubeUrl: string;
  link: string;
  isFeatured: boolean;
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

  const categoryName = resolveCategoryName(
    item.category,
    String(item.category_name || item.categoryName || fallbackCategory)
  );

  return {
    id,
    headline,
    description,
    image: String(item.image || item.image_url || item.imageUrl || '/placeholder.jpg'),
    category: categoryName,
    youtubeUrl: String(item.youtube_url || item.youtubeUrl || ''),
    link: String(item.link || `/article/${id}`),
    isFeatured: !!(item.is_featured || item.isFeatured),
  };
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache' },
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
    const candidate = payload as { items?: unknown; data?: { items?: unknown } };
    if (Array.isArray(candidate.items)) {
      return candidate.items as Record<string, unknown>[];
    }
    if (candidate.data && Array.isArray(candidate.data.items)) {
      return candidate.data.items as Record<string, unknown>[];
    }
  }

  return [];
}

export async function getNewsByCategory(
  categoryName: string,
  limit = 10
): Promise<MainSiteNewsItem[]> {
  const timeBuster = Date.now();
  try {
    const url = `${API_BASE_URL}/api/news?page=1&pageSize=${limit}&status=published&category=${encodeURIComponent(categoryName)}&_t=${timeBuster}`;
    const payload = await fetchJson(url);
    return extractItems(payload).map((item) => normalizeNewsItem(item, categoryName));
  } catch (error) {
    console.error(`Error fetching category "${categoryName}":`, error);
    return [];
  }
}

export async function getAllPublishedNews(limit = 20): Promise<MainSiteNewsItem[]> {
  const timeBuster = Date.now();
  try {
    const payload = await fetchJson(
      `${API_BASE_URL}/api/news?page=1&pageSize=${limit}&status=published&_t=${timeBuster}`
    );
    return extractItems(payload).map((item) => normalizeNewsItem(item, 'General'));
  } catch (error) {
    console.error('Error fetching all news:', error);
    return [];
  }
}

export async function listCategories(): Promise<CategoryItem[]> {
  const timeBuster = Date.now();
  try {
    const payload = await fetchJson(`${API_BASE_URL}/api/categories?_t=${timeBuster}`);
    if (Array.isArray(payload)) {
      return payload.map((c: Record<string, unknown>) => ({
        id: String(c._id || c.id),
        name: String(c.name),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error listing categories:', error);
    return [];
  }
}
