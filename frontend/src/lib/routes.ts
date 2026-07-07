/**
 * Centralized route helpers.
 * Use these everywhere instead of hardcoding paths.
 * Future route changes only need updating here.
 */

export const routes = {
  home: () => '/',

  /** Public article page by slug */
  article: (slug: string) => `/article/${slug}`,

  /** Category listing page by slug */
  category: (slug: string) => `/category/${slug}`,

  /** Campus Buzz section */
  campusBuzz: () => '/category/campus-buzz',
  beyondCampus: () => '/category/beyond-campus',
  socialBuzz: () => '/category/social-buzz',
  manavRachnaTV: () => '/category/mr-tv',
  podcast: () => '/category/podcast',
  blog: () => '/category/blog',
  achievements: () => '/category/achievements',
  announcement: () => '/category/announcement',
  gallery: () => '/category/gallery',

  /** Admin routes */
  admin: {
    dashboard: () => '/admin/dashboard',
    news: () => '/admin/news',
    newsCreate: () => '/admin/news/create',
    newsEdit: (id: string) => `/admin/news/edit/${id}`,
    categories: () => '/admin/categories',
    grids: () => '/admin/grids',
    settings: () => '/admin/settings',
    users: () => '/admin/users',
  },

  login: () => '/login',
}
