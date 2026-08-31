@echo off
setlocal
title CaptionFlow - Limpieza temporal

echo ============================================
echo   Limpieza temporal para CaptionFlow
echo   Cierra Chrome/Edge y borra cache y
echo   service workers (no borra claves, historial
echo   ni permisos de microfono).
echo ============================================
echo.

set "PROC=chrome"
set "USERDATA=%LocalAppData%\Google\Chrome\User Data"
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" goto :found
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" goto :found
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" goto :found
set "PROC=msedge"
set "USERDATA=%LocalAppData%\Microsoft\Edge\User Data"
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" goto :found
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" goto :found

echo No se encontro Chrome ni Edge.
goto :fin

:found
echo Cerrando %PROC% (tu sesion se restaurara al reabrirlo)...
taskkill /IM %PROC%.exe /F >nul 2>&1
timeout /t 2 /nobreak >nul

set "PROFILE=%USERDATA%\Default"
set "BORRADO="
for %%D in (Cache "Code Cache" GPUCache "Service Worker\CacheStorage" "Service Worker\ScriptCache") do (
    if exist "%PROFILE%\%%~D" (
        rd /s /q "%PROFILE%\%%~D"
        echo   Eliminado: %%D
        set "BORRADO=1"
    )
)
if not defined BORRADO (
    echo   No habia temporales que borrar (o la ruta es distinta).
) else (
    echo.
    echo   Limpieza completada.
)

:fin
echo.
echo Abre CaptionFlow de nuevo con su acceso directo.
echo Si aun falla, es probablemente una EXTENSION (bloqueador):
echo   - Prueba primero en incognito: Ctrl+Shift+N y abre la URL.
echo   - Si en incognito traduce, desactiva el bloqueador o agrega
echo     una excepcion para translate.googleapis.com
echo.
pause
endlocal