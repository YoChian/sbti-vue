import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const distDir = join(projectRoot, 'dist');
const tempRoot = join(projectRoot, '..', '_tmp');
const deployDir = join(tempRoot, 'sbti-vue-gh-pages');

function run(command, options = {}) {
  execSync(command, {
    cwd: projectRoot,
    stdio: 'inherit',
    ...options,
  });
}

function runInDeployDir(command) {
  execSync(command, {
    cwd: deployDir,
    stdio: 'inherit',
  });
}

function getOriginUrl() {
  return execSync('git remote get-url origin', {
    cwd: projectRoot,
    encoding: 'utf8',
  }).trim();
}

run('node ./scripts/extract-prototype.mjs');
run('npm run build');

if (!existsSync(distDir)) {
  throw new Error('未找到 dist 目录');
}

rmSync(deployDir, { recursive: true, force: true });
mkdirSync(tempRoot, { recursive: true });
mkdirSync(deployDir, { recursive: true });

for (const entry of readdirSync(distDir, { withFileTypes: true })) {
  cpSync(join(distDir, entry.name), join(deployDir, entry.name), { recursive: true });
}

writeFileSync(join(deployDir, '.nojekyll'), '');

const originUrl = getOriginUrl();

runInDeployDir('git init -b gh-pages');
runInDeployDir(`git remote add origin ${originUrl}`);
runInDeployDir('git add -A');
runInDeployDir('git commit -m "Update GitHub Pages site"');
runInDeployDir('git push -f origin gh-pages');
