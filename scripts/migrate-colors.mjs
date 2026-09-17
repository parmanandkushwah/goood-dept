import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../src');
const EXTENSIONS = ['.jsx', '.js', '.css'];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      walk(full, files);
    } else if (entry.isFile() && EXTENSIONS.includes(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const files = walk(SRC);
let totalChanges = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  content = content.replace(/\bgreen-([1-9])\b/g, 'emerald-$1');
  content = content.replace(/\bred-(\d+)\b/g, 'brand-$1');
  content = content.replace(/\bgray-(\d+)\b/g, 'neutral-$1');
  content = content.replace(/\bprimary-(\d+)\b/g, 'brand-$1');
  content = content.replace(/\bblue-(\d+)\b/g, 'sky-$1');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    const changes = [...original.matchAll(/\b(?:red|gray|primary|blue|green)-[1-9]\d*/g)].length;
    totalChanges += changes;
    console.log(`Modified: ${filePath.replace(SRC + '/', '')} (${changes} changes)`);
  }
}

console.log(`\nTotal: ${totalChanges} color references migrated.`);
