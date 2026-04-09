import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const prototypePath = join(projectRoot, 'prototype', 'SBTI 人格测试.html');
const outputDir = join(projectRoot, 'src', 'generated');
const publicDir = join(projectRoot, 'public');

mkdirSync(outputDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });

const html = readFileSync(prototypePath, 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
if (!styleMatch) {
  throw new Error('未找到原型中的 <style> 块。');
}

const scriptBlocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
const inlineScript = scriptBlocks.at(-1)?.[1];
if (!inlineScript) {
  throw new Error('未找到原型中的内联 <script> 块。');
}

const constantsCutoff = inlineScript.indexOf('const app =');
if (constantsCutoff === -1) {
  throw new Error('未找到原型中的常量定义区域。');
}

const constantsSource = inlineScript.slice(0, constantsCutoff);
const sandbox = {};

vm.runInNewContext(
  `
${constantsSource}
globalThis.__EXTRACTED__ = {
  dimensionMeta,
  questions,
  specialQuestions,
  TYPE_LIBRARY,
  TYPE_IMAGES,
  NORMAL_TYPES,
  DIM_EXPLANATIONS,
  dimensionOrder,
  DRUNK_TRIGGER_QUESTION_ID
};
`,
  sandbox,
  { timeout: 5000 }
);

const extracted = sandbox.__EXTRACTED__;
if (!extracted) {
  throw new Error('原型数据提取失败。');
}

writeFileSync(join(outputDir, 'prototype.css'), styleMatch[1].trim(), 'utf8');
writeFileSync(join(publicDir, 'prototype-data.json'), JSON.stringify(extracted), 'utf8');

console.log('Prototype data extracted successfully.');
