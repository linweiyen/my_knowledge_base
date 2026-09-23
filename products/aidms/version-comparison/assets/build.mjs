import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const base = dirname(dirname(fileURLToPath(import.meta.url)));
const source = readFileSync(join(base, 'research.md'), 'utf8').replace(/\r\n/g, '\n');
const metadata = Object.fromEntries([...source.matchAll(/^(title|updated):\s*(.+)$/gm)].map(([, key, value]) => [key, value]));
const lines = source.replace(/^---\n[\s\S]*?\n---\n/, '').trim().split('\n');
const escapeHtml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = value => escapeHtml(value)
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `<a href="${href}"${href.startsWith('https://') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>');

const out = [];
let i = 0;
let section = 0;
while (i < lines.length) {
  const line = lines[i].trim();
  if (!line) { i++; continue; }
  if (/^# /.test(line)) { i++; continue; }
  if (/^## /.test(line)) {
    const title = line.slice(3);
    if (section) out.push('</section>');
    const id = `section-${++section}`;
    out.push(`<section id="${id}"><h2>${inline(title)}</h2>`);
    i++;
    while (i < lines.length && !lines[i].trim()) i++;
    continue;
  }
  if (/^### /.test(line)) { out.push(`<h3>${inline(line.slice(4))}</h3>`); i++; continue; }
  if (/^> /.test(line)) {
    const body = [];
    while (i < lines.length && /^> /.test(lines[i])) body.push(lines[i++].slice(2));
    out.push(`<aside class="note">${body.map(v => `<p>${inline(v)}</p>`).join('')}</aside>`);
    continue;
  }
  if (/^\|/.test(line)) {
    const rows = [];
    while (i < lines.length && /^\|/.test(lines[i].trim())) rows.push(lines[i++].trim().slice(1, -1).split('|').map(v => v.trim()));
    const header = rows.shift();
    rows.shift();
    out.push(`<div class="table-wrap"><table><thead><tr>${header.map(v => `<th scope="col">${inline(v)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(v => `<td>${inline(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
    continue;
  }
  if (/^(?:- |\d+\. )/.test(line)) {
    const ordered = /^\d+\. /.test(line);
    const items = [];
    while (i < lines.length && (ordered ? /^\d+\. /.test(lines[i]) : /^- /.test(lines[i]))) items.push(lines[i++].replace(ordered ? /^\d+\. / : /^- /, ''));
    const tag = ordered ? 'ol' : 'ul';
    out.push(`<${tag}>${items.map(v => `<li>${inline(v)}</li>`).join('')}</${tag}>`);
    continue;
  }
  const paragraph = [];
  while (i < lines.length && lines[i].trim() && !/^(?:#{1,3} |\| |> |- |\d+\. )/.test(lines[i].trim())) paragraph.push(lines[i++].trim());
  if (paragraph.length) out.push(`<p>${inline(paragraph.join(' '))}</p>`);
}
if (section) out.push('</section>');

const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="AIDMS 1.0 與 2.0 功能比較表。">
<title>${escapeHtml(metadata.title)}</title>
<style>
:root{color-scheme:light;--ink:#152b38;--muted:#526b77;--line:#dbe6e9;--accent:#087e83;--pale:#eaf7f6;--paper:#fff;--bg:#f3f7f8}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.78 system-ui,-apple-system,"Noto Sans TC","Microsoft JhengHei",sans-serif}
a{color:#076b74;text-underline-offset:3px}a:hover{color:#044b52}a:focus-visible{outline:3px solid #e9a436;outline-offset:3px}
.hero{background:linear-gradient(135deg,#103c4b,#087e83);color:white;padding:64px max(24px,calc((100vw - 1160px)/2)) 58px}
.eyebrow{font-size:13px;letter-spacing:.16em;text-transform:uppercase;font-weight:800;color:#aee7e3;margin:0 0 12px}.hero h1{font-size:clamp(34px,5vw,60px);line-height:1.16;letter-spacing:-.035em;margin:0 0 20px}.hero p{max-width:790px;margin:0;color:#e0f3f2;font-size:18px;line-height:1.7}.meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.meta span{font-size:12px;font-weight:700;border:1px solid #8acac8;border-radius:99px;padding:4px 10px;color:#e5f8f7}
.layout{max-width:1280px;margin:0 auto;padding:30px 24px 80px}
main{min-width:0;padding:12px 28px 40px;background:var(--paper);border:1px solid var(--line);border-radius:16px;box-shadow:0 14px 35px #113e4b0b}section{scroll-margin-top:24px}h2{font-size:clamp(23px,2.7vw,31px);line-height:1.3;margin:48px 0 17px;padding-bottom:11px;border-bottom:2px solid var(--line)}h3{font-size:20px;line-height:1.4;margin:30px 0 10px}p{margin:12px 0}strong{font-weight:760}.note{margin:20px 0;padding:14px 19px;border-left:4px solid var(--accent);border-radius:0 9px 9px 0;background:var(--pale)}.note p{margin:0}.table-wrap{overflow-x:auto;margin:20px 0 28px;border:1px solid var(--line);border-radius:12px}table{border-collapse:collapse;table-layout:fixed;width:100%;min-width:920px;font-size:14px;line-height:1.62}th{background:#eaf3f4;color:#174855;text-align:left;font-weight:800}th,td{padding:13px 15px;vertical-align:top;border-bottom:1px solid var(--line)}th:nth-child(1),td:nth-child(1){width:27.27%;white-space:nowrap}th:nth-child(2),td:nth-child(2){width:36.36%}th:nth-child(3),td:nth-child(3){width:36.37%}tr:last-child td{border-bottom:0}tbody tr:nth-child(even){background:#f8fbfb}td:first-child{font-weight:700}ul,ol{padding-left:25px}li{margin:8px 0}code{padding:1px 5px;background:#eef3f4;border-radius:4px;font-size:.9em}.footer{margin-top:30px;padding-top:20px;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}
@media(max-width:1050px){.layout{padding:16px 12px 50px}main{padding:8px 20px 30px}.hero{padding:43px 24px}}
@media print{@page{size:A4 landscape;margin:12mm}body{background:white}.hero{color:var(--ink);background:white;padding:0 0 14px}.hero p,.eyebrow,.meta span{color:var(--ink)}.layout{padding:0}main{border:0;box-shadow:none;padding:0}.table-wrap{overflow:visible}table{min-width:0;font-size:11px}th,td{padding:6px}a{color:inherit}}
</style>
</head>
<body>
<header class="hero"><p class="eyebrow">AIDMS · VERSION COMPARISON</p><h1>${escapeHtml(metadata.title)}</h1><p>產品功能與系統架構對照</p><div class="meta"><span>資料整理：${escapeHtml(metadata.updated.replace(/-/g, '/'))}</span></div></header>
<div class="layout"><main>${out.join('\n')}</main></div>
</body>
</html>`;
writeFileSync(join(base, 'index.html'), html, 'utf8');
