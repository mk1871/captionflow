@echo off
setlocal
title CaptionFlow - Limpieza temporal

echo ============================================
echo   Limpieza temporal para CaptionFlow
echo   Cierra SOLO las instancias de CaptionFlow
echo   y borra cache y service workers del perfil
echo   dedicado (no toca tu Chrome normal).
echo ============================================
echo.

set "PROFILE=%LocalAppData%\CaptionFlow\Profile"

rem --- Cerrar solo las instancias de Chrome/Edge lanzadas con el perfil de CaptionFlow ---
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe' OR Name='msedge.exe'\" | Where-Object { $_.CommandLine -like '*CaptionFlow\Profile*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"

timeout /t 2 /nobreak >nul

set "PROFILE_DEFAULT=%PROFILE%\Default"
set "BORRADO="
for %%D in (Cache "Code Cache" GPUCache "Service Worker\CacheStorage" "Service Worker\ScriptCache") do (
    if exist "%PROFILE_DEFAULT%\%%~D" (
        rd /s /q "%PROFILE_DEFAULT%\%%~D"
        echo   Eliminado: %%D
        set "BORRADO=1"
    )
)
if not defined BORRADO (
    echo   No habia temporales que borrar (o el perfil aun no existe).
) else (
    echo.
    echo   Limpieza completada.
)

:fin
echo.
echo Abre CaptionFlow de nuevo con su acceso directo.
echo Si aun falla, es probablemente una EXTENSION del Chrome normal
echo que interfiere al compartir el microfono o red:
echo   - El perfil dedicado de CaptionFlow no carga extensiones.
echo   - Si falla, prueba en incognito del Chrome normal: Ctrl+Shift+N
echo     y abre la URL, o revisa los permisos del microfono.
echo.
pause
endlocal