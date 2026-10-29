#!/usr/bin/env bash
# Serves the MiniWoB++ bundle (original tasks need it over HTTP), then OpenEnv's BrowserGym app with
# megawob tasks registered. megawob pages load over file:// unless MEGAWOB_URL is set.
set -euo pipefail

MINIWOB_HTML_DIR=${MINIWOB_HTML_DIR:-/usr/local/share/miniwob-plusplus/miniwob/html}
MINIWOB_HTTP_PORT=${MINIWOB_HTTP_PORT:-8888}
BROWSERGYM_PORT=${BROWSERGYM_PORT:-8000}

python -m http.server "${MINIWOB_HTTP_PORT}" --bind 127.0.0.1 --directory "${MINIWOB_HTML_DIR}" &
HTTP_SERVER_PID=$!
sleep 1
if ! kill -0 "${HTTP_SERVER_PID}" 2>/dev/null; then
    echo "Failed to start MiniWoB static server on port ${MINIWOB_HTTP_PORT}" >&2
    exit 1
fi
trap 'kill "${HTTP_SERVER_PID}" 2>/dev/null || true' EXIT INT TERM

exec python -m uvicorn megawob.serve:app --host 0.0.0.0 --port "${BROWSERGYM_PORT}"
