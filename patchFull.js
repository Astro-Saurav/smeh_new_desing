const fs = require('fs');
const path = require('path');

// 1. ADD YOUTUBE_URL TO MODEL
const modelFile = path.join('backend', 'src', 'models', 'News.js');
let modelContent = fs.readFileSync(modelFile, 'utf8');
if (!modelContent.includes('youtube_url')) {
  modelContent = modelContent.replace(
    /image_url: \{([^}]+)\},/s,
    "image_url: {$1},\n  youtube_url: {\n    type: String,\n    default: null\n  },"
  );
  fs.writeFileSync(modelFile, modelContent);
  console.log('Patched News.js');
}

// 2. ADD YOUTUBE_URL TO SCHEMAS
const schemaFile = path.join('backend', 'src', 'validators', 'newsSchemas.js');
let schemaContent = fs.readFileSync(schemaFile, 'utf8');
if (!schemaContent.includes('youtubeUrl:')) {
  schemaContent = schemaContent.replace(
    /imageUrl: z\.string\(\)\.url\(\)\.optional\(\)\.nullable\(\),/g,
    "imageUrl: z.string().url().optional().nullable(),\n    youtubeUrl: z.string().url().optional().nullable(),"
  );
  fs.writeFileSync(schemaFile, schemaContent);
  console.log('Patched newsSchemas.js');
}

// 3. PASS YOUTUBE_URL THROUGH CONTROLLER
const controllerFile = path.join('backend', 'src', 'controllers', 'newsController.js');
let controllerContent = fs.readFileSync(controllerFile, 'utf8');
if (!controllerContent.includes('youtubeUrl: payload.youtubeUrl')) {
  controllerContent = controllerContent.replace(
    /imageUrl: payload\.imageUrl,/g,
    "imageUrl: payload.imageUrl,\n    youtubeUrl: payload.youtubeUrl,"
  );
  fs.writeFileSync(controllerFile, controllerContent);
  console.log('Patched newsController.js');
}

// 4. SAVE YOUTUBE_URL IN SERVICE
const serviceFile = path.join('backend', 'src', 'services', 'newsService.js');
let serviceContent = fs.readFileSync(serviceFile, 'utf8');
if (!serviceContent.includes('youtubeUrl,')) {
  serviceContent = serviceContent.replace(
    /async function createNews \(\{ title, content, categoryId, authorId, imageUrl, status, publishedAt \}\) \{/,
    "async function createNews ({ title, content, categoryId, authorId, imageUrl, youtubeUrl, status, publishedAt }) {"
  ).replace(
    /image_url: imageUrl \|\| null,/,
    "image_url: imageUrl || null,\n    youtube_url: youtubeUrl || null,"
  ).replace(
    /if \(payload\.imageUrl \!== undefined\) news\.image_url \= payload\.imageUrl/,
    "if (payload.imageUrl !== undefined) news.image_url = payload.imageUrl\n  if (payload.youtubeUrl !== undefined) news.youtube_url = payload.youtubeUrl"
  );
  fs.writeFileSync(serviceFile, serviceContent);
  console.log('Patched newsService.js');
}

// 5. FIX DROPDOWN AND MAPPING IN UI
const uiFile = path.join('frontend', 'admin-crm', 'src', 'pages', 'NewsPage.jsx');
let uiContent = fs.readFileSync(uiFile, 'utf8');
uiContent = uiContent.replace(
  /\<option key=\{item\._id \|\| item\.id\} value=\{item\.id\}\>/g,
  "<option key={item._id || item.id} value={item._id || item.id}>"
);
fs.writeFileSync(uiFile, uiContent);
console.log('Patched NewsPage.jsx');
