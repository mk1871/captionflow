@echo off
title CaptionFlow
setlocal
set "URL=https://mk1871.github.io/captionflow/"

set "NAVEGADOR="
set "USERDATA="

rem --- Chrome portable (el que traduce sin fallar) ---
for %%R in (
    "%USERPROFILE%\Downloads\GoogleChromePortable"
    "%USERPROFILE%\Desktop\GoogleChromePortable"
    "%USERPROFILE%\Documents\GoogleChromePortable"
    "%~dp0GoogleChromePortable"
) do (
    if not defined NAVEGADOR (
        if exist "%%~R\App\Chrome-bin\chrome.exe" (
            set "NAVEGADOR=%%~R\App\Chrome-bin\chrome.exe"
            set "USERDATA=%%~R\Data\profile"
        )
    )
)

rem --- Chrome normal ---
if not defined NAVEGADOR if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "NAVEGADOR=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined NAVEGADOR if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "NAVEGADOR=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined NAVEGADOR if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "NAVEGADOR=%LocalAppData%\Google\Chrome\Application\chrome.exe"

rem --- Edge ---
if not defined NAVEGADOR if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "NAVEGADOR=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined NAVEGADOR if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "NAVEGADOR=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"

if not defined NAVEGADOR (
    start "" "%URL%"
    goto :fin
)

set "FLAGS=--disable-backgrounding-occluded-windows --disable-features=CalculateNativeWinOcclusion --disable-renderer-backgrounding --disable-background-timer-throttling"

if defined USERDATA (
    start "" "%NAVEGADOR%" --app=%URL% --user-data-dir="%USERDATA%" %FLAGS%
) else (
    start "" "%NAVEGADOR%" --app=%URL% %FLAGS%
)

:fin
endlocal