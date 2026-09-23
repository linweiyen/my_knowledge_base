---
title: AIDMS 1.0 與 2.0 功能比較
created: 2026-09-23
updated: 2026-09-23
verified: null
status: draft
tags: [aidms, product-evolution, version-comparison]
---

# AIDMS 1.0 與 2.0 功能比較

| 比較項目 | AIDMS 1.0 | AIDMS 2.0 |
| --- | --- | --- |
| 作業系統 | Ubuntu 20.04 | Ubuntu 24.04 |
| 系統架構 | 單機 Docker 架構 | Kubernetes 架構，可同時管理多台主機與多個節點 |
| 資源與工作管理 | 以單台主機的資源與工作環境為主 | 以 Project 配置多台主機的資源；建立 Job 時可指定執行節點 |
| Project 與使用者 | 支援 Project 與 User／角色管理 | 支援 Project 與 User／角色管理 |
| Job 類型 | 提供 Instance Job、CV Job | 提供 Instance Job、LLM Job；CV Job **預計於 2026/11 版本加入** |
| 電腦視覺（CV）功能 | 透過 CV Job 提供完整的 CV 訓練流程 | **預計於 2026/11 版本加入**參照 1.0 的 CV 功能；初期功能尚未完全齊備，但可執行完整訓練流程 |
| LLM 推論 | 可透過 Instance Job 啟動 LLM 服務，但無參數設定介面 | 透過 LLM Job 提供簡易的視覺化操作流程，讓使用者快速建立所需的 LLM 服務並設定相關參數；目前支援 vLLM 推論引擎 |
| AIDMS Backend API 調閱 | 不支援 | 支援 |
| 資安合規 | 僅支援 HTTP 傳輸 | 支援 HTTPS 加密傳輸，提供傳輸層加密、資料完整性保護（防篡改）與伺服器身分驗證 |
| 監控儀表板 | 僅提供 Netdata API | 整合 Grafana 與 Netdata 儀表板 |
| GPU 資源調配 | 使用 NVIDIA MPS | 使用 NVIDIA MPS |
| NVIDIA GPU Operator | 不支援 | **預計於 2026/11 版本支援** |
| 後續規劃 | **不再維護** | **後續發展主力** |

註：表中標示「預計於 2026/11 版本」的項目為規劃功能，與目前已提供的功能分開列示。內容依產品方於 2026-09-23 提供的資訊整理。

## Job 用詞說明

- **Instance Job：**提供使用者可操作的運算環境，供 AI 開發、測試或執行自訂工作使用；1.0 也可透過 Instance Job 啟動 LLM 服務。
- **CV Job：**執行電腦視覺模型的訓練工作。1.0 已提供相關流程；2.0 預計於 2026/11 版本加入。
- **LLM Job：**執行大型語言模型的推論服務。2.0 目前以 vLLM 作為支援的推論引擎。

## 版本演進與使用情境

### 從單機環境擴展到多主機管理

AIDMS 1.0 以單台 Ubuntu 20.04 主機上的 Docker 環境為基礎。AIDMS 2.0 改採 Ubuntu 24.04 與 Kubernetes，可集中管理多台主機的資源，並在 Project 中配置資源。建立 Job 時，使用者可指定執行節點。兩個版本都有 Project 與 User／角色管理。

### 從 CV 訓練延伸到 LLM 服務

1.0 已提供 Instance Job 與 CV Job，適合以電腦視覺模型開發、訓練為主的使用情境；也可透過 Instance Job 啟動 LLM 服務，但無參數設定介面。2.0 目前提供 Instance Job 與 LLM Job；使用者可透過簡易的視覺化操作流程快速建立 LLM 服務、設定相關參數，並以 vLLM 執行推論。2.0 的 CV Job 與相關 CV 功能預計於 2026/11 版本加入；初期功能尚未完全齊備，但可執行完整訓練流程。

### API 與 GPU 管理能力

2.0 增加 AIDMS Backend API 調閱功能；1.0 不提供此功能。兩個版本目前皆以 NVIDIA MPS 進行 GPU 資源調配。NVIDIA GPU Operator 為 2.0 預計於 2026/11 版本加入的能力，1.0 不支援。

### 適用情境

若主要需求是在單台主機上進行電腦視覺模型開發與訓練，1.0 的 Instance Job 與 CV Job 已提供相應流程。若需要集中管理多台主機、依 Project 配置資源，或透過專用的 LLM Job 管理推論服務，2.0 的多節點架構較符合需求。若使用情境同時依賴 CV Job，應以 2026/11 版本實際提供的功能範圍評估導入時程。

產品後續將以 2.0 為發展主力；1.0 不再維護。
