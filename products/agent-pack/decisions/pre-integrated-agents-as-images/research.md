---
title: 決策：預整合 Agent 以驗證過的 Docker image 提供，第一版不依賴 NemoClaw／OpenShell
created: 2026-10-22
updated: 2026-10-22
verified: null
status: accepted
tags: [agent-pack, decision, docker, openshell, nemoclaw, pre-integrated-agents]
---

# 決策：預整合 Agent 以驗證過的 Docker image 提供，第一版不依賴 NemoClaw／OpenShell

**決策日期：2026-10-22｜狀態：使用者核定，工程驗證待執行**

> Agent Pack 第一版是「通用 Docker 容器平台＋驗證過的 image 目錄」。預整合 Agent（OpenClaw、Hermes 等）以經驗證的普通 Docker image 提供，與客戶自行上傳的 image 走同一套管理機制；第一版不把 NemoClaw／OpenShell 堆疊納入產品架構。

## 1. 背景

- Agent Pack 的目標客戶是只購買一台 GPU 工作站／伺服器的小型客戶，產品目的是開箱即用，客戶不需自行安裝 Ollama 等工具。
- [全庫閱讀研究](../../repository-review/index.html)指出，GitLab 現有的 OpenClaw／Hermes 部署方式是在 host Docker 內執行一個 privileged 外層容器，內含 NemoClaw CLI、OpenShell gateway 與巢狀 dockerd，再由巢狀 dockerd 管理各 Agent 的 sandbox。
- OpenShell 是 NVIDIA 的 Agent 沙箱執行環境，自帶 sandbox 生命週期、網路／檔案／process policy、推論路由與受管密鑰。NemoClaw 是 host 端的 CLI 與包裝層，驅動 OpenShell 資源，不取代它。依據：[NVIDIA NemoClaw 架構說明](https://docs.nvidia.com/nemoclaw/latest/user-guide/openclaw/about/how-it-works)（2026-10-22 查閱）。
- 若 Agent Pack 直接沿用該堆疊，會形成兩層管理系統並存：Agent Pack 管外層容器，OpenShell 管內層 sandbox；規劃中的容器清單、GPU 分配、資源配置與模型服務注入對內層 Agent 皆不生效。
- 全庫研究 §5 記錄的限制多數來自該包裝層而非 Agent 本身：單一 gateway 共用一條推論路由、設定異動觸發 rebuild 且有資料遺失紀錄、容器 Up 不代表可用、每次啟動先下載安裝腳本。

## 2. 候選方案

| 方案 | 做法 | 優點 | 代價 |
|---|---|---|---|
| A. 繼承現有堆疊 | Agent Pack 包裝 NemoClaw／OpenShell／DinD 外層容器 | 直接沿用 GitLab 既有部署與除錯經驗 | 兩層管理並存；privileged 容器與巢狀 dockerd；繼承推論路由、rebuild、健康檢查與離線啟動限制；與「簡單、Docker、單機」原則衝突 |
| B. 只提供上傳空間 | 平台只管理客戶自行上傳的 image，不提供預整合 Agent | 第一版範圍最小 | 客戶開箱後是空的，與開箱即用目標矛盾；售前無可展示內容 |
| C. 通用平台＋驗證 image 目錄（採用） | 預整合 Agent 以普通 Docker image 提供，與自製 image 共用同一機制，另加一個目錄頁 | 單一管理路徑；第一版複雜度大幅降低；目錄可從小開始 | 失去 OpenShell 的 policy 與受管密鑰，需以 Docker 層控制補最低限度圍欄；OpenClaw／Hermes 脫離包裝後是否可用需驗證 |

## 3. 採用理由

- 客戶買的是硬體，Agent Pack 的價值在於「在這台機器上裝好、驗過、有人維護」，而非自行開發 Agent 管制平台。類比 NAS 廠商的套件中心：套件多為開源軟體，價值在於一鍵安裝與維護。
- 預整合 Agent 的需求本身成立（開箱要有東西可用、可展示），不成立的是用 NemoClaw／OpenShell 實現它。拿掉堆疊後，「預整合」只是「我們驗證過的 image」，和客戶自製 image 的差別只在提供者。
- 第一版目錄可以很小：一個模型服務（vLLM 或 Ollama）加一個對話介面（例如 Open WebUI）即可達成開機可用；OpenClaw、Hermes 之後以 image 形式加入，是否納入依驗證結果決定。
- OpenShell 針對的是企業級 Agent 管制需求；對單機小型客戶，是否必要尚無證據，先不承擔其複雜度。

## 4. 影響

### 4.1 第一版需定義的「上傳空間」規格

| 項目 | 需定義的內容 |
|---|---|
| image 來源 | 上傳 tar 檔（`docker load`）、公開 registry 拉取、客戶內部 registry；內網／離線環境必須支援離線載入 |
| 容器設定 | GPU 選擇、環境變數、連接埠、資料掛載；模型 API 位址自動注入 |
| 相容 image 約定 | 接收 OpenAI 相容 base URL 的環境變數名稱、健康檢查路徑、持久化資料目錄；不符合約定的 image 仍可執行，僅狀態顯示與自動設定減少 |
| 安全邊界 | 任意 image 預設不給 privileged、不掛 Docker socket、GPU 只給指定的卡；此為不採 OpenShell 後必須自行補足的最低限度圍欄 |
| 支援責任 | 平台與目錄內 image 由我方支援；客戶自行上傳的 image 內容不在支援範圍，需寫入產品文件 |

### 4.2 對既有研究的影響

- [啟動會議簡報](../../kick-off/index.html)情境 D「選用預先整合的 Agent」與第一版能力範圍中的「選定預整合 Agent」，依本決策改讀為「驗證過的 image 目錄」；情境 C 與情境 D 共用同一接入機制。
- 全庫研究 §5.1（共享推論路由）、§5.2（rebuild／recreate）、§7 C10–C13 等限制，在新拓樸下不再直接適用，但不代表自動消失；驗證時需重新確認。
- GitLab 研究中關於 OpenClaw／Hermes 設定格式、記憶、任務取消與健康檢查的紀錄仍有效，作為驗證兩個 image 時的檢查清單。
- 本決策是 Agent Pack 的部署原則，不涉及 AIDMS 架構。

### 4.3 待執行的驗證（spike）

| 項目 | 完成條件 |
|---|---|
| OpenClaw 以普通容器執行 | 脫離 NemoClaw／OpenShell，直接跑在 host Docker 上並接上 Agent Pack 模型服務 API；列出跑不起來或缺少的功能 |
| Hermes 以普通容器執行 | 同上 |
| Docker 層圍欄 | 確認無 privileged、無 Docker socket、指定 GPU 的限制下，兩個 Agent 仍可完成基本情境 |
| 失去的能力清單 | 逐項列出 OpenShell 原提供的 policy、密鑰、推論路由能力，標註「不需要」「可用 Docker 替代」或「需另行設計」 |

預估一至兩週；結果在估工前提交。

## 5. 重新評估條件

- 企業客戶明確要求 Agent 的網路出口管制、資料外流管制或受管密鑰，且 Docker 層控制無法滿足時，評估加入 policy 層（可能是 OpenShell，也可能是其他方案）。
- spike 顯示 OpenClaw 或 Hermes 脫離 NemoClaw／OpenShell 後無法完成基本情境，且修補成本高於沿用堆疊時，就該 Agent 個別重新評估，不影響通用平台方向。
- Agent Pack 與 AIDMS 整合方式核定後，若要求統一 Agent 管制層，重新檢視本決策。

## 6. 相關研究

- [Agent Pack 研究入口](../../index.html)
- [產品規劃啟動會議簡報](../../kick-off/index.html)
- [全庫閱讀與單機管理系統研究](../../repository-review/index.html)
- [知識庫首頁](../../../../index.html)

本決策整理自 2026-10-22 的規劃討論。OpenClaw／Hermes 脫離包裝後的可用性尚未實測，`verified: null`。
