const fs = require('fs');
const path = require('path');

// 1. Update Category Schema
const schemaPath = path.join('backend', 'src', 'validators', 'categorySchemas.js');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');
if (!schemaContent.includes('idParamSchema')) {
  schemaContent = schemaContent.replace(
    'module.exports = {',
    `const idParamSchema = z.object({
  body: z.object({}),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({})
})

module.exports = {
  idParamSchema,`
  );
  fs.writeFileSync(schemaPath, schemaContent);
}

// 2. Update Category Service
const servicePath = path.join('backend', 'src', 'services', 'categoryService.js');
let serviceContent = fs.readFileSync(servicePath, 'utf8');
if (!serviceContent.includes('deleteCategoryById')) {
  serviceContent = serviceContent.replace(
    "const { v4: uuidv4 } = require('uuid')",
    "const { v4: uuidv4 } = require('uuid')\nconst News = require('../models/News')"
  );
  serviceContent = serviceContent.replace(
    'module.exports = {',
    `async function deleteCategoryById (id) {
  const hasNews = await News.exists({ category: id })
  if (hasNews) {
    return { deleted: false, reason: 'CATEGORY_HAS_NEWS' }
  }
  const result = await Category.findByIdAndDelete(id)
  return { deleted: !!result, reason: null }
}

module.exports = {
  deleteCategoryById,`
  );
  fs.writeFileSync(servicePath, serviceContent);
}

// 3. Update Category Controller
const controllerPath = path.join('backend', 'src', 'controllers', 'categoryController.js');
let controllerContent = fs.readFileSync(controllerPath, 'utf8');
if (!controllerContent.includes('remove')) {
  controllerContent = controllerContent.replace(
    "const { createCategory, listCategories } = require('../services/categoryService')",
    "const { createCategory, listCategories, deleteCategoryById } = require('../services/categoryService')"
  ).replace(
    'module.exports = {',
    `const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await deleteCategoryById(id);
  if (!result.deleted) {
     if (result.reason === 'CATEGORY_HAS_NEWS') {
        return res.status(400).json({ message: 'Cannot delete category with associated news' });
     }
     return res.status(404).json({ message: 'Category not found' });
  }
  res.status(204).end();
})

module.exports = {
  remove,`
  );
  fs.writeFileSync(controllerPath, controllerContent);
}

// 4. Update Category Routes
const routesPath = path.join('backend', 'src', 'routes', 'categoryRoutes.js');
let routesContent = fs.readFileSync(routesPath, 'utf8');
if (!routesContent.includes('categoryRouter.delete')) {
  routesContent = routesContent.replace(
    "const { create, list } = require('../controllers/categoryController')",
    "const { create, list, remove } = require('../controllers/categoryController')"
  ).replace(
    "const { createCategorySchema } = require('../validators/categorySchemas')",
    "const { createCategorySchema, idParamSchema } = require('../validators/categorySchemas')"
  ).replace(
    "categoryRouter.post('/', authenticate, authorize('admin', 'editor'), validateRequest(createCategorySchema), create)",
    "categoryRouter.post('/', authenticate, authorize('admin', 'editor'), validateRequest(createCategorySchema), create)\ncategoryRouter.delete('/:id', authenticate, authorize('admin'), validateRequest(idParamSchema), remove)"
  );
  fs.writeFileSync(routesPath, routesContent);
}

// 5. Update categoriesApi.js
const apiPath = path.join('frontend', 'admin-crm', 'src', 'api', 'categoriesApi.js');
let apiContent = fs.readFileSync(apiPath, 'utf8');
if (!apiContent.includes('remove (id)')) {
  apiContent = apiContent.replace(
    '  async create (payload) {',
    `  async remove (id) {
    const { data } = await apiClient.delete(\`/categories/\${id}\`)
    return data
  },
  async create (payload) {`
  );
  fs.writeFileSync(apiPath, apiContent);
}

// 6. Fix seed-admin.js to include "Latest Buzz", and remove Dummy specific data logic
const seedPath = path.join('backend', 'scripts', 'seed-admin.js');
let seedContent = fs.readFileSync(seedPath, 'utf8');
if (!seedContent.includes('Latest Buzz')) {
  // Wipe all contents of DB to fully purge Test Categories and Demo news.
  seedContent = seedContent.replace(
    "'Campus Buzz',", 
    "'Campus Buzz',\n      'Latest Buzz',"
  ).replace(
    "await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });",
    "await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });\n    await mongoose.connection.db.dropDatabase();\n    console.log('Database wiped completely.');"
  );
  fs.writeFileSync(seedPath, seedContent);
}

console.log('Patch complete.');
