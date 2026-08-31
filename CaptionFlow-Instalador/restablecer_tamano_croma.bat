@echo off
title CaptionFlow - Restablecer tamano del croma
setlocal

echo ============================================
echo   Restablecer el tamano de la ventana croma
echo   Vuelve a usar el tamano calculado desde
echo   el lienzo de OBS en el proximo lanzamiento.
echo ============================================
echo.

echo Cerrando ventanas de CaptionFlow...
powershell -NoProfile -Command "Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*CaptionFlow*' } | ForEach-Object { $_.CloseMainWindow() | Out-Null }; Start-Sleep -Seconds 3; Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*CaptionFlow*' } | Stop-Process -Force -ErrorAction SilentlyContinue"

echo Limpiando el tamano guardado del perfil de Chrome...
powershell -NoProfile -Command "$prefs = Join-Path $env:LOCALAPPDATA 'CaptionFlow\Profile\Default\Preferences'; if (Test-Path $prefs) { Copy-Item -LiteralPath $prefs -Destination ($prefs + '.bak') -Force; $j = Get-Content -LiteralPath $prefs -Raw | ConvertFrom-Json; if ($j.browser.PSObject.Properties['app_window_placement']) { $j.browser.PSObject.Properties.Remove('app_window_placement'); $j | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $prefs -Encoding utf8; Write-Output 'Tamano del croma restablecido.' } else { Write-Output 'Ya estaba en el tamano configurado.' } } else { Write-Output 'Perfil de CaptionFlow no encontrado.' }"

echo.
echo Listo. Vuelve a abrir "CaptionFlow Croma" y usara el tamano del lienzo de OBS.
pause
endlocal