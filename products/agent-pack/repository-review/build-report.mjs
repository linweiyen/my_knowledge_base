// Regenerates the local reading pages from Markdown; never runs repository code.
// Usage: node build-report.mjs <extracted-agentpack-root>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {marked} from 'file:///C:/Users/1875/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js';
const here=path.dirname(fileURLToPath(import.meta.url));
const source=process.argv[2];
const commit='d3fe1734fa95d87760145a823975eeebff8cbb6b';
const base=`https://gitlab.com/leadtek/agentpack/-/blob/${commit}/`;
const roles={
 '.gitignore':'排除本機秘密、log、產物等檔案',
 'LICENSE':'此 repository 的 Apache 2.0 授權',
 'README.md':'全庫定位、版本與文件入口',
 'docker-dind/.env.example':'DinD Agent、模型、通道、資源設定範本',
 'docker-dind/docker-compose.yml':'外層 gateway、volumes、ports 與可選代理服務',
 'docker-dind/docker-entrypoint.sh':'啟動、onboard、修補、forward 與內建 watchdog',
 'docker-dind/Dockerfile':'Ubuntu 外層映像、工具與巢狀 Docker 依賴',
 'docker-dind/hermes-dashboard-lan-proxy.conf.template':'非預設的 Hermes LAN nginx 代理範本',
 'docker-dind/README.md':'現行 DinD 安裝、操作與架構說明',
 'docker-dind/troubleshooting.md':'D1–D32 事故、修法與後續更正',
 'docker-dind/scripts/hermes-dashboard-tunnel.py':'Hermes loopback TCP relay 輔助程式',
 'docker-dood/.env.example':'前代 DooD 設定範本',
 'docker-dood/docker-compose.yml':'host socket 與 sibling-container 部署',
 'docker-dood/docker-entrypoint.sh':'前代啟動、onboard、修補與 forward',
 'docker-dood/Dockerfile':'DooD 外層映像與工具依賴',
 'docker-dood/hermes-dashboard-lan-proxy.conf.template':'前代 Hermes LAN proxy 範本',
 'docker-dood/README.md':'前代部署入口與限制',
 'docker-dood/troubleshooting.md':'前代 storage、gateway、session 與路由事故',
 'docs/comparison/openclaw-hermes-comparison.md':'比較總表、實測數據、判讀條件與限制',
 'docs/hermes/browser-chromium-setup.md':'Chromium、agent-browser、policy、資源與新版命名修正',
 'docs/hermes/command-reference.md':'Hermes CLI、設定、API、記憶與生命週期差異',
 'docs/hermes/scenario-setup-guide.md':'搜尋、通道、開發、巡查、任務與記憶情境',
 'docs/hermes/presets/dealer-ecommerce-sites.yaml':'電商網站巡查網路 policy preset',
 'docs/nemoclaw/backup-and-state-guide.md':'備份還原、manifest、真實資料路徑與驗證紀錄',
 'docs/nemoclaw/command-reference.md':'共通管理 CLI、熱重載、異動與重建邊界',
 'docs/nemoclaw/config-storage-map.md':'gateway、sandbox、憑證與檔案路徑對照',
 'docs/nemoclaw/cron-job-notes.md':'排程、時區、投遞與執行成功的區別',
 'docs/nemoclaw/inference-provider-limits-and-switching.md':'共享推論路由、模型切換限制及替代思路',
 'docs/nemoclaw/iso-product-spec.md':'早期 ISO 產品草案，未同步後續 DinD 全部發現',
 'docs/nemoclaw/monitoring-and-recovery-guide.md':'健康檢查、forward、watchdog、復原與重建',
 'docs/nemoclaw/onboard-parameters.md':'Agent、provider、資源、build 參數與適用性',
 'docs/nemoclaw/policy-whitelist-and-control-layers.md':'網路、TLS、filesystem 與多層控制',
 'docs/nemoclaw/quick-start.md':'安裝後的最小可用流程與已知注意事項',
 'docs/nemoclaw/rebuild-vs-recreate.md':'restart、rebuild、recreate、destroy 與保存範圍',
 'docs/nemoclaw/skill-plugin-mcp-install-notes.md':'Skill/MCP/Plugin 安裝入口、限制與驗證',
 'docs/nemoclaw/storage-locations-dind-vs-host.md':'DinD 與原生 host 的實際儲存路徑',
 'docs/nemoclaw/vendor-and-cloud-service-landscape.md':'硬體/預裝與雲端市場初步整理，未重查外部資料',
 'docs/openclaw/command-reference.md':'OpenClaw CLI、API、session 與任務操作',
 'docs/openclaw/scenario-setup-guide.md':'搜尋、通道、記憶、產檔與開發情境',
 'docs/openclaw/setup-notes.md':'初始設定、Tavily、排程與限制補充',
 'reports/01-overview-and-recommendation.html':'主管用總覽與建議，須對照較新筆記',
 'reports/02-agent-comparison.html':'Agent 比較閱讀版',
 'reports/03-architecture-diagram.html':'架構圖閱讀版',
 'reports/04-config-layers.html':'設定分層閱讀版',
 'reports/05-scenario-handbook.html':'情境手冊閱讀版，部分步驟已過時',
 'reports/06-risk-and-ops.html':'風險維運閱讀版，部分驗證狀態已過時',
 'reports/README.md':'HTML 報告用途、閱讀順序及衝突處理',
 'scripts/benchmark/first-response-benchmark.sh':'基本回應、耗時與全域 token metrics 差值',
 'scripts/benchmark/general-task-benchmark.sh':'一般任務輸出與耗時；非完整品質自動評分',
 'scripts/benchmark/longmemeval-crosssession-benchmark.sh':'跨 session 記憶測試、停滯與評分',
 'scripts/benchmark/longmemeval-memory-benchmark.sh':'同 session LongMemEval 子集與模型 judge',
 'scripts/benchmark/multiturn-memory-benchmark.sh':'多輪記憶 smoke test',
 'scripts/benchmark/nemoclaw-pptx-benchmark.sh':'PDF→PPTX 測試、產物結構檢查與清理',
 'scripts/benchmark/policy-whitelist-benchmark.sh':'受控天氣查詢的 policy 兩階段測試',
 'scripts/benchmark/session-reset-benchmark.sh':'上下文重置測試；兩 Agent 流程不同',
 'scripts/benchmark/stuck-task-recovery-benchmark.sh':'逾時、殘留程序與重啟復原觀察',
 'scripts/benchmark/web-search-benchmark.sh':'Web Search 工具路徑測試',
 'scripts/benchmark/lib/common.sh':'命令轉送、模型 metrics 與 benchmark 共用函式',
 'scripts/install/nemoclaw-auto-install.sh':'歷史 OpenClaw 自動安裝流程',
 'scripts/install/nemoclaw-hermes-auto-install.sh':'歷史 Hermes 自動安裝流程',
 'scripts/install/README.md':'歷史腳本定位與較新部署入口',
 'scripts/monitoring/dashboard-forward-watchdog.sh':'外部 Dashboard forward HTTP 健康與重啟監控'
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=`*{box-sizing:border-box}body{margin:0;background:#f5f7fb;color:#19283b;font:17px/1.85 system-ui,"Segoe UI","Noto Sans TC",sans-serif}main{max-width:1100px;margin:auto;padding:35px 28px 80px}nav{display:flex;gap:20px;flex-wrap:wrap;font-size:14px;margin-bottom:30px}a{color:#175eaa;text-underline-offset:3px}h1{font-size:clamp(28px,4vw,42px);line-height:1.35}h2{margin-top:3em;border-top:1px solid #d7dfe9;padding-top:25px}h3{margin-top:2em}p,li{overflow-wrap:anywhere}table{width:100%;border-collapse:collapse;background:white;font-size:15px;line-height:1.65}th,td{border:1px solid #dbe2ec;padding:12px 15px;text-align:left;vertical-align:top}th{background:#eaf0f8}.table-wrap{overflow-x:auto;margin:22px 0}code{background:#e9edf4;padding:2px 5px;border-radius:4px;font-size:.88em}pre{overflow:auto;padding:18px;background:#e9edf4}blockquote{border-left:4px solid #447cac;padding-left:20px}.meta{color:#53667d;font-size:14px}.toc{padding:20px 26px;background:#fff;border:1px solid #dbe2ec;border-radius:12px}.toc a{display:block;font-size:15px;margin:5px 0}footer{margin-top:60px;border-top:1px solid #ddd;padding-top:16px;color:#53667d;font-size:13px}@media(max-width:620px){main{padding:22px 16px 50px}table{min-width:700px}}@media print{body{background:white}main{max-width:none}.toc,nav{display:none}a{color:inherit}}`;
function render(title,markdown,nav){
 let body=marked.parse(markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,''));
 const headings=[];
 body=body.replace(/<h2>(.*?)<\/h2>/g,(_,s)=>{const id=`section-${headings.length+1}`;headings.push({id,label:s.replace(/<[^>]+>/g,'')});return `<h2 id="${id}">${s}</h2>`;});
 body=body.replace(/<table>/g,'<div class="table-wrap"><table>').replace(/<\/table>/g,'</table></div>');
 const toc=headings.length?`<details class="toc"><summary>章節目錄（${headings.length} 節）</summary>${headings.map(h=>`<a href="#${h.id}">${h.label}</a>`).join('')}</details>`:'';
 return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${css}</style></head><body><main><nav>${nav}</nav><div class="meta">Agent Pack 研究 · 2026-10-21 · 草稿／既有實測未重跑</div>${toc}${body}<footer>Markdown 為內容來源。修改正文後請重新產生本頁；來源版本及證據限制以正文為準。</footer></main></body></html>`;
}
if(source){
 const files=[];
 function walk(dir,prefix=''){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const name=prefix+e.name;if(e.isDirectory())walk(path.join(dir,e.name),name+'/');else {const data=fs.readFileSync(path.join(dir,e.name));if(!roles[name])throw Error('Missing role: '+name);files.push({path:name,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex'),role:roles[name],url:base+name});}}}
 walk(source);files.sort((a,b)=>a.path.localeCompare(b.path));
 if(files.length!==62)throw Error('Unexpected snapshot file count '+files.length);
 const manifest={repository:'https://gitlab.com/leadtek/agentpack',branch:'main',observedCommit:commit,acquired:'2026-10-21',archiveSha256:'D553AB5B8B9420CC048F4CD374AD800D2FF722FE8F59EF88D00FCAC521CF6D5A',fileCount:files.length,totalBytes:files.reduce((a,f)=>a+f.bytes,0),files};
 fs.writeFileSync(path.join(here,'source-inventory.json'),JSON.stringify(manifest,null,2)+'\n');
 let md=`# Agent Pack：62 個檔案來源索引\n\n取得日期：2026-10-21。來源為 GitLab 已登入頁面下載的 main 分支完整 ZIP；頁面觀察到的 HEAD 為 [${commit}](https://gitlab.com/leadtek/agentpack/-/commit/${commit})。\n\n逐檔索引與靜態閱讀不代表逐行程式碼稽核，也不代表本次執行過安裝或測試。原始碼沒有複製進研究知識庫。\n\n- 62 個檔案，${manifest.totalBytes.toLocaleString('en-US')} bytes。\n- ZIP SHA-256：\`${manifest.archiveSha256}\`\n- [研究正文](index.html) · [機器可讀索引／逐檔 SHA-256](source-inventory.json)\n\n`;
 for(const group of ['根目錄','docker-dind','docker-dood','docs','reports','scripts']){
 const subset=files.filter(f=>(f.path.includes('/')?f.path.split('/')[0]:'根目錄')===group);
 md+=`## ${group}（${subset.length} 檔）\n\n| 檔案／固定版本來源 | Bytes | 用途與閱讀定位 |\n|---|---:|---|\n`;
 for(const f of subset)md+=`| [${f.path}](${f.url}) | ${f.bytes.toLocaleString('en-US')} | ${f.role} |\n`;
 md+='\n';}
 fs.writeFileSync(path.join(here,'source-inventory.md'),md);
}
for(const [stem,title] of [['research','Agent Pack 全庫閱讀與單機管理系統研究'],['source-inventory','Agent Pack 完整來源索引']]){
 const md=fs.readFileSync(path.join(here,stem+'.md'),'utf8');
 fs.writeFileSync(path.join(here,stem==='research'?'index.html':stem+'.html'),render(title,md,'<a href="../index.html">Agent Pack 入口</a><a href="../../../index.html">知識庫</a><a href="'+stem+'.md">Markdown 原文</a>'));
}
const overview='# Agent Pack 研究\n\n重新設計 Agent Pack 取代 RTX Pack，為小型客戶提供 Docker 單機資源、模型服務及 Agent Container 管理。RTX Pack 與 GDMS 準備退場；AIDMS 維持多 GPU node 分工。\n\n## 目前研究\n\n- [產品規劃啟動會議簡報](kick-off/index.html)：最新定位、產品替代關係、三種 GPU 配置、模型與 Agent 工作負載，以及第一版驗收安排。\n- [產品定位：Kick off 討論稿](positioning/index.html)：早期三個方向的討論紀錄，目前定位以啟動會議簡報為準。\n- [全庫閱讀與單機管理系統研究](repository-review/index.html)：62 個檔案盤點、架構、現有能力、規格缺口、實測條件與待驗證事項。\n- [完整來源索引](repository-review/source-inventory.html)：逐檔用途、固定版本連結與雜湊。\n\n## 核心判斷\n\nAgent Pack 採 Docker、免產品帳號，管理單機 GPU、模型及自製／預整合 Agent Container。GPU 需求包含整卡分配、單卡共享、單容器跨多卡；支援範圍及共享保證需驗證。GitLab 提供工程研究基礎，尚需產品化。\n\n## 待研究\n\n首發硬體／OS、GPU 共享與多卡模型方案、容器接入規則、OpenClaw／Hermes 整合清單、存取與資料保存、舊產品退場銜接。\n\n## 相關研究\n\n- [知識庫首頁](../../index.html)\n- [AIDMS 推論路由器](../aidms/architecture/inference-router/index.html)\n';
fs.writeFileSync(path.join(here,'..','index.html'),render('Agent Pack 研究',overview,'<a href="../../index.html">知識庫首頁</a>'));
console.log('Generated research, inventory and Agent Pack entry pages.');
