@ECHO off
IF NOT DEFINED IS_CHILD_PROCESS (CMD /K SET IS_CHILD_PROCESS=1 ^& %0 %*) & EXIT )
TITLE Amy Bot
CLS
COLOR 0F
ECHO.

SET cwd=%~dp0
CD /D %cwd%

ECHO [Amy]: Welcome, %USERNAME%!
ECHO.

ECHO [Amy]: Updating Amy Bot...
git pull origin stable 1>nul || (
  ECHO [Amy]: Unable to update the bot.
  GOTO :EXIT
)
ECHO [Amy]: Done.
ECHO.

ECHO [Amy]: Updating dependencies...
choco upgrade ffmpeg -y
RD /S /Q node_modules 2>nul
DEL /Q package-lock.json 2>nul
CALL npm i --only=production --no-package-lock >nul 2>update.log
ECHO [Amy]: Done.
ECHO [Amy]: If you get any errors please check the update.log file for errors while updating.
ECHO [Amy]: Ready to boot up and start running.
ECHO.

EXIT /B 0

:EXIT
ECHO.
ECHO [Amy]: If you faced any issues during any steps, join my official server and our amazing support staffs will help you out.
ECHO [Amy]: Stay updated about new releases, important announcements, a lot of other things and giveaways too!
ECHO [Amy]: https://discord.gg/dCmp4TQ
ECHO.
ECHO [Amy]: Press any key to exit.
PAUSE >nul 2>&1
CD /D "%cwd%"
TITLE Windows Command Prompt (CMD)
COLOR
