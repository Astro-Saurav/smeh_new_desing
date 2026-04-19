const fs = require('fs');

const apiPath = 'frontend/src/lib/newsApi.ts';
let apiContent = fs.readFileSync(apiPath, 'utf8');

apiContent = apiContent.replace(
  /const preferredUrl = `\$\{API_BASE_URL\}\/api\/news\/category\/[^\n]+;/g,
  ""
).replace(
  /try \{\s+const directPayload = await fetchJson\(preferredUrl\);\s+const directItems = extractItems\(directPayload\);\s+if \(directItems\.length\) \{\s+return directItems\.map\(\(item\) \=\> normalizeNewsItem\(item, categoryName\)\);\s+\}\s+\} catch \{\s+\/\/ Fallback below handles backends that do not support[^\n]+\s+\}/g,
  ""
);

fs.writeFileSync(apiPath, apiContent);
console.log('Cleaned up newsApi.ts to only use correct query parameters.');
