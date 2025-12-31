#!/usr/bin/env bash
set -euo pipefail

# Braille characters for progress animation
BRAILLE=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")
CHECK_MARK="✓"
CROSS_MARK="✗"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[0;37m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Function to show animated progress
show_progress() {
  local pid=$1
  local msg=$2
  local i=0
  
  while kill -0 $pid 2>/dev/null; do
    printf "\r${YELLOW}${BRAILLE[$i]}${NC} $msg"
    i=$(( (i + 1) % ${#BRAILLE[@]} ))
    sleep 0.05
  done
}

# Function to execute step with progress indicator
run_step() {
  local msg=$1
  shift
  
  # Create temp file for command output
  local output_file=$(mktemp)
  
  # Run command in background, capturing output
  # check if single argument with shell operators then use bash -c
  if [ $# -eq 1 ] && [[ "$1" =~ (&&|\|\||;|\|) ]]; then
    # Single string with shell operators :: use bash -c
    bash -c "$1" > "$output_file" 2>&1 &
  else
    # Normal command with arguments :: execute directly
    "$@" > "$output_file" 2>&1 &
  fi
  local pid=$!
  
  # Show progress animation
  show_progress $pid "$msg"
  
  # Wait for completion and check status
  wait $pid
  local status=$?
  
  if [ $status -eq 0 ]; then
    printf "\r${GREEN}${CHECK_MARK}${NC} $msg\n"
    rm -f "$output_file"
    return 0
  else
    printf "\r${RED}${CROSS_MARK}${NC} $msg\n"
    echo ""
    echo -e "${RED}Error output:${NC}"
    echo -e "${GRAY}─────────────────────────────────────${NC}"
    cat "$output_file"
    echo -e "${GRAY}─────────────────────────────────────${NC}"
    rm -f "$output_file"
    return 1
  fi
}

# Clean ssh-agent stuff when deployment finishes or fails
clean_up() {
  ssh-agent -k > /dev/null 2>&1
  rm -f /tmp/bunapp-ssh_vars
}

# Footer to show message that build failed 
build_failed() {
  echo ""
  echo -e "${RED}${CROSS_MARK} Build failed!${NC}"
  exit 1
}

# Foot to show message that deployment failed 
deployment_failed() {
  clean_up

  echo ""
  echo -e "${RED}${CROSS_MARK} Deployment failed!${NC}"
  exit 1
}

# Load variables from package.json
if [[ -f package.json ]]; then
  PACKAGE_NAME="$(jq -r '.name // empty' package.json)"
  PACKAGE_DESCRIPTION="$(jq -r '.description // empty' package.json)"
  PACKAGE_VERSION="$(jq -r '.version // empty' package.json)"
  PACKAGE_AUTHOR="$(jq -r '.author.name // empty' package.json)"
  PACKAGE_LICENSE="$(jq -r '.license // empty' package.json)"
  PACKAGE_REPO_URL="$(jq -r '.repository.url // empty' package.json)"
else
  echo "Error: package.json not found" >&2
  exit 1
fi