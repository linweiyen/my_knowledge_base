---
title: Agent Pack 全庫閱讀與單機管理系統研究
created: 2026-10-21
updated: 2026-10-21
verified: null
status: draft
tags: [agent-pack, single-machine, nemoclaw, openclaw, hermes]
---

# Agent Pack：全庫閱讀與單機管理系統研究

**這份 repository 是有實作腳本的安裝、維運與實測研究庫，可以作為單機管理系統的工程基礎，但還不是完成的管理產品。** 它最有價值的內容，是記錄安裝、設定、重建、憑證、記憶及故障復原的真實邊界。產品開發要把這些邊界轉成使用者可理解、可恢復、可驗收的操作。

依使用者描述，AIDMS 負責多 GPU node 管理；本研究聚焦「安裝在一台電腦上的簡易管理系統」。兩者如何整合尚未核定。

## 1. 版本、閱讀範圍與限制

| 項目 | 本次範圍 |
|---|---|
| Repository | [leadtek/agentpack](https://gitlab.com/leadtek/agentpack) |
| 來源 | main 分支完整 ZIP 快照 |
| 頁面顯示的 HEAD | [d3fe1734fa95d87760145a823975eeebff8cbb6b](https://gitlab.com/leadtek/agentpack/-/commit/d3fe1734fa95d87760145a823975eeebff8cbb6b)，2026-09-21 合併提交 |
| 取得與閱讀日期 | 2026-10-21，Asia/Taipei |
| 內容 | 62 個檔案，共 1,477,764 bytes；[完整來源索引](source-inventory.html) 含逐檔連結、用途與雜湊 |
| 方法 | 全庫逐檔盤點，文件與 HTML 正文閱讀、部署設定與腳本靜態檢視、重要主張交叉核對；不是逐行程式碼稽核 |
| 未包含 | 其他分支、完整 Git 歷史、Issues/MRs、未追蹤的 .env、工程師機器資料、外部資料集及上游完整原始碼 |

**「repo 實測紀錄」指 Justin 文件記載的既有測試，本次沒有重新實機驗證。** 「程式碼觀察」指下載快照的靜態行為；「建議」是本研究提出的產品方向，尚未核定。未安裝、建置或執行 repo 的程式及 benchmark，也未修改 GitLab。`verified: null` 表示既有實測與外部事實未重新驗證。下方來源連結固定在上述提交，下載 ZIP 的 SHA-256 記在來源索引。

## 2. 全庫內容地圖

| 區域 | 檔案數 | 內容與定位 |
|---|---:|---|
| 根目錄 | 3 | README、Apache 2.0 LICENSE、.gitignore |
| docker-dind | 8 | 現行部署包裝、雙 Agent 上線、設定範本、自癒、relay 與 D1–D32 除錯紀錄 |
| docker-dood | 7 | 前一代 sibling-container 部署；保留演進與除錯經驗，非新部署入口 |
| docs | 22 | NemoClaw 通用管理、OpenClaw/Hermes 設定、比較研究、電商網站 policy |
| reports | 7 | 六份 HTML 報告與 README；內容有些落後原始筆記 |
| scripts | 15 | 10 支 benchmark、1 支共用函式、2 支歷史安裝腳本及 README、1 支外部 watchdog |

六份 HTML 分別面向主管總覽、Agent 比較、架構圖、設定分層、情境操作與風險維運。[reports/README](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/reports/README.md) 說明內容衝突時應回到 docs 查證。全庫沒有獨立的 Agent Pack 管理前端、管理後端或產品資料庫實作，也未提供 AIDMS cluster/node 管理程式。

## 3. 系統架構：目前到底安裝了什麼

實體主機的 Docker 執行一個 privileged 外層容器，裡面包含 NemoClaw CLI、OpenShell gateway 與巢狀 dockerd，再由巢狀 dockerd 管理 OpenClaw、Hermes 各自的 sandbox。模型服務透過 API 接入，**沒有一併部署在這份 Compose 裡**。

| 元件 | 角色 |
|---|---|
| NemoClaw | sandbox 上線、設定、policy、憑證接線、快照及生命週期管理 |
| OpenShell | gateway、受管執行環境、網路/檔案控制、推論路由等機制 |
| OpenClaw | Agent runtime，自己的 JSON 設定、工作區、session、TaskFlow |
| Hermes | 另一個 runtime，自己的 YAML/env、HTTP API、記憶資料庫、Kanban |
| 模型推論端點 | 由使用者另外提供；範本接到區網上的 OpenAI 相容服務 |

部署演進為 host 原生 → DooD → DinD。DooD 掛載 host Docker socket，並處理 host 系統執行檔與相同路徑掛載；DinD 把狀態收進 named volumes，減少這類跨邊界路徑管理問題。這是 **repo 的實務選型，不能轉述為 NVIDIA 官方推薦 DinD**。privileged 外層容器也不能因為沒有掛 host socket，就當成低權限安全保證。[部署說明](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/README.md)

### 單機安裝與全部在本機推論，要分開定義

現有腳本能把 Agent 環境裝在一台電腦，但不代表包含模型下載、模型服務、GPU/VRAM 管理，或斷網可用。單機產品需選定支援範圍：只連已有模型 API、同時管理本機模型，或兩者皆可。

**建議將 Agent 環境管理與模型服務管理分成兩個可分期模組。** 若使用遠端模型、搜尋 API、MCP、通訊服務，也不能宣稱資料完全不出機。與 AIDMS 的連結可先研究為「使用其提供的推論端點」，不預設已完成產品整合。

### 資料與憑證分層

狀態分成 gateway 藍圖、gateway 憑證、sandbox 設定及使用者資料；物理儲存主要是外層 home 與巢狀 Docker data 兩個 volumes。repo 的 DinD 實測顯示 `/sandbox` 在容器寫入層，沒有每個 sandbox 獨立的 named volume，資料保留依賴應用層 snapshot/restore。**外層 volume 還在，不等於某次 sandbox 重建完整保住資料。** [儲存總覽](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/storage-locations-dind-vs-host.md)

受管密鑰流程與藍圖的 hash/reference 分離；但 OpenClaw Tavily workaround 直接寫入設定，不能推定所有密鑰都不落 sandbox 磁碟。產品必須逐條檢查實際設定路徑。

## 4. 已有能力與管理產品的落差

| 功能 | repo 已有基礎 | 產品仍需補足 |
|---|---|---|
| 安裝 | Compose、CLI 安裝、onboard、已知修法 | 安裝精靈、前置檢查、可理解的進度、失敗續跑 |
| Agent 管理 | 兩類 Agent 啟用開關、名稱、port | 動態實例清單、真正的啟停狀態、能力差異；現有開關不是通用動態管理器 |
| 模型連線 | endpoint/model/provider 設定 | 可達性、工具能力與模型 metadata 檢查，切換影響預覽 |
| 搜尋與通道 | Tavily、Telegram 流程與事故紀錄 | 憑證表單、端到端測試、重建後恢復與回歸檢查 |
| 擴充 | host 層 Skill/MCP 安裝已有紀錄 | 來源、版本、權限、依賴及實際工具可呼叫檢查 |
| Plugin | OpenClaw 實例、Hermes build-time 研究 | 依 Agent 分別建立支援矩陣，不能統一當成熱安裝 |
| 記憶 | 檔案、資料庫與測試腳本 | 區分同對話上下文、跨對話回憶、索引健康及使用者隔離 |
| 任務/排程 | TaskFlow、Kanban、cron 指令與紀錄 | 真正取消、逾時收尾、資源預算、時區、通知投遞 |
| 監控 | status/logs/recover/rebuild、HTTP watchdog | 分層健康、退化/維護狀態、告警與復原歷程 |
| 備份 | snapshot/restore/backup-all、涵蓋範圍核對 | 完整性、遺漏資料、憑證重接與整機復原演練 |
| 資源 | 每 Agent CPU/RAM 設定入口 | 安全預設、總量預算、同機模型共存；範本留空代表無上限 |
| 更新 | 版本配對及 migration 事故經驗 | 可重建發行包、相容矩陣、資料遷移與回復策略 |

能力盤點不等於全部完成同一版本驗收。Kanban 失敗保護、Plugin、自動化 API 核准行為、跨平台支援等項目仍有只查文件/help 的部分。

## 5. 會直接決定規格的限制

### 5.1 多 Agent 不等於各自自由切模型

repo 指出一個 OpenShell gateway 共用一條活的推論路由，多個已登記 sandbox（含 stopped）會影響模型切換的相容檢查。不能直接在每個 Agent 下提供任意切模型選單。

候選方向是獨立 gateway、同端點多模型路由，或第一版先限制共用模型。獨立 gateway 尚非無痛答案：DooD 歷史曾有影子登記及名稱解析誤刪；新拓樸須重測。多模型 proxy/固定模型別名還需處理 context window metadata 不同步。[推論限制與切換](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/inference-provider-limits-and-switching.md)

### 5.2 儲存設定可能觸發重建與停機

policy 即時異動、Agent process restart、sandbox rebuild、重新 onboard、destroy 的影響不同。通道異動會牽動 rebuild；資源與部分建立時設定要 recreate。備份只涵蓋 manifest 指定內容。

管理系統應先產生操作計畫：影響哪些 Agent、預期停機、備份範圍、需要重套的設定與失敗恢復點。後端再依「備份 → 套用 → 恢復設定 → 功能驗證」執行，不能只給一個沒有進度的儲存按鈕。[生命週期邊界](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/rebuild-vs-recreate.md)

### 5.3 健康必須測到使用者實際走的路徑

曾有 forward 顯示 running，HTTP 卻不轉發；設定存在，工具卻未出現。entrypoint 已有約每 120 秒做 HTTP 探測/修復的 watchdog，但不是完整產品健康檢查。

介面應區分容器、Agent process、Dashboard HTTP/WebSocket、推論、工具、通道、排程與通知。容器 Up 不等於可用；憑證已存也不等於搜尋成功。[監控復原](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/monitoring-and-recovery-guide.md)

### 5.4 共通介面需要 Agent 適配層

兩者設定格式、session、任務與 API 不同，連 CLI 的 `-m` 意義都不同。OpenClaw session reset 不能直接用於 Hermes。可以提供共通上層概念，但後端必須依 Agent 實作，並顯示不支援或未驗證能力。[Hermes 差異](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/hermes/command-reference.md)

### 5.5 完成與停止都要獨立驗證

repo 記錄產檔失敗卻回報成功，也記錄 client timeout 後工作仍執行。特定 OpenClaw TaskFlow 事故在 restart 後復活；Hermes 普通 chat process 可從 OS 層清理，但不能推廣到所有 Kanban worker。

建議任務狀態區分執行中、等待核准、正在取消、已停止、成功、失敗、結果待驗證。產檔需檢查本次產物，取消需確認實際執行及模型請求結束。提示詞要求誠實不能取代驗證。

### 5.6 單機仍需資源與存取設計

CPU/RAM 範本預設無上限，瀏覽器 process 曾耗盡 host 資源。同機若跑模型，要預留推論、OS 與管理服務預算。Hermes 未認證 LAN proxy 已被 repo 判定停用；應明確區分本機存取與有認證的遠端管理。[瀏覽器及資源事故](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/hermes/browser-chromium-setup.md)

## 6. 比較數據：保留條件，避免直接排勝負

| repo 測試 | OpenClaw | Hermes | 解讀限制 |
|---|---|---|---|
| 08-18 首句回應，各 n=5 | 5/5，6.7 秒 | 5/5，8.7 秒 | 基本回應測試，不代表冷安裝或長期可靠度 |
| 同日 Web Search，各 n=5 | 5/5，11.7 秒 | 5/5，12.4 秒 | 完成設定後的結果；較舊手冊仍標 Hermes 未完成驗證 |
| 同日一般摘要，各 n=5 | 22.4 秒；prompt 33,626 | 18.9 秒；prompt 20,608 | 此任務 Hermes 較快且較省，不能說它永遠耗更多 token |
| PDF → PPTX 歷史測試 | 原記錄 2/5，124.3 秒；有漏查產出路徑偏差 | 加 --yolo 後 5/5，251.4 秒；兩次 client 逾時但已產檔 | 核准模式、token 配置與產物驗證條件不完全對齊，不能作對外勝率 |
| 09-01 同 session，各 30 題 | 24/30 PASS，0 stalled | 17/30 PASS，10/30 stalled；有效 20 題中 17 PASS | 有效樣本 85% 不能直接和全體 80% 比；需呈現端到端成功與 stalled |
| 同輪跨 session，Hermes 8 題 | 未對稱重跑，受 D25 混淆 | 8/8 stalled | 該輪 CLI resume 流程失敗，不能推廣到所有 UI/API 路徑 |

來源：[比較研究 §4](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/comparison/openclaw-hermes-comparison.md)。不同模型、版本、設定與輪次不能混成總排行榜。`--yolo` 改變核准條件，不能為提高測試勝率就當成產品預設。「Hermes 永遠不編造產物」「OpenClaw 一定較擅長調度」均無足夠證據支持。

## 7. 文件矛盾與靜態檢視發現

下列未修改原始 repo，也未一律判定為已證實 bug。

| 編號 | 觀察 | 本次處理與待驗證 |
|---|---|---|
| C01 | 子文件稱 DinD 為官方正式部署，根 README 說 repo 自建 | 採後者範圍限定，統一措辭 |
| C02 | 部分文件說手動 policy 一律被 rebuild 清掉；另有更正會回寫藍圖 | 不能採一律清除說法；Tavily workaround 仍有特定遺失紀錄，逐項測試 |
| C03 | Quick Start 說 provider=none 可避免搜尋崩潰；D25 說 memory_search 仍失敗 | 分開 provider 與 SQLite 索引缺陷，不能宣稱完整搜尋已修復 |
| C04 | Hermes 手冊標搜尋未完整驗證，比較表有 n=5 成功 | 對齊日期、條件與驗證狀態 |
| C05 | reports/05 仍教 memory index --force、舊 Chromium 步驟 | 應按 D25 與 09-10 browser 文件更新 |
| C06 | reports/06 說備份路徑/upload/download 未實測，backup guide 已有 09-02 驗證 | 更新報告，備份範圍與憑證重接仍分開確認 |
| C07 | SOUL.md、state.db、Dashboard profile 路徑不一致 | 按版本/profile 實測，勿硬寫全域路徑 |
| C08 | rebuild-vs-recreate §5 的 Hermes 補設定範例用 openclaw 且 key 命名混用 | 不能直接照抄，按 Agent schema 讀回與驗證 |
| C09 | browser 文件改正 default-- 命名，entrypoint race guard 仍只匹配舊名稱 | 靜態上可能漏新容器，需驗證啟動競速防護 |
| C10 | D30 說 bridge 存取需 0.0.0.0 forward，.env.example 卻仍註解該開關 | 驗證範本首次啟動的 host 存取與 host 側暴露介面 |
| C11 | Hermes startup forward-open 依賴 LAN_PORT，範本註解；watchdog 修復卻一律 start 0.0.0.0 | 分開容器內 forward 與 host/LAN 存取；不能靠後續自癒充當安裝驗收 |
| C12 | onboard 失敗後容器保持存活，Compose 無 Agent healthcheck | 是方便診斷的設計；UI 必須顯示失敗或退化，不能只看 Up |
| C13 | 每次啟動先下載安裝腳本，即使 CLI 存在；另有動態 npm audit fix --force | 無外網啟動與可重建發行尚無保證，需固定依賴並測試 |
| C14 | repo 有 Apache 2.0 LICENSE，部署還下載其他元件 | 不推定全部依賴與模型都同授權；本次未做授權法律審查 |

靜態依據：[entrypoint](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/docker-entrypoint.sh)、[設定範本](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/.env.example)、[Compose](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docker-dind/docker-compose.yml)。此外，部分深入紀錄只以 wiki-style 連到工程師個人 memory，沒有落在 repo，不能視為已取得完整證據。

benchmark 也有邊界：vLLM 全域 metrics 差值可能受其他請求污染；部分判定依賴 CLI 文字解析；產檔只驗證 ZIP/slide 存在，未驗證內容與畫面品質；LongMemEval 原始資料及大部分逐次輸出未隨庫提供。重現前需補資料與模型設定。

## 8. 單機管理系統第一版建議

以下是假設「一台機器、一位管理者、少數 Agent 實例」的建議草案，尚未核定。

| 管理頁面 | 第一版能做什麼 | 驗收重點 |
|---|---|---|
| 總覽 | 主機資源、Agent、模型連線、異常 | 有檢查時間，指出哪一層失敗 |
| 初次設定 | 選 Agent、填模型端點、驗證第一句對話 | 乾淨主機完成，不要求手改容器檔案 |
| Agent | 支援的實例建立、啟停、對話入口、設定 | 結果符合實際狀態，資料保留範圍清楚 |
| 模型連線 | 本機/遠端 API、模型 ID、憑證 | 切換前檢查共享路由衝突與 metadata |
| 功能與擴充 | 搜尋、首個通道、Skill、受管 MCP | 真正可呼叫，重建後做回歸檢查 |
| 任務/排程 | 執行紀錄、核准等待、取消、時區、通知 | 取消後停止推論；執行與投遞成功分開 |
| 維護 | 診斷、日誌、備份、還原、更新與修復 | 備份不完整時阻止高風險步驟，失敗可接續 |

後端建議包含本機管理服務、各 Agent 適配、操作工作佇列、期望設定儲存、健康探測與機密儲存。期望設定能產生實際配置，重建後自動恢復及比對；避免以容器裡散落的手動補丁作為唯一真相。

建議第一版先有一個預設 Agent，另一個列為可選實驗功能，降低支援矩陣。現有資料不足以直接指定勝者；先用目標使用者的 3–5 個任務，在出貨硬體與固定版本上驗收再選。本期先不加入多 node 排程、跨機資源池、叢集 GPU 分配及未驗證的多租戶承諾。本機模型管理另開規格。

## 9. 下一輪工程驗證清單

| 優先 | 工作 | 完成條件 |
|---|---|---|
| P0 | 固定版本、目標 OS/硬體 | 乾淨安裝可重現，有實際依賴清單 |
| P0 | 預設 Dashboard 存取鏈 | 安裝結束即能由指定入口存取，非靠之後 watchdog 補好 |
| P0 | 搜尋/通道/Skill/MCP 保存矩陣 | restart/rebuild/recreate 後核對設定、憑證與真實功能 |
| P0 | 取消任務與資源控制 | 頂層、子任務、瀏覽器與模型請求可收尾，主機仍可操作 |
| P0 | 重測 OpenClaw D25、Hermes D20 | 以出貨版本及實際 UI/API 路徑驗證，不沿用舊版勝率 |
| P0 | 備份與整機復原 | 涵蓋遺漏路徑、憑證重接及失敗復原演練 |
| P1 | 開機自啟、斷網、模型離線 | 狀態清楚且可恢復；不支援離線則寫入規格 |
| P1 | 排程時區/投遞/重啟恢復 | Asia/Taipei 設定後如期觸發，失敗可追溯 |
| P1 | 長期運作與更新 | 建議先做至少 7 天觀察，再延長至出貨標準；非既有測試結果 |

## 10. 定案前仍需決定什麼

1. 主要使用者及三個核心任務：個人助理、研究、開發或電商巡查？
2. 單機是否包含模型服務？可否接外部 API 或 AIDMS 的推論端點？
3. 出貨形式是 ISO 選裝、Linux 安裝包、容器套件或其他？Windows/macOS DinD 不能由本庫推定已支援。
4. 一人或多人？對話、記憶、檔案與權限如何隔離？
5. 預設 Agent、必備擴充/通道、可接受停機與遠端管理方式？

[ISO 草案](https://gitlab.com/leadtek/agentpack/-/blob/d3fe1734fa95d87760145a823975eeebff8cbb6b/docs/nemoclaw/iso-product-spec.md) 的出廠準備／首次設定分工仍有價值，但文件自己註明早於 DinD 與後續發現，未整體重寫。兩個 vLLM、fallback、多租戶等不能當成已核定或實測完成。

市場調查檔含 ASUS/Dell/Beelink 與雲端服務，但本次只閱讀庫內研究，未重查外部網站、效能、價格及預裝範圍，不把那些舊說法當作規格的已驗證前提。

## 11. 延伸閱讀

- [62 個檔案完整來源索引](source-inventory.html)
- [Agent Pack 研究入口](../index.html)
- [知識庫首頁](../../../index.html)

本研究只將分析與索引存入知識庫，未匯入產品部署程式碼，未 commit/push、部署或更改原始 repo。
