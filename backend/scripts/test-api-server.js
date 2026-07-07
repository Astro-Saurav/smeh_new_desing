const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;

// Allow CORS from frontend (can be on 5173, 5174, or any localhost port during dev)
app.use(cors({ 
  origin: function(origin, callback) {
    // Allow localhost with any port for development
    if (!origin || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json({ limit: '25mb' }));
app.use(cookieParser());

// Mock data
const mockUser = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'admin@manav.in',
  role: 'admin'
};

// Pre-populate categories matching frontend sections
const mockCategories = [
  { id: 1, name: 'Campus Buzz' },
  { id: 2, name: 'Beyond Campus' },
  { id: 3, name: 'Social Buzz' },
  { id: 4, name: 'Manav Rachna TV' },
  { id: 5, name: 'Podcast' },
  { id: 6, name: 'Blog' },
  { id: 7, name: 'Achievements' },
  { id: 8, name: 'Announcement' },
  { id: 9, name: 'Gallery' },
  { id: 10, name: 'Current Affairs' },
  { id: 11, name: 'Competitions' }
];

const mockNews = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    title: 'Documentary: The Lifeline of a City',
    content: '<p>A short documentary exploring the daily lives of commuters on the city\'s metro.</p>',
    category_id: 4,
    category_name: 'Manav Rachna TV',
    author_id: mockUser.id,
    image_url: 'https://picsum.photos/seed/project1/600/400',
    status: 'published',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    title: 'Interactive Report: The Urban Heat Island Effect',
    content: '<p>An in-depth multimedia article about the rising temperatures in urban centers.</p>',
    category_id: 3,
    category_name: 'Social Buzz',
    author_id: mockUser.id,
    image_url: 'https://picsum.photos/seed/project2/600/400',
    status: 'published',
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440003',
    title: 'Campus Chronicle: The Anniversary Edition',
    content: '<p>A special edition newspaper celebrating 25 years of the university.</p>',
    category_id: 1,
    category_name: 'Campus Buzz',
    author_id: mockUser.id,
    image_url: 'https://picsum.photos/seed/project3/600/400',
    status: 'published',
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440004',
    title: 'Podcast: "Tech Talks" - Technology in Everyday Life',
    content: '<p>An interview with a leading researcher on the future of digital innovation.</p>',
    category_id: 5,
    category_name: 'Podcast',
    author_id: mockUser.id,
    image_url: 'https://picsum.photos/seed/project4/600/400',
    status: 'published',
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440005',
    title: 'Blog Post: Student Achievement Highlights',
    content: '<p>Celebrating the remarkable achievements of our students this semester.</p>',
    category_id: 6,
    category_name: 'Blog',
    author_id: mockUser.id,
    image_url: 'https://picsum.photos/seed/project5/600/400',
    status: 'published',
    published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  }
];

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.cookie('mrt_refresh_token', 'mock-refresh-token', { httpOnly: true, secure: false, sameSite: 'lax' });
    return res.json({
      token: 'mock-access-token-123',
      user: mockUser
    });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/auth/refresh', (req, res) => {
  res.cookie('mrt_refresh_token', 'mock-refresh-token', { httpOnly: true, secure: false, sameSite: 'lax' });
  res.json({ token: 'mock-access-token-123' });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('mrt_refresh_token');
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  res.json(mockUser);
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, role } = req.body;
  if (email && password && role) {
    return res.json({
      id: require('crypto').randomUUID(),
      email,
      role
    });
  }
  res.status(400).json({ error: 'Missing fields' });
});

// News routes
app.get('/api/news', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const search = req.query.search?.toLowerCase() || '';
  const status = req.query.status || '';
  const category = req.query.category || '';

  // Filter news
  let filtered = mockNews.filter(item => {
    const matchesSearch = !search || item.title.toLowerCase().includes(search);
    const matchesStatus = !status || item.status === status;
    const matchesCategory = !category || item.category_name === category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Always show newest entries first so new stories appear at the top.
  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at || a.published_at || 0).getTime();
    const dateB = new Date(b.updated_at || b.created_at || b.published_at || 0).getTime();
    return dateB - dateA;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  res.json({
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages
    }
  });
});

// New endpoint for fetching category-specific news (for main site sections)
app.get('/api/news/category/:categoryName', (req, res) => {
  const categoryName = req.params.categoryName;
  const limit = parseInt(req.query.limit) || 10;

  // Filter published news by category
  const items = mockNews
    .filter(item => item.category_name === categoryName && item.status === 'published')
    .sort((a, b) => {
      const dateA = new Date(a.published_at || a.updated_at || a.created_at || 0).getTime();
      const dateB = new Date(b.published_at || b.updated_at || b.created_at || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, limit)
    .map(item => ({
      id: item.id,
      headline: item.title,
      description: item.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      image: item.image_url,
      category: item.category_name,
      link: `/explore/${item.category_name.toLowerCase().replace(/\s+/g, '-')}`
    }));

  res.json(items);
});

app.post('/api/news', (req, res) => {
  // Accept both camelCase (from frontend) and snake_case (from backend)
  const title = req.body.title;
  const content = req.body.content;
  const category_id = req.body.category_id || req.body.categoryId;
  const status = req.body.status || 'draft';
  const image_url = req.body.image_url || req.body.imageUrl;
  const youtube_url = req.body.youtube_url || req.body.youtubeUrl;
  const published_at = req.body.published_at || req.body.publishedAt;

  // Validate required fields
  if (!title || !content || !category_id) {
    return res.status(400).json({ 
      error: 'Missing required fields: title, content, category_id' 
    });
  }

  // Find category name
  const category = mockCategories.find(c => c.id === parseInt(category_id));
  const newArticle = {
    id: require('crypto').randomUUID(),
    title,
    content,
    category_id: parseInt(category_id),
    category_name: category?.name || 'Unknown',
    author_id: mockUser.id,
    image_url: image_url || 'https://picsum.photos/seed/news/600/400',
    youtube_url: youtube_url || null,
    status,
    published_at: status === 'published' || published_at ? (published_at || new Date().toISOString()) : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockNews.push(newArticle);
  return res.status(201).json(newArticle);
});

app.put('/api/news/:id', (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const status = req.body.status;
  const category_id = req.body.category_id || req.body.categoryId;
  const image_url = req.body.image_url || req.body.imageUrl;
  const youtube_url = req.body.youtube_url || req.body.youtubeUrl;
  const published_at = req.body.published_at || req.body.publishedAt;

  const article = mockNews.find(a => a.id === req.params.id);
  if (article) {
    if (title) article.title = title;
    if (content) article.content = content;
    if (status) {
      article.status = status;
      if (status === 'published' && !article.published_at) {
        article.published_at = new Date().toISOString();
      }
    }
    if (image_url) article.image_url = image_url;
    if (youtube_url !== undefined) article.youtube_url = youtube_url;
    if (published_at) article.published_at = published_at;
    if (category_id) {
      article.category_id = parseInt(category_id);
      const category = mockCategories.find(c => c.id === parseInt(category_id));
      article.category_name = category?.name || 'Unknown';
    }
    article.updated_at = new Date().toISOString();
    return res.json(article);
  }
  res.status(404).json({ error: 'News not found' });
});

app.get('/api/news/:id', (req, res) => {
  const news = mockNews.find(n => n.id === req.params.id);
  if (!news) return res.status(404).json({ error: 'Not found' });
  res.json(news);
});

app.get('/api/news/slug/:slug', (req, res) => {
  const news = mockNews.find(n => n.id === req.params.slug || n.slug === req.params.slug);
  if (!news) return res.status(404).json({ error: 'Not found' });
  res.json(news);
});

app.delete('/api/news/:id', (req, res) => {
  const index = mockNews.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    mockNews.splice(index, 1);
    return res.status(204).send();
  }
  res.status(404).json({ error: 'News not found' });
});

// Categories routes
app.get('/api/categories', (req, res) => {
  res.json(mockCategories);
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (name) {
    const newCat = {
      id: Math.max(...mockCategories.map(c => c.id), 0) + 1,
      name
    };
    mockCategories.push(newCat);
    return res.status(201).json(newCat);
  }
  res.status(400).json({ error: 'Missing name' });
});

app.delete('/api/categories/:id', (req, res) => {
  const index = mockCategories.findIndex(c => c.id === parseInt(req.params.id));
  if (index !== -1) {
    mockCategories.splice(index, 1);
    return res.status(204).send();
  }
  res.status(404).json({ error: 'Category not found' });
});

// Users routes
app.get('/api/users', (req, res) => {
  res.json([mockUser]);
});

app.post('/api/users', (req, res) => {
  const { email, password, role } = req.body;
  if (email && password && role) {
    return res.status(201).json({
      id: require('crypto').randomUUID(),
      email,
      role
    });
  }
  res.status(400).json({ error: 'Missing fields' });
});

app.delete('/api/users/:id', (req, res) => {
  if (req.params.id !== mockUser.id) {
    return res.status(204).send();
  }
  res.status(409).json({ error: 'Cannot delete user with news' });
});

// Media/Upload routes
app.post('/api/upload', (req, res) => {
  const { file } = req.body;
  if (file) {
    return res.json({
      url: 'https://mockblobstorage.blob.core.windows.net/news-media/sample-image.jpg',
      filename: 'sample-image.jpg'
    });
  }
  res.status(400).json({ error: 'No file provided' });
});

// Analytics routes
app.get('/api/analytics/overview', (req, res) => {
  res.json({
    totals: {
      totalNews: 15,
      published: 10,
      draft: 4,
      scheduled: 1
    },
    categoryCounts: [
      { name: 'Technology', count: 6 },
      { name: 'Sports', count: 5 },
      { name: 'News', count: 4 }
    ],
    monthlyTrend: [
      { month: 'Jan', count: 5 },
      { month: 'Feb', count: 8 },
      { month: 'Mar', count: 12 }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`✅ Mock API Server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:5173`);
  console.log('\nEndpoints available:');
  console.log('  POST   /api/auth/login');
  console.log('  POST   /api/auth/register');
  console.log('  POST   /api/auth/refresh');
  console.log('  POST   /api/auth/logout');
  console.log('  GET    /api/auth/me');
  console.log('  GET    /api/news');
  console.log('  POST   /api/news');
  console.log('  PUT    /api/news/:id');
  console.log('  DELETE /api/news/:id');
  console.log('  GET    /api/categories');
  console.log('  POST   /api/categories');
  console.log('  DELETE /api/categories/:id');
  console.log('  GET    /api/users');
  console.log('  POST   /api/users');
  console.log('  DELETE /api/users/:id');
  console.log('  POST   /api/upload');
  console.log('  GET    /api/analytics/overview');
});
