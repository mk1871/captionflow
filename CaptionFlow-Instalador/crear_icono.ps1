Add-Type -AssemblyName System.Drawing

$size = 256
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(15, 23, 42))

$rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(29, 78, 216), [System.Drawing.Color]::FromArgb(14, 165, 233), 40.0)
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$d = 48
$path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
$path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
$path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
$path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
$path.CloseFigure()
$g.FillPath($brush, $path)

$white = [System.Drawing.Brushes]::White
$bars = @(
    @{x = 64; w = 22; h = 70 },
    @{x = 108; w = 22; h = 120 },
    @{x = 152; w = 22; h = 150 },
    @{x = 196; w = 22; h = 90 }
)
foreach ($b in $bars) {
    $y = ($size - $b.h) / 2
    $r = New-Object System.Drawing.Rectangle($b.x, $y, $b.w, $b.h)
    $g.FillRectangle($white, $r)
}

$font = New-Object System.Drawing.Font("Arial", 34, [System.Drawing.FontStyle]::Bold)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("CF", $font, [System.Drawing.Brushes]::White, (New-Object System.Drawing.RectangleF(0, 168, 256, 60)), $sf)

$pngPath = Join-Path $PSScriptRoot "captionflow_temp.png"
$bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

$icoPath = Join-Path $PSScriptRoot "captionflow.ico"
$pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
$fs = [System.IO.File]::Create($icoPath)
$bw = New-Object System.IO.BinaryWriter($fs)
$bw.Write([uint16]0)
$bw.Write([uint16]1)
$bw.Write([uint16]1)
$bw.Write([byte]0)
$bw.Write([byte]0)
$bw.Write([byte]0)
$bw.Write([byte]0)
$bw.Write([uint16]1)
$bw.Write([uint16]32)
$bw.Write([uint32]$pngBytes.Length)
$bw.Write([uint32]22)
$bw.Write($pngBytes)
$bw.Close()
$fs.Close()

Remove-Item -LiteralPath $pngPath -ErrorAction SilentlyContinue
Write-Output "Icono generado: $icoPath"