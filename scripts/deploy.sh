#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source $SCRIPT_DIR/helper.sh

# check required tools
command -v ssh >/dev/null || { echo "Error: OpenSSH is required"; deployment_failed; }
command -v rsync >/dev/null || { echo "Error: rsync is required"; deployment_failed; }

# Load variables from .env.deploy
if [[ -f .env.deploy ]]; then
  # shellcheck disable=SC2046
  export $(grep -E '^(DOCKER_TAG|SSH_KEY|SSH_USER|SSH_HOST|SSH_PORT|REMOTE_PATH)=' .env.deploy | xargs)
else
  echo "Error: .env.deploy not found" >&2
  deployment_failed
fi

[ -z "$PACKAGE_NAME" ] && echo "Error: package name cannot be empty\! Please set in your package.json" && deployment_failed
[ -z "$PACKAGE_VERSION" ] && echo "Error: package version cannot be empty\! Please set in your package.json" && deployment_failed
[ -z "$SSH_KEY" ] && echo "Error: SSH_KEY name cannot be empty\! Please set in your .env.deploy" && deployment_failed
[ -z "$SSH_USER" ] && echo "Error: SSH_USER cannot be empty\! Please set in your .env.deploy" && deployment_failed
[ -z "$SSH_HOST" ] && echo "Error: SSH_HOST name cannot be empty\! Please set in your .env.deploy" && deployment_failed
[ -z "$SSH_PORT" ] && echo "Error: SSH_PORT cannot be empty\! Please set in your .env.deploy" && deployment_failed
[ -z "$REMOTE_PATH" ] && echo "Error: REMOTE_PATH cannot be empty\! Please set in your .env.deploy" && deployment_failed

echo ""
echo -e "Package: ${CYAN}$PACKAGE_NAME@$PACKAGE_VERSION${NC}"
echo -e "Deploy host: ${CYAN}$SSH_HOST${NC}"
echo ""

# Start SSH agent
run_step "Starting SSH agent" bash -c '
  eval "$(ssh-agent -s)" > /dev/null 2>&1
  ssh-add '$SSH_KEY' > /dev/null 2>&1
  echo "export SSH_AUTH_SOCK=$SSH_AUTH_SOCK" > /tmp/bunapp-ssh_vars
  echo "export SSH_AGENT_PID=$SSH_AGENT_PID" >> /tmp/bunapp-ssh_vars
' || deployment_failed
source /tmp/bunapp-ssh_vars

# Possibly going to be implemented in the future
# Save docker image
#run_step "Saving docker image locally" \
#  docker save -o $PACKAGE_NAME-$PACKAGE_VERSION.tar bunapp-$PACKAGE_NAME:$DOCKER_TAG || deployment_failed

# Create remote directory
run_step "Creating remote directory" \
  ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" "mkdir -p $REMOTE_PATH/$PACKAGE_NAME" || deployment_failed

# Possibly going to be implemented in the future
# Transfer docker image
#run_step "Transferring docker image" \
#  rsync -az -e "ssh -p $SSH_PORT" $PACKAGE_NAME-$PACKAGE_VERSION.tar $SSH_USER@$SSH_HOST:$REMOTE_PATH/$PACKAGE_NAME || deployment_failed

# Transfer compose.yaml
run_step "Transferring compose.yaml" \
  rsync -az -e "ssh -p $SSH_PORT" compose.yaml $SSH_USER@$SSH_HOST:$REMOTE_PATH/$PACKAGE_NAME || deployment_failed

# Deploy on remote
run_step "Loading image and deploying on ${CYAN}$SSH_HOST${NC}" \
  ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" \
  "cd $REMOTE_PATH/$PACKAGE_NAME && sudo docker load -i $PACKAGE_NAME-$PACKAGE_VERSION.tar > /dev/null 2>&1 && sudo docker compose up -d > /dev/null 2>&1 && echo y | sudo docker image prune > /dev/null 2>&1" || deployment_failed

clean_up

echo ""
echo -e "${GREEN}${CHECK_MARK} Deployment completed successfully!${NC}"
exit 0