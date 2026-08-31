@echo off
title CaptionFlow Croma
setlocal
set "URL=https://mk1871.github.io/captionflow/?chroma=1"

set "NAVEGADOR="

rem --- Chrome instalado en el sistema ---
if not defined NAVEGADOR if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "NAVEGADOR=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined NAVEGADOR if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "NAVEGADOR=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined NAVEGADOR if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "NAVEGADOR=%LocalAppData%\Google\Chrome\Application\chrome.exe"

rem --- Edge (Chromium) como respaldo ---
if not defined NAVEGADOR if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "NAVEGADOR=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined NAVEGADOR if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "NAVEGADOR=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"

if not defined NAVEGADOR (
    start "" "%URL%"
    goto :fin
)

rem --- MISMO perfil dedicado que la ventana principal ---
rem Asi ambas ventanas comparten sesion (BroadcastChannel + localStorage).
set "PROFILE=%LocalAppData%\CaptionFlow\Profile"
if not exist "%PROFILE%" mkdir "%PROFILE%"

rem --- Tamano inicial desde el lienzo de OBS (35% ancho x 28% alto) ---
set "SIZESCRIPT=%~dp0tamano_ventana_croma.ps1"
if not exist "%SIZESCRIPT%" set "SIZESCRIPT=%LocalAppData%\CaptionFlow\tamano_ventana_croma.ps1"
set "WSIZE="
if exist "%SIZESCRIPT%" for /f "usebackq delims=" %%S in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%SIZESCRIPT%"`) do set "WSIZE=%%S"
if not defined WSIZE set "WSIZE=672,300"

set "FLAGS=--disable-backgrounding-occluded-windows --disable-features=CalculateNativeWinOcclusion,IntensiveWakeUpThrottling --disable-renderer-backgrounding --disable-background-timer-throttling"

start "" "%NAVEGADOR%" --app=%URL% --user-data-dir="%PROFILE%" --window-size=%WSIZE% %FLAGS%

:fin
endlocal