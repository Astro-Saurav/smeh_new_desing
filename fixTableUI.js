const fs = require('fs');

const uiPath = 'frontend/admin-crm/src/pages/NewsPage.jsx';
let uiContent = fs.readFileSync(uiPath, 'utf8');

uiContent = uiContent.replace(/item\.category_name/g, "(item.category?.name || 'Uncategorized')");
uiContent = uiContent.replace(/item\.category_id/g, "(item.category?._id || '')");
uiContent = uiContent.replace(/pendingDelete\.id\)/g, "(pendingDelete._id || pendingDelete.id))");
uiContent = uiContent.replace(/key=\{item\.id\}/g, "key={item._id || item.id}");
uiContent = uiContent.replace(/item\.id !== id/g, "(item._id || item.id) !== id");
uiContent = uiContent.replace(/startEdit\(item\)/g, "startEdit(item)");
uiContent = uiContent.replace(/setEditingId\(item.id\)/g, "setEditingId(item._id || item.id)");

fs.writeFileSync(uiPath, uiContent);
console.log('Fixed News table variable binding');
