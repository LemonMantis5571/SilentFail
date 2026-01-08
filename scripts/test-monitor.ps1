# Test Monitor Script for SilentFail
# Usage: .\test-monitor.ps1 -PingId <ping-id> [-Interval <seconds>]

param(
    [Parameter(Mandatory=$true)]
    [string]$PingId,
    
    [int]$Interval = 30
)

$AppUrl = if ($env:APP_URL) { $env:APP_URL } else { "http://localhost:3000" }
$PingUrl = "$AppUrl/api/ping/$PingId"

Write-Host "🔕 SilentFail Test Monitor" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📡 Ping URL: $PingUrl"
Write-Host "⏱️  Interval: $Interval seconds"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔄 Running... Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

while ($true) {
    $Timestamp = Get-Date -Format "HH:mm:ss"
    
    try {
        $Response = Invoke-WebRequest -Uri $PingUrl -Method Get -UseBasicParsing
        Write-Host "✅ [$Timestamp] Ping successful ($($Response.StatusCode))" -ForegroundColor Green
    }
    catch {
        $StatusCode = $_.Exception.Response.StatusCode.value__
        if ($StatusCode) {
            Write-Host "⚠️  [$Timestamp] Ping failed ($StatusCode)" -ForegroundColor Yellow
        } else {
            Write-Host "❌ [$Timestamp] Ping error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Seconds $Interval
}
