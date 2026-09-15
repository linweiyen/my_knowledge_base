---
title: AIDMS 推論路由器：功能與操作流程
created: 2026-09-10
updated: 2026-09-10
verified: null
status: draft
tags: [aidms, inference-router, llm-d, autoscaling]
---

# AIDMS 推論路由器設計

在 Project 下新增「推論路由器」Tab。使用者可以建立路由器，加入既有 LLM Job，或批次建立新的 LLM Job，並在此設定自動擴縮。每個路由器提供固定的推論 endpoint，由 llm-d 協助分配請求。

## 01｜功能定位

AIDMS 已有 Project 資源分配與 Job 建立功能。本次擴充讓使用者管理「哪些 Job 一起接收推論請求」，以及這組 Job 如何隨負載增減。

| 名稱 | 在本設計中的意思 |
| --- | --- |
| Project | 路由器與 Job 所屬的資源、權限範圍。 |
| LLM Job | 執行模型推論的工作，例如執行 vLLM＋Qwen 的 Pod。 |
| 推論路由器 | 接收請求，從指定的 LLM Job 中選擇可用 Job，轉送請求並回傳結果。 |
| 路由器 endpoint | 提供給應用程式呼叫的固定 API 位址。 |
| Job endpoint | 個別 LLM Job 提供的 API 位址，由系統追蹤。 |

產品介面統一稱為「推論路由器」。llm-d 是背後採用的實作方案，使用者透過 AIDMS 操作即可。

## 02｜Project 與 Job 的關係

一個 Project 可以建立多個推論路由器；每個路由器可以選用該 Project 下的一個或多個 LLM Job。

```text
Project A
├─ 推論路由器 1 → LLM Job A、B
└─ 推論路由器 2 → LLM Job C、D

應用程式 → 路由器 1 的 endpoint → Job A 或 Job B
應用程式 → 路由器 2 的 endpoint → Job C 或 Job D
```

同一路由器內的 Job 應提供相容的模型版本與推論 API，確保請求分配到任一 Job 都能得到預期服務。路由器只能選取所屬 Project 的 Job。

## 03｜新增推論路由器

操作入口：Project → 推論路由器 → 新增。

先填寫路由器名稱，再選擇「加入既有 Job」或「批次建立 Job」。建立完成後取得固定的路由器 endpoint。

| 建立方式 | 使用者填寫或選擇 | AIDMS 處理 |
| --- | --- | --- |
| 加入既有 Job | 勾選本 Project 已啟用的 LLM Job。 | 檢查模型相容性，建立關聯，取得 Job endpoint。 |
| 批次建立 Job | 指定模型與執行設定、每個 Job 的資源、初始 Job 數量。 | 檢查 Project 可用資源，批次建立 Job，準備完成後加入路由器。 |

既有 Job 的選取清單建議顯示：

| 選取 | Job 名稱 | 模型／版本 | 狀態 |
| --- | --- | --- | --- |
| 已選 | qwen-job-a | Qwen／版本 X | 可用 |
| 已選 | qwen-job-b | Qwen／版本 X | 可用 |
| 未選 | qwen-job-c | Qwen／版本 Y | 模型不相容，不可選 |

批次建立的操作範例：

```text
路由器名稱：qwen-router
Job 來源：批次建立 Job
模型與執行設定：選擇 Qwen 設定
每個 Job 的資源：指定 GPU、CPU、記憶體
初始 Job 數量：3
自動擴縮：關閉／開啟
```

按下建立後，畫面呈現建立進度與 Job 狀態。只有模型載入完成且可接收請求的 Job，才會被路由器選用。沒有可用 Job 時，顯示「尚無可用 Job」，而非已可服務。

## 04｜建立後的管理畫面

路由器清單顯示名稱、狀態、可用／已加入 Job 數量、自動擴縮開關，以及複製 endpoint 的操作。

進入路由器詳情後，可執行以下操作：

| 操作 | 預期行為 |
| --- | --- |
| 複製 endpoint | 取得應用程式使用的固定推論網址。 |
| 查看 Job | 顯示已加入的 Job、模型、狀態，以及來自手動加入或批次建立。 |
| 加入既有 Job | 勾選其他相容 Job，加入此路由器。 |
| 批次建立 Job | 依指定設定建立更多 Job，準備完成後加入。 |
| 移除 Job | 停止將新請求送到該 Job，解除關聯；此操作本身不刪除 Job。 |
| 調整自動擴縮 | 修改最少／最多 Job 數與擴縮條件。 |
| 刪除路由器 | 移除路由器與入口；需事先定義其管理的 Job 是否一併刪除。 |

Job 數量變動時，路由器 endpoint 維持不變。新 Job 只有在使用者選取，或透過此路由器的建立／擴容流程產生時才加入。

## 05｜請求如何處理

1. 應用程式呼叫路由器 endpoint。
2. 系統檢查呼叫者是否有權使用此路由器。
3. 推論路由器從已加入且可用的 Job 中選擇一個。
4. 將請求送到該 Job endpoint。
5. 將回答或串流內容回傳給應用程式。

AIDMS 記錄路由器與 Job 的關聯，並透過整合機制讓 llm-d 取得目前可用的 Job。Job endpoint 改變時由系統更新，使用者不必重新輸入 IP 與 Port。

Job 暫時不可用時停止派送；恢復可用後重新納入。全部 Job 都不可用時，回傳清楚的服務暫時不可用訊息。

## 06｜自動擴縮

自動擴縮設定放在推論路由器中，調整的是它所管理的 LLM Job 數量。

| 設定 | 意義 |
| --- | --- |
| 啟用自動擴縮 | 是否依負載自動增減 Job。 |
| Job 建立設定 | 新 Job 使用的模型、執行參數與資源需求。 |
| 最少 Job 數量 | 保持的最低容量。 |
| 最多 Job 數量 | 可擴展的數量上限，仍受 Project 資源限制。 |
| 擴縮條件 | 例如等待請求數或回應延遲，門檻由實測決定。 |
| 調整間隔 | 避免短時間反覆增加與減少 Job。 |

增加容量：負載達到條件 → AIDMS 檢查可用資源 → 建立 Job → Job 可用後加入路由。

減少容量：符合縮容條件 → 停止派送新請求 → 等待既有請求完成或達到設定的等待上限 → 移除並釋放系統管理的 Job。

建議先讓自動擴縮只管理依路由器建立設定產生的 Job；手動加入的既有 Job 保留原生命週期，不自動刪除。最少／最多 Job 數也先針對自動管理的 Job 計算。此規則是實作建議，需在開發前確認。

當 Project 資源不足時，顯示「無法擴容」與原因，並保留目前仍可運作的 Job。

## 07｜開發前確認事項

產品方向已確定為「Project 下管理推論路由器」。以下細節仍需確認：

- 同一個 Job 是否允許同時加入多個推論路由器。
- 刪除路由器時，批次建立的 Job 要保留還是刪除；手動加入的 Job 建議預設保留。
- 固定 Job 數量模式是否需要在故障後自動補足。
- AIDMS 如何把 Job 關聯、endpoint 與狀態同步給 llm-d，以及擴縮如何沿用現有資源分配流程。
- 路由器執行元件的部署方式；產品上的一個路由器不必固定對應一個 Pod。

> 本文為功能設計草案，依使用者描述的 AIDMS 現況整理；尚未核對現有 API 或完成 llm-d 整合測試。

參考：[AIDMS API 文件（尚未成功讀取）](https://10.1.2.1:20443/api/v1/docs) · [llm-d 官方架構](https://llm-d.ai/docs/architecture) · [llm-d 服務發現文件](https://llm-d.ai/docs/architecture/core/inferencepool)。官方連結沿用先前討論資料，本次未重新查證。

相關研究：[AIDMS 演進與 Inference Engineering](../inference-engineering/aidms-evolution-inference.html)。
