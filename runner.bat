@echo off
setlocal enabledelayedexpansion

:: Paths
set "INSTALLER=%USERPROFILE%\Downloads\iCloudSetup.exe"
set "EXTRACTED=%USERPROFILE%\Downloads\iCloudExtracted"
set "SEVENZIP=C:\Program Files\7-Zip\7z.exe"

:: Step 1: Extract installer using 7-Zip
echo Extracting iCloudSetup.exe...
"%SEVENZIP%" x "%INSTALLER%" -o"%EXTRACTED%" -y
if errorlevel 1 (
    echo Failed to extract iCloudSetup.exe
    goto end
)

:: Step 2: Install MSI packages silently
cd /d "%EXTRACTED%"

echo Installing AppleApplicationSupport.msi...
msiexec /i AppleApplicationSupport.msi /quiet /norestart

echo Installing AppleSoftwareUpdate.msi...
msiexec /i AppleSoftwareUpdate.msi /quiet /norestart

echo Installing iCloud.msi...
msiexec /i iCloud.msi /quiet /norestart

if exist Bonjour.msi (
    echo Installing Bonjour.msi...
    msiexec /i Bonjour.msi /quiet /norestart
)

if exist AppleMobileDeviceSupport64.msi (
    echo Installing AppleMobileDeviceSupport64.msi...
    msiexec /i AppleMobileDeviceSupport64.msi /quiet /norestart
)

:: Step 3: Wait for all msiexec.exe processes to finish
echo Waiting for all installer processes to finish...
:waitloop
tasklist /FI "IMAGENAME eq msiexec.exe" | find /I "msiexec.exe" >nul
if %ERRORLEVEL%==0 (
    timeout /t 3 /nobreak >nul
    goto waitloop
)

:: Step 4: Delete extracted folder
cd /d "%USERPROFILE%\Downloads"
echo Deleting extracted folder...
rmdir /s /q "iCloudExtracted"

echo iCloud silent installation completed successfully.

:end
pause
