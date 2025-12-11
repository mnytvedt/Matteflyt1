# Inline Google Fonts into a single HTML file by downloading woff2/ttf files and embedding them as base64.
# Usage: run from repository root or run from dist-standalone directory.
# Created by assistant on demand — backs up original file to MatteFlyt-single.html.bak

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $root) { $root = Get-Location }
$html = Join-Path $root 'MatteFlyt-single.html'
if (-not (Test-Path $html)) {
    Write-Error "File not found: $html"
    exit 1
}

Write-Host "Reading: $html"
$content = Get-Content -Path $html -Raw -Encoding UTF8

# Try to find a Google Fonts stylesheet link first; if not present, look for an existing @font-face <style> block
$cssLinkMatch = [regex]::Match($content, 'href\s*=\s*"(https://fonts\.googleapis\.com/css2[^"]*)"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
if ($cssLinkMatch.Success) {
    $cssUrl = $cssLinkMatch.Groups[1].Value
    Write-Host "Found Google Fonts CSS URL: $cssUrl"
    # Download the CSS from Google Fonts
    try {
        $cssResponse = Invoke-WebRequest -Uri $cssUrl -UseBasicParsing -ErrorAction Stop
        $css = $cssResponse.Content
    } catch {
        Write-Error "Failed to download Google Fonts CSS: $cssUrl`n$_"
        exit 1
    }
} else {
    Write-Host "No Google Fonts stylesheet link found; searching for existing @font-face <style> block in the HTML..."
    $css = $null
    $existingStyle = $null
    $styleMatches = [regex]::Matches($content, '<style[^>]*>(.*?)</style>', [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    foreach ($m in $styleMatches) {
        if ($m.Groups[1].Value -match '@font-face') {
            $css = $m.Groups[1].Value
            $existingStyle = $m.Value
            break
        }
    }
    if (-not $css) {
        Write-Host "No @font-face style blocks found. Nothing to inline."
        exit 0
    }
    Write-Host "Found existing @font-face style block in HTML; will inline its external font URLs."
}

# Find font URLs in the CSS (fonts.gstatic.com) - handle .woff2 and .ttf
$pattern = @'
url\(\s*['"]?(https://fonts\.gstatic\.com/[^'")]+?\.(?:woff2|ttf)[^'")]*)['"]?\s*\)
'@
$fontMatches = [regex]::Matches($css, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$unique = $fontMatches | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique

if ($unique.Count -eq 0) {
    Write-Host "No external fonts (woff2/ttf) found in CSS. Inserting CSS as-is."
    $modifiedCss = $css
} else {
    Write-Host "Found $($unique.Count) unique font URL(s). Downloading and encoding..."

    $tempDir = Join-Path $root 'tmp-fonts'
    if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue }
    New-Item -Path $tempDir -ItemType Directory -Force | Out-Null

    $replacements = @{}
    foreach ($u in $unique) {
        try {
            $fileName = [IO.Path]::GetFileName($u)
            $out = Join-Path $tempDir $fileName
            Write-Host "Downloading: $u"
            Invoke-WebRequest -Uri $u -OutFile $out -UseBasicParsing -ErrorAction Stop
            $bytes = [System.IO.File]::ReadAllBytes($out)
            $b64 = [Convert]::ToBase64String($bytes)
            $ext = [IO.Path]::GetExtension($out).TrimStart('.').ToLower()
            switch ($ext) {
                'woff2' { $mime = 'font/woff2' }
                'ttf'   { $mime = 'font/ttf' }
                default { $mime = 'application/octet-stream' }
            }
            $dataUrl = "data:$mime;base64,$b64"
            $replacements[$u] = $dataUrl
        } catch {
            Write-Warning "Failed to download or encode $u; skipping. $_"
        }
    }

    # Replace the URLs in the CSS with data URIs
    $modifiedCss = $css
    foreach ($k in $replacements.Keys) {
        $escaped = [regex]::Escape($k)
        $modifiedCss = [regex]::Replace($modifiedCss, "url\(\s*$escaped\s*\)", "url($($replacements[$k]))", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    }
}

# Remove preconnect/link tags for Google Fonts and fonts.gstatic (if present)
$content2 = $content
$content2 = [regex]::Replace($content2, '<link[^>]+https://fonts.googleapis.com[^>]*>', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$content2 = [regex]::Replace($content2, '<link[^>]+https://fonts.gstatic.com[^>]*>', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
# Remove preconnects (generic)
$content2 = [regex]::Replace($content2, '<link[^>]+rel\s*=\s*"preconnect"[^>]*>', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
# If an existing <style> block with @font-face was found earlier, remove it so we can replace it with the updated CSS
if ($existingStyle) {
    $content2 = [regex]::Replace($content2, '<style[^>]*>.*?@font-face.*?</style>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
}

# Build the <style> block containing the inlined CSS
$styleBlock = "<style>/* Inlined Google Fonts CSS - generated by inline-google-fonts.ps1 on $(Get-Date -Format o) */`n$modifiedCss`n</style>`n"

# Insert style block before </head>, or at top if </head> not found
if ($content2 -match '(?i)</head>') {
    $content2 = [regex]::Replace($content2, '(?i)</head>', [System.Text.RegularExpressions.Regex]::Escape($styleBlock) + "`n</head>", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
} else {
    $content2 = $styleBlock + $content2
}

# Backup and write
$bak = "$html.bak"
Copy-Item -Path $html -Destination $bak -Force
Set-Content -Path $html -Value $content2 -Encoding UTF8
Write-Host "Wrote updated HTML and backed up original to: $bak"

# Cleanup temp (only if tempDir exists)
if ($tempDir -and (Test-Path $tempDir)) { Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue }

# Verify no remaining external font references
$checks = Select-String -Path $html -Pattern 'fonts\.googleapis|fonts\.gstatic|fonts.googleapis.com|fonts.gstatic.com' -AllMatches -SimpleMatch -ErrorAction SilentlyContinue
if ($checks) {
    Write-Warning "Still found external font references in the generated HTML. Here are the first matches:"
    $checks | Select-Object -First 20 | ForEach-Object { Write-Host "Line $($_.LineNumber): $($_.Line.Trim())" }
    exit 2
} else {
    Write-Host "Success: All Google Fonts references appear to be inlined."
    exit 0
}
