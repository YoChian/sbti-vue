import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const prototypePath = join(projectRoot, 'prototype', 'SBTI 人格测试.html');
const publicDir = join(projectRoot, 'public');
const imageOutputDir = join(publicDir, 'type-images');

mkdirSync(publicDir, { recursive: true });
mkdirSync(imageOutputDir, { recursive: true });

const html = readFileSync(prototypePath, 'utf8');

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

function getImageExtension(mimeType) {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/gif') return 'gif';
  if (mimeType === 'image/svg+xml') return 'svg';
  return 'bin';
}

function extractTypeImages(typeImages) {
  const imagePathMap = {};

  Object.entries(typeImages).forEach(([code, imageValue]) => {
    if (!imageValue || typeof imageValue !== 'string') {
      return;
    }

    const dataUriMatch = imageValue.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

    if (!dataUriMatch) {
      imagePathMap[code] = imageValue;
      return;
    }

    const [, mimeType, base64Data] = dataUriMatch;
    const extension = getImageExtension(mimeType);
    const fileName = `${code}.${extension}`;
    const filePath = join(imageOutputDir, fileName);

    writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    imagePathMap[code] = `type-images/${fileName}`;
  });

  return imagePathMap;
}

const extractedImagePaths = extractTypeImages(extracted.TYPE_IMAGES);

const questionData = {
  dimensionMeta: extracted.dimensionMeta,
  questions: extracted.questions,
  specialQuestions: extracted.specialQuestions,
  DRUNK_TRIGGER_QUESTION_ID: extracted.DRUNK_TRIGGER_QUESTION_ID,
};

const resultData = {
  TYPE_LIBRARY: extracted.TYPE_LIBRARY,
  TYPE_IMAGES: extractedImagePaths,
  NORMAL_TYPES: extracted.NORMAL_TYPES,
  DIM_EXPLANATIONS: extracted.DIM_EXPLANATIONS,
  dimensionOrder: extracted.dimensionOrder,
};

writeFileSync(join(publicDir, 'question-data.json'), JSON.stringify(questionData), 'utf8');
writeFileSync(join(publicDir, 'result-data.json'), JSON.stringify(resultData), 'utf8');
rmSync(join(publicDir, 'prototype-data.json'), { force: true });

console.log('Prototype data extracted successfully.');
