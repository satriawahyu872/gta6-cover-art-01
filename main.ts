// Midnight Boulevard — the hand-in program for gta6-cover-art-01.
// Node 22, standard library only. It copies this repository's app/ and
// screenshots/ into the output directory and writes dossier.json with the
// vendored make.fun library, the summary the judge reads.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}

mkdirSync(outDir, { recursive: true });
if (!existsSync(join(repoRoot, 'app'))) throw new Error('app/ is missing from the repository');
copyTree(join(repoRoot, 'app'), join(outDir, 'app'));
if (existsSync(join(repoRoot, 'screenshots'))) {
  copyTree(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'));
}

// The scorer's caps for this competition: the dossier text budget shapes
// the bytes; the other limits refuse an entry the scorer would refuse
// (more than 4 screenshots or one over 256 KiB; more than 993 files in
// app/ or 48 MiB of app files in all, or a path under app/ over 1000
// bytes).
const dossierText = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossierText);
console.log('Midnight Boulevard dossier written to', join(outDir, 'dossier.json'));
