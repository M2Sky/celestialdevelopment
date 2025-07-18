@echo off
setlocal

:: Define variables
set AHKInstallerURL=https://www.autohotkey.com/download/ahk-install.exe
set AHKInstallerPath=%TEMP%\ahk-install.exe
set ScriptName=HideAnyDesk.ahk
set StartupFolder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set ScriptPath=%StartupFolder%\%ScriptName%

echo Checking for AutoHotkey...

:: Check if AutoHotkey is installed by looking for ahk.exe in PATH
where ahk.exe >nul 2>&1
if errorlevel 1 (
    echo AutoHotkey not found. Downloading installer...
    powershell -Command "Invoke-WebRequest -Uri '%AHKInstallerURL%' -OutFile '%AHKInstallerPath%'"
    echo Installing AutoHotkey silently...
    start /wait "" "%AHKInstallerPath%" /S
    if errorlevel 1 (
        echo AutoHotkey installation failed. Exiting.
        exit /b 1
    )
    echo AutoHotkey installed.
) else (
    echo AutoHotkey is already installed.
)

echo Creating AutoHotkey script...

:: Create the script content
(
echo #Persistent
echo SetTitleMatchMode, 2
echo.
echo ; Run once immediately on start
echo HideAnyDesk()
echo.
echo ; Then check every 50 milliseconds
echo SetTimer, HideAnyDesk, 50
echo return
echo.
echo HideAnyDesk:
echo IfWinExist, AnyDesk
echo {
echo     WinSet, ExStyle, +0x80, AnyDesk ; WS_EX_TOOLWINDOW (removes from taskbar)
echo     WinHide, AnyDesk
echo }
echo return
) > "%ScriptPath%"

echo Script created at "%ScriptPath%"

echo Adding script to Startup folder...

:: Script is already in Startup, so it will run at login

echo Done. You can reboot or log off/on to activate the script.

pause
endlocal
