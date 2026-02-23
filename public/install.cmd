@echo off

:: Elevar para administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando permissao de administrador...
    powershell -Command "Start-Process cmd -ArgumentList '/c %~s0' -Verb RunAs"
    exit
)

set URL=https://studioapi.ceroimagem.com.br/qz-tray.exe
set FILE=%TEMP%\qz-tray.exe

echo Baixando QZ Tray...
powershell -Command "Start-BitsTransfer '%URL%' '%FILE%'"

echo Executando instalador...
start "" "%FILE%"

exit