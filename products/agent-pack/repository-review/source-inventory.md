# Agent Pack：62 個檔案來源索引

取得日期：2026-10-21。來源為 GitLab 已登入頁面下載的 main 分支完整 ZIP；頁面觀察到的 HEAD 為 [d3fe1734fa95d87760145a823975eeebff8cbb6b](https://gitlab.com/leadtek/agentpack/-/commit/d3fe1734fa95d87760145a823975eeebff8cbb6b)。

逐檔索引與靜態閱讀不代表逐行程式碼稽核，也不代表本次執行過安裝或測試。原始碼沒有複製進研究知識庫。

- 62 個檔案，1,477,764 bytes。
- ZIP SHA-256：`D553AB5B8B9420CC048F4CD374AD800D2FF722FE8F59EF88D00FCAC521CF6D5A`
- [研究正文](index.html) · [機器可讀索引／逐檔 SHA-256](source-inventory.json)

## 根目錄（3 檔）

| 檔案／固定版本來源 | Bytes | 用途與閱讀定位 |
|---|---:|---|
| [.gitignore](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/.gitignore) | 492 | 排除本機秘密、log、產物等檔案 |
| [LICENSE](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/LICENSE) | 11,337 | 此 repository 的 Apache 2.0 授權 |
| [README.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/README.md) | 25,312 | 全庫定位、版本與文件入口 |

## docker-dind（8 檔）

| 檔案／固定版本來源 | Bytes | 用途與閱讀定位 |
|---|---:|---|
| [docker-dind/.env.example](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/.env.example) | 10,444 | DinD Agent、模型、通道、資源設定範本 |
| [docker-dind/docker-compose.yml](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/docker-compose.yml) | 7,710 | 外層 gateway、volumes、ports 與可選代理服務 |
| [docker-dind/docker-entrypoint.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/docker-entrypoint.sh) | 68,019 | 啟動、onboard、修補、forward 與內建 watchdog |
| [docker-dind/Dockerfile](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/Dockerfile) | 7,632 | Ubuntu 外層映像、工具與巢狀 Docker 依賴 |
| [docker-dind/hermes-dashboard-lan-proxy.conf.template](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/hermes-dashboard-lan-proxy.conf.template) | 2,185 | 非預設的 Hermes LAN nginx 代理範本 |
| [docker-dind/README.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/README.md) | 29,862 | 現行 DinD 安裝、操作與架構說明 |
| [docker-dind/scripts/hermes-dashboard-tunnel.py](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/scripts/hermes-dashboard-tunnel.py) | 5,910 | Hermes loopback TCP relay 輔助程式 |
| [docker-dind/troubleshooting.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/troubleshooting.md) | 204,182 | D1–D32 事故、修法與後續更正 |

## docker-dood（7 檔）

| 檔案／固定版本來源 | Bytes | 用途與閱讀定位 |
|---|---:|---|
| [docker-dood/.env.example](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dood/.env.example) | 8,630 | 前代 DooD 設定範本 |
| [docker-dood/docker-compose.yml](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dood/docker-compose.yml) | 3,195 | host socket 與 sibling-container 部署 |
| [docker-dood/docker-entrypoint.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dood/docker-entrypoint.sh) | 24,028 | 前代啟動、onboard、修補與 forward |
| [docker-dood/Dockerfile](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dood/Dockerfile) | 2,423 | DooD 外層映像與工具依賴 |
| [docker-dood/hermes-dashboard-lan-proxy.conf.template](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dood/hermes-dashboard-lan-proxy.conf.template) | 1,728 | 前代 Hermes LAN proxy 範本 |
| [docker-dood/README.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dood/README.md) | 25,233 | 前代部署入口與限制 |
| [docker-dood/troubleshooting.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dood/troubleshooting.md) | 54,635 | 前代 storage、gateway、session 與路由事故 |

## docs（22 檔）

| 檔案／固定版本來源 | Bytes | 用途與閱讀定位 |
|---|---:|---|
| [docs/comparison/openclaw-hermes-comparison.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/comparison/openclaw-hermes-comparison.md) | 73,650 | 比較總表、實測數據、判讀條件與限制 |
| [docs/hermes/browser-chromium-setup.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/hermes/browser-chromium-setup.md) | 59,638 | Chromium、agent-browser、policy、資源與新版命名修正 |
| [docs/hermes/command-reference.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/hermes/command-reference.md) | 33,234 | Hermes CLI、設定、API、記憶與生命週期差異 |
| [docs/hermes/presets/dealer-ecommerce-sites.yaml](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/hermes/presets/dealer-ecommerce-sites.yaml) | 4,747 | 電商網站巡查網路 policy preset |
| [docs/hermes/scenario-setup-guide.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/hermes/scenario-setup-guide.md) | 18,349 | 搜尋、通道、開發、巡查、任務與記憶情境 |
| [docs/nemoclaw/backup-and-state-guide.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/backup-and-state-guide.md) | 23,887 | 備份還原、manifest、真實資料路徑與驗證紀錄 |
| [docs/nemoclaw/command-reference.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/command-reference.md) | 22,030 | 共通管理 CLI、熱重載、異動與重建邊界 |
| [docs/nemoclaw/config-storage-map.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/config-storage-map.md) | 16,534 | gateway、sandbox、憑證與檔案路徑對照 |
| [docs/nemoclaw/cron-job-notes.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/cron-job-notes.md) | 11,083 | 排程、時區、投遞與執行成功的區別 |
| [docs/nemoclaw/inference-provider-limits-and-switching.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/inference-provider-limits-and-switching.md) | 31,820 | 共享推論路由、模型切換限制及替代思路 |
| [docs/nemoclaw/iso-product-spec.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/iso-product-spec.md) | 8,933 | 早期 ISO 產品草案，未同步後續 DinD 全部發現 |
| [docs/nemoclaw/monitoring-and-recovery-guide.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/monitoring-and-recovery-guide.md) | 15,854 | 健康檢查、forward、watchdog、復原與重建 |
| [docs/nemoclaw/onboard-parameters.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/onboard-parameters.md) | 15,870 | Agent、provider、資源、build 參數與適用性 |
| [docs/nemoclaw/policy-whitelist-and-control-layers.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/policy-whitelist-and-control-layers.md) | 23,442 | 網路、TLS、filesystem 與多層控制 |
| [docs/nemoclaw/quick-start.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/quick-start.md) | 9,580 | 安裝後的最小可用流程與已知注意事項 |
| [docs/nemoclaw/rebuild-vs-recreate.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/rebuild-vs-recreate.md) | 14,789 | restart、rebuild、recreate、destroy 與保存範圍 |
| [docs/nemoclaw/skill-plugin-mcp-install-notes.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/skill-plugin-mcp-install-notes.md) | 19,902 | Skill/MCP/Plugin 安裝入口、限制與驗證 |
| [docs/nemoclaw/storage-locations-dind-vs-host.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/storage-locations-dind-vs-host.md) | 13,903 | DinD 與原生 host 的實際儲存路徑 |
| [docs/nemoclaw/vendor-and-cloud-service-landscape.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/vendor-and-cloud-service-landscape.md) | 17,036 | 硬體/預裝與雲端市場初步整理，未重查外部資料 |
| [docs/openclaw/command-reference.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/openclaw/command-reference.md) | 18,097 | OpenClaw CLI、API、session 與任務操作 |
| [docs/openclaw/scenario-setup-guide.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/openclaw/scenario-setup-guide.md) | 25,680 | 搜尋、通道、記憶、產檔與開發情境 |
| [docs/openclaw/setup-notes.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/openclaw/setup-notes.md) | 70,883 | 初始設定、Tavily、排程與限制補充 |

## reports（7 檔）

| 檔案／固定版本來源 | Bytes | 用途與閱讀定位 |
|---|---:|---|
| [reports/01-overview-and-recommendation.html](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/reports/01-overview-and-recommendation.html) | 65,816 | 主管用總覽與建議，須對照較新筆記 |
| [reports/02-agent-comparison.html](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/reports/02-agent-comparison.html) | 62,416 | Agent 比較閱讀版 |
| [reports/03-architecture-diagram.html](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/reports/03-architecture-diagram.html) | 50,391 | 架構圖閱讀版 |
| [reports/04-config-layers.html](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/reports/04-config-layers.html) | 47,591 | 設定分層閱讀版 |
| [reports/05-scenario-handbook.html](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/reports/05-scenario-handbook.html) | 35,110 | 情境手冊閱讀版，部分步驟已過時 |
| [reports/06-risk-and-ops.html](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/reports/06-risk-and-ops.html) | 28,629 | 風險維運閱讀版，部分驗證狀態已過時 |
| [reports/README.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/reports/README.md) | 2,011 | HTML 報告用途、閱讀順序及衝突處理 |

## scripts（15 檔）

| 檔案／固定版本來源 | Bytes | 用途與閱讀定位 |
|---|---:|---|
| [scripts/benchmark/first-response-benchmark.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/benchmark/first-response-benchmark.sh) | 4,935 | 基本回應、耗時與全域 token metrics 差值 |
| [scripts/benchmark/general-task-benchmark.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/benchmark/general-task-benchmark.sh) | 4,840 | 一般任務輸出與耗時；非完整品質自動評分 |
| [scripts/benchmark/lib/common.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/benchmark/lib/common.sh) | 4,498 | 命令轉送、模型 metrics 與 benchmark 共用函式 |
| [scripts/benchmark/longmemeval-crosssession-benchmark.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/benchmark/longmemeval-crosssession-benchmark.sh) | 20,578 | 跨 session 記憶測試、停滯與評分 |
| [scripts/benchmark/longmemeval-memory-benchmark.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/benchmark/longmemeval-memory-benchmark.sh) | 26,436 | 同 session LongMemEval 子集與模型 judge |
| [scripts/benchmark/multiturn-memory-benchmark.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/benchmark/multiturn-memory-benchmark.sh) | 4,500 | 多輪記憶 smoke test |
| [scripts/benchmark/nemoclaw-pptx-benchmark.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/benchmark/nemoclaw-pptx-benchmark.sh) | 11,215 | PDF→PPTX 測試、產物結構檢查與清理 |
| [scripts/benchmark/policy-whitelist-benchmark.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/benchmark/policy-whitelist-benchmark.sh) | 4,631 | 受控天氣查詢的 policy 兩階段測試 |
| [scripts/benchmark/session-reset-benchmark.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/benchmark/session-reset-benchmark.sh) | 8,215 | 上下文重置測試；兩 Agent 流程不同 |
| [scripts/benchmark/stuck-task-recovery-benchmark.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/benchmark/stuck-task-recovery-benchmark.sh) | 6,998 | 逾時、殘留程序與重啟復原觀察 |
| [scripts/benchmark/web-search-benchmark.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/benchmark/web-search-benchmark.sh) | 10,424 | Web Search 工具路徑測試 |
| [scripts/install/nemoclaw-auto-install.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/install/nemoclaw-auto-install.sh) | 12,840 | 歷史 OpenClaw 自動安裝流程 |
| [scripts/install/nemoclaw-hermes-auto-install.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/install/nemoclaw-hermes-auto-install.sh) | 15,151 | 歷史 Hermes 自動安裝流程 |
| [scripts/install/README.md](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/install/README.md) | 2,746 | 歷史腳本定位與較新部署入口 |
| [scripts/monitoring/dashboard-forward-watchdog.sh](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/scripts/monitoring/dashboard-forward-watchdog.sh) | 5,895 | 外部 Dashboard forward HTTP 健康與重啟監控 |

