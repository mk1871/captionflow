@echo off
setlocal
title CaptionFlow - Instalador

if /i "%~1"=="/reg" goto :reg

echo ============================================
echo   CaptionFlow - Instalador
echo ============================================
echo.

set "CHROME_EXE="
set "PROC=chrome"
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME_EXE=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined CHROME_EXE if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME_EXE=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined CHROME_EXE if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "CHROME_EXE=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if not defined CHROME_EXE if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    set "CHROME_EXE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
    set "PROC=msedge"
)
if not defined CHROME_EXE if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set "CHROME_EXE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
    set "PROC=msedge"
)

set "DEST=%LocalAppData%\CaptionFlow"
if not exist "%DEST%" mkdir "%DEST%"

echo [1/5] Copiando lanzador a %DEST%...
copy /y "%~dp0captionflow.bat" "%DEST%\captionflow.bat" >nul
copy /y "%~dp0captionflow-chroma.bat" "%DEST%\captionflow-chroma.bat" >nul
copy /y "%~dp0tamano_ventana_croma.ps1" "%DEST%\tamano_ventana_croma.ps1" >nul
copy /y "%~dp0restablecer_tamano_croma.bat" "%DEST%\restablecer_tamano_croma.bat" >nul
if exist "%~dp0captionflow.ico" (
    copy /y "%~dp0captionflow.ico" "%DEST%\captionflow.ico" >nul
) else (
    if exist "%~dp0crear_icono.ps1" (
        echo        Regenerando el icono...
        powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0crear_icono.ps1"
        if exist "%~dp0captionflow.ico" copy /y "%~dp0captionflow.ico" "%DEST%\captionflow.ico" >nul
    )
)
if exist "%DEST%\captionflow.bat" (
    echo        Lanzador instalado.
) else (
    echo        ERROR: no se pudo copiar el lanzador.
)

echo [2/5] Creando acceso directo en el escritorio...
set "LNKCREADO="
for /f "usebackq delims=" %%L in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0crear_acceso_directo_cf.ps1" -TargetPath "%DEST%\captionflow.bat" -WorkingDir "%DEST%" -IconPath "%DEST%\captionflow.ico" -Name "CaptionFlow" -Description "CaptionFlow - subtitulos en vivo"`) do set "LNKCREADO=%%L"
if defined LNKCREADO (
    echo        Acceso directo creado: %LNKCREADO%
) else (
    echo        ERROR: no se pudo crear el acceso directo.
)

set "LNK2="
for /f "usebackq delims=" %%L in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0crear_acceso_directo_cf.ps1" -TargetPath "%DEST%\captionflow-chroma.bat" -WorkingDir "%DEST%" -IconPath "%DEST%\captionflow.ico" -Name "CaptionFlow Croma" -Description "CaptionFlow - ventana de subtitulos (chroma)"`) do set "LNK2=%%L"
if defined LNK2 (
    echo        Acceso directo creado: %LNK2%
) else (
    echo        AVISO: no se pudo crear el acceso directo de chroma.
)

set "CHROME_WAS_RUNNING="
tasklist /FI "IMAGENAME eq %PROC%.exe" 2>nul | find /I "%PROC%.exe" >nul
if %errorlevel% equ 0 set "CHROME_WAS_RUNNING=1"

if defined CHROME_WAS_RUNNING (
    echo [3/5] Cerrando %PROC% para aplicar la configuracion...
    powershell -NoProfile -Command "$p=Get-Process %PROC% -ErrorAction SilentlyContinue; if($p){ $p | ForEach-Object { if($_.MainWindowHandle -ne 0){ $_.CloseMainWindow() | Out-Null } }; Start-Sleep -Seconds 4; if(Get-Process %PROC% -ErrorAction SilentlyContinue){ Stop-Process -Name %PROC% -Force -ErrorAction SilentlyContinue } }"
    echo        %PROC% cerrado.
) else (
    echo [3/5] %PROC% no estaba abierto.
)

echo [4/5] Aplicando politica de registro (acepta el aviso UAC)...
powershell -NoProfile -Command "$p=Start-Process -FilePath '%~f0' -ArgumentList '/reg' -Verb RunAs -PassThru; if(-not $p.WaitForExit(60000)){ $p.Kill() }"
set "RES=%TEMP%\captionflow_reg_result.txt"
set "REGRES="
if exist "%RES%" (
    set /p REGRES=<"%RES%"
    del "%RES%" >nul 2>&1
)
if "%REGRES%"=="OK" (
    echo        Politica aplicada o ya estaba configurada.
) else (
    echo        AVISO: la politica no pudo confirmarse.
    echo        Puedes aplicarla luego con doble clic en captionflow_politica_hklm.reg
)

if defined CHROME_WAS_RUNNING (
    if defined CHROME_EXE (
        echo [5/5] Relanzando %PROC% para restaurar tu sesion...
        start "" "%CHROME_EXE%" --restore-last-session
    )
) else (
    echo [5/5] El navegador no se relanza porque no estaba abierto.
)

echo.
echo ============================================
if defined LNKCREADO (
    echo   Instalacion completada.
    echo   Usa el acceso directo "CaptionFlow" del escritorio.
) else (
    echo   Instalacion incompleta: no hay acceso directo.
    echo   Abre manualmente: "%DEST%\captionflow.bat"
)
echo   Todo queda instalado en %DEST%.
echo   Ya puedes borrar esta carpeta con tranquilidad.
echo ============================================
echo.
pause
exit /b 0

:reg
setlocal
set "RES=%TEMP%\captionflow_reg_result.txt"
reg query "HKLM\SOFTWARE\Policies\Google\Chrome" /v WindowOcclusionEnabled 2>nul | find /I "0x0" >nul
if %errorlevel% equ 0 (
    echo La politica WindowOcclusionEnabled ya estaba aplicada.
    echo OK > "%RES%"
) else (
    reg add "HKLM\SOFTWARE\Policies\Google\Chrome" /v WindowOcclusionEnabled /t REG_DWORD /d 0 /f >nul
    if %errorlevel% equ 0 (
        echo Politica aplicada: WindowOcclusionEnabled = 0
        echo OK > "%RES%"
    ) else (
        echo ERROR al aplicar la politica de registro.
        echo ERROR > "%RES%"
    )
)
exit /b 0