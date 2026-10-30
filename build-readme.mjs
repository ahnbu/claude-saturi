// README.md의 「수록 단어」 표를 data.js에서 다시 만든다(손으로 고치지 않는다).
// 표는 <!-- WORDS:START --> 와 <!-- WORDS:END --> 사이만 바꾼다. 사용: node build-readme.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const dir = dirname(fileURLToPath(import.meta.url));
const ctx = {};
vm.runInNewContext(readFileSync(join(dir, 'data.js'), 'utf8') + '\nthis.ENTRIES = ENTRIES;', ctx);
const cell = s => s.replace(/\|/g, '\\|');
const rows = ctx.ENTRIES.map(e => `| **${cell(e.word)}**${e.note ? ` (${e.note})` : ''} | ${cell(e.ex[0][0])} | ${cell(e.ex[0][1])} |`);
const table = ['| 단어 | 클로드 문장 | 사람 말로 바꾸면 |', '|---|---|---|', ...rows].join('\n');

const file = join(dir, 'README.md');
const md = readFileSync(file, 'utf8');
const a = md.indexOf('<!-- WORDS:START -->'), b = md.indexOf('<!-- WORDS:END -->');
if (a < 0 || b < a) { console.error('README.md에 WORDS 표시가 없다'); process.exit(2); }
writeFileSync(file, md.slice(0, a) + `<!-- WORDS:START -->\n${table}\n` + md.slice(b));
console.log(`단어 ${ctx.ENTRIES.length}개로 표를 다시 만들었다`);
