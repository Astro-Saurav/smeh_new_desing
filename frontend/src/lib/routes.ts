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
  mrPodcast: () => '/category/mr-podcast',
  achievements: () => '/category/achievements',
  announcement: () => '/category/announcement',
  photoGallery: () => '/category/photo-gallery',
  studentsVoices: () => '/category/students-voices',
  entertainmentLifestyle: () => '/category/entertainment-lifestyle',
  currentAffairs: () => '/category/current-affairs',
  sports: () => '/category/sports',

  /** Static pages */
  aboutUs: () => '/about',
  editorialBoard: () => '/about/editorial-board',
  contact: () => '/contact',

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
