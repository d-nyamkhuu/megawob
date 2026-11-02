# OpenEnv BrowserGym server with the original MiniWoB++ tasks and megawob tasks.
#
# Build context is the repo root (the Dockerfile's grandparent, OpenEnv's convention):
#   docker build -f server/Dockerfile -t megawob .
#   ModalProvider.image_from_dockerfile("server/Dockerfile")
#
# Clients use OpenEnv's unmodified BrowserGymEnv:
#   await env.reset(task_name="reorder-items", seed=0)     # megawob
#   await env.reset(task_name="click-button", seed=0)     # original MiniWoB++
#   megawob.client.screenshot(result.observation)          # the frame (PNG in metadata, see megawob/serve.py)
# Reward mode, profile, track and knobs come from MEGAWOB_* variables (docker run -e MEGAWOB_PRESET=small).
FROM mcr.microsoft.com/playwright/python:v1.44.0-jammy

ARG OPENENV_COMMIT=8d3455ab91d28b46349b8bf01fc243d339cda260
ARG MINIWOB_COMMIT=7fd85d71a4b60325c6585396ec4f48377d049838
ARG MINIWOB_SHA256=89cc878fc4769d8815630f5367c5c53b0ad4ae0a98b6fa9663eba83cf99a3807

# Era fonts for site widgets (see docs/architecture.md); fontconfig maps the classic task names.
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git \
    fonts-liberation fonts-dejavu-core fonts-urw-base35 fonts-comic-neue \
    fonts-noto-color-emoji fonts-unifont fonts-wqy-microhei \
    && rm -rf /var/lib/apt/lists/*

# OpenEnv's browsergym_env server and client, pinned (brings browsergym-core/miniwob 0.14.3, playwright 1.44).
# Playwright is then lifted to 1.58 (Chromium 145, the checker's version) over BrowserGym's playwright==1.44 pin:
# Chromium 125 from 1.44 deadlocks a page's renderer now and then (main and IO threads both parked on futexes, so
# a step's page.evaluate never returns; 8 hung smoke runs on 1.44, none on 1.58). BrowserGym 0.14.3 works on 1.58.
# The base stays v1.44.0-jammy: on the v1.58.0-jammy base Chromium 145 crashed at launch (SIGSEGV, 4 in 375
# launches; none in 375 here), and `playwright install --with-deps` adds what Chromium 145 needs.
RUN pip install --no-cache-dir uv && \
    uv pip install --system --no-cache \
    "openenv-browsergym_env @ git+https://github.com/meta-pytorch/OpenEnv.git@${OPENENV_COMMIT}#subdirectory=envs/browsergym_env" && \
    uv pip install --system --no-cache "playwright==1.58.0"

ENV PLAYWRIGHT_BROWSERS_PATH=/usr/local/share/ms-playwright
RUN python -m playwright install --with-deps chromium && chmod -R a+rx /usr/local/share/ms-playwright

# Original MiniWoB++ bundle, same pinned snapshot as OpenEnv's image; the download is checked against its SHA-256
# (change MINIWOB_SHA256 together with MINIWOB_COMMIT).
RUN mkdir -p /usr/local/share/miniwob-plusplus && \
    curl -fsSL -o /tmp/miniwob.tar.gz "https://github.com/Farama-Foundation/miniwob-plusplus/archive/${MINIWOB_COMMIT}.tar.gz" && \
    echo "${MINIWOB_SHA256}  /tmp/miniwob.tar.gz" | sha256sum -c - && \
    tar -xzf /tmp/miniwob.tar.gz --strip-components=1 -C /usr/local/share/miniwob-plusplus && \
    rm /tmp/miniwob.tar.gz && \
    chmod -R a+rX /usr/local/share/miniwob-plusplus

# megawob last, so editing tasks only rebuilds this layer.
COPY . /opt/megawob
RUN chmod +x /opt/megawob/server/start.sh && python -c "import sys; sys.path.insert(0, '/opt/megawob'); import megawob.catalog as c; print(len(c.task_names()), 'megawob tasks')"

ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/opt/megawob \
    BROWSERGYM_BENCHMARK=miniwob \
    BROWSERGYM_TASK_NAME=click-test \
    BROWSERGYM_HEADLESS=true \
    BROWSERGYM_VIEWPORT_WIDTH=1280 \
    BROWSERGYM_VIEWPORT_HEIGHT=720 \
    BROWSERGYM_TIMEOUT=10000 \
    BROWSERGYM_PORT=8000 \
    MINIWOB_HTML_DIR=/usr/local/share/miniwob-plusplus/miniwob/html \
    MINIWOB_HTTP_PORT=8888 \
    MINIWOB_URL=http://127.0.0.1:8888/miniwob/ \
    MEGAWOB_SCREENSHOT=1 \
    MEGAWOB_SCREENSHOT_FORMAT=png \
    ENABLE_WEB_INTERFACE=true

# The server runs as an unprivileged user (Chromium needs a writable home and /tmp, nothing else). Mount the tree or
# pass `-u` to run tools as yourself, see AGENTS.md.
RUN useradd --create-home --uid 10001 megawob
USER megawob

EXPOSE 8000 8888
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["/opt/megawob/server/start.sh"]
