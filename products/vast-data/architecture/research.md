---
title: VAST Data 架構研究：DASE 與 AI 資料平台
created: 2026-10-21
updated: 2026-10-21
verified: 2026-10-21
status: research-note
tags: [vast-data, dase, storage, ai-infrastructure]
---

# VAST Data 架構研究

查證日期：2026-10-21。範圍：VAST Data，非 Vast.ai。本文以公開官方文件為依據，未取得設備進行實測；verified 表示已核對所列來源，不代表所有功能均經實測或適用所有版本。沒有作出採購或架構採用決策。

## 1. 研究摘要

VAST 的核心是 DASE（Disaggregated Shared Everything）：將處理邏輯與持久狀態分離，讓各 CNode 透過 NVMe fabric 存取共享資料及 metadata。重點是「共享資料結構與狀態」，不只是多台主機連到同一組磁碟。這讓運算與容量能分別擴充。[官方架構概覽](https://www.vastdata.com/platform/how-it-works)、[共享架構說明](https://www.vastdata.com/blog/vasts-datastore-and-the-case-for-true-shared-everything-architecture)

**研究判斷：**VAST 值得研究的地方是如何減少資料所有權、跨協定複製與節點狀態管理的成本。是否提高 GPU 利用率，仍取決於工作負載、網路與實際配置；架構本身不能保證效果。

## 2. 架構元件與邊界

| 元件 | 角色 | 理解重點 |
| --- | --- | --- |
| CNode | 執行 VAST OS 的伺服器／容器 | 處理請求與資料服務；與用戶端 GPU 計算節點不同 |
| DBox | 含 SSD 與 NVMe-oF 控制元件的儲存機箱 | 提供持久媒體與存取路徑 |
| DNode | DBox 內的 NVMe-oF 控制卡 | 不應把 DNode 與整個 DBox 畫上等號 |
| EBox | 同時執行 CNode、DNode 容器 | 實體放在一起，邏輯上仍共享媒體 |
| Element Store | 統一資料儲存結構 | 涵蓋 file、object、block、table、vector |
| View | 暴露 Element Store 路徑的配置 | 指定存取協定及相關安全設定 |
| VMS | VAST Management Service | 管理叢集 |

來源：[官方術語文件，標記 5.4，2026-02-04 更新](https://kb.vastdata.com/documentation/docs/vast-cluster-concepts-and-terminology)。協定和功能支援仍需對照目標版本。

```text
應用程式／GPU 訓練與推論主機
             │ 用戶端存取網路
             ▼
    CNode A    CNode B    CNode C
    協定處理、資料服務、儲存邏輯
             │ NVMe fabric
             ▼
    共享 SSD：資料、metadata、持久狀態
        位於 DBox 或 EBox

邏輯底座：Element Store → 協定與上層資料服務
```

這是概念圖，沒有表示實際交換器、冗餘路徑或機箱數量。用戶端網路與後端 fabric 的用途應分開評估。

## 3. EBox 是否代表回到超融合？

EBox 把運算與 SSD 放進同一台伺服器，但其 CNode 不獨占本機 SSD；各 CNode 仍可經 fabric 存取所有 SSD。因此，實體共置不代表資料依本機運算節點切割。官方於 2025 年描述支援 CNode 與 EBox 混合，以增加服務運算資源。該文章明示可能過時，部署前需再核對支援矩陣。[官方 EBox 說明](https://www.vastdata.com/blog/mixing-cnodes-eboxes-power-future-ai-infrastructure)

**研究判斷：**增加 CNode 可以增加處理資源，但若瓶頸已是 SSD、fabric 或用戶端頻寬，增加 CNode 不一定繼續提高吞吐。

## 4. 一次讀寫如何經過系統

依[官方白皮書](https://www.vastdata.com/whitepaper)的 DataStore 說明：

1. **讀取：**CNode 找到 Element 的 metadata V-Tree，沿指標定位內容，再讀取資料並回傳。
2. **寫入：**先將資料放入受保護的持久寫入緩衝，更新 metadata 後確認寫入。
3. **背景整理：**將緩衝內容縮減、編碼並寫入容量 flash，更新指標，再回收緩衝空間。

緩衝不是只存在 DRAM 的暫存。持續寫入仍需要背景處理能追上輸入速度。metadata 使用交易式更新；並行寫入仍有鎖與故障協調機制。

**研究判斷：**短時間測速可能主要測到緩衝能力。應測長時間穩態寫入、背景整理與讀取同時發生時的尾延遲。新寫入資料的讀取也應列入測試，不能只測已整理到容量層的資料。

## 5. Metadata 與「無狀態」的精確意義

官方將名稱、ACL、鎖等 metadata 放在共享非揮發媒體，以鏡像及分散結構維護一致來源；交易需要完整套用或不套用。[Metadata Indexing](https://www.vastdata.com/features/metadata-indexing)

**研究判斷：**CNode 無狀態指重要持久狀態沒有被綁死在某台 CNode，不能推導為沒有程序記憶體、連線或所有協調都消失。一般架構概覽對「無 east-west traffic」的描述，應與白皮書中的鎖處理一起閱讀；不宜解讀為任意負載、任何故障期間都完全沒有節點間通訊。

## 6. 從儲存底座到 AI 平台

官方目前使用 VAST AI Operating System 名稱，主要服務包括：

| 服務 | 架構位置 |
| --- | --- |
| DataStore | 儲存與資料保護、協定存取 |
| DataBase | 結構化資料與查詢 |
| DataEngine | 事件驅動的函數與資料處理 |
| DataSpace | 跨站點資料存取與命名空間 |

來源：[官方白皮書](https://www.vastdata.com/whitepaper)。本文將服務名稱作為概念分層，實際版本可用性與授權需另核對。

同一份資料以不同協定使用，是平台的一項重點：官方示範 S3 上傳、NFS 處理、SMB 讀取同一底層資料。[共享架構說明](https://www.vastdata.com/blog/vasts-datastore-and-the-case-for-true-shared-everything-architecture)

**研究判斷：**多協定共享可減少流程中的資料副本，但不代表所有資料型別能任意以所有協定操作；ACL、檔案／物件語意及應用相容性仍要驗證。跨站點統一入口也不會消除 WAN 延遲與資料傳輸成本。

## 7. 與 shared-nothing 的比較

以下是概念比較與研究推論，不能套用到每一家產品。

| 面向 | 常見 shared-nothing 設計 | VAST DASE 的取向 |
| --- | --- | --- |
| 資料所有權 | 節點管理所屬分片或裝置 | CNode 共享存取資料與 metadata |
| 擴充 | 常需同時考慮容量與節點運算配比 | 可分別增加處理資源與容量 |
| 存取路徑 | 可能轉送至資料擁有者 | CNode 可透過 fabric 存取媒體 |
| 平台依賴 | 依賴分片、路由與重平衡實作 | 依賴共享資料結構與 fabric 設計 |
| 選型驗證 | 看熱點、重平衡與跨節點成本 | 看 fabric 飽和、共享資源競爭及故障域 |

設計依據：[DASE 概覽](https://www.vastdata.com/platform/how-it-works)。這不是與特定競品的實測排名。

## 8. 資料保護與容易誤讀的宣稱

VAST 使用 erasure coding、資料縮減與 metadata 保護。實際可承受的故障取決於機箱型態與保護配置，不能把 SSD、DNode、整箱與機櫃故障混為一談。[官方白皮書](https://www.vastdata.com/whitepaper)

| 常見說法 | 研究時應如何解讀 |
| --- | --- |
| 運算與容量獨立擴充 | 可分別擴充，不代表所有資源都不互相影響 |
| 全域共享 | 資料可見性仍受權限控制；也不等於單一故障域 |
| 線性擴充 | 官方架構主張，需要以指定負載與硬體驗證 |
| 高資料縮減率 | 應以自己的資料測試，不能直接作為容量採購乘數 |
| AI OS | 是平台定位；各服務的成熟度與相容性需分別評估 |

**研究判斷：**容量估算應包含保護、metadata、快照、可用空間與故障重建餘裕，不能只用 raw SSD 容量乘上縮減比。高可用也不等同備份或異地災難復原。

## 9. 對 AI 工作負載與 AIDMS 的意義

以下為研究推論，非已驗證效益或已核定產品決策。

- **訓練：**共享資料可簡化多 GPU 主機資料供應；需分別測大檔串流、小檔案、資料增強與 checkpoint 寫入。
- **推論：**模型載入與冷啟動可能受儲存影響；穩態 token 生成是否受益，要看模型、記憶體與 serving 架構。
- **RAG：**資料進入、處理與查詢服務整合值得研究；仍需測過濾查詢、更新可見性、權限與刪除傳播。
- **AIDMS 整合：**可先把 VAST 當作共享資料基礎設施候選，檢查掛載、身分映射、Project 權限、配額與監控。若引入 DataEngine 等服務，則需明確界定與既有 Job／排程功能的責任。

## 10. 建議 PoC 與未解問題

| 驗證項目 | 方法與觀察指標 |
| --- | --- |
| GPU 是否等資料 | 比較相同模型、資料與 GPU 配置的吞吐、資料等待時間、GPU 利用率 |
| 穩態寫入 | 測超過緩衝突發期的持續寫入，觀察 p95／p99 延遲與背景整理 |
| 小檔與 metadata | 大量建立、列目錄、stat、開關檔，同時混入讀寫 |
| 混合負載 | 訓練讀取＋checkpoint＋查詢／資料處理，觀察互相干擾 |
| 故障恢復 | 經核准在隔離環境測 CNode、路徑及儲存故障；記錄中斷與重建期間效能 |
| 多租戶 | 驗證協定間身分與 ACL、配額、快照／複製權限及資源競爭 |
| 多站點 | 冷資料首次讀取、重複讀取、WAN 中斷、衝突與恢復行為 |
| 成本 | 以有效可用容量、所需效能、網路、授權、維護及成長空間估算 |

仍需取得：目標 VAST OS 版本、硬體與交換器清單、部署規模、協定支援矩陣、故障域設計、服務授權、資料集特徵與實測結果。目前公開資料不足以核定特定環境的效能、最低採購規模或成本效益。

## 11. 來源與適用限制

所有來源於 2026-10-21 存取；以下均為供應商第一手資料，並非獨立評測。

1. [VAST AI OS White Paper](https://www.vastdata.com/whitepaper)：架構、讀寫、交易與保護；動態頁面，內容有版本及配置差異。
2. [DASE：How It Works](https://www.vastdata.com/platform/how-it-works)：設計原則；效能及成本描述包含行銷主張。
3. [Cluster Concepts and Terminology](https://kb.vastdata.com/documentation/docs/vast-cluster-concepts-and-terminology)：官方術語，5.4 標記。
4. [Mixing CNodes and EBoxes](https://www.vastdata.com/blog/mixing-cnodes-eboxes-power-future-ai-infrastructure)：2025-05-29；頁面明示可能過時。
5. [True Shared-Everything Architecture](https://www.vastdata.com/blog/vasts-datastore-and-the-case-for-true-shared-everything-architecture)：2026-05-13；共享資料及跨協定示範。
6. [Metadata Indexing](https://www.vastdata.com/features/metadata-indexing)：metadata 與交易一致性。

相關研究：[AIDMS 推論路由器](../../aidms/architecture/inference-router/research.md)。
