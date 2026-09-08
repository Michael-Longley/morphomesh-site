<#
  Generates real placeholder JPEGs for the tool card art / modal gallery.
  Dev utility only — never referenced by the served site. Re-run this if a
  new tool is added; it overwrites existing placeholders, so don't re-run
  it after real photos have been swapped in without backing those up first.

  Usage: powershell -File scripts/generate-placeholder-images.ps1
#>

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$toolsRoot = Join-Path $root "assets\tools"

# label, folder slug, accent hex (pulled from the site's existing print palette)
$tools = @(
  @{ Name = "Model Painter";           Slug = "model-painter";           Accent = "#E36B20" },
  @{ Name = "Color Puzzle Generator";  Slug = "color-puzzle-generator";  Accent = "#5B8DEF" },
  @{ Name = "Kit Card Generator";      Slug = "kit-card-generator";      Accent = "#3FA95A" }
)

$width = 1200
$height = 900
$fillHex = "#312D29"   # --mm-raised
$borderHex = "#3D3830" # --mm-border

function New-PlaceholderImage {
  param(
    [string]$Path,
    [string]$Title,
    [string]$Subtitle,
    [string]$AccentHex
  )

  $bmp = New-Object System.Drawing.Bitmap($width, $height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $fill = [System.Drawing.ColorTranslator]::FromHtml($fillHex)
  $border = [System.Drawing.ColorTranslator]::FromHtml($borderHex)
  $accent = [System.Drawing.ColorTranslator]::FromHtml($AccentHex)

  $g.Clear($fill)

  $borderPen = New-Object System.Drawing.Pen($border, 6)
  $g.DrawRectangle($borderPen, 3, 3, $width - 6, $height - 6)

  $titleFont = New-Object System.Drawing.Font("Segoe UI", 48, [System.Drawing.FontStyle]::Bold)
  $subFont = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Regular)
  $accentBrush = New-Object System.Drawing.SolidBrush($accent)
  $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#A8A09A"))

  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center

  $titleY = ($height / 2) - 70
  $subY = ($height / 2) + 20
  $titleRect = New-Object -TypeName System.Drawing.RectangleF -ArgumentList @(0, $titleY, $width, 90)
  $subRect = New-Object -TypeName System.Drawing.RectangleF -ArgumentList @(0, $subY, $width, 60)

  $g.DrawString($Title, $titleFont, $accentBrush, $titleRect, $format)
  $g.DrawString($Subtitle, $subFont, $mutedBrush, $subRect, $format)

  $dir = Split-Path -Parent $Path
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Jpeg)

  $g.Dispose()
  $bmp.Dispose()
}

foreach ($tool in $tools) {
  $dir = Join-Path $toolsRoot $tool.Slug

  New-PlaceholderImage -Path (Join-Path $dir "card.jpg") `
    -Title $tool.Name -Subtitle "placeholder card art" -AccentHex $tool.Accent

  for ($i = 1; $i -le 3; $i++) {
    New-PlaceholderImage -Path (Join-Path $dir "gallery-$i.jpg") `
      -Title $tool.Name -Subtitle "placeholder gallery image $i" -AccentHex $tool.Accent
  }

  Write-Host "Generated placeholders for $($tool.Name) -> $dir"
}
