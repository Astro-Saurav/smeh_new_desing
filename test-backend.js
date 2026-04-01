/**
 * Mock Backend Server for Testing Frontend Integration
 * Runs on http://localhost:8080
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;

// Mock data storage
const mockData = {
  users: [
    { id: '1', email: 'admin@example.com', role: 'admin', created_at: new Date() },
    { id: '2', email: 'editor@example.com', role: 'editor', created_at: new Date() }
  ],
  categories: [
    { id: 1, name: 'Technology', created_at: new Date() },
    { id: 2, name: 'Sports', created_at: new Date() },
    { id: 3, name: 'Entertainment', created_at: new Date() }
  ],
  news: [
    {
      id: '1',
      title: 'Breaking News: New Feature Released',
      content: '<p>Lorem ipsum dolor sit amet...</p>',
      category_id: 1,
      author_id: '1',
      image_url: 'https://via.placeholder.com/300',
      status: 'published',
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '2',
      title: 'Sports Update: Team Wins Championship',
      content: '<p>Lorem ipsum dolor sit amet...</p>',
      category_id: 2,
      author_id: '2',
      image_url: 'https://via.placeholder.com/300',
      status: 'draft',
      published_at: null,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]
};

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

// Helper: Generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    'local_dev_secret_keep_this_strong_in_production',
    { expiresIn: '12h' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    'local_refresh_secret_keep_this_strong_in_production',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

// Helper: Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'local_dev_secret_keep_this_strong_in_production', (err, user) => {
    if (err) return res.status(401).json({ error: 'Token expired or invalid' });
    req.user = user;
    next();
  });
}

// Helper: Admin check
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// ==================== AUTH ENDPOINTS ====================

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockData.users[0];
  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie('mrt_refresh_token', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
});

app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.cookies.mrt_refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token' });
  }

  jwt.verify(refreshToken, 'local_refresh_secret_keep_this_strong_in_production', (err, user) => {
    if (err) return res.status(401).json({ error: 'Invalid refresh token' });

    const newTokens = generateTokens(user);

    res.cookie('mrt_refresh_token', newTokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken: newTokens.accessToken });
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = mockData.users.find(u => u.id === req.user.id);
  res.json(user);
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('mrt_refresh_token');
  res.json({ message: 'Logged out' });
});

app.post('/api/auth/register', authenticateToken, adminOnly, (req, res) => {
  const { email, password, role } = req.body;
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    role: role || 'editor',
    created_at: new Date()
  };
  mockData.users.push(newUser);
  res.json(newUser);
});

// ==================== NEWS ENDPOINTS ====================

app.get('/api/news', authenticateToken, (req, res) => {
  const { search, category, status, page = 1, limit = 10 } = req.query;

  let filtered = mockData.news;

  if (search) {
    filtered = filtered.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));
  }
  if (category) {
    filtered = filtered.filter(n => n.category_id === parseInt(category));
  }
  if (status) {
    filtered = filtered.filter(n => n.status === status);
  }

  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + parseInt(limit));

  res.json({
    data: paged,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filtered.length
    }
  });
});

app.get('/api/news/:id', authenticateToken, (req, res) => {
  const news = mockData.news.find(n => n.id === req.params.id);
  if (!news) return res.status(404).json({ error: 'Not found' });
  res.json(news);
});

app.post('/api/news', authenticateToken, (req, res) => {
  const { title, content, category_id, image_url, status } = req.body;

  const newNews = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    content,
    category_id,
    author_id: req.user.id,
    image_url: image_url || null,
    status: status || 'draft',
    published_at: status === 'published' ? new Date() : null,
    created_at: new Date(),
    updated_at: new Date()
  };

  mockData.news.push(newNews);
  res.status(201).json(newNews);
});

app.put('/api/news/:id', authenticateToken, (req, res) => {
  const newsIndex = mockData.news.findIndex(n => n.id === req.params.id);
  if (newsIndex === -1) return res.status(404).json({ error: 'Not found' });

  const updates = req.body;
  mockData.news[newsIndex] = {
    ...mockData.news[newsIndex],
    ...updates,
    updated_at: new Date()
  };

  res.json(mockData.news[newsIndex]);
});

app.delete('/api/news/:id', authenticateToken, adminOnly, (req, res) => {
  const newsIndex = mockData.news.findIndex(n => n.id === req.params.id);
  if (newsIndex === -1) return res.status(404).json({ error: 'Not found' });

  mockData.news.splice(newsIndex, 1);
  res.status(204).send();
});

// ==================== CATEGORIES ENDPOINTS ====================

app.get('/api/categories', authenticateToken, (req, res) => {
  res.json(mockData.categories);
});

app.post('/api/categories', authenticateToken, (req, res) => {
  const { name } = req.body;

  const newCategory = {
    id: mockData.categories.length + 1,
    name,
    created_at: new Date()
  };

  mockData.categories.push(newCategory);
  res.status(201).json(newCategory);
});

app.delete('/api/categories/:id', authenticateToken, adminOnly, (req, res) => {
  const catIndex = mockData.categories.findIndex(c => c.id === parseInt(req.params.id));
  if (catIndex === -1) return res.status(404).json({ error: 'Not found' });

  mockData.categories.splice(catIndex, 1);
  res.status(204).send();
});

// ==================== USERS ENDPOINTS ====================

app.get('/api/users', authenticateToken, adminOnly, (req, res) => {
  res.json(mockData.users);
});

app.delete('/api/users/:id', authenticateToken, adminOnly, (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }

  const userIndex = mockData.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) return res.status(404).json({ error: 'Not found' });

  mockData.users.splice(userIndex, 1);
  res.status(204).send();
});

// ==================== ANALYTICS ENDPOINTS ====================

app.get('/api/analytics/overview', authenticateToken, (req, res) => {
  res.json({
    stats: {
      totalNews: mockData.news.length,
      published: mockData.news.filter(n => n.status === 'published').length,
      draft: mockData.news.filter(n => n.status === 'draft').length,
      scheduled: mockData.news.filter(n => n.status === 'scheduled').length
    },
    categories: mockData.categories.map(c => ({
      name: c.name,
      count: mockData.news.filter(n => n.category_id === c.id).length
    })),
    monthlyTrend: [
      { month: 'Jan', count: 5 },
      { month: 'Feb', count: 8 },
      { month: 'Mar', count: 12 },
      { month: 'Apr', count: 10 }
    ]
  });
});

// ==================== UPLOAD ENDPOINTS ====================

app.post('/api/upload', authenticateToken, (req, res) => {
  const imageUrl = `https://via.placeholder.com/300x200?text=UploadedImage`;
  res.json({ url: imageUrl });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`\n✅ Mock Backend Server Running on http://localhost:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`\n🧪 Test Credentials:`);
  console.log(`   Email: admin@example.com`);
  console.log(`   Password: (any value)\n`);
});
