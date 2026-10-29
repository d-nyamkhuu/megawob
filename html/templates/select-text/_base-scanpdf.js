// select-text/base: scanned-PDF layout, raster painting and selection. S preserves the reference unit hooks.
(function () {
  'use strict';

  function layoutPage(ctx, S) {
    const { spec, util, rng, size } = ctx;
    ctx.css('sp-style', S.SP_CSS);
    const doc = spec.doc;
    // The viewer's frame: the stage minus a floating end control that overlaps it, the app box with its toolbar, the canvas.
    function buildFrame() {
      let W = size.width;
      let H = size.height;
      const st = ctx.stage.getBoundingClientRect();
      const sub = S.env.submitEl && S.env.submitEl.getBoundingClientRect();
      if (sub && sub.width && sub.left < st.right && sub.right > st.left && sub.top < st.bottom && sub.bottom > st.top) {
        const cutH = st.bottom - sub.top + 10;
        const cutW = st.right - sub.left + 10;
        if (cutH * W <= cutW * H) H -= cutH;
        else W -= cutW;
      }
      const appW = Math.round(Math.min(W - 2 * rng.int(6, 18), 1180));
      const appH = Math.round(H - 14);
      const app = util.el('div', 'sp-app', ctx.stage);
      app.style.width = appW + 'px';
      app.style.height = appH + 'px';
      const bar = util.el('div', 'sp-bar', app);
      util.el('span', 'sp-file', bar, `${rng.pick(['scan', 'IMG', 'document', 'fax', 'SCN'])}_${rng.int(1000, 9999)}.pdf`);
      util.el('span', 'sp-chip', bar, 'Page 1 / 1');
      util.el('span', 'sp-chip', bar, `${rng.pick([90, 100, 110, 125])}%`);
      util.el('span', 'sp-grow', bar);
      if (appW > 760) util.el('span', 'sp-note', bar, rng.pick(['Scanned image', 'Image-only PDF', 'Scanned at 300 dpi']));
      for (const g of rng.sample(['⤓', '⟳', '⋯', '+', '−'], 3)) util.el('span', 'sp-btn', bar, g);
      const area = util.el('div', 'sp-area', app);
      const cv = util.el('canvas', 'sp-canvas', area);
      cv.setAttribute('aria-hidden', 'true');
      cv.dataset.role = 'page';
      return { appW, appH, app, cv };
    }
    const { appW, appH, app, cv } = buildFrame();

    const availW = appW - 2 - 28;
    const availH = appH - 2 - 40 - 6 - 14;
    const font = rng.pick(S.SP_FONTS);
    const mono = /Mono/.test(font);
    const meas = document.createElement('canvas').getContext('2d');
    const fs0 = rng.pick([15, 16, 17]);
    const lhK = rng.pick([1.38, 1.45, 1.52]);
    const gapK = rng.pick([0.55, 0.75, 0.9]);
    const indent = rng.bool(0.35);

    // Greedy wrap of every paragraph (and its hard line breaks) at font size fs into width textW.
    function layout(fs, textW, m) {
      meas.font = `${fs}px ${font}`;
      const lh = Math.round(fs * lhK);
      const lines = [];
      let y = m.t;
      let base = 0;
      spec.paragraphs.forEach((p, pi) => {
        if (pi) y += Math.round(lh * gapK);
        let off = base;
        p.split('\n').forEach((hard, hi) => {
          const words = [...hard.matchAll(/\S+/g)].map((w) => ({ s: off + w.index, e: off + w.index + w[0].length }));
          const ind = indent && pi > 0 && hi === 0 ? Math.round(fs * 1.6) : 0;
          let cur = null;
          const push = () => { lines.push({ start: cur.s, end: cur.e, x: m.l + cur.ind, top: y, bottom: y + lh, lh }); y += lh; };
          for (const w of words) {
            if (!cur) { cur = { s: w.s, e: w.e, ind }; continue; }
            if (meas.measureText(doc.slice(cur.s, w.e)).width + cur.ind <= textW) cur.e = w.e;
            else { push(); cur = { s: w.s, e: w.e, ind: 0 }; }
          }
          if (cur) push();
          else { lines.push({ start: off, end: off, x: m.l, top: y, bottom: y + lh, lh }); y += lh; }
          off += hard.length + 1;
        });
        base += p.length + 2;
      });
      return { lines, h: y + m.b, lh };
    }
    let fs = fs0;
    let pageW;
    let L;
    let mg;
    for (;;) {
      mg = { l: Math.round(fs * 2.6), r: Math.round(fs * 2.4), t: Math.round(fs * 4), b: Math.round(fs * 3) };
      pageW = Math.min(availW, Math.round(fs * (mono ? 46 : 52)));
      L = layout(fs, pageW - mg.l - mg.r, mg);
      if (L.h <= availH || fs <= 10) break;
      fs -= 0.5;
    }
    if (L.h > availH) {
      pageW = availW;
      L = layout(fs, pageW - mg.l - mg.r, mg);
    }
    const pageH = Math.round(Math.max(L.h, Math.min(availH, pageW * 1.25)));
    const lines = L.lines;
    return { ctx, spec, util, rng, doc, app, cv, font, meas, fs, pageW, mg, pageH, lines };
  }

  function measurePage(page) {
    const { doc, meas, fs, font, lines, rng, cv, pageW, pageH } = page;
    // Glyph boxes (page px): x0[i], x1[i] for every character on a line; per-line scan jitter.
    function measureGlyphs() {
      const x0 = new Float32Array(doc.length);
      const x1 = new Float32Array(doc.length);
      const lineOf = new Int32Array(doc.length).fill(-1);
      meas.font = `${fs}px ${font}`;
      lines.forEach((ln, k) => {
        ln.dx = rng.float(-0.7, 0.7);
        ln.dy = rng.float(-0.5, 0.5);
        ln.base = ln.top + ln.lh * 0.74 + ln.dy;
        for (let i = ln.start; i < ln.end; i++) {
          x0[i] = ln.x + ln.dx + meas.measureText(doc.slice(ln.start, i)).width;
          x1[i] = ln.x + ln.dx + meas.measureText(doc.slice(ln.start, i + 1)).width;
          lineOf[i] = k;
        }
      });
      return { x0, x1, lineOf };
    }
    const { x0, x1, lineOf } = measureGlyphs();

    // Canvas = page + a margin for its shadow; the page turns by theta around its centre.
    const M = 12;
    const cw = pageW + 2 * M;
    const ch = pageH + 2 * M;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(cw * dpr);
    cv.height = Math.round(ch * dpr);
    cv.style.width = cw + 'px';
    cv.style.height = ch + 'px';
    const theta = rng.float(-0.006, 0.006);
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const pcx = pageW / 2;
    const pcy = pageH / 2;
    const toCanvas = (px, py) => [M + pcx + (px - pcx) * cos - (py - pcy) * sin, M + pcy + (px - pcx) * sin + (py - pcy) * cos];
    const toPage = (cx, cy) => {
      const dx = cx - M - pcx;
      const dy = cy - M - pcy;
      return [pcx + dx * cos + dy * sin, pcy - dx * sin + dy * cos];
    };
    const dark = (document.querySelector('[data-theme]') || { dataset: {} }).dataset.theme === 'dark';

    return { ...page, x0, x1, lineOf, M, dpr, theta, pcx, pcy, toCanvas, toPage, dark };
  }

  // The scanned page is painted once before the live selection overlay is bound.
  function paintScan(page, S) {
    const { cv, dpr, M, pcx, pcy, theta, rng, dark, pageW, pageH, fs, font, mg, doc, lines, x0 } = page;
    const scan = document.createElement('canvas');
    scan.width = cv.width;
    scan.height = cv.height;
    const g = scan.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.translate(M + pcx, M + pcy);
    g.rotate(theta);
    g.translate(-pcx, -pcy);
    g.save();
    g.shadowColor = 'rgba(0,0,0,.28)';
    g.shadowBlur = 8;
    g.shadowOffsetY = 2;
    const tone = rng.pick(dark ? ['#d8d3c6', '#d2cfc6', '#dcd8cc'] : ['#f6f3ea', '#f2efe6', '#f8f6f0', '#efece2']);
    g.fillStyle = tone;
    g.fillRect(0, 0, pageW, pageH);
    g.restore();
    // uneven exposure: a soft darker band along one edge
    const grad = g.createLinearGradient(0, 0, pageW, 0);
    const edgeL = rng.bool(0.5);
    grad.addColorStop(0, `rgba(80,70,50,${edgeL ? 0.1 : 0})`);
    grad.addColorStop(0.18, 'rgba(80,70,50,0)');
    grad.addColorStop(0.82, 'rgba(80,70,50,0)');
    grad.addColorStop(1, `rgba(80,70,50,${edgeL ? 0 : 0.1})`);
    g.fillStyle = grad;
    g.fillRect(0, 0, pageW, pageH);
    // scanner streak
    g.fillStyle = 'rgba(60,60,60,.06)';
    g.fillRect(rng.int(20, pageW - 20), 0, rng.float(0.8, 2), pageH);
    // speckles
    const nSpeck = Math.round((pageW * pageH) / 1100);
    for (let k = 0; k < nSpeck; k++) {
      g.fillStyle = `rgba(40,38,34,${rng.float(0.04, 0.3).toFixed(3)})`;
      g.beginPath();
      g.arc(rng.float(0, pageW), rng.float(0, pageH), rng.float(0.25, 1.0), 0, Math.PI * 2);
      g.fill();
    }
    for (let k = 0; k < rng.int(1, 4); k++) {
      g.fillStyle = 'rgba(40,38,34,.35)';
      g.beginPath();
      g.ellipse(rng.float(10, pageW - 10), rng.float(10, pageH - 10), rng.float(1, 2.2), rng.float(0.6, 1.6), rng.float(0, 3), 0, Math.PI * 2);
      g.fill();
    }
    // running header (outside the text): a ruled date line and a rubber stamp in the top margin
    const small = Math.max(9, Math.round(fs * 0.72));
    g.font = `${small}px ${font}`;
    g.fillStyle = 'rgba(40,38,34,.55)';
    g.textBaseline = 'alphabetic';
    const hdr = `${rng.pick(['Ref.', 'File', 'Doc.'])} ${rng.int(100, 999)}-${rng.int(10, 99)}   ${rng.pick(['Mar', 'Jun', 'Sep', 'Nov'])} ${rng.int(1, 28)}`;
    g.fillText(hdr, mg.l, Math.round(mg.t * 0.42));
    g.fillRect(mg.l, Math.round(mg.t * 0.42) + 5, pageW - mg.l - mg.r, 0.8);
    g.save();
    const stampW = small * 7.5;
    g.translate(pageW - mg.r - stampW / 2 - rng.int(0, 30), Math.round(mg.t * 0.36));
    g.rotate(rng.float(-0.18, 0.12));
    g.strokeStyle = g.fillStyle = rng.pick(['rgba(176,40,40,.5)', 'rgba(40,70,160,.45)', 'rgba(60,110,60,.45)']);
    g.lineWidth = 1.6;
    g.strokeRect(-stampW / 2, -small * 0.95, stampW, small * 1.6);
    g.font = `bold ${small}px "DejaVu Sans", Arial, sans-serif`;
    g.textAlign = 'center';
    g.fillText(rng.pick(S.SP_STAMPS), 0, small * 0.38);
    g.restore();
    g.textAlign = 'left';
    g.font = `${small}px ${font}`;
    g.fillStyle = 'rgba(40,38,34,.5)';
    g.fillText(`— ${rng.int(1, 9)} —`, pageW / 2 - small, pageH - Math.round(mg.b * 0.45));
    // the text, as ink: slightly blurred, word by word with uneven density
    g.font = `${fs}px ${font}`;
    g.filter = `blur(${rng.pick([0.3, 0.4, 0.5])}px)`;
    const ink = rng.pick(['30,28,26', '24,24,30', '38,34,30']);
    for (const ln of lines) {
      for (const w of doc.slice(ln.start, ln.end).matchAll(/\S+/g)) {
        const i = ln.start + w.index;
        g.fillStyle = `rgba(${ink},${rng.float(0.74, 0.95).toFixed(2)})`;
        g.fillText(w[0], x0[i], ln.base);
      }
    }
    g.filter = 'none';
    return scan;
  }

  // Hit testing and window listeners. Selection accessors share the overlay's live anchor and focus.
  function bindInput(page, selection, S) {
    const { lines, x0, x1, doc, cv, toPage, ctx, util, spec } = page;
    const { paragraphAt } = S;
    // Hit testing (page px).
    const lineAtY = (y) => {
      let best = 0;
      let bd = Infinity;
      lines.forEach((ln, k) => {
        const d = y < ln.top ? ln.top - y : y >= ln.bottom ? y - ln.bottom + 1 : 0;
        if (d < bd) { bd = d; best = k; }
      });
      return lines[best];
    };
    const caretAt = (px, py) => {
      const ln = lineAtY(py);
      for (let i = ln.start; i < ln.end; i++) if (px < (x0[i] + x1[i]) / 2) return i;
      return ln.end;
    };
    const charAt = (px, py) => {
      const ln = lineAtY(py);
      if (ln.end <= ln.start) return ln.start;
      for (let i = ln.start; i < ln.end; i++) if (px < x1[i]) return i;
      return ln.end - 1;
    };
    const ALNUM = /[A-Za-z0-9]/;
    const wordAt = (i) => {
      if (!ALNUM.test(doc[i] || '')) return [i, Math.min(doc.length, i + 1)];
      let s = i;
      let e = i + 1;
      while (s > 0 && ALNUM.test(doc[s - 1])) s--;
      while (e < doc.length && ALNUM.test(doc[e])) e++;
      return [s, e];
    };
    const pageXY = (e) => {
      const r = cv.getBoundingClientRect();
      return toPage(e.clientX - r.left, e.clientY - r.top);
    };
    const commit = () => {
      selection.draw();
      const start = Math.min(selection.anchor, selection.focus);
      const end = Math.max(selection.anchor, selection.focus);
      if (start !== ctx.model.start || end !== ctx.model.end) ctx.update({ ...ctx.model, start, end });
    };
    let dragging = false;
    cv.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const [px, py] = pageXY(e);
      const n = util.clickCount(e);
      if (n >= 3) {
        const r = paragraphAt(spec, charAt(px, py));
        [selection.anchor, selection.focus] = [r.start, r.end];
        dragging = false;
      } else if (n === 2) {
        [selection.anchor, selection.focus] = wordAt(charAt(px, py));
        dragging = false;
      } else if (e.shiftKey) {
        selection.focus = caretAt(px, py);
        dragging = true;
      } else {
        selection.anchor = selection.focus = caretAt(px, py);
        dragging = true;
      }
      commit();
    });
    const onMove = (e) => {
      if (!dragging || !cv.isConnected) return;
      if (!(e.buttons & 1)) { dragging = false; return; }
      const [px, py] = pageXY(e);
      const f = caretAt(px, py);
      if (f !== selection.focus) { selection.focus = f; commit(); }
    };
    const onUp = () => { dragging = false; };
    const onKey = (e) => {
      if (!cv.isConnected || !e.shiftKey || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      e.preventDefault();
      if (e.key === 'ArrowLeft') selection.focus = Math.max(0, selection.focus - 1);
      else if (e.ctrlKey) {
        let f = Math.min(doc.length, selection.focus + 1);
        while (f < doc.length && !ALNUM.test(doc[f])) f++;
        while (f < doc.length && ALNUM.test(doc[f])) f++;
        selection.focus = f;
      } else selection.focus = Math.min(doc.length, selection.focus + 1);
      commit();
    };
    if (S.spView && S.spView.off) S.spView.off();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('keydown', onKey);
    };
  }

  function selectionView(page, scan, S) {
    const { ctx, cv, dpr, M, pcx, pcy, theta, lines, x0, x1, fs, doc, lineOf, toCanvas, app } = page;
    const out = cv.getContext('2d');
    let anchor = ctx.model.start;
    let focus = ctx.model.end;
    function draw() {
      out.setTransform(1, 0, 0, 1, 0, 0);
      out.clearRect(0, 0, cv.width, cv.height);
      out.drawImage(scan, 0, 0);
      const a = Math.min(anchor, focus);
      const b = Math.max(anchor, focus);
      if (b <= a) return;
      out.setTransform(dpr, 0, 0, dpr, 0, 0);
      out.translate(M + pcx, M + pcy);
      out.rotate(theta);
      out.translate(-pcx, -pcy);
      out.globalCompositeOperation = 'multiply';
      out.fillStyle = 'rgba(90,150,255,.42)';
      for (const ln of lines) {
        const s = Math.max(a, ln.start);
        const e = Math.min(b, ln.end);
        if (e <= s) continue;
        // a selection that runs on past the line end covers the trailing space too
        const right = b > ln.end && e === ln.end ? x1[e - 1] + fs * 0.25 : x1[e - 1];
        out.fillRect(x0[s], ln.top + ln.dy, right - x0[s], ln.lh);
      }
      out.globalCompositeOperation = 'source-over';
    }
    draw();

    S.spView = {
      off: bindInput(page, {
        get anchor() { return anchor; }, set anchor(v) { anchor = v; },
        get focus() { return focus; }, set focus(v) { focus = v; },
        draw,
      }, S),
      locate(t) {
        if (t.char === undefined) return null;
        let i = Math.max(0, Math.min(doc.length - 1, t.char));
        if (lineOf[i] < 0) {
          // whitespace past a line end: the nearest drawn glyph
          let k = i;
          while (k > 0 && lineOf[k] < 0) k--;
          i = k;
        }
        const ln = lines[lineOf[i]];
        const w = x1[i] - x0[i];
        const inset = Math.min(1.5, w * 0.3);
        // 'after': right of the glyph's middle (caretAt puts the caret after it there) by at least a pixel, since
        // mouse events report whole-pixel coordinates and a narrow glyph (an 'l' or 't' at a small size) would
        // otherwise round back into its left half.
        const px = t.edge === 'after' ? Math.max(x1[i] - inset, (x0[i] + x1[i]) / 2 + 1.1) : x0[i] + inset;
        const py = ln.base - fs * 0.33;
        const [cx, cy] = toCanvas(px, py);
        const r = cv.getBoundingClientRect();
        return [r.left + cx, r.top + cy];
      },
    };
    return {
      anchors: [app],
      sync(m) {
        anchor = m.start;
        focus = m.end;
        draw();
      },
    };
  }

  function renderScanpdf(ctx, S) {
    const page = measurePage(layoutPage(ctx, S));
    const scan = paintScan(page, S);
    return selectionView(page, scan, S);
  }

  env.template('select-text/_base-scanpdf', () => ({ renderScanpdf }));
})();
