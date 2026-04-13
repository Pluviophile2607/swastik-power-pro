$dashboardPath = 'C:\Users\Admin\Documents\Solar-power\client\src\components\Dashboard.jsx'
$modalPath = 'C:\Users\Admin\Documents\Solar-power\InvoiceDetailModal_fixed.jsx'
$outputPath = 'C:\Users\Admin\Documents\Solar-power\client\src\components\Dashboard_fixed.jsx'

$lines = Get-Content $dashboardPath
$modalFunc = Get-Content $modalPath -Raw

# Line numbers (1-indexed in IDE, 0-indexed in PowerShell array)
# function InvoiceDetailModal starts at line 2194
$startIndex = 2194 - 1
# ends at line 2314
$endIndex = 2314 - 1

$prefix = $lines[0..($startIndex-1)]
$suffix = $lines[($endIndex+1)..($lines.Count-1)]

$prefix | Set-Content $outputPath -Encoding utf8
$modalFunc | Add-Content $outputPath -Encoding utf8
$suffix | Add-Content $outputPath -Encoding utf8

Move-Item -Path $outputPath -Destination $dashboardPath -Force
