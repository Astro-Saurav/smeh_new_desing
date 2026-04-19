const fs = require('fs');
const path = require('path');

// 1. FREE THE NEWS ROUTE
const newsRoutesPath = path.join('backend', 'src', 'routes', 'newsRoutes.js');
let newsRoutesContent = fs.readFileSync(newsRoutesPath, 'utf8');

newsRoutesContent = newsRoutesContent.replace(
  "newsRouter.get('/', authenticate, validateRequest(listNewsSchema), list)",
  "newsRouter.get('/', validateRequest(listNewsSchema), list)"
).replace(
  "newsRouter.get('/:id', authenticate, validateRequest(idParamSchema), getById)",
  "newsRouter.get('/:id', validateRequest(idParamSchema), getById)"
);
fs.writeFileSync(newsRoutesPath, newsRoutesContent);
console.log('Freed newsRoutes.js');

// 2. FREE THE CATEGORY ROUTE
const categoryRoutesPath = path.join('backend', 'src', 'routes', 'categoryRoutes.js');
let categoryRoutesContent = fs.readFileSync(categoryRoutesPath, 'utf8');

categoryRoutesContent = categoryRoutesContent.replace(
  "categoryRouter.get('/', authenticate, list)",
  "categoryRouter.get('/', list)"
);
fs.writeFileSync(categoryRoutesPath, categoryRoutesContent);
console.log('Freed categoryRoutes.js');
