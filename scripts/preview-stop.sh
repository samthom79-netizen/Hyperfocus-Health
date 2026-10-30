#!/usr/bin/env bash
# Stops the preview server started by scripts/preview-start.sh.
cd "$(dirname "$0")/.."
if [ -f /tmp/hf-preview.pid ]; then
  pkill -P "$(cat /tmp/hf-preview.pid)" 2>/dev/null || true
  kill "$(cat /tmp/hf-preview.pid)" 2>/dev/null || true
  rm -f /tmp/hf-preview.pid
fi
PID=$(lsof -t -i:4321 2>/dev/null || true)
[ -n "$PID" ] && kill $PID 2>/dev/null || true
echo "Preview stopped"
