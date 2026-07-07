const fs = require('fs');

let schema = fs.readFileSync('prisma/schema.prisma', 'utf-8');

// 1. Remove Enums
schema = schema.replace(/enum GridLayout {[\s\S]*?}/, '');
schema = schema.replace(/enum HomepageVisibility {[\s\S]*?}/, '');

// 2. Change Provider
schema = schema.replace(/provider = "postgresql"/, 'provider = "sqlite"\n  url      = env("DATABASE_URL")');

// 3. Remove @db.*
schema = schema.replace(/@db\.\w+(\(.*?\))?/g, '');

// 4. Change dbgenerated("gen_random_uuid()") to uuid()
schema = schema.replace(/dbgenerated\("gen_random_uuid\(\)"\)/g, 'uuid()');

// 5. Change Enum usages
schema = schema.replace(/GridLayout/g, 'String');
schema = schema.replace(/HomepageVisibility/g, 'String');

// 6. Change Json to String
schema = schema.replace(/Json\?/g, 'String?');
schema = schema.replace(/Json/g, 'String');

// 7. Fix indexes that might not be supported in SQLite (e.g. descending order, if not supported)
// SQLite does not support sorts in @@index in some older prisma versions, but recent versions do.
// We'll leave them for now. If prisma format fails, we'll strip them.

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Schema converted to SQLite');
