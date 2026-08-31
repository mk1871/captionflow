# Calcula el tamano recomendado para la ventana de chroma de CaptionFlow
# a partir de la resolucion del lienzo (BaseWidth/BaseHeight) del perfil activo
# de OBS Studio. Devuelve "ancho,alto". Fracciones: 50% del ancho, 22% del alto
# (banner compacto para 2-4 lineas de subtitulos). Si OBS no esta configurado,
# usa 960x240 (fraccion de un lienzo 1080p).
$ErrorActionPreference = 'SilentlyContinue'

$obs = Join-Path $env:APPDATA 'obs-studio'
$w = 960
$h = 240
$ini = ''

$globalIni = Join-Path $obs 'global.ini'
if (Test-Path $globalIni) {
    $line = Get-Content $globalIni | Select-String '^Profile=' | Select-Object -First 1
    if ($line) {
        $profile = ($line.ToString() -split '=')[1].Trim()
        $candidate = Join-Path $obs ("basic\profiles\{0}\basic.ini" -f $profile)
        if (Test-Path $candidate) { $ini = $candidate }
    }
}

if (-not $ini) {
    $profileDir = Get-ChildItem (Join-Path $obs 'basic\profiles') -Directory |
        Where-Object { Test-Path (Join-Path $_.FullName 'basic.ini') } |
        Select-Object -First 1
    if ($profileDir) { $ini = Join-Path $profileDir.FullName 'basic.ini' }
}

if ($ini -and (Test-Path $ini)) {
    $baseW = 1920
    $baseH = 1080
    Get-Content $ini | ForEach-Object {
        if ($_ -match '^BaseWidth=(\d+)') { $baseW = [int]$Matches[1] }
        elseif ($_ -match '^BaseHeight=(\d+)') { $baseH = [int]$Matches[1] }
    }
    $w = [int][math]::Round($baseW * 0.5)
    $h = [int][math]::Round($baseH * 0.22)
}

Write-Output ("{0},{1}" -f $w, $h)