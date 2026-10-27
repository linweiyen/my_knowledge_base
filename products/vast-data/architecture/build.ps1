$ErrorActionPreference = 'Stop'
$source = Join-Path $PSScriptRoot 'research.md'
$markdown = Get-Content -LiteralPath $source -Raw
$body = $markdown -replace '(?s)\A---\r?\n.*?\r?\n---\r?\n', ''
$content = (ConvertFrom-Markdown -InputObject $body).Html
$style = 'body{margin:0;background:#f4f7fb;color:#172033;font-family:Segoe UI,Microsoft JhengHei,sans-serif;line-height:1.85}main{max-width:1060px;margin:30px auto;padding:32px;background:white;border-radius:18px}h1,h2{line-height:1.4}h2{margin-top:2.2em;border-bottom:1px solid #dde4ef;padding-bottom:10px}a{color:#1756b9}table{width:100%;border-collapse:collapse;font-size:.94rem;display:block;overflow-x:auto}td,th{border:1px solid #dce3ee;padding:10px;text-align:left}th{background:#eef4fc}pre{overflow:auto;background:#eef3fa;padding:20px;border-radius:10px}nav{font-size:.9rem}@media(max-width:700px){main{margin:0;padding:20px;border-radius:0}}'
$html = '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VAST Data 架構研究</title><style>' + $style + '</style></head><body><main><nav><a href="../../../index.html">知識庫首頁</a> · <a href="../index.html">VAST Data</a> · <a href="research.md">Markdown 原文</a></nav>' + $content + '</main></body></html>'
$html | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'index.html') -Encoding utf8
