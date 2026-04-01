const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), 'frontend', '.next');
const targetDir = path.join(process.cwd(), '.next');

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Missing Next build output at ${sourceDir}`);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

const manifestPath = path.join(targetDir, 'routes-manifest.json');
if (!fs.existsSync(manifestPath)) {
  throw new Error(`routes-manifest.json was not copied to ${manifestPath}`);
}

console.log('Synced frontend/.next to root .next for Vercel.');
