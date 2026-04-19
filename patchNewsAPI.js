const fs = require('fs');

const uiPath = 'frontend/admin-crm/src/pages/NewsPage.jsx';
let uiContent = fs.readFileSync(uiPath, 'utf8');

if (uiContent.includes('file: reader.result')) {
  // Fix Upload Image Request payload matching schema
  uiContent = uiContent.replace(
    'file: reader.result',
    'base64Data: reader.result'
  );

  // Fix categoryId being converted to Number which fails UUID validation
  uiContent = uiContent.replace(
    'categoryId: Number(form.categoryId),',
    'categoryId: String(form.categoryId),'
  );
  
  fs.writeFileSync(uiPath, uiContent);
  console.log('Fixed News API logic.');
} else {
  console.log('Already fixed or not found.');
}
