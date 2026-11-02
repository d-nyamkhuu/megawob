/*
 * reference / slider / video: a video player drawn on one <canvas> (scenarios media, player). The name, scenarios and
 * `uses` live in templates/set-slider/base.js; this file fills in render / locate.
 *   Frames are procedural: a seeded scene (hills, city, shapes or stripes in a seeded palette) that changes with the
 *   seek position, the video title top left, and the timecode (HH:MM:SS:FF) burned in bottom right. player: a
 *   caption line over the frame while captions are on.
 *   Controls are drawn on the canvas too, under the frame (bar) or over its bottom edge (overlay), per seed:
 *   a seek bar split into 3-6 chapters (gaps at the chapter starts, as streaming players do) with a hover preview
 *   (a thumbnail of the frame under the pointer, its time and chapter name) above it; a play button (decoy: the
 *   video stays paused, nothing here runs on a clock); elapsed / total time and the current chapter; a volume
 *   slider with its percentage and a speaker icon (media: decoy; player: the mute toggle); player only: a CC
 *   toggle, and decoy settings / full-screen buttons on wide players. The volume group sits left (after play) or
 *   right (before CC) per seed.
 * There is no DOM for the controls: the widget hit-tests the canvas. A press on a knob drags it, keeping the offset
 * from the knob's center (no jump); a press elsewhere on a track jumps the knob to the pointer and keeps dragging
 * (logged as 'track-click', flagged when the spec forbids it). Dragging the volume unmutes (player), as real players
 * do. Toggles flip on a click that starts and ends on the same button.
 * Keyboard (spec.keys): the canvas takes focus on a press; the last pressed slider is focused (model.focus) and
 * arrows / PageUp / PageDown / Home / End step it with helpers.scale.keyApply. Without spec.keys keys do nothing.
 * locate: { slider, thumb } = the knob's center; with value, the point on the track where the knob's center sits at
 * that value; { toggle: 'mute' | 'captions' } = the button's center. Anchor: the canvas.
 */
(function () {
  'use strict';

  const KEYS = new Set(['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);
  const CHAPTERS = ['Intro', 'Getting started', 'The basics', 'Setup', 'First steps', 'Main part', 'A closer look', 'Details',
    'Tips', 'Common mistakes', 'Questions', 'Recap', 'Wrap-up', 'Outro', 'Bonus'];
  const CAPTION_LINES = ['So the first thing we want to do is', 'and that is really all there is to it.', '[upbeat music]',
    'Let me show you what I mean here.', 'which brings us to the next part.', '[laughter]', 'Okay, let us take a closer look.',
    'You can see it right over here.', 'and this is where it gets interesting.', '[applause]'];
  const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  const CSS = `.svp-box { position: absolute; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.18); background: #000; line-height: 0; }
  .svp-box canvas { display: block; outline: none; }
  .svp-box canvas:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }`;

  let V = null; // the current render

  function placeIn(ctx, el, rng, pad = 12) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const freeX = Math.max(0, ctx.size.width - w - 2 * pad);
    const freeY = Math.max(0, ctx.size.height - h - 2 * pad);
    const c01 = (f) => Math.min(1, Math.max(0, f));
    const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
    const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
    const st = ctx.stage.getBoundingClientRect();
    const fixed = [...document.querySelectorAll('[data-role="submit"]')]
      .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
    const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + h > r.top - 6);
    let [x, y] = [pad + fx * freeX, pad + fy * freeY];
    for (const [ax, ay] of [[fx, fy], [fx, 0], [0, fy], [0, 0], [1, 0], [0, 1], [0.5, 0], [0.5, 0.5]]) {
      if (!hits(pad + ax * freeX, pad + ay * freeY)) {
        [x, y] = [pad + ax * freeX, pad + ay * freeY];
        break;
      }
    }
    el.style.left = Math.round(x) + 'px';
    el.style.top = Math.round(y) + 'px';
  }

  const SC = () => env.taskOf('set-slider').helpers.scale;
  const pad2 = (n) => String(n).padStart(2, '0');
  const timecode = (sec) => `${pad2(Math.floor(sec / 3600))}:${pad2(Math.floor((sec % 3600) / 60))}:${pad2(Math.floor(sec % 60))}:00`;
  const inRect = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

  // ---- geometry

  // The track of slider i: { x0, x1, y, r (knob radius), hit (half height of the press band) }.
  const trackOf = (S, i) => S.tracks[i];
  const knobX = (S, i, v) => {
    const t = trackOf(S, i);
    return t.x0 + SC().frac(S.spec.sliders[i], v) * (t.x1 - t.x0);
  };
  const valueAtX = (S, i, x) => {
    const t = trackOf(S, i);
    return SC().valueAt(S.spec.sliders[i], (x - t.x0) / (t.x1 - t.x0));
  };
  const chapterAt = (S, sec) => {
    let k = 0;
    for (let j = 0; j < S.chapters.length; j++) if (S.chapters[j].at <= sec) k = j;
    return S.chapters[k];
  };

  // ---- drawing

  // A seeded scene at time sec, drawn into the rectangle (x, y, w, h).
  function drawFrame(S, g, x, y, w, h, sec) {
    const { scene } = S;
    const p = sec / Math.max(1, S.spec.sliders[0].max);
    const hue = (scene.hue + p * scene.drift) % 360;
    g.save();
    g.beginPath();
    g.rect(x, y, w, h);
    g.clip();
    const sky = g.createLinearGradient(x, y, x, y + h);
    sky.addColorStop(0, `hsl(${hue} ${scene.sat}% ${scene.light + 14}%)`);
    sky.addColorStop(1, `hsl(${(hue + 40) % 360} ${scene.sat}% ${scene.light - 6}%)`);
    g.fillStyle = sky;
    g.fillRect(x, y, w, h);
    if (scene.kind === 'hills' || scene.kind === 'city') {
      // A sun crossing the sky over the video.
      g.fillStyle = `hsl(${(hue + 180) % 360} 80% 75% / .85)`;
      g.beginPath();
      g.arc(x + w * (0.1 + 0.8 * p), y + h * (0.55 - 0.35 * Math.sin(Math.PI * p)), Math.max(4, h * 0.08), 0, 2 * Math.PI);
      g.fill();
    }
    if (scene.kind === 'hills') {
      for (let k = 0; k < 3; k++) {
        g.fillStyle = `hsl(${(hue + 90 + k * 20) % 360} ${scene.sat - 10}% ${22 + k * 9}%)`;
        g.beginPath();
        g.moveTo(x, y + h);
        for (let i = 0; i <= 24; i++) {
          const fx = i / 24;
          const yy = y + h * (0.55 + k * 0.13) - h * 0.12 * Math.sin(fx * scene.freq[k] + scene.phase[k] + p * (3 - k) * 4);
          g.lineTo(x + fx * w, yy);
        }
        g.lineTo(x + w, y + h);
        g.closePath();
        g.fill();
      }
    } else if (scene.kind === 'city') {
      const n = scene.blocks.length;
      const off = (p * w * 0.6) % (w / n);
      scene.blocks.forEach((b, i) => {
        const bx = x + ((i * w) / n - off + w) % (w + w / n) - w / n;
        g.fillStyle = `hsl(${(hue + 200) % 360} 18% ${12 + b.l}%)`;
        g.fillRect(bx, y + h * (1 - b.h), (w / n) * 0.9, h * b.h);
        g.fillStyle = 'hsl(48 90% 70% / .7)';
        for (let r = 0; r < 4; r++) if ((i + r + Math.floor(sec / 7)) % 3 === 0) g.fillRect(bx + 6, y + h * (1 - b.h) + 8 + r * 12, 5, 6);
      });
    } else if (scene.kind === 'shapes') {
      scene.shapes.forEach((s, i) => {
        const a = s.a + p * s.v * 2 * Math.PI;
        g.fillStyle = `hsl(${(hue + s.dh) % 360} 70% 60% / .8)`;
        g.beginPath();
        const cx = x + w * (0.5 + 0.38 * Math.cos(a) * s.rx);
        const cy = y + h * (0.5 + 0.38 * Math.sin(a) * s.ry);
        if (i % 2) g.arc(cx, cy, h * s.size, 0, 2 * Math.PI);
        else g.rect(cx - h * s.size, cy - h * s.size, 2 * h * s.size, 2 * h * s.size);
        g.fill();
      });
    } else {
      const n = scene.stripes;
      for (let i = 0; i < n + 2; i++) {
        g.fillStyle = `hsl(${(hue + i * 25) % 360} 55% ${30 + (i % 3) * 10}% / .7)`;
        const sx = x + ((i * w) / n + p * w * 1.5) % (w + w / n) - w / n;
        g.beginPath();
        g.moveTo(sx, y + h);
        g.lineTo(sx + w / n, y + h);
        g.lineTo(sx + w / n + h * 0.4, y);
        g.lineTo(sx + h * 0.4, y);
        g.closePath();
        g.fill();
      }
    }
    g.restore();
  }

  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function drawSpeaker(g, b, silent, hot) {
    const x = b.x + b.w / 2 - 9;
    const y = b.y + b.h / 2;
    g.fillStyle = g.strokeStyle = hot ? '#fff' : '#e8e8e8';
    g.beginPath();
    g.moveTo(x, y - 3.5);
    g.lineTo(x + 4, y - 3.5);
    g.lineTo(x + 9, y - 8);
    g.lineTo(x + 9, y + 8);
    g.lineTo(x + 4, y + 3.5);
    g.lineTo(x, y + 3.5);
    g.closePath();
    g.fill();
    g.lineWidth = 1.7;
    g.lineCap = 'round';
    g.beginPath();
    if (silent) {
      g.moveTo(x + 12, y - 4);
      g.lineTo(x + 18, y + 4);
      g.moveTo(x + 18, y - 4);
      g.lineTo(x + 12, y + 4);
    } else {
      g.arc(x + 10, y, 4.5, -0.9, 0.9);
      g.moveTo(x + 10 + 8 * Math.cos(-0.9), y + 8 * Math.sin(-0.9));
      g.arc(x + 10, y, 8, -0.9, 0.9);
    }
    g.stroke();
  }

  function draw() {
    const S = V;
    if (!S) return;
    const { g, spec, W, H, accent } = S;
    const m = S.ctx.model;
    const [seek, vol] = spec.sliders;
    const sec = m.values[0][0];
    g.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    // Frame.
    drawFrame(S, g, 0, 0, W, S.VH, sec);
    g.textBaseline = 'alphabetic';
    g.font = `600 ${S.titleSize}px ${FONT}`;
    g.fillStyle = 'rgba(0,0,0,.35)';
    g.fillRect(0, 0, W, S.titleSize + 22);
    g.fillStyle = '#fff';
    g.textAlign = 'left';
    g.fillText(spec.title, 14, S.titleSize + 10);
    g.font = `600 12px ui-monospace, Menlo, Consolas, monospace`;
    const tc = timecode(sec);
    const tw = g.measureText(tc).width;
    const tcY = S.layout === 'overlay' ? S.seekY - 34 : S.VH - 12;
    g.fillStyle = 'rgba(0,0,0,.55)';
    g.fillRect(W - tw - 22, tcY - 14, tw + 12, 19);
    g.fillStyle = '#f5f5f5';
    g.fillText(tc, W - tw - 16, tcY);
    if (spec.scenario === 'player' && m.captions) {
      g.font = `500 ${S.capSize}px ${FONT}`;
      g.textAlign = 'center';
      const cw = g.measureText(S.caption).width;
      const cy = S.layout === 'overlay' ? S.seekY - 62 : S.VH - 40;
      g.fillStyle = 'rgba(0,0,0,.7)';
      g.fillRect(W / 2 - cw / 2 - 8, cy - S.capSize - 2, cw + 16, S.capSize + 10);
      g.fillStyle = '#fff';
      g.fillText(S.caption, W / 2, cy + 2);
      g.textAlign = 'left';
    }
    // Control area.
    if (S.layout === 'overlay') {
      const gr = g.createLinearGradient(0, S.VH - 90, 0, S.VH);
      gr.addColorStop(0, 'rgba(0,0,0,0)');
      gr.addColorStop(1, 'rgba(0,0,0,.75)');
      g.fillStyle = gr;
      g.fillRect(0, S.VH - 90, W, 90);
    } else {
      g.fillStyle = S.barColor;
      g.fillRect(0, S.VH, W, H - S.VH);
    }
    // Seek bar: chapter segments, buffered part, played part, hover highlight, knob.
    const t = S.tracks[0];
    const kx = knobX(S, 0, sec);
    const hoverX = S.hover && S.hover.seek ? S.hover.x : null;
    const thick = S.hover && (S.hover.seek || S.drag) ? S.rail + 2 : S.rail;
    S.chapters.forEach((c, k) => {
      const a = knobX(S, 0, c.at) + (k ? 1.5 : 0);
      const b = (k + 1 < S.chapters.length ? knobX(S, 0, S.chapters[k + 1].at) - 1.5 : t.x1);
      const y = t.y - thick / 2;
      g.fillStyle = 'rgba(255,255,255,.28)';
      g.fillRect(a, y, b - a, thick);
      const buf = Math.min(b, Math.max(a, t.x0 + S.buffer * (t.x1 - t.x0)));
      g.fillStyle = 'rgba(255,255,255,.45)';
      g.fillRect(a, y, buf - a, thick);
      if (hoverX !== null) {
        g.fillStyle = 'rgba(255,255,255,.65)';
        g.fillRect(a, y, Math.min(b, Math.max(a, hoverX)) - a, thick);
      }
      g.fillStyle = accent;
      g.fillRect(a, y, Math.min(b, Math.max(a, kx)) - a, thick);
    });
    g.fillStyle = accent;
    g.beginPath();
    g.arc(kx, t.y, S.knob[0], 0, 2 * Math.PI);
    g.fill();
    if (S.focus === 0) {
      g.strokeStyle = '#fff';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(kx, t.y, S.knob[0] + 3, 0, 2 * Math.PI);
      g.stroke();
    }
    // Buttons and text.
    const B = S.buttons;
    const y0 = S.rowY;
    // play (decoy)
    g.fillStyle = '#f2f2f2';
    g.beginPath();
    g.moveTo(B.play.x + 9, y0 - 8);
    g.lineTo(B.play.x + 22, y0);
    g.lineTo(B.play.x + 9, y0 + 8);
    g.closePath();
    g.fill();
    // volume group
    const silent = m.muted || m.values[1][0] === 0;
    drawSpeaker(g, B.speaker, spec.scenario === 'player' ? silent : false, S.hover && S.hover.button === 'mute');
    const vt = S.tracks[1];
    const vx = knobX(S, 1, m.values[1][0]);
    g.fillStyle = 'rgba(255,255,255,.3)';
    g.fillRect(vt.x0, vt.y - 2, vt.x1 - vt.x0, 4);
    g.fillStyle = m.muted ? 'rgba(255,255,255,.45)' : '#fff';
    g.fillRect(vt.x0, vt.y - 2, vx - vt.x0, 4);
    g.beginPath();
    g.arc(vx, vt.y, S.knob[1], 0, 2 * Math.PI);
    g.fill();
    if (S.focus === 1) {
      g.strokeStyle = accent;
      g.lineWidth = 2;
      g.beginPath();
      g.arc(vx, vt.y, S.knob[1] + 3, 0, 2 * Math.PI);
      g.stroke();
    }
    g.font = `500 13px ${FONT}`;
    g.fillStyle = '#eaeaea';
    g.textBaseline = 'middle';
    g.fillText(`${m.values[1][0]}%`, S.pctX, y0 + 1);
    // time and chapter
    g.fillStyle = '#f5f5f5';
    const timeText = `${SC().fmt(seek, sec)} / ${SC().fmt(seek, seek.max)}`;
    g.fillText(timeText, S.timeX, y0 + 1);
    const tW = g.measureText(timeText).width;
    g.fillStyle = '#bdbdbd';
    let chap = ` · ${chapterAt(S, sec).name}`;
    while (chap.length > 4 && S.timeX + tW + g.measureText(chap).width > S.timeMax) chap = chap.slice(0, -2) + '…';
    if (S.timeX + tW + g.measureText(chap).width <= S.timeMax) g.fillText(chap, S.timeX + tW, y0 + 1);
    // CC, gear, full screen
    if (B.captions) {
      const b = B.captions;
      g.lineWidth = 1.6;
      g.strokeStyle = '#f2f2f2';
      roundRect(g, b.x + 5, b.y + 7, b.w - 10, b.h - 14, 3);
      g.stroke();
      g.font = `700 10px ${FONT}`;
      g.fillStyle = '#f2f2f2';
      g.textAlign = 'center';
      g.fillText('CC', b.x + b.w / 2, b.y + b.h / 2 + 1);
      g.textAlign = 'left';
      if (m.captions) {
        g.fillStyle = accent;
        g.fillRect(b.x + 6, b.y + b.h - 4, b.w - 12, 3);
      }
    }
    if (B.gear) {
      const b = B.gear;
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      g.strokeStyle = '#f2f2f2';
      g.lineWidth = 2.6;
      g.beginPath();
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4;
        g.moveTo(cx + 5.5 * Math.cos(a), cy + 5.5 * Math.sin(a));
        g.lineTo(cx + 8.5 * Math.cos(a), cy + 8.5 * Math.sin(a));
      }
      g.stroke();
      g.lineWidth = 2;
      g.beginPath();
      g.arc(cx, cy, 5, 0, 2 * Math.PI);
      g.stroke();
    }
    if (B.full) {
      const b = B.full;
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      g.strokeStyle = '#f2f2f2';
      g.lineWidth = 2;
      g.beginPath();
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        g.moveTo(cx + sx * 8, cy + sy * 3);
        g.lineTo(cx + sx * 8, cy + sy * 7);
        g.lineTo(cx + sx * 4, cy + sy * 7);
      }
      g.stroke();
    }
    // Hover preview over the seek bar (also while dragging the seek knob).
    const pv = S.drag && S.drag.i === 0 ? kx : hoverX;
    if (pv !== null) {
      const ps = S.drag && S.drag.i === 0 ? sec : valueAtX(S, 0, pv);
      const pw = S.preview[0];
      const ph = S.preview[1];
      const px = Math.max(6, Math.min(W - pw - 6, pv - pw / 2));
      const py = t.y - ph - 40;
      g.fillStyle = '#000';
      g.fillRect(px - 2, py - 2, pw + 4, ph + 4);
      drawFrame(S, g, px, py, pw, ph, ps);
      g.textBaseline = 'middle';
      g.textAlign = 'center';
      g.font = `600 12px ${FONT}`;
      const label = chapterAt(S, ps).name;
      const lw = Math.max(g.measureText(label).width, 40) + 12;
      g.fillStyle = 'rgba(0,0,0,.8)';
      g.fillRect(pv - lw / 2, py + ph + 4, lw, 30);
      g.fillStyle = '#fff';
      g.fillText(label, pv, py + ph + 12);
      g.font = `500 12px ${FONT}`;
      g.fillText(SC().fmt(seek, ps), pv, py + ph + 26);
      g.textAlign = 'left';
    }
  }

  // ---- input

  function local(S, e) {
    const r = S.canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  // What lies under (x, y): { slider, onKnob } | { button } | null.
  function hitTest(S, x, y) {
    const m = S.ctx.model;
    for (const i of [0, 1]) {
      const t = S.tracks[i];
      const kx = knobX(S, i, m.values[i][0]);
      if (Math.hypot(x - kx, y - t.y) <= S.knob[i] + 4) return { slider: i, onKnob: true, kx };
    }
    for (const i of [0, 1]) {
      const t = S.tracks[i];
      if (x >= t.x0 - 4 && x <= t.x1 + 4 && Math.abs(y - t.y) <= t.hit) return { slider: i, onKnob: false };
    }
    for (const [name, b] of Object.entries(S.buttons)) if (inRect(b, x, y)) return { button: name };
    return null;
  }

  function setValue(S, i, v) {
    const m = S.ctx.model;
    const patch = i === 1 && S.spec.scenario === 'player' && m.muted ? { muted: false } : null;
    if (m.values[i][0] === v && !patch) return;
    const values = m.values.map((x) => x.slice());
    values[i] = [v];
    S.ctx.update({ ...m, values, ...patch });
  }

  function bind(S) {
    const { canvas, ctx, spec } = S;
    const sig = { signal: S.abort.signal };
    canvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      const [x, y] = local(S, e);
      const h = hitTest(S, x, y);
      S.press = h;
      if (!h || h.slider === undefined) return;
      e.preventDefault();
      if (spec.keys) {
        canvas.focus({ preventScroll: true });
        S.focus = h.slider;
        if (ctx.model.focus !== h.slider) ctx.update({ ...ctx.model, focus: h.slider });
      }
      const i = h.slider;
      if (!h.onKnob) {
        env.log('track-click', { what: spec.sliders[i].label, policy: spec.allowTrackClick ? 'jump' : 'forbidden' });
        if (!spec.allowTrackClick) ctx.flag('track-click');
      }
      S.drag = { i, off: h.onKnob ? x - h.kx : 0 };
      setValue(S, i, valueAtX(S, i, x - S.drag.off));
      draw();
    }, sig);
    window.addEventListener('mousemove', (e) => {
      const [x, y] = local(S, e);
      if (S.drag) {
        setValue(S, S.drag.i, valueAtX(S, S.drag.i, x - S.drag.off));
      } else {
        const h = hitTest(S, x, y);
        const t = S.tracks[0];
        const seekHover = x >= t.x0 && x <= t.x1 && Math.abs(y - t.y) <= t.hit + 4;
        S.hover = seekHover || (h && h.button) ? { seek: seekHover, x: Math.max(t.x0, Math.min(t.x1, x)), button: h && h.button } : null;
        canvas.style.cursor = h ? (h.onKnob ? 'grab' : 'pointer') : 'default';
      }
      draw();
    }, sig);
    window.addEventListener('mouseup', () => {
      if (!S.drag) return;
      S.drag = null;
      draw();
    }, sig);
    canvas.addEventListener('mouseleave', () => {
      if (S.drag) return;
      S.hover = null;
      draw();
    }, sig);
    canvas.addEventListener('click', (e) => {
      const [x, y] = local(S, e);
      const h = hitTest(S, x, y);
      const p = S.press;
      S.press = null;
      if (!h || !h.button || !p || p.button !== h.button) return;
      if (h.button === 'mute' && spec.scenario === 'player') ctx.update({ ...ctx.model, muted: !ctx.model.muted });
      else if (h.button === 'captions') ctx.update({ ...ctx.model, captions: !ctx.model.captions });
      draw();
    }, sig);
    canvas.addEventListener('keydown', (e) => {
      if (!KEYS.has(e.key)) return;
      e.preventDefault();
      if (!spec.keys || S.focus === null) return;
      const i = S.focus;
      const v = ctx.model.values[i][0];
      const nv = SC().keyApply(spec.sliders[i], v, e.key);
      if (nv !== v) setValue(S, i, nv);
      draw();
    }, sig);
    canvas.addEventListener('blur', () => {
      S.focus = null;
      if (ctx.model.focus !== null && ctx.model.focus !== undefined) ctx.update({ ...ctx.model, focus: null });
      draw();
    }, sig);
  }

  // ---- render

  function render(ctx) {
    ctx.css('svp-style', CSS);
    if (V) V.abort.abort();
    const { spec, rng, size } = ctx;
    const player = spec.scenario === 'player';
    const W = Math.max(player ? 560 : 480, Math.min(880, Math.floor(size.width) - 40, rng.int(560, 900)));
    const layout = rng.pick(['bar', 'overlay']);
    const VH = Math.max(layout === 'overlay' ? 220 : 170, Math.min(380, Math.floor(size.height) - (layout === 'overlay' ? 110 : 170), Math.round(W * rng.float(0.42, 0.56))));
    const H = layout === 'overlay' ? VH : VH + 64;
    const S = {
      ctx, spec, W, H, VH, layout, abort: new AbortController(), focus: null, drag: null, hover: null, press: null,
      dpr: Math.max(1, Math.min(3, window.devicePixelRatio || 1)),
      barColor: rng.pick(['#14161b', '#1d1f24', '#101114']),
      rail: rng.int(3, 5), knob: [rng.int(6, 8), rng.int(5, 7)], buffer: rng.float(0.3, 1),
      titleSize: rng.int(14, 17), capSize: rng.int(15, 18), caption: rng.pick(CAPTION_LINES),
    };
    // Scene.
    const kind = rng.pick(['hills', 'city', 'shapes', 'stripes']);
    S.scene = {
      kind, hue: rng.int(0, 359), drift: rng.int(20, 120), sat: rng.int(35, 60), light: rng.int(30, 46),
      freq: [rng.float(3, 7), rng.float(4, 9), rng.float(5, 11)], phase: [rng.float(0, 6), rng.float(0, 6), rng.float(0, 6)],
      blocks: Array.from({ length: rng.int(7, 12) }, () => ({ h: rng.float(0.25, 0.75), l: rng.int(0, 14) })),
      shapes: Array.from({ length: rng.int(4, 7) }, () => ({ a: rng.float(0, 6.28), v: rng.float(0.5, 3) * (rng.bool(0.5) ? 1 : -1), rx: rng.float(0.4, 1), ry: rng.float(0.4, 1), size: rng.float(0.05, 0.12), dh: rng.int(60, 300) })),
      stripes: rng.int(5, 10),
    };
    // Chapters: the first at 0, the others at sorted, well-separated times.
    const dur = spec.sliders[0].max;
    const nc = rng.int(3, 6);
    const starts = [0];
    for (const f of Array.from({ length: nc - 1 }, () => rng.float(0.08, 0.92)).sort((a, b) => a - b)) {
      if (f * dur - starts[starts.length - 1] >= dur * 0.07 && dur - f * dur >= dur * 0.07) starts.push(Math.round(f * dur));
    }
    const names = rng.sample(CHAPTERS.slice(1, -2), starts.length - 1);
    S.chapters = starts.map((at, k) => ({ at, name: k === 0 ? rng.pick(['Intro', 'Welcome', 'Opening']) : names[k - 1] }));
    // Layout of the controls.
    const pad = 16;
    S.seekY = layout === 'overlay' ? VH - 44 : VH + 14;
    S.rowY = layout === 'overlay' ? VH - 20 : VH + 42;
    S.tracks = [{ x0: pad, x1: W - pad, y: S.seekY, hit: 9 }];
    const bh = 30;
    const btn = (x, w = 32) => ({ x, y: S.rowY - bh / 2, w, h: bh });
    const B = { play: btn(pad - 6) };
    const volLeft = rng.bool(0.6);
    const VL = rng.int(70, 110);
    const volGroup = 28 + 8 + VL + 10 + 40;
    let right = W - pad + 6;
    if (player && W >= 640) {
      right -= 32;
      B.full = btn(right);
      right -= 34;
      B.gear = btn(right);
    }
    if (player) {
      right -= 36;
      B.captions = btn(right, 34);
    }
    let left = B.play.x + 36;
    let vx = volLeft ? left : right - volGroup - 6;
    if (volLeft) left += volGroup + 8;
    else right -= volGroup + 6;
    B.speaker = btn(vx, 28);
    S.tracks[1] = { x0: vx + 36 + 2, x1: vx + 36 + VL - 2, y: S.rowY, hit: 9 };
    S.pctX = vx + 36 + VL + 10;
    S.timeX = left + 4;
    S.timeMax = right - 8;
    if (player) B.mute = B.speaker;
    delete B.speaker;
    if (!player) B.speaker = btn(vx, 28); // media: a decoy icon
    S.buttons = B;
    S.preview = [Math.round(Math.min(200, W * 0.24)), Math.round(Math.min(200, W * 0.24) * 0.5625)];
    // Elements.
    const box = ctx.util.el('div', 'svp-box', ctx.stage);
    box.dataset.role = 'player';
    const canvas = ctx.util.el('canvas', '', box);
    canvas.width = Math.round(W * S.dpr);
    canvas.height = Math.round(H * S.dpr);
    Object.assign(canvas.style, { width: W + 'px', height: H + 'px' });
    canvas.setAttribute('role', 'application');
    canvas.setAttribute('aria-label', `Video player: ${spec.title}`);
    if (spec.keys) canvas.tabIndex = 0;
    S.canvas = canvas;
    S.g = canvas.getContext('2d');
    S.accent = getComputedStyle(ctx.stage).getPropertyValue('--accent').trim() || '#e53935';
    // Keep the selected-part colour readable on the dark bar.
    V = S;
    // draw() reads the speaker button for both scenarios.
    S.buttons.speaker = S.buttons.speaker || S.buttons.mute;
    draw();
    placeIn(ctx, box, rng);
    bind(S);
    return {
      anchors: [canvas],
      sync() { if (V === S) draw(); },
    };
  }

  function locate(t) {
    const S = V;
    if (!S) throw new Error('slider/video: not rendered');
    const r = S.canvas.getBoundingClientRect();
    if (t.toggle) {
      const b = S.buttons[t.toggle === 'mute' ? 'mute' : 'captions'];
      if (!b) throw new Error(`slider/video cannot locate ${JSON.stringify(t)}`);
      return [r.left + b.x + b.w / 2, r.top + b.y + b.h / 2];
    }
    const i = t.slider;
    if (!S.tracks[i]) throw new Error(`slider/video cannot locate ${JSON.stringify(t)}`);
    const v = t.value !== undefined ? t.value : S.ctx.model.values[i][0];
    return [r.left + knobX(S, i, v), r.top + S.tracks[i].y];
  }

  const def = env.widgetOf('set-slider', 'video');
  if (def) Object.assign(def, { render, locate });
})();
