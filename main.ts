// NusaBudget — Anggaran Rumah Tangga Indonesia. Program penyerahan (Node 22, stdlib saja).
//
// Situsnya file statis di bawah app/ (index.html, CSS, modul ES, tanpa build,
// tanpa network). Program ini menyerahkannya: menyalin app/ dan screenshots/
// dari sebelah file ini ke /output lalu menulis /output/dossier.json — ringkasan
// yang dibaca juri (screenshot, pemuatan pertama, garis besar sumber) — dengan
// pustaka make.fun yang divendor, yang harus tetap tidak berubah supaya dossier
// sama persis dengan yang ditulis pustaka itu.
//
// Di luar grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas dari kompetisi (RULES.txt): text_max_bytes membentuk teks dossier;
// sisanya menolak entri yang akan ditolak scorer — lebih dari 4 screenshot,
// satu di atas 256 KiB, atau app/ di atas 993 entri / 16 MiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
