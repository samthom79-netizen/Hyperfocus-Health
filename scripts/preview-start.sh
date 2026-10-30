#!/usr/bin/env bash
# Starts the built site on http://localhost:4321 in the background and waits
# until it answers. Stop it with: scripts/preview-stop.sh
set -euo pipefail
cd "$(dirname "$0")/.."
nohup npx astro preview --host --ignore-lock > /tmp/hf-preview.log 2>&1 &
echo $! > /tmp/hf-preview.pid
for _ in $(seq 1 30); do
  if curl -sf -o /dev/null http://localhost:4321/; then
    echo "Preview running at http://localhost:4321"
    exit 0
  fi
  sleep 1
done
echo "Preview did not start; see /tmp/hf-preview.log" >&2
exit 1
