# 知識庫

個人技術研究與產品決策的長期知識庫，內容聚焦 AIDMS、GPU 基礎設施、AI research 與 AI coding。研究成果保留來源、限制與查證狀態，方便日後閱讀、搜尋與交叉引用。

## 閱讀入口

- [知識庫首頁](index.html)：以研究卡片與完整檔案樹瀏覽全部內容
- [工作區規劃](KNOWLEDGE_BASE_PLAN.md)：目錄、命名、研究格式與維護規則
- [待整理資料](inbox/)：尚未完成分類的新資料

## 目前研究

### AIDMS 產品與架構

- [AIDMS 的演進與推論工程定位](products/aidms/architecture/inference-engineering/aidms-evolution-inference.html)
- [AIDMS GPU Sharing Strategy：MPS 與 MIG](products/aidms/architecture/gpu-sharing/aidms_mps_mig_full_report.html)
- [AIDMS × Supermicro HGX B300](products/aidms/architecture/hgx-b300/aidms-hgx-b300.html)
- [Backend.AI vs AIDMS](products/aidms/competitors/backend-ai/backend_ai_vs_aidms_table.html)
- [Inference Router 研究筆記](products/aidms/architecture/inference-router/research.md)

### GPU

- [B300 vs RTX PRO 6000 Blackwell](products/gpu/b300-vs-rtx-pro-6000/pro6000_vs_b300.html)

### AI Coding

- [AI Harness Engineering 與 Context Engineering](topics/ai-coding/harness-engineering/overview/ai_harness_engineering_report.html)
- [Harness Engineering of Claude Code](topics/ai-coding/tools/claude-code/harness_engineering_of_claude_code.html)

### AI Research

- [Agentic AI 的 Agent Evaluation 方法論](topics/ai-research/evaluation/agent-evaluation/agent_evaluation_methodology_report.html)
- [驗證 Fine-tuned LLM 的方法論](topics/ai-research/evaluation/llm-evaluation/llm_evaluation_methodology.html)

## 目錄結構

```text
MyKnowledgeBase/
├── index.html                 # 知識庫網站首頁
├── products/                  # AIDMS 與 GPU 產品研究
│   ├── aidms/
│   │   ├── architecture/      # 架構、推論、GPU 共享與基礎設施
│   │   ├── competitors/       # 競品與橫向比較
│   │   ├── requirements/      # 使用情境與需求
│   │   └── decisions/         # 已採用的決策與理由
│   └── gpu/                   # GPU 規格、比較與選型
├── topics/                    # 通用 AI 研究與 AI coding
│   ├── ai-research/
│   └── ai-coding/
├── radar/                     # 具時效性的動態與追蹤線索
├── inbox/                     # 等待分類與整理的暫存區
├── _templates/                # 可複用的研究寫作範本
└── archive/                   # 已停止維護或被取代的內容
```

## 研究筆記慣例

- 同一份研究只保留一個主要位置，跨主題用連結引用。
- AIDMS 的具體應用與決策放在 `products/aidms/`；通用知識放在 `topics/`。
- 最新、仍需追蹤的資訊先記錄在 `radar/`，再視價值整理成完整研究。
- 新研究優先以 Markdown 維護；既有 HTML 報告可保留作為閱讀版本。
- 未重新核對的內容不視為已驗證結論；研究筆記應清楚區分外部事實、推論、建議與決策。

## 維護方式

研究內容以 Git 保存。新增或修改研究後，請同步更新對應的入口頁與連結；根目錄 `index.html` 是完整瀏覽入口，`README.md` 是 GitHub 儲存庫首頁說明。
