#!/bin/bash
NAME="AmyBot";
NC='\033[0m';
RED='\033[0;31m';
ORANGE='\033[0;33m'
GREEN='\033[0;32m';
CYAN='\033[0;36m';

echo -e "${CYAN}[Amy]:${NC} Welcome, $USER!"
echo

if ! [ -z "$SUDO_USER" ]; then
  echo -e "${CYAN}[Amy]: ${RED}[ERROR] I do not need root permissions.${NC} Please run without sudo."
  exit 1
fi

if ! command -v screen >/dev/null 2>&1; then
  echo -e "${CYAN}[Amy]: ${ORANGE}You need to install 'screen' if you want to use this script!${NC}"
  exit 1
fi

function screengrepname () {
  screen -ls | grep "\\.${NAME//./\\.}"
}

cd "$(dirname "$0")" || cd . || echo "${RED}[ERROR] Please run the script in the same directory you installed Amy."

case $1 in

--debug)
  if [[ $(screengrepname) ]]; then
    echo -e "${ORANGE}$NAME is already running.${NC} Use '$0 --stop' to stop it before you run it in dubug mode!"
  else
    node Amy.js
  fi
;;

--restart)
  $0 --stop
  $0 --start
;;

--show)
  if [[ $(screengrepname) ]]; then
    tail -f screenlog.0
  else
    echo -e "$NAME is currently ${RED}stopped${NC}!"
  fi
;;

--start)
  if [[ $(screengrepname) ]]; then
    echo -e "${ORANGE}$NAME is already started.${NC} Use '$0 --stop' to stop or '$0 --restart' to restart it."
  else
    echo -e "${CYAN}[Amy]:${NC} Checking System..."
    if [ -r Amy.js ]; then
      echo -e "${CYAN}[Amy]:${NC} System Checked. O7" && echo -e "${CYAN}[Amy]:${NC} Booting up..."
      screen -L -dmS "$NAME" /bin/bash -c "until node .; do sleep 1; done"
      echo -e "${GREEN}$NAME was successfully started!${NC} If you have any problems, see the log using '$0 --show' or start $NAME in dubug mode using '$0 --debug'!"
    else
      echo -e "${RED}[ERROR] System Check Failed.${NC}" && echo -e "Check if you have Amy Bot installed correctly." && exit 1
    fi
  fi
;;

--status)
  if [[ $(screengrepname) ]]; then
    echo -e "$NAME is currently ${GREEN}running${NC}!"
  else
    echo -e "$NAME is currently ${RED}stopped${NC}!"
  fi
;;

--stop)
  if [[ $(screengrepname) ]]; then
    kill "$(screengrepname | awk -F . '{print $1}' | awk '{print $1}')"
    echo -e "$NAME was successfully ${RED}stopped!"
  else
    echo "$NAME is not running!"
  fi
;;

--update)
  if [[ $(screengrepname) ]]; then
    echo -e "${ORANGE}$NAME is currently running.${NC} Use '$0 --stop' to stop it before running the update."
  else
    echo "Updating $NAME..."
    git pull origin stable 1>/dev/null || (echo -e "${CYAN}[Amy]: ${RED} Unable to download update files. Please check your internet connection or if you've made any modifications, revert them.\\n" && exit 1)
    echo "Updating dependencies..."
    rm -fr node_modules package-lock.json screenlog.0
    npm i --only=production --no-package-lock 1>/dev/null 2>update.log || (echo -e "${CYAN}[Amy]: ${RED} Failed installing dependencies. Please see update.log file and report it, if it's really an issue.\\n" && exit 1)
    echo -e "${CYAN}[Amy]:${NC} Ready to boot up and start running."
  fi
;;

--upgrade)
  if [[ $(screengrepname) ]]; then
    echo -e "${ORANGE}$NAME is currently running.${NC} Use '$0 --stop' to stop it before running the update."
  else
    if [ -r data/Amy.sqlite ]; then
      modifiedDate="$(date -r data/Amy.sqlite -u +%y%m%d%H%M)"
      echo "Backing up database to backup_${modifiedDate}.sqlite..."
      mv data/Amy.sqlite "data/backup_${modifiedDate}.sqlite"
    fi
    echo "Deleting old files..."
    rm -fr node_modules data/Amy.sqlite package-lock.json screenlog.0
    echo "Updating $NAME..."
    git pull origin stable 1>/dev/null || (echo -e "${CYAN}[Amy]: ${RED} Unable to download update files. Please check your internet connection or if you've made any modifications, revert them.\\n" && exit 1)
    echo "Updating dependencies..."
    npm i --only=production --no-package-lock 1>/dev/null 2>update.log || (echo -e "${CYAN}[Amy]: ${RED} Failed installing dependencies. Please see update.log file and report it, if it's really an issue.\\n" && exit 1)
    echo -e "${CYAN}[Amy]:${NC} Ready to boot up and start running."
  fi
;;

--fix-d)
  echo -e "${CYAN}[Amy]:${NC} Fixing dependencies..."
  rm -rf node_modules package-lock.json
  npm i --only=production --no-package-lock
;;

--fix-l)
  echo -e "${CYAN}[Amy]:${NC} Fixing locales..."
  export LC_ALL="$LANG"
  grep -qF "LC_ALL=\"$LANG\"" /etc/environment || echo "LC_ALL=\"$LANG\"" | sudo tee -a /etc/environment 1>/dev/null
;;

*)
  echo
  echo -e "${CYAN}Amy${NC}"
  echo -e "${ORANGE}Administration, Moderation, Searches, Game Server Stats, Player Stats,"
  echo "Music, Games, User Profiles, User Levels, Virtual Currencies, Humor."
  echo -e "A Discord Bot, that can do it all. And Amy will even talk with you!${NC}"
  echo
  echo -e "${GREEN}Usage:${NC}"
  echo " $0 --[OPTION]"
  echo
  echo -e "${GREEN}Options:${NC}"
  echo " --debug      Start Amy in debug mode to see the issue that is"
  echo "              preventing Amy from booting. Does not start Amy in"
  echo "              background, so if you close the debug mode, Amy stops."
  echo " --fix-d      Fixes dependencies issues by reinstalling dependencies."
  echo " --fix-l      Fixes locales issue that causes errors with youtube-dl."
  echo " --fix-p      Fixes permission issues that causes errors in updating"
  echo "              or running."
  echo " --restart    Restarts Amy."
  echo " --show       Shows you real-time log of Amy running in background."
  echo " --start      Starts Amy in background - in a screen session -"
  echo "              which will keep running even if you close the terminal."
  echo " --status     Shows you if Amy is running in the background or not."
  echo " --stop       Stops Amy's process that is running in the background."
  echo " --update     Updates Amy to the latest version without losing data."
  echo " --upgrade    Updates Amy to the latest version. But all your data"
  echo "              are reset. Needed if you want to start from scratch or if"
  echo "              you have somehow corrupted the database."
  echo
  echo -e "${GREEN}Examples:${NC}"
  echo " $0 --start"
  echo " $0 --stop"
  echo " $0 --update"
  echo
;;

esac

echo
echo -e "${CYAN}[Amy]:${NC} If you faced any issues during any steps, join my official server and our amazing support staffs will help you out."
echo -e "${CYAN}[Amy]:${NC} Stay updated about new releases, important announcements, a lot of other things and giveaways too!"
echo -e "${CYAN}[Amy]:${NC} https://discord.gg/dCmp4TQ"
echo
