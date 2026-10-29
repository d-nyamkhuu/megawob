/* draw-shape/_canvasboard: canvas rendering phases behind the reference renderCanvasboard unit.
 * S holds the original render's per-episode locals; S.scope is its overridable reference scope.
 * Phases keep DOM construction, RNG draws, canvas operations and event binding in their original order. */
(function () {
  'use strict';

  function surface(S) {
    ({ spec: S.spec, util: S.util, rng: S.rng, size: S.size } = S.ctx);
    S.ctx.css('cb-style', S.scope.CB_CSS);
    S.fam = S.scope.env.taskDef;
    S.v = S.spec.scenario;
    S.scope.cbKey = null;
    if (S.scope.cbView && S.scope.cbView.off) S.scope.cbView.off();
    S.W = S.size.width;
    S.H = S.size.height;
    S.st = S.ctx.stage.getBoundingClientRect();
    S.sub = S.scope.env.submitEl && S.scope.env.submitEl.getBoundingClientRect();
    if (S.sub && S.sub.width && S.sub.left < S.st.right && S.sub.right > S.st.left && S.sub.top < S.st.bottom && S.sub.bottom > S.st.top) {
      const cutH = S.st.bottom - S.sub.top + 10;
      const cutW = S.st.right - S.sub.left + 10;
      if (cutH * S.W <= cutW * S.H) S.H -= cutH;
      else S.W -= cutW;
    }
    S.appW = Math.round(Math.min(S.W - 2 * S.rng.int(4, 14), 1360));
    S.appH = Math.round(Math.min(S.H - 2 * S.rng.int(4, 10), 820));
    S.app = S.util.el('div', 'cb-app', S.ctx.stage);
    S.app.style.width = `${S.appW}px`;
    S.app.style.height = `${S.appH}px`;
    S.app.style.left = `${Math.round(S.rng.float(0, 1) * Math.max(0, S.W - S.appW))}px`;
    S.app.style.top = `${Math.round(S.rng.float(0, 1) * Math.max(0, S.H - S.appH))}px`;
    S.cw = S.app.clientWidth;
    S.ch = S.app.clientHeight;
    S.canvas = S.util.el('canvas', 'cb-canvas', S.app);
    S.canvas.dataset.role = 'board';
    S.dpr = window.devicePixelRatio || 1;
    S.canvas.width = Math.round(S.cw * S.dpr);
    S.canvas.height = Math.round(S.ch * S.dpr);
    S.canvas.style.width = `${S.cw}px`;
    S.canvas.style.height = `${S.ch}px`;
    S.g = S.canvas.getContext('2d');
    S.cs = getComputedStyle(S.app);
    S.tv = (k, d) => {
      const s = (S.cs.getPropertyValue(`--${k}`) || '').trim();
      if (!s) return d;
      S.g.fillStyle = '#010203';
      S.g.fillStyle = s;
      return S.g.fillStyle === '#010203' && s !== '#010203' ? d : S.g.fillStyle;
    };
    S.col = { bg: S.tv('bg', '#f4f5f7'), panel: S.tv('panel', '#ffffff'), fg: S.tv('fg', '#1d2330'), muted: S.tv('muted', '#6b7280'),
      line: S.tv('line', '#d5d9e0'), accent: S.tv('accent', '#2f6fed') };
    S.lum = (c) => {
      const m = /^#([0-9a-f]{6})$/i.exec(c);
      if (!m) return 1;
      const n = parseInt(m[1], 16);
      return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    };
    S.dark = S.lum(S.col.bg) < 0.45;
    S.font = getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif';
  }

  function chrome(S) {
    S.head = S.util.el('div', 'cb-float cb-head', S.app);
    S.appName = S.rng.pick(S.scope.CB_APPS);
    S.util.el('span', 'logo', S.head, S.appName[0]);
    S.util.el('span', 'name', S.head, S.rng.pick(S.scope.CB_BOARDS));
    S.util.el('span', 'crumb', S.head, S.appName);
    S.share = S.util.el('div', 'cb-float cb-share', S.app);
    S.people = S.rng.sample(['AK', 'JM', 'RT', 'SL', 'PD', 'NO'], S.rng.int(2, 3));
    S.people.forEach((p, i) => { const a = S.util.el('span', 'av', S.share, p); a.style.background = S.scope.CB_AV[(i + S.rng.int(0, 5)) % S.scope.CB_AV.length]; });
    S.shareBtn = S.util.el('button', '', S.share, 'Share');
    S.shareBtn.type = 'button';
    S.shareBtn.addEventListener('click', () => S.ctx.log('decoy', { what: 'share' }));
    S.toolsEl = S.util.el('div', 'cb-float cb-tools', S.app);
    S.btn = {};
    S.mkBtn = (parent, key, title, kbd) => {
      const b = S.util.el('button', 'cb-btn', parent);
      b.type = 'button';
      b.dataset.key = key;
      b.title = title;
      b.setAttribute('aria-label', title);
      if (S.scope.CB_ICONS[key]) b.insertAdjacentHTML('beforeend', S.scope.CB_ICONS[key]);
      if (kbd) S.util.el('kbd', '', b, kbd);
      return b;
    };
    S.keyOf = (t) => (S.spec.keys && S.fam.helpers.TOOL_KEYS[t] ? S.fam.helpers.TOOL_KEYS[t].toUpperCase() : null);
    S.tools = undefined;
    if (S.v === 'tool') S.tools = S.rng.bool(0.5) ? ['pen', 'line', 'rect', 'ellipse'] : ['line', 'rect', 'ellipse', 'pen'];
    else if (S.v === 'erase') S.tools = S.rng.bool(0.5) ? ['pen', 'eraser'] : ['eraser', 'pen'];
    else if (S.v === 'connect') S.tools = ['select'];
    else S.tools = ['pen'];
    S.decoys = S.v === 'connect' ? ['sticky', 'text'] : S.rng.bool(0.5) ? ['sticky'] : ['text'];
    for (const t of ['hand', ...S.tools]) {
      S.btn[t] = S.mkBtn(S.toolsEl, t, S.scope.CB_TOOL_LABELS[t], S.keyOf(t));
      S.btn[t].dataset.role = 'tool';
    }
    for (const t of S.decoys) {
      const b = S.mkBtn(S.toolsEl, t, S.scope.CB_TOOL_LABELS[t]);
      b.addEventListener('click', () => S.ctx.log('decoy', { what: t }));
    }
    S.ctl = {};
    if (S.v === 'tool' || S.v === 'erase' || S.v === 'multi') {
      S.util.el('span', 'sep', S.toolsEl);
      S.ctl.undo = S.mkBtn(S.toolsEl, 'undo', 'Undo', S.spec.keys && S.v !== 'multi' ? '⌃Z' : null);
      S.ctl.undo.dataset.role = 'control';
      if (S.v === 'multi') {
        S.ctl.clear = S.mkBtn(S.toolsEl, 'clear', S.rng.pick(['Clear', 'Clear all']));
        S.ctl.clear.dataset.role = 'control';
      }
    }
    S.zoomEl = S.util.el('div', 'cb-float cb-zoom', S.app);
    S.zOut = S.mkBtn(S.zoomEl, 'zout', 'Zoom out');
    S.zOut.textContent = '−';
    S.pct = S.util.el('span', 'pct', S.zoomEl, '100%');
    S.zIn = S.mkBtn(S.zoomEl, 'zin', 'Zoom in');
    S.zIn.textContent = '+';
    S.zFit = S.mkBtn(S.zoomEl, 'fit', 'Zoom to fit');
    S.hints = {
      line: 'Press and drag on the frame to draw; a new stroke replaces the last one.',
      circle: 'Press and drag on the frame to draw; a new stroke replaces the last one.',
      trace: 'Press and drag on the frame to draw; a new stroke replaces the last one.',
      tool: 'Pick a tool, then drag on the frame. Undo removes the last shape.',
      connect: 'Drag from a note’s right-hand dot onto another note to connect them. Hover a connector for its ×.',
      erase: 'The eraser deletes any doodle it touches. Undo brings it back.',
      multi: 'Every stroke stays and counts. Undo removes the last one.',
    };
    S.hintEl = S.util.el('div', 'cb-float cb-hint', S.app, `${S.hints[S.v]} Hand tool or middle-drag pans.`);
  }

  function camera(S) {
    S.ar = S.app.getBoundingClientRect();
    S.rel = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - S.ar.left, t: r.top - S.ar.top, r: r.right - S.ar.left, b: r.bottom - S.ar.top }; };
    S.zr = S.rel(S.zoomEl);
    S.hintEl.style.maxWidth = `${Math.max(120, S.zr.l - 26)}px`;
    S.free = { x: S.rel(S.toolsEl).r + 18, y: Math.max(S.rel(S.head).b, S.rel(S.share).b) + 30, r: S.cw - 18, b: Math.min(S.zr.t, S.rel(S.hintEl).t) - 16 };
    S.bw = S.spec.board.w;
    S.bh = S.spec.board.h;
    S.fitK = Math.min((S.free.r - S.free.x) / S.bw, (S.free.b - S.free.y) / S.bh);
    S.cam = { k: 0, x: 0, y: 0 };
    S.k0 = S.fitK;
    S.fit = function fit(frac, fx, fy) {
      S.cam.k = S.fitK * frac;
      S.cam.x = S.free.x + (S.free.r - S.free.x - S.bw * S.cam.k) * fx;
      S.cam.y = S.free.y + (S.free.b - S.free.y - S.bh * S.cam.k) * fy;
    };
    S.fit(S.rng.float(0.84, 0.97), S.rng.float(0.25, 0.75), S.rng.float(0.3, 0.7));
    S.k0 = S.cam.k;
    S.K100 = S.rng.pick([440, 480, 520]);
    S.toS = ([x, y]) => [S.cam.x + x * S.cam.k, S.cam.y + y * S.cam.k];
    S.toB = ([x, y]) => [(x - S.cam.x) / S.cam.k, (y - S.cam.y) / S.cam.k];
    S.z = () => S.cam.k / S.k0;
    S.vp = (s) => { const r = S.canvas.getBoundingClientRect(); return [r.left + s[0], r.top + s[1]]; };
    S.local = (e) => { const r = S.canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    S.clampB = ([x, y]) => [S.scope.r4(Math.min(S.bw, Math.max(0, x))), S.scope.r4(Math.min(S.bh, Math.max(0, y)))];
  }

  function clutter(S) {
    S.cr = S.rng.fork('clutter');
    S.clutter = [];
    S.frame2 = S.cr.bool(0.6) ? { x: S.bw + S.cr.float(0.3, 0.45), y: S.cr.float(-0.1, 0.25), w: S.cr.float(0.7, 1.0), h: S.cr.float(0.6, 0.85), name: S.cr.pick(['Frame 2', 'Parking lot', 'Archive', 'Ideas']) } : null;
    S.nClutter = S.cr.int(4, 7);
    for (let i = 0; i < S.nClutter; i++) {
      const side = S.cr.pick(['left', 'left', 'below', 'above', 'right']);
      const w = S.cr.float(0.16, 0.24);
      let x;
      let y;
      if (side === 'left') { x = -w - S.cr.float(0.12, 0.6); y = S.cr.float(-0.2, S.bh); }
      else if (side === 'right') { x = S.bw + S.cr.float(0.12, 0.2); y = S.cr.float(-0.2, S.bh); }
      else if (side === 'below') { x = S.cr.float(-0.2, S.bw); y = S.bh + S.cr.float(0.14, 0.4); }
      else { x = S.cr.float(-0.2, S.bw); y = -w - S.cr.float(0.2, 0.4); }
      if (S.frame2 && x + w > S.frame2.x - 0.05 && x < S.frame2.x + S.frame2.w + 0.05 && y + w > S.frame2.y - 0.05 && y < S.frame2.y + S.frame2.h + 0.05) continue;
      S.clutter.push({ kind: S.cr.pick(['note', 'note', 'note', 'shape']), x, y, w, h: w, color: S.cr.pick(S.scope.CB_NOTES), text: S.cr.pick(S.scope.CB_NOTE_TEXT), rot: S.cr.float(-0.05, 0.05) });
    }
    if (S.frame2) for (let i = 0; i < S.cr.int(2, 3); i++) {
      const w = S.cr.float(0.16, 0.2);
      S.clutter.push({ kind: 'note', x: S.frame2.x + 0.06 + i * (w + 0.05), y: S.frame2.y + S.cr.float(0.08, S.frame2.h - w - 0.05), w, h: w, color: S.cr.pick(S.scope.CB_NOTES), text: S.cr.pick(S.scope.CB_NOTE_TEXT), rot: S.cr.float(-0.04, 0.04) });
    }
    S.frameName = S.rng.pick(S.scope.CB_FRAMES);
    S.paper = S.v === 'erase' && S.dark ? '#f3f2ee' : S.col.panel;
    S.gridStep = S.rng.pick([0.04, 0.05, 0.0625]);
    S.inkCol = S.v === 'erase' ? '#25262b' : S.rng.pick([S.col.accent, '#1c63d6', '#c2255c', '#2b8a3e']);
    S.inkW = S.rng.pick([3, 3.5, 4]);
    S.noteCols = (S.spec.nodes || []).map(() => S.rng.pick(S.scope.CB_NOTES));
    S.eraseW = S.rng.pick([4, 5, 6]);
  }

  function drawing(S) {
    S.text = function text(s, x, y, size, color, weight = 700, align = 'center', halo = S.paper) {
      S.g.font = `${weight} ${size}px ${S.font}`;
      S.g.textAlign = align;
      S.g.textBaseline = 'middle';
      if (halo) { S.g.lineWidth = 4; S.g.strokeStyle = halo; S.g.lineJoin = 'round'; S.g.strokeText(s, x, y); }
      S.g.fillStyle = color;
      S.g.fillText(s, x, y);
    };
    S.dotAt = function dotAt(p, hollow) {
      const [x, y] = S.toS(p);
      S.g.beginPath();
      if (hollow) {
        S.g.arc(x, y, 7.5, 0, 2 * Math.PI);
        S.g.fillStyle = S.paper;
        S.g.fill();
        S.g.lineWidth = 2.5;
        S.g.strokeStyle = S.col.fg;
        S.g.stroke();
        return;
      }
      S.g.arc(x, y, 9, 0, 2 * Math.PI);
      S.g.fillStyle = S.paper;
      S.g.fill();
      S.g.beginPath();
      S.g.arc(x, y, 6.5, 0, 2 * Math.PI);
      S.g.fillStyle = S.col.fg;
      S.g.fill();
    };
    S.unitV = (a, b) => { const dx = a[0] - b[0]; const dy = a[1] - b[1]; const l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
    S.labelAt = function labelAt(p, d, s, small, off = 20) {
      const [x, y] = S.toS(p);
      const [fx0, fy0] = S.toS([0, 0]);
      const [fx1, fy1] = S.toS([S.bw, S.bh]);
      const lx = Math.min(fx1 - 16, Math.max(fx0 + 16, x + d[0] * off));
      const ly = Math.min(fy1 - 10, Math.max(fy0 + 12, y + d[1] * off));
      if (small) S.text(s.toUpperCase(), lx, ly, 12, S.col.muted, 600);
      else S.text(s, lx, ly, 15, S.col.fg, 700);
    };
    S.poly = function poly(pts, color, width, dash, alpha = 1) {
      if (!pts || pts.length < 1) return;
      S.g.save();
      S.g.globalAlpha = alpha;
      S.g.beginPath();
      pts.forEach((p, i) => { const [x, y] = S.toS(p); if (i) S.g.lineTo(x, y); else S.g.moveTo(x, y); });
      if (pts.length === 1) { const [x, y] = S.toS(pts[0]); S.g.lineTo(x + 0.01, y); }
      S.g.lineWidth = width;
      S.g.strokeStyle = color;
      S.g.lineCap = 'round';
      S.g.lineJoin = 'round';
      S.g.setLineDash(dash || []);
      S.g.stroke();
      S.g.restore();
    };
    S.arrowRoute = function arrowRoute(path) {
      S.poly(path, S.col.muted, 16, null, 0.18);
      S.poly(path, S.col.muted, 2, [6, 6]);
      const tip = S.toS(path[path.length - 1]);
      const d = S.unitV(S.toS(path[path.length - 1]), S.toS(path[path.length - 2]));
      const n = [-d[1], d[0]];
      const back = [tip[0] - d[0] * 18, tip[1] - d[1] * 18];
      S.g.beginPath();
      S.g.moveTo(tip[0], tip[1]);
      S.g.lineTo(back[0] + n[0] * 9, back[1] + n[1] * 9);
      S.g.lineTo(back[0] - n[0] * 9, back[1] - n[1] * 9);
      S.g.closePath();
      S.g.fillStyle = S.col.fg;
      S.g.fill();
      S.g.lineWidth = 1.5;
      S.g.strokeStyle = S.paper;
      S.g.stroke();
    };
    S.dashedCircle = function dashedCircle(c, r) {
      const [x, y] = S.toS(c);
      S.g.save();
      S.g.beginPath();
      S.g.arc(x, y, r * S.cam.k, 0, 2 * Math.PI);
      S.g.lineWidth = 2;
      S.g.strokeStyle = S.col.muted;
      S.g.globalAlpha = 0.8;
      S.g.setLineDash([8, 7]);
      S.g.stroke();
      S.g.restore();
    };
    S.item = function item(it, color, width, dash, alpha) {
      const p = it.pts;
      if (!p || !p.length) return;
      if (it.kind === 'pen') { S.poly(p, color, width, dash, alpha); return; }
      if (it.kind === 'line') { S.poly([p[0], p[p.length - 1]], color, width, dash, alpha); return; }
      const [x0, y0] = S.toS(p[0]);
      const [x1, y1] = S.toS(p[p.length - 1]);
      S.g.save();
      S.g.globalAlpha = alpha ?? 1;
      S.g.beginPath();
      if (it.kind === 'rect') S.g.rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
      else S.g.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, 0, 2 * Math.PI);
      S.g.lineWidth = width;
      S.g.strokeStyle = color;
      S.g.lineJoin = 'round';
      S.g.setLineDash(dash || []);
      S.g.stroke();
      S.g.restore();
    };
    S.sticky = function sticky(x, y, w, h, color, label, rot, size) {
      // x, y, w, h in canvas px (top-left box)
      S.g.save();
      S.g.translate(x + w / 2, y + h / 2);
      S.g.rotate(rot || 0);
      S.g.shadowColor = 'rgba(0,0,0,.18)';
      S.g.shadowBlur = 8;
      S.g.shadowOffsetY = 3;
      S.g.fillStyle = color;
      S.g.beginPath();
      const f = Math.min(12, w * 0.14);
      S.g.moveTo(-w / 2, -h / 2);
      S.g.lineTo(w / 2, -h / 2);
      S.g.lineTo(w / 2, h / 2 - f);
      S.g.lineTo(w / 2 - f, h / 2);
      S.g.lineTo(-w / 2, h / 2);
      S.g.closePath();
      S.g.fill();
      S.g.shadowColor = 'transparent';
      S.g.fillStyle = 'rgba(0,0,0,.08)';
      S.g.beginPath();
      S.g.moveTo(w / 2, h / 2 - f);
      S.g.lineTo(w / 2 - f, h / 2 - f);
      S.g.lineTo(w / 2 - f, h / 2);
      S.g.closePath();
      S.g.fill();
      if (label) {
        let s = size;
        S.g.font = `600 ${s}px ${S.font}`;
        while (s > 8 && S.g.measureText(label).width > w - 12) { s -= 1; S.g.font = `600 ${s}px ${S.font}`; }
        S.g.textAlign = 'center';
        S.g.textBaseline = 'middle';
        S.g.fillStyle = '#26221a';
        S.g.fillText(label, 0, 0);
      }
      S.g.restore();
    };
  }

  function connectGeometry(S) {
    S.NODE = S.fam.helpers.NODE;
    S.portOf = (i, kind) => [S.spec.nodes[i].x + (kind === 'out' ? S.NODE.w / 2 : -S.NODE.w / 2), S.spec.nodes[i].y];
    S.edgeGeom = function edgeGeom(i, j) {
      const a = S.toS(S.portOf(i, 'out'));
      const b = S.toS(S.portOf(j, 'in'));
      const Wl = S.toS([0, 0])[0];
      const Wr = S.toS([S.bw, 0])[0];
      const kk = b[0] > a[0] ? Math.max(40 * S.z(), (b[0] - a[0]) / 2) : 60 * S.z();
      const c1 = [a[0] + Math.min(kk, (Wr - a[0]) * 1.2), a[1]];
      const c2 = [b[0] - Math.min(kk, (b[0] - Wl) * 1.2), b[1]];
      const at = (t) => {
        const u = 1 - t;
        return [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
          u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]];
      };
      return { a, b, c1, c2, at, mid: at(0.5) };
    };
    S.noteRect = (i) => {
      const [x, y] = S.toS([S.spec.nodes[i].x - S.NODE.w / 2, S.spec.nodes[i].y - S.NODE.h / 2]);
      return { x, y, w: S.NODE.w * S.cam.k, h: S.NODE.h * S.cam.k };
    };
    S.portR = () => Math.max(5, Math.min(8, 6 * S.z()));
  }

  function painting(S) {
    S.hover = null;
    S.live = null;
    S.paint = function paint() {
      const m = S.ctx.model;
      S.g.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
      S.g.fillStyle = S.col.bg;
      S.g.fillRect(0, 0, S.cw, S.ch);
      // infinite dot grid in world space
      let step = S.gridStep;
      while (step * S.cam.k < 12) step *= 2;
      const [wx0, wy0] = S.toB([0, 0]);
      const [wx1, wy1] = S.toB([S.cw, S.ch]);
      S.g.fillStyle = S.col.line;
      const rad = Math.max(0.8, Math.min(1.6, 1.2 * S.z()));
      for (let gx = Math.floor(wx0 / step) * step; gx <= wx1; gx += step) {
        for (let gy = Math.floor(wy0 / step) * step; gy <= wy1; gy += step) {
          const [x, y] = S.toS([gx, gy]);
          S.g.fillRect(x - rad, y - rad, 2 * rad, 2 * rad);
        }
      }
      // clutter
      if (S.frame2) {
        const [x, y] = S.toS([S.frame2.x, S.frame2.y]);
        S.g.fillStyle = S.col.panel;
        S.g.globalAlpha = 0.85;
        S.g.fillRect(x, y, S.frame2.w * S.cam.k, S.frame2.h * S.cam.k);
        S.g.globalAlpha = 1;
        S.g.strokeStyle = S.col.line;
        S.g.lineWidth = 1;
        S.g.strokeRect(x, y, S.frame2.w * S.cam.k, S.frame2.h * S.cam.k);
        S.text(S.frame2.name, x, y - 11, 12, S.col.muted, 600, 'left', null);
      }
      for (const c of S.clutter) {
        const [x, y] = S.toS([c.x, c.y]);
        if (c.kind === 'note') S.sticky(x, y, c.w * S.cam.k, c.h * S.cam.k, c.color, c.text, c.rot, Math.max(9, 13 * S.z()));
        else {
          S.g.save();
          S.g.strokeStyle = S.col.muted;
          S.g.globalAlpha = 0.7;
          S.g.lineWidth = 2;
          S.g.beginPath();
          S.g.ellipse(x + c.w * S.cam.k / 2, y + c.h * S.cam.k / 2, c.w * S.cam.k / 2, c.h * S.cam.k / 3, 0, 0, 2 * Math.PI);
          S.g.stroke();
          S.g.restore();
        }
      }
      // the frame
      const [fx, fy] = S.toS([0, 0]);
      const fw = S.bw * S.cam.k;
      const fh = S.bh * S.cam.k;
      S.g.save();
      S.g.shadowColor = S.dark ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.12)';
      S.g.shadowBlur = 14;
      S.g.shadowOffsetY = 3;
      S.g.fillStyle = S.paper;
      S.g.fillRect(fx, fy, fw, fh);
      S.g.restore();
      S.g.strokeStyle = S.col.line;
      S.g.lineWidth = 1;
      S.g.strokeRect(fx + 0.5, fy + 0.5, fw - 1, fh - 1);
      S.text(S.frameName, fx, fy - 12, 12, S.col.muted, 600, 'left', null);
      S.g.save();
      S.g.beginPath();
      S.g.rect(fx, fy, fw, fh);
      S.g.clip();
      S.paintScenario(m);
      S.g.restore();
      if (S.v === 'connect') S.paintConnect(m); // notes and ports may sit at the frame edge
      S.pct.textContent = `${Math.round((S.cam.k / S.K100) * 100)}%`;
    };
  }

  function scenarioPainting(S) {
    S.paintScenario = function paintScenario(m) {
      if (S.v === 'line') {
        if (S.spec.mode === 'connect') {
          S.dotAt(S.spec.a);
          S.dotAt(S.spec.b);
          S.labelAt(S.spec.a, S.unitV(S.spec.a, S.spec.b), 'A');
          S.labelAt(S.spec.b, S.unitV(S.spec.b, S.spec.a), 'B');
        } else {
          if (S.spec.dir === 'guide') {
            const d = [Math.cos(S.spec.angle), Math.sin(S.spec.angle)];
            const h = S.spec.guide.len / 2;
            const a = [S.spec.guide.c[0] - d[0] * h, S.spec.guide.c[1] - d[1] * h];
            const b = [S.spec.guide.c[0] + d[0] * h, S.spec.guide.c[1] + d[1] * h];
            S.poly([a, b], S.col.muted, 4);
            for (const e of [a, b]) { const [x, y] = S.toS(e); S.g.beginPath(); S.g.arc(x, y, 4, 0, 2 * Math.PI); S.g.fillStyle = S.col.muted; S.g.fill(); }
            const nrm = [-d[1], d[0]];
            S.labelAt(S.spec.guide.c, nrm[1] > 0 ? [-nrm[0], -nrm[1]] : nrm, 'guide', true, 18);
          }
          const [x, y] = S.toS(S.spec.p);
          S.g.save();
          S.g.beginPath();
          S.g.arc(x, y, 15, 0, 2 * Math.PI);
          S.g.setLineDash([3, 4]);
          S.g.lineWidth = 1.5;
          S.g.strokeStyle = S.col.muted;
          S.g.stroke();
          S.g.restore();
          S.dotAt(S.spec.p);
        }
        const k = (m.strokes || [])[m.strokes.length - 1];
        S.poly(S.live ? S.live.pts : k, S.inkCol, S.inkW * S.z());
      } else if (S.v === 'circle') {
        if (S.spec.show === 'guide') {
          S.dashedCircle(S.spec.c, S.spec.r);
          S.dotAt(S.spec.c);
          if (S.spec.rimDot) S.dotAt(S.spec.rim, true);
        } else {
          S.dotAt(S.spec.c);
          S.dotAt(S.spec.rim, true);
        }
        const k = (m.strokes || [])[m.strokes.length - 1];
        S.poly(S.live ? S.live.pts : k, S.inkCol, S.inkW * S.z());
      } else if (S.v === 'trace') {
        S.arrowRoute(S.spec.path);
        S.dotAt(S.spec.path[0]);
        S.labelAt(S.spec.path[0], S.unitV(S.spec.path[0], S.spec.path[1]), 'start', true, 24);
        const k = (m.strokes || [])[m.strokes.length - 1];
        S.poly(S.live ? S.live.pts : k, S.inkCol, S.inkW * S.z());
      } else if (S.v === 'tool') {
        if (S.spec.target === 'line') {
          S.dotAt(S.spec.a);
          S.dotAt(S.spec.b);
          S.labelAt(S.spec.a, S.unitV(S.spec.a, S.spec.b), 'A');
          S.labelAt(S.spec.b, S.unitV(S.spec.b, S.spec.a), 'B');
        } else if (S.spec.target === 'pen') {
          S.arrowRoute(S.spec.path);
          S.dotAt(S.spec.path[0]);
          S.labelAt(S.spec.path[0], S.unitV(S.spec.path[0], S.spec.path[1]), 'start', true, 24);
        } else if (S.spec.show === 'outline') {
          const [x0, y0] = S.toS(S.spec.a);
          const [x1, y1] = S.toS(S.spec.b);
          S.g.save();
          S.g.setLineDash([7, 6]);
          S.g.lineWidth = 2;
          S.g.strokeStyle = S.col.muted;
          S.g.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
          S.g.restore();
          S.g.fillStyle = S.col.muted;
          for (const [cx, cy] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) S.g.fillRect(cx - 3.5, cy - 3.5, 7, 7);
        } else {
          S.dotAt(S.spec.a);
          S.dotAt(S.spec.b);
        }
        for (const it of m.items || []) S.item(it, it.kind === 'pen' ? S.col.fg : S.inkCol, S.inkW * S.z(), null, it.kind === 'pen' ? 0.85 : 1);
        if (S.live && S.live.pts.length >= 2) {
          const t = m.tool;
          S.item(t === 'pen' ? { kind: 'pen', pts: S.live.pts } : { kind: t, pts: [S.live.pts[0], S.live.pts[S.live.pts.length - 1]] }, S.inkCol, S.inkW * S.z(), t === 'pen' ? null : [5, 4], 0.8);
        }
      } else if (S.v === 'erase') {
        S.spec.strokes.forEach((s, i) => { if (!(m.erased || []).includes(i)) S.poly(s.pts, S.fam.helpers.INKS[s.color], S.eraseW * S.z()); });
        for (const s of m.drawn || []) S.poly(s, '#25262b', 3 * S.z());
        if (S.live && m.tool === 'pen') S.poly(S.live.pts, '#25262b', 3 * S.z(), null, 0.7);
      } else if (S.v === 'multi') {
        for (const t of S.spec.targets) {
          if (t.type === 'line') {
            S.dotAt(t.a);
            S.dotAt(t.b);
            S.labelAt(t.a, S.unitV(t.a, t.b), t.labels[0]);
            S.labelAt(t.b, S.unitV(t.b, t.a), t.labels[1]);
          } else {
            S.dashedCircle(t.c, t.r);
            S.dotAt(t.c);
          }
        }
        for (const s of m.strokes || []) S.poly(s, S.inkCol, S.inkW * S.z()); // a live stroke is already the model's last
      }
    };
  }

  function connectPainting(S) {
    S.paintConnect = function paintConnect(m) {
      // connectors under the notes, remove handles above them
      const arrow = (e) => {
        const d = S.unitV(e.b, e.at(0.96));
        const n = [-d[1], d[0]];
        const back = [e.b[0] - d[0] * 10, e.b[1] - d[1] * 10];
        S.g.beginPath();
        S.g.moveTo(e.b[0], e.b[1]);
        S.g.lineTo(back[0] + n[0] * 5, back[1] + n[1] * 5);
        S.g.lineTo(back[0] - n[0] * 5, back[1] - n[1] * 5);
        S.g.closePath();
        S.g.fill();
      };
      const edges = (m.edges || []).map(([i, j]) => ({ i, j, e: S.edgeGeom(i, j) }));
      S.g.save();
      S.g.strokeStyle = S.col.fg;
      S.g.fillStyle = S.col.fg;
      S.g.globalAlpha = 0.65;
      S.g.lineWidth = 2;
      for (const { e } of edges) {
        S.g.beginPath();
        S.g.moveTo(e.a[0], e.a[1]);
        S.g.bezierCurveTo(e.c1[0], e.c1[1], e.c2[0], e.c2[1], e.b[0], e.b[1]);
        S.g.stroke();
        arrow(e);
      }
      S.g.restore();
      const size = Math.max(10, Math.min(20, 0.05 * S.cam.k));
      S.spec.nodes.forEach((n, i) => {
        const r = S.noteRect(i);
        S.sticky(r.x, r.y, r.w, r.h, S.noteCols[i], n.label, 0, size);
        for (const kind of ['in', 'out']) {
          const [x, y] = S.toS(S.portOf(i, kind));
          const on = S.hover && S.hover.port === `${i}:${kind}`;
          S.g.beginPath();
          S.g.arc(x, y, S.portR() + (on ? 2 : 0), 0, 2 * Math.PI);
          S.g.fillStyle = on ? S.col.accent : S.col.panel;
          S.g.fill();
          S.g.lineWidth = 2;
          S.g.strokeStyle = on ? S.col.accent : S.col.fg;
          S.g.stroke();
        }
      });
      for (const { i, j, e } of edges) {
        const on = S.hover && S.hover.edge === `${i}>${j}`;
        S.g.save();
        S.g.globalAlpha = on ? 1 : 0.35;
        S.g.beginPath();
        S.g.arc(e.mid[0], e.mid[1], 8, 0, 2 * Math.PI);
        S.g.fillStyle = on ? '#e03131' : S.col.panel;
        S.g.fill();
        S.g.lineWidth = 1.5;
        S.g.strokeStyle = on ? '#e03131' : S.col.muted;
        S.g.stroke();
        S.g.beginPath();
        S.g.moveTo(e.mid[0] - 3.5, e.mid[1] - 3.5);
        S.g.lineTo(e.mid[0] + 3.5, e.mid[1] + 3.5);
        S.g.moveTo(e.mid[0] + 3.5, e.mid[1] - 3.5);
        S.g.lineTo(e.mid[0] - 3.5, e.mid[1] + 3.5);
        S.g.strokeStyle = on ? '#fff' : S.col.fg;
        S.g.stroke();
        S.g.restore();
      }
      if (S.live && S.live.kind === 'link') {
        S.g.save();
        S.g.setLineDash([6, 5]);
        S.g.lineWidth = 2;
        S.g.strokeStyle = S.col.accent;
        S.g.beginPath();
        S.g.moveTo(S.live.from[0], S.live.from[1]);
        S.g.lineTo(S.live.cur[0], S.live.cur[1]);
        S.g.stroke();
        S.g.restore();
      }
    };
  }

  function controls(S) {
    S.up = function up(m) {
      S.ctx.update(m);
      S.sync(S.ctx.model);
    };
    S.hand = false;
    S.sync = function sync(m) {
      for (const t of Object.keys(S.btn)) {
        const on = t === 'hand' ? S.hand : !S.hand && (S.v === 'tool' || S.v === 'erase' ? m.tool === t : true);
        S.btn[t].setAttribute('aria-pressed', String(on));
      }
      if (S.ctl.undo) S.ctl.undo.disabled = S.v === 'tool' ? !(m.items || []).length : S.v === 'erase' ? !(m.ops || []).length : !(m.strokes || []).length;
      if (S.ctl.clear) S.ctl.clear.disabled = !(m.strokes || []).length;
      S.canvas.style.cursor = S.hand ? 'grab' : S.v === 'connect' ? 'default' : S.v === 'erase' && m.tool === 'eraser' ? 'cell' : 'crosshair';
      S.paint();
    };
    S.undo = () => {
      const m = S.ctx.model;
      if (S.v === 'tool') { if (m.items.length) S.up({ ...m, items: m.items.slice(0, -1) }); return; }
      if (S.v === 'multi') { if (m.strokes.length) S.up({ strokes: m.strokes.slice(0, -1) }); return; }
      const op = m.ops[m.ops.length - 1];
      if (!op) return;
      const ops = m.ops.slice(0, -1);
      if (op[0] === 'e') S.up({ ...m, ops, erased: m.erased.filter((i) => i !== op[1]) });
      else S.up({ ...m, ops, drawn: m.drawn.slice(0, -1) });
    };
    S.btn.hand.addEventListener('click', () => { S.hand = !S.hand; S.ctx.log('tool', { tool: S.hand ? 'hand' : 'off' }); S.sync(S.ctx.model); });
    for (const t of S.tools) {
      S.btn[t].addEventListener('click', () => {
        S.hand = false;
        S.ctx.log('tool', { tool: t });
        if (S.v === 'tool' || S.v === 'erase') S.up({ ...S.ctx.model, tool: t });
        else S.sync(S.ctx.model);
      });
    }
    if (S.ctl.undo) S.ctl.undo.addEventListener('click', S.undo);
    if (S.ctl.clear) S.ctl.clear.addEventListener('click', () => { if (S.ctx.model.strokes.length) S.up({ strokes: [] }); });
    if (S.spec.keys && (S.v === 'tool' || S.v === 'erase')) {
      S.scope.cbKey = (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); S.undo(); return; }
        if (e.ctrlKey || e.metaKey) return;
        const t = S.tools.find((k) => S.fam.helpers.TOOL_KEYS[k] === e.key.toLowerCase());
        if (t) { S.hand = false; S.up({ ...S.ctx.model, tool: t }); }
      };
    }
    S.zoomBy = function zoomBy(f) {
      const kmin = S.k0 * 0.45;
      const kmax = S.k0 * 2.6;
      const nk = Math.min(kmax, Math.max(kmin, S.cam.k * f));
      const c = [(S.free.x + S.free.r) / 2, (S.free.y + S.free.b) / 2];
      const w = S.toB(c);
      S.cam.k = nk;
      S.cam.x = c[0] - w[0] * nk;
      S.cam.y = c[1] - w[1] * nk;
      S.ctx.log('zoom', { pct: Math.round((nk / S.K100) * 100) });
      S.paint();
    };
    S.zIn.addEventListener('click', () => S.zoomBy(1.25));
    S.zOut.addEventListener('click', () => S.zoomBy(0.8));
    S.zFit.addEventListener('click', () => { S.fit(0.92, 0.5, 0.5); S.ctx.log('zoom', { fit: true }); S.paint(); });
  }

  function hitTesting(S) {
    S.near = (a, b, r) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= r;
    S.portAt = function portAt(s) {
      for (let i = S.spec.nodes.length - 1; i >= 0; i--) {
        for (const kind of ['out', 'in']) if (S.near(S.toS(S.portOf(i, kind)), s, S.portR() + 5)) return { i, kind };
      }
      return null;
    };
    S.edgeHandleAt = function edgeHandleAt(s) {
      for (const [i, j] of S.ctx.model.edges || []) if (S.near(S.edgeGeom(i, j).mid, s, 10)) return [i, j];
      return null;
    };
    S.edgeNear = function edgeNear(s) {
      for (const [i, j] of S.ctx.model.edges || []) {
        const e = S.edgeGeom(i, j);
        for (let t = 0; t <= 1.0001; t += 1 / 24) if (S.near(e.at(t), s, 7)) return [i, j];
      }
      return null;
    };
    S.noteAt = function noteAt(s) {
      for (let i = S.spec.nodes.length - 1; i >= 0; i--) {
        const r = S.noteRect(i);
        const pad = S.portR() + 4;
        if (s[0] >= r.x - pad && s[0] <= r.x + r.w + pad && s[1] >= r.y && s[1] <= r.y + r.h) return i;
      }
      return -1;
    };
    S.erasedNow = 0;
    S.eraseAt = function eraseAt(points) {
      const R = 10 / S.cam.k;
      let m = S.ctx.model;
      let changed = false;
      for (; S.erasedNow < points.length; S.erasedNow++) {
        const p = points[S.erasedNow];
        S.spec.strokes.forEach((s, i) => {
          if (m.erased.includes(i)) return;
          for (let k = 1; k < s.pts.length; k++) {
            const a = s.pts[k - 1];
            const b = s.pts[k];
            const ab = [b[0] - a[0], b[1] - a[1]];
            const l2 = ab[0] * ab[0] + ab[1] * ab[1];
            const t = l2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1]) / l2)) : 0;
            if (Math.hypot(p[0] - a[0] - t * ab[0], p[1] - a[1] - t * ab[1]) <= R) {
              m = { ...m, erased: m.erased.concat([i]), ops: m.ops.concat([['e', i]]) };
              changed = true;
              S.ctx.log('erase', { stroke: i });
              return;
            }
          }
        });
      }
      if (changed) S.up(m);
    };
  }

  function pointerStart(S) {
    S.drag = null;
    S.inkLive = function inkLive() {
      const pts = S.live.pts.slice();
      if (S.v === 'line' || S.v === 'circle' || S.v === 'trace' || S.v === 'multi') S.ctx.update({ strokes: S.live.base.concat([pts]) });
      else if (S.v === 'erase' && S.ctx.model.tool === 'eraser') { S.eraseAt(S.live.pts); return; }
      S.paint();
    };
    S.inkEnd = function inkEnd() {
      const pts = S.live.pts.slice();
      const kind = S.v;
      S.live = null;
      S.ctx.log('stroke', { phase: 'end', points: pts.length });
      if (kind === 'line' || kind === 'circle' || kind === 'trace' || kind === 'multi') S.up({ strokes: S.ctx.model.strokes.slice(0, -1).concat([pts]) });
      else if (kind === 'tool') {
        const it = S.fam.helpers.itemFromStroke(S.ctx.model.tool, pts);
        if (it) S.up({ ...S.ctx.model, items: S.ctx.model.items.concat([it]) });
        else S.paint();
      } else if (kind === 'erase') {
        if (S.ctx.model.tool === 'eraser') { S.eraseAt(pts); S.erasedNow = 0; S.paint(); return; }
        S.erasedNow = 0;
        if (pts.length >= 2) S.up({ ...S.ctx.model, drawn: S.ctx.model.drawn.concat([pts]), ops: S.ctx.model.ops.concat([['d']]) });
        else S.paint();
      }
    };
    S.onDown = (e) => {
      if (S.drag) return;
      const s = S.local(e);
      if (e.button === 1 || (e.button === 0 && S.hand)) {
        e.preventDefault();
        S.drag = { kind: 'pan', s0: s, c0: { ...S.cam } };
        S.canvas.style.cursor = 'grabbing';
      } else if (e.button === 0) {
        if (S.v === 'connect') {
          const p = S.portAt(s);
          const del = !p && S.edgeHandleAt(s);
          if (p) {
            S.drag = { kind: 'link', i: p.i, port: p.kind };
            S.live = { kind: 'link', from: S.toS(S.portOf(p.i, p.kind)), cur: s };
          } else if (del) S.drag = { kind: 'del', edge: del, s0: s };
          else if (S.noteAt(s) < 0) S.drag = { kind: 'pan', s0: s, c0: { ...S.cam } };
          else return;
        } else {
          const p = S.clampB(S.toB(s));
          S.drag = { kind: 'ink', last: s };
          S.live = { kind: 'ink', pts: [p], base: (S.ctx.model.strokes || []).slice() };
          S.erasedNow = 0;
          S.ctx.log('stroke', { phase: 'start' });
          S.inkLive();
        }
      } else return;
      S.canvas.setPointerCapture(e.pointerId);
    };
  }

  function pointerMove(S) {
    S.onMove = (e) => {
      const s = S.local(e);
      if (!S.drag) {
        if (S.v !== 'connect') return;
        const p = S.portAt(s);
        const ed = !p && (S.edgeHandleAt(s) || S.edgeNear(s));
        const h = p ? { port: `${p.i}:${p.kind}` } : ed ? { edge: `${ed[0]}>${ed[1]}` } : null;
        if (JSON.stringify(h) !== JSON.stringify(S.hover)) { S.hover = h; S.paint(); }
        S.canvas.style.cursor = S.hand ? 'grab' : p ? 'crosshair' : ed && S.edgeHandleAt(s) ? 'pointer' : 'default';
        return;
      }
      if (S.drag.kind === 'pan') {
        S.cam.x = S.drag.c0.x + s[0] - S.drag.s0[0];
        S.cam.y = S.drag.c0.y + s[1] - S.drag.s0[1];
        S.paint();
      } else if (S.drag.kind === 'link') {
        S.live.cur = s;
        S.paint();
      } else if (S.drag.kind === 'ink') {
        const evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
        let added = false;
        for (const ce of evs.length ? evs : [e]) {
          const q = S.local(ce);
          if (Math.hypot(q[0] - S.drag.last[0], q[1] - S.drag.last[1]) < 1) continue;
          S.drag.last = q;
          S.live.pts.push(S.clampB(S.toB(q)));
          added = true;
        }
        if (added) S.inkLive();
      }
    };
  }

  function pointerEnd(S) {
    S.onUp = (e) => {
      if (!S.drag) return;
      const d = S.drag;
      S.drag = null;
      const s = S.local(e);
      try { S.canvas.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
      if (d.kind === 'pan') {
        if (s[0] !== d.s0[0] || s[1] !== d.s0[1]) S.ctx.log('pan', { dx: Math.round(s[0] - d.s0[0]), dy: Math.round(s[1] - d.s0[1]) });
        S.sync(S.ctx.model);
      } else if (d.kind === 'link') {
        S.live = null;
        const j = S.noteAt(s);
        if (j >= 0 && j !== d.i) {
          const edge = d.port === 'out' ? [d.i, j] : [j, d.i];
          const m = S.ctx.model;
          if (!m.edges.some((f) => f[0] === edge[0] && f[1] === edge[1])) {
            S.ctx.log('connect', { from: edge[0], to: edge[1] });
            S.up({ ...m, edges: m.edges.concat([edge]) });
            return;
          }
        }
        S.paint();
      } else if (d.kind === 'del') {
        const [i, j] = d.edge;
        if (S.near(S.edgeGeom(i, j).mid, s, 10)) {
          S.ctx.log('disconnect', { from: i, to: j });
          S.hover = null;
          S.up({ ...S.ctx.model, edges: S.ctx.model.edges.filter((f) => !(f[0] === i && f[1] === j)) });
        }
      } else if (d.kind === 'ink') {
        const p = S.clampB(S.toB(s));
        const l = S.live.pts[S.live.pts.length - 1];
        if (p[0] !== l[0] || p[1] !== l[1]) S.live.pts.push(p);
        S.inkEnd();
      }
    };
    S.canvas.addEventListener('pointerdown', S.onDown);
  }

  function finish(S) {
    S.canvas.addEventListener('pointermove', S.onMove);
    S.canvas.addEventListener('pointerup', S.onUp);
    S.canvas.addEventListener('pointercancel', S.onUp);
    S.canvas.addEventListener('auxclick', (e) => e.preventDefault());
    S.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    S.sync(S.ctx.model);
    S.scope.cbView = {
      locate(t) {
        if (t.point) return S.vp(S.toS(t.point));
        if (t.tool) return S.btn[t.tool] ? S.scope.env.util.center(S.btn[t.tool]) : null;
        if (t.control) return S.ctl[t.control] ? S.scope.env.util.center(S.ctl[t.control]) : null;
        if (t.port) return S.vp(S.toS(S.portOf(t.port[0], t.port[1])));
        if (t.edgeDel) {
          const [i, j] = t.edgeDel;
          return (S.ctx.model.edges || []).some((e) => e[0] === i && e[1] === j) ? S.vp(S.edgeGeom(i, j).mid) : null;
        }
        if (t.grab !== undefined) return S.vp(S.toS(S.spec.strokes[t.grab].grab));
        return null;
      },
    };
    return { anchors: [S.canvas], sync: S.sync };
  }

  env.template('draw-shape/_canvasboard', () => ({
    render(scope, ctx) {
      const S = { scope, ctx };
      surface(S);
      chrome(S);
      camera(S);
      clutter(S);
      drawing(S);
      connectGeometry(S);
      painting(S);
      scenarioPainting(S);
      connectPainting(S);
      controls(S);
      hitTesting(S);
      pointerStart(S);
      pointerMove(S);
      pointerEnd(S);
      return finish(S);
    },
  }));
})();
