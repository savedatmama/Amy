@ECHO off
IF NOT DEFINED IS_CHILD_PROCESS (CMD /K SET IS_CHILD_PROCESS=1 ^& %0 %*) & EXIT )
TITLE Amy Bot
CLS
COLOR 0F
ECHO.

SET cwd=%~dp0

ECHO [Amy]: Checking System...
IF EXIST Amy.js (
  ECHO [Amy]: System Checked. O7. Booting up...
  node .
) ELSE (
  TITLE [ERROR] System Check Failed
  ECHO [Amy]: System check failed. Check if you Amy BOT installed correctly.
  GOTO :EXIT
)
ECHO.

EXIT /B 0

:EXIT
ECHO.
ECHO [Amy]: Press any key to exit.
PAUSE >nul 2>&1
CD /D "%cwd%"
TITLE Windows Command Prompt (CMD)
COLOR
