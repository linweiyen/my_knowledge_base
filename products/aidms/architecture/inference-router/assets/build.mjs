// Rebuild the standalone reading page from research.md using only Node.js.
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const source = readFileSync(new URL('research.md', root), 'utf8');
const text = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const inline = s => esc(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>').replace(/`([^`]+)`/g, '<code>$1</code>');
const lines = text.trim().split(/\r?\n/), out = [], toc = [];
let i = 0, section = 0;
while (i < lines.length) {
  const line = lines[i];
  if (!line.trim()) { i++; continue; }
  if (line.startsWith('```')) {
    const code = []; i++;
    while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
    i++; out.push('<pre>' + esc(code.join('\n')) + '</pre>'); continue;
  }
  if (line.startsWith('# ')) { out.push('<h1>' + inline(line.slice(2)) + '</h1>'); i++; continue; }
  if (line.startsWith('## ')) {
    const id = 'section-' + (++section), title = line.slice(3);
    toc.push(`<a href="#${id}">${inline(title)}</a>`);
    out.push(`<h2 id="${id}">${inline(title)}</h2>`); i++; continue;
  }
  if (line.startsWith('|')) {
    const rows = [];
    while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
    const cells = row => row.split('|').slice(1, -1).map(x => x.trim());
    out.push('<div class="table-wrap"><table><thead><tr>' + cells(rows[0]).map(x => '<th scope="col">' + inline(x) + '</th>').join('') + '</tr></thead><tbody>' + rows.slice(2).map(row => '<tr>' + cells(row).map(x => '<td>' + inline(x) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>'); continue;
  }
  if (/^(- |\d+\. )/.test(line)) {
    const ordered = /^\d/.test(line), tag = ordered ? 'ol' : 'ul', items = [];
    while (i < lines.length && (ordered ? /^\d+\. / : /^- /).test(lines[i])) items.push('<li>' + inline(lines[i++].replace(/^(- |\d+\. )/, '')) + '</li>');
    out.push('<' + tag + '>' + items.join('') + '</' + tag + '>'); continue;
  }
  if (line.startsWith('> ')) { out.push('<aside class="note">' + inline(line.slice(2)) + '</aside>'); i++; continue; }
  out.push('<p>' + inline(line) + '</p>'); i++;
}
const html = `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="AIDMS 推論路由器的功能與操作流程：加入既有 LLM Job、批次建立 Job，以及設定自動擴縮。">
<title>AIDMS 推論路由器｜功能與操作流程</title>
<style>
:root{color-scheme:light;--ink:#182b3b;--muted:#526576;--line:#dbe4eb;--accent:#087c83}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:24px}body{margin:0;background:#f3f6f9;color:var(--ink);font:17px/1.85 "Segoe UI","Microsoft JhengHei",sans-serif}a{color:#086b91;text-underline-offset:4px}a:focus-visible{outline:3px solid #087c83;outline-offset:4px}header{background:#102b3d;color:#fff;padding:36px max(24px,calc((100vw - 1220px)/2))}header p{margin:0}.eyebrow{font-size:13px;letter-spacing:.18em;color:#7be0d4}.meta{font-size:14px;color:#c3d3df;margin-top:10px}header a{color:#a5eee5}.layout{display:grid;grid-template-columns:235px minmax(0,1fr);gap:36px;max-width:1268px;margin:36px auto;padding:0 24px}nav{position:sticky;top:24px;align-self:start;font-size:14px}nav strong{display:block;margin-bottom:12px}nav a{display:block;text-decoration:none;padding:7px 0;color:var(--muted);border-bottom:1px solid var(--line)}nav a:hover{color:var(--accent)}main{background:white;border:1px solid var(--line);border-radius:12px;padding:38px 44px;min-width:0}h1{font-size:38px;line-height:1.35;letter-spacing:-.03em;margin:0 0 20px}h1+p{font-size:21px;color:#315569;border-left:4px solid var(--accent);padding-left:20px}h2{font-size:25px;line-height:1.5;margin:44px 0 18px;padding-top:22px;border-top:1px solid var(--line)}p{margin:16px 0}li{margin:8px 0}ul,ol{padding-left:26px}.note{padding:17px 20px;background:#fff6e6;border-left:4px solid #c48a25;color:#685326;font-size:15px;margin:24px 0}pre{background:#102b3d;color:#e2f3f4;border-radius:9px;padding:23px;overflow-x:auto;font:15px/1.9 Consolas,"Microsoft JhengHei",monospace;white-space:pre}code{background:#eaf1f4;padding:2px 5px;border-radius:4px}.table-wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:15px}th,td{padding:13px 15px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}th{background:#eaf2f5;color:#17485a}td:first-child{width:24%;font-weight:600}footer{font-size:13px;color:var(--muted);padding:20px 0 0;border-top:1px solid var(--line);margin-top:40px}@media(max-width:850px){.layout{grid-template-columns:1fr;gap:20px;margin-top:20px}nav{position:static;display:flex;gap:10px;overflow-x:auto;padding-bottom:10px}nav strong{display:none}nav a{white-space:nowrap;border:1px solid var(--line);padding:6px 10px;border-radius:6px}main{padding:26px 20px}h1{font-size:30px}h2{font-size:22px}body{font-size:16px}}@media print{body{background:#fff;font-size:11pt}header{padding:16px 0;background:#fff;color:#182b3b}header .eyebrow,header .meta,header a{color:#526576}.layout{display:block;margin:0;padding:0;max-width:none}nav{display:none}main{border:0;padding:0}h1{font-size:27pt}h2{font-size:17pt;break-after:avoid}pre,.note,tr{break-inside:avoid}pre{white-space:pre-wrap;background:#f2f5f7;color:#182b3b}a{overflow-wrap:anywhere}@page{size:A4;margin:17mm}}
</style></head><body><header><p class="eyebrow">AIDMS · ARCHITECTURE NOTE</p><p class="meta">2026-09-10 · 討論整理／設計草案 · <a href="research.md">Markdown 原稿</a></p></header><div class="layout"><nav aria-label="文件目錄"><strong>文件內容</strong>${toc.join('')}</nav><main>${out.join('\n')}<footer>以 research.md 作為維護來源；執行 assets/build.mjs 重新產生本頁。此頁可離線閱讀，未載入任何外部字型或程式。</footer></main></div></body></html>`;
writeFileSync(new URL('index.html', root), html, 'utf8');
console.log('Generated inference-router/index.html with ' + section + ' sections.');
