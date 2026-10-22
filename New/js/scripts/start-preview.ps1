$ErrorActionPreference = 'Stop'
$previewRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
$previewUrl = 'http://127.0.0.1:5173/Portfolio-YoungSliker/New/'
function Test-Preview {
    try {
        $response = Invoke-WebRequest -Uri $previewUrl -TimeoutSec 2 -UseBasicParsing
        return $response.StatusCode -eq 200 -and $response.Content.Contains('/@vite/client')
    } catch { return $false }
}
try {
    if (-not (Test-Preview)) {
        $nodePath = (Get-Command node -ErrorAction Stop).Source
        if (-not (Test-Path -LiteralPath (Join-Path $previewRoot 'node_modules\vite\bin\vite.js'))) {
            throw 'Preview dependencies are missing. Please ask Codex to restore them.'
        }
        Start-Process -FilePath $nodePath -ArgumentList @('node_modules/vite/bin/vite.js', '--host', '127.0.0.1') -WorkingDirectory $previewRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $previewRoot 'preview-server.log') -RedirectStandardError (Join-Path $previewRoot 'preview-server-error.log')
        $previewReady = $false
        for ($attempt = 0; $attempt -lt 30; $attempt++) {
            Start-Sleep -Milliseconds 500
            if (Test-Preview) { $previewReady = $true; break }
        }
        if (-not $previewReady) { throw 'Preview did not start. Please share preview-server-error.log with Codex.' }
    }
    Start-Process $previewUrl
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    Read-Host 'Press Enter to close'
    exit 1
}
