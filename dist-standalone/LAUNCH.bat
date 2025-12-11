@echo off
REM MatteFlyt Game Launcher
REM This batch file launches the game in your default browser

echo Starting MatteFlyt...
echo.

REM Get the full path to the index.html file
set "scriptDir=%~dp0"
set "htmlFile=%scriptDir%index.html"

REM Convert the path to a URL format that browsers understand
set "url=file:///%htmlFile:\=/%"

REM Open the game in the default browser
start "" "%htmlFile%"

echo.
echo The game should open in your browser shortly!
echo If it doesn't, you can also open the index.html file manually.
pause
