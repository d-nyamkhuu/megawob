// crop-image/_base-scene: reference canvas and SVG scene drawing.
// paintScene receives the reference unit's paintFace so design overrides still apply.
(function () {
  'use strict';

  function paintScene(g, spec, fam, rng, W, H, paintFace) {
        const bg = spec.bg;
        const grad = g.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, `hsl(${bg.hue} 30% 88%)`);
        grad.addColorStop(1, `hsl(${bg.hue2} 30% 70%)`);
        g.fillStyle = grad;
        g.fillRect(0, 0, W, H);
        const r = rng.fork('bg');
        if (bg.style === 'landscape') {
          const sky = g.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, `hsl(${bg.hue} 45% 78%)`);
          sky.addColorStop(1, `hsl(${bg.hue} 35% 92%)`);
          g.fillStyle = sky;
          g.fillRect(0, 0, W, H);
          g.fillStyle = 'rgba(255, 240, 200, .8)';
          g.beginPath();
          g.arc(r.float(0.1, 0.9) * W, r.float(0.1, 0.3) * H, H * 0.07, 0, 2 * Math.PI);
          g.fill();
          for (const [k, light] of [[0, 62], [1, 48]]) {
            g.fillStyle = `hsl(${(bg.hue2 + 60 * k) % 360} 25% ${light}%)`;
            g.beginPath();
            g.moveTo(0, H);
            const base = H * (0.55 + 0.15 * k);
            for (let x = 0; x <= W; x += W / 8) g.lineTo(x, base - r.float(0, H * 0.18));
            g.lineTo(W, H);
            g.closePath();
            g.fill();
          }
        } else if (bg.style === 'blobs') {
          for (let i = 0, n = r.int(5, 8); i < n; i++) {
            const cx = r.float(0, W);
            const cy = r.float(0, H);
            const rad = r.float(0.15, 0.4) * H;
            const rg = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
            rg.addColorStop(0, `hsla(${r.int(0, 359)} 55% 70% / .55)`);
            rg.addColorStop(1, 'hsla(0 0% 100% / 0)');
            g.fillStyle = rg;
            g.fillRect(0, 0, W, H);
          }
        } else if (bg.style === 'noise') {
          const img = g.getImageData(0, 0, W, H);
          const d = img.data;
          const n = r.fork('px');
          for (let i = 0; i < d.length; i += 4) {
            const v = (n.next() - 0.5) * 46;
            d[i] += v;
            d[i + 1] += v;
            d[i + 2] += v;
          }
          g.putImageData(img, 0, 0);
        } else if (bg.style === 'text') {
          g.save();
          g.fillStyle = 'rgba(255, 255, 255, .35)';
          g.font = `700 ${Math.round(H * 0.11)}px system-ui, sans-serif`;
          g.textAlign = 'center';
          g.translate(W / 2, H / 2);
          g.rotate(-0.35);
          g.fillText(bg.text, 0, 0);
          g.restore();
          g.fillStyle = 'rgba(0, 0, 0, .35)';
          g.fillRect(0, H - 26, W, 26);
          g.fillStyle = 'rgba(255, 255, 255, .9)';
          g.font = '13px system-ui, sans-serif';
          g.textAlign = 'left';
          g.fillText(`${bg.text} · ${W}×${H}`, 10, H - 9);
        }
        for (const o of spec.objects) {
          const { x, y, w, h } = o.sq;
          if (o.kind === 'label') {
            const px = [x * W, y * H, w * W, h * H];
            g.fillStyle = o.hex;
            g.beginPath();
            g.roundRect(px[0], px[1], px[2], px[3], Math.min(8, px[3] / 4));
            g.fill();
            g.fillStyle = '#fff';
            g.font = `650 ${Math.round(px[3] * 0.42)}px system-ui, -apple-system, "Segoe UI", sans-serif`;
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillText(o.text, px[0] + px[2] / 2, px[1] + px[3] / 2 + 1, px[2] * 0.88);
            continue;
          }
          g.fillStyle = o.hex;
          g.beginPath();
          const pts = fam.shapePoints(o);
          if (pts) {
            pts.forEach(([px, py], k) => (k ? g.lineTo(px * W, py * H) : g.moveTo(px * W, py * H)));
            g.closePath();
          } else {
            g.ellipse((x + w / 2) * W, (y + h / 2) * H, (w / 2) * W, (h / 2) * H, 0, 0, 2 * Math.PI);
          }
          g.fill();
          if (o.kind === 'face') paintFace(g, fam, o, W, H);
        }
      }

  function paintFace(g, fam, o, W, H) {
        const { x, y, w, h } = o.sq;
        const X = (u) => (x + u * w) * W;
        const Y = (v) => (y + v * h) * H;
        g.strokeStyle = fam.FACE_INK;
        g.fillStyle = fam.FACE_INK;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        g.lineWidth = Math.max(2, 0.05 * w * W);
        g.beginPath();
        g.ellipse((x + w / 2) * W, (y + h / 2) * H, (w / 2) * W, (h / 2) * H, 0, 0, 2 * Math.PI);
        g.lineWidth = Math.max(1.5, 0.03 * w * W);
        g.strokeStyle = 'rgba(59,47,26,.55)';
        g.stroke();
        g.strokeStyle = fam.FACE_INK;
        for (const f of fam.facePrims(o.expr)) {
          g.beginPath();
          if (f.t === 'dot') {
            g.ellipse(X(f.x), Y(f.y), f.r * w * W, f.r * h * H, 0, 0, 2 * Math.PI);
            g.fill();
          } else if (f.t === 'rect') {
            g.roundRect(X(f.x), Y(f.y), f.w * w * W, f.h * h * H, 3);
            g.fill();
          } else {
            f.pts.forEach(([u, v], k) => (k ? g.lineTo(X(u), Y(v)) : g.moveTo(X(u), Y(v))));
            g.lineWidth = Math.max(2, f.w * w * W);
            g.stroke();
          }
        }
      }

  function drawSvgScene(svg, spec, fam, W, H, util, rng) {
        const bg = spec.bg;
        const uid = `cc${bg.seed}`;
        const defs = util.svg('defs', {}, svg);
        const g = util.svg('linearGradient', { id: `${uid}-bg`, x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
        util.svg('stop', { offset: 0, 'stop-color': `hsl(${bg.hue} 30% 80%)` }, g);
        util.svg('stop', { offset: 1, 'stop-color': `hsl(${bg.hue2} 30% 62%)` }, g);
        util.svg('rect', { width: W, height: H, fill: `url(#${uid}-bg)` }, svg);
        const r = rng.fork('bg');
        if (bg.style === 'landscape') {
          util.svg('circle', { cx: r.float(0.1, 0.9) * W, cy: r.float(0.1, 0.3) * H, r: H * 0.07, fill: 'rgba(255,240,200,.8)' }, svg);
          for (const [k, light] of [[0, 58], [1, 44]]) {
            const base = H * (0.55 + 0.15 * k);
            const pts = [`0,${H}`];
            for (let x = 0; x <= W + 1; x += W / 8) pts.push(`${x},${base - r.float(0, H * 0.18)}`);
            pts.push(`${W},${H}`);
            util.svg('polygon', { points: pts.join(' '), fill: `hsl(${(bg.hue2 + 60 * k) % 360} 22% ${light}%)` }, svg);
          }
        } else if (bg.style === 'blobs') {
          for (let i = 0, n = r.int(5, 8); i < n; i++) {
            const id = `${uid}-b${i}`;
            const rg = util.svg('radialGradient', { id }, defs);
            util.svg('stop', { offset: 0, 'stop-color': `hsl(${r.int(0, 359)} 55% 70%)`, 'stop-opacity': 0.55 }, rg);
            util.svg('stop', { offset: 1, 'stop-color': '#fff', 'stop-opacity': 0 }, rg);
            util.svg('circle', { cx: r.float(0, W), cy: r.float(0, H), r: r.float(0.15, 0.4) * H, fill: `url(#${id})` }, svg);
          }
        } else if (bg.style === 'noise') {
          const f = util.svg('filter', { id: `${uid}-n`, x: 0, y: 0, width: '100%', height: '100%' }, defs);
          util.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.9, numOctaves: 2, seed: bg.seed % 1000 }, f);
          util.svg('feColorMatrix', { type: 'saturate', values: 0 }, f);
          const ct = util.svg('feComponentTransfer', {}, f);
          util.svg('feFuncA', { type: 'table', tableValues: '0 0.35' }, ct);
          util.svg('rect', { width: W, height: H, filter: `url(#${uid}-n)` }, svg);
        } else if (bg.style === 'text') {
          const t = util.svg('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', transform: `rotate(-20 ${W / 2} ${H / 2})`,
            fill: 'rgba(255,255,255,.35)', 'font-size': Math.round(H * 0.11), 'font-weight': 700, 'font-family': 'system-ui, sans-serif' }, svg);
          t.textContent = bg.text;
          util.svg('rect', { x: 0, y: H - 26, width: W, height: 26, fill: 'rgba(0,0,0,.35)' }, svg);
          const c = util.svg('text', { x: 10, y: H - 9, fill: 'rgba(255,255,255,.9)', 'font-size': 13, 'font-family': 'system-ui, sans-serif' }, svg);
          c.textContent = `${bg.text} · ${W}×${H}`;
        }
        for (const o of spec.objects) {
          const { x, y, w, h } = o.sq;
          if (o.kind === 'label') {
            util.svg('rect', { x: x * W, y: y * H, width: w * W, height: h * H, rx: Math.min(8, (h * H) / 4), fill: o.hex }, svg);
            const fs = Math.round(h * H * 0.42);
            const t = util.svg('text', { x: (x + w / 2) * W, y: (y + h / 2) * H + 1, 'text-anchor': 'middle', 'dominant-baseline': 'central',
              fill: '#fff', 'font-size': fs, 'font-weight': 650, 'font-family': 'system-ui, -apple-system, "Segoe UI", sans-serif' }, svg);
            t.textContent = o.text;
            if (o.text.length * fs * 0.56 > w * W * 0.88) {
              t.setAttribute('textLength', (w * W * 0.86).toFixed(1));
              t.setAttribute('lengthAdjust', 'spacingAndGlyphs');
            }
            continue;
          }
          const pts = fam.shapePoints(o);
          if (pts) {
            util.svg('polygon', { points: pts.map(([px, py]) => `${px * W},${py * H}`).join(' '), fill: o.hex }, svg);
          } else {
            util.svg('ellipse', { cx: (x + w / 2) * W, cy: (y + h / 2) * H, rx: (w / 2) * W, ry: (h / 2) * H, fill: o.hex,
              ...(o.kind === 'face' ? { stroke: 'rgba(59,47,26,.55)', 'stroke-width': Math.max(1.5, 0.03 * w * W) } : {}) }, svg);
          }
          if (o.kind === 'face') {
            const X = (u) => ((x + u * w) * W).toFixed(1);
            const Y = (v) => ((y + v * h) * H).toFixed(1);
            for (const f of fam.facePrims(o.expr)) {
              if (f.t === 'dot') util.svg('ellipse', { cx: X(f.x), cy: Y(f.y), rx: f.r * w * W, ry: f.r * h * H, fill: fam.FACE_INK }, svg);
              else if (f.t === 'rect') util.svg('rect', { x: X(f.x), y: Y(f.y), width: f.w * w * W, height: f.h * h * H, rx: 3, fill: fam.FACE_INK }, svg);
              else util.svg('polyline', { points: f.pts.map(([u, v]) => `${X(u)},${Y(v)}`).join(' '), fill: 'none', stroke: fam.FACE_INK,
                'stroke-width': Math.max(2, f.w * w * W), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
            }
          }
        }
      }

  env.template('crop-image/_base-scene', () => ({ paintScene, paintFace, drawSvgScene }));
})();
