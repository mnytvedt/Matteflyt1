# Download and embed Google Fonts font files as base64 data URIs.
# This script searches the HTML for external fonts.gstatic.com references and embeds them.

$html_path = Join-Path (Split-Path -Parent $PSCommandPath) 'MatteFlyt-single.html'
if (-not (Test-Path $html_path)) {
    Write-Error "File not found: $html_path"
    exit 1
}

Write-Host "Reading: $html_path"
[string]$html = Get-Content -Path $html_path -Raw -Encoding UTF8

# Find all fonts.gstatic.com URLs in the HTML
$pattern = 'url\(([^)]*https://fonts\.gstatic\.com[^)]*\.ttf[^)]*)\)'
$matches = [regex]::Matches($html, $pattern)

if ($matches.Count -eq 0) {
    Write-Host "No fonts.gstatic.com TTF URLs found in HTML."
    exit 0
}

Write-Host "Found $($matches.Count) font URL(s) to embed"

# Track replacements
$replacements = @{}

# Create temp directory
$temp_dir = Join-Path (Split-Path -Parent $PSCommandPath) 'temp-fonts'
if (Test-Path $temp_dir) { Remove-Item $temp_dir -Recurse -Force }
New-Item $temp_dir -ItemType Directory -Force | Out-Null

# Process each unique URL
$unique_urls = @($matches | ForEach-Object { $_.Groups[1].Value.Trim("'`"") } | Select-Object -Unique)

foreach ($font_url in $unique_urls) {
    try {
        $font_url_clean = $font_url.Trim("'`"")
        Write-Host "Downloading: $font_url_clean"
        
        $filename = [System.IO.Path]::GetFileName($font_url_clean)
        $file_path = Join-Path $temp_dir $filename
        
        Invoke-WebRequest -Uri $font_url_clean -OutFile $file_path -UseBasicParsing -ErrorAction Stop
        
        $bytes = [System.IO.File]::ReadAllBytes($file_path)
        $b64 = [Convert]::ToBase64String($bytes)
        $data_url = "url(data:font/ttf;base64,$b64) format('truetype')"
        
        # Store replacement - handle the URL as it appears in HTML
        $replacements[$font_url] = $data_url
        Write-Host "  Encoded: $([Math]::Round($bytes.Length / 1KB, 1)) KB"
    }
    catch {
        Write-Warning "Failed to download $font_url_clean : $_"
    }
}

# Apply replacements to HTML
$updated_html = $html
foreach ($old_url in $replacements.Keys) {
    $new_url = $replacements[$old_url]
    # Replace as it appears: url(https://...) with quotes if present
    $pattern_to_replace = [regex]::Escape($old_url)
    $updated_html = $updated_html -replace $pattern_to_replace, $new_url
}

# Backup original and write updated HTML
$backup_path = "$html_path.bak"
Copy-Item $html_path $backup_path -Force
Set-Content -Path $html_path -Value $updated_html -Encoding UTF8

Write-Host "Wrote updated HTML with embedded fonts"
Write-Host "Backup saved to: $backup_path"

# Cleanup
if (Test-Path $temp_dir) { Remove-Item $temp_dir -Recurse -Force }

# Verify
$remaining = [regex]::Matches($updated_html, 'fonts\.gstatic\.com')
if ($remaining.Count -eq 0) {
    Write-Host "Success: All fonts.gstatic.com references have been embedded!"
    exit 0
} else {
    Write-Warning "Warning: $($remaining.Count) fonts.gstatic.com references still remain"
    exit 1
}
