$pub = "C:\Users\morten2307\OneDrive - Osloskolen\Apper\MatteFlyt-0-20\MatteFlyt-0-20\dist\public"

Write-Host "Reading assets from: $pub"
$cssPath = Join-Path $pub "assets\index-BxWOH_t4.css"
$jsPath = Join-Path $pub "assets\index-LEGQHKAy.js"
$htmlPath = Join-Path $pub "index.html"
$faviconPath = Join-Path $pub "favicon.png"
$ogPath = Join-Path $pub "opengraph.jpg"
$bigPngPath = Join-Path $pub "assets\colorful_3d_math_symbols_floating_playfully-C1h0DHav.png"

if (-not (Test-Path $cssPath)) { Write-Error "CSS not found: $cssPath"; exit 1 }
if (-not (Test-Path $jsPath)) { Write-Error "JS not found: $jsPath"; exit 1 }
if (-not (Test-Path $htmlPath)) { Write-Error "index.html not found: $htmlPath"; exit 1 }

$css = Get-Content $cssPath -Raw
$js = Get-Content $jsPath -Raw
$html = Get-Content $htmlPath -Raw

function To-Base64($path) {
    if (-not (Test-Path $path)) { return $null }
    return [Convert]::ToBase64String([IO.File]::ReadAllBytes($path))
}

$favicon = To-Base64 $faviconPath
$og = To-Base64 $ogPath
$png = To-Base64 $bigPngPath

# Replace image references in CSS with data URIs
if ($png) {
    $css = $css -replace '/assets/colorful_3d_math_symbols_floating_playfully-C1h0DHav.png', "data:image/png;base64,$png"
}

# Regex patterns that tolerate whitespace/newlines and attribute order
$cssPattern = '(?s)<link[^>]*href\s*=\s*"/assets/index-BxWOH_t4.css"[^>]*>'
$jsPattern = '(?s)<script[^>]*src\s*=\s*"/assets/index-LEGQHKAy.js"[^>]*>\s*</script>'

# Replace with inline CSS and JS (use Regex::Replace to match across newlines)
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $cssPattern, "<style>" + $css + "</style>", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $jsPattern, "<script>" + $js + "</script>", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

# Replace favicon reference
if ($favicon) {
    $html = [System.Text.RegularExpressions.Regex]::Replace($html, 'href\s*=\s*"/favicon.png"', 'href="data:image/png;base64,' + $favicon + '"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
}

# Replace meta image references (attached_assets/logo.png) -> use big png if available
if ($png) {
    $html = [System.Text.RegularExpressions.Regex]::Replace($html, 'content\s*=\s*"/attached_assets/logo.png"', 'content="data:image/png;base64,' + $png + '"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $html = [System.Text.RegularExpressions.Regex]::Replace($html, 'name\s*=\s*"twitter:image"\s+content\s*=\s*"/attached_assets/logo.png"', 'name="twitter:image" content="data:image/png;base64,' + $png + '"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
}

# Replace opengraph.jpg if present
if ($og) {
    $html = [System.Text.RegularExpressions.Regex]::Replace($html, 'content\s*=\s*"/opengraph.jpg"', 'content="data:image/jpeg;base64,' + $og + '"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
}

$outPath = Join-Path (Get-Location) "MatteFlyt-single.html"
Set-Content -Path $outPath -Value $html -Encoding UTF8
Write-Host "Created single-file HTML: $outPath"
Get-Item $outPath | Select-Object FullName, @{Name='SizeKB';Expression={[math]::Round($_.Length/1KB,2)}} | Format-Table -AutoSize
