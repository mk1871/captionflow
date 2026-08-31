param(
    [Parameter(Mandatory = $true)][string]$TargetPath,
    [string]$WorkingDir = "",
    [string]$IconPath = "",
    [string]$Name = "CaptionFlow",
    [string]$Description = ""
)

$ErrorActionPreference = 'Stop'

function Get-DesktopPath {
    try {
        $d = [Environment]::GetFolderPath('Desktop')
        if ($d -and (Test-Path -LiteralPath $d)) { return $d }
    } catch {}
    $candidates = @(
        (Join-Path $env:USERPROFILE 'Desktop'),
        (Join-Path $env:USERPROFILE 'OneDrive\Desktop'),
        (Join-Path ([Environment]::GetFolderPath('Profile')) 'Desktop')
    )
    foreach ($c in $candidates) {
        if ($c -and (Test-Path -LiteralPath $c)) { return $c }
    }
    return $null
}

$desktop = Get-DesktopPath
if (-not $desktop) {
    Write-Error "No se encontro la carpeta del escritorio."
    exit 1
}

$lnk = Join-Path $desktop "$Name.lnk"
$sh = New-Object -ComObject WScript.Shell
$s = $sh.CreateShortcut($lnk)
$s.TargetPath = $TargetPath
if ($WorkingDir) { $s.WorkingDirectory = $WorkingDir }
if ($IconPath -and (Test-Path -LiteralPath $IconPath)) { $s.IconLocation = $IconPath }
if ($Description) { $s.Description = $Description }
$s.Save()

if (Test-Path -LiteralPath $lnk) {
    Write-Output $lnk
    exit 0
} else {
    Write-Error "No se pudo crear el acceso directo."
    exit 1
}