// Design on templates/crop-image/base.js: the base site's crop-image widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-content-03',
  name: 'design',
  split: 'train',
  scenarios: ['content'],
  template: 'crop-image/base',
  design: {
    parts: {
      '+0.CONTENT_BG': (base, S) => {
        const { scriptOf } = S;
        return new URL('../assets/storefront.webp', scriptOf.src).href;
      },
      '+0.storefrontPhoto': (base, S) => null,
      '+0.storefrontLoad': (base, S) => null,
      'paintScene': (base, S) => function paintScene(g, spec, fam, rng, W, H) {
        const { paintFace } = S;
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
        if (spec.scenario === 'content') {
          if (S.storefrontPhoto) {
            g.drawImage(S.storefrontPhoto, 0, 0, W, H);
          } else {
          const glass = g.createLinearGradient(0, 0, W, H);
          glass.addColorStop(0, '#172329'); glass.addColorStop(.48, '#413c30'); glass.addColorStop(1, '#151a18');
          g.fillStyle = glass; g.fillRect(0, 0, W, H);
          g.fillStyle = 'rgba(218,230,222,.18)'; g.fillRect(W * .06, 0, W * .07, H);
          g.fillStyle = 'rgba(5,11,14,.6)'; g.fillRect(W * .16, 0, W * .025, H);
          for (let i = 0; i < 7; i++) {
            const x = W * (((i * 73 + 29) % 97) / 97), y = H * (.14 + (i % 4) * .2);
            const glow = g.createRadialGradient(x, y, 1, x, y, W * .12);
            glow.addColorStop(0, 'rgba(255,184,89,.4)'); glow.addColorStop(1, 'rgba(255,184,89,0)');
            g.fillStyle = glow; g.fillRect(x - W * .13, y - W * .13, W * .26, W * .26);
          }
          for (let i = 0; i < 36; i++) {
            const x = W * ((i % 9) * .052 - .08), y = H * (.84 + Math.floor(i / 9) * .055 + (i % 3) * .018);
            g.save(); g.translate(x, y); g.rotate((i % 5 - 2) * .32);
            g.fillStyle = ['#263a25', '#34462a', '#40552e', '#1f3428'][i % 4];
            g.beginPath(); g.ellipse(0, 0, W * (.035 + (i % 3) * .006), H * .012, 0, 0, 2 * Math.PI); g.fill(); g.restore();
          }
          }
        }
        for (const o of spec.objects) {
          const { x, y, w, h } = o.sq;
          if (o.kind === 'label') {
            const px = [x * W, y * H, w * W, h * H];
            if (spec.scenario === 'content') {
              const dark = o.text.toLowerCase().includes('lunch');
              const trim = Math.max(3, W * .018);
              g.strokeStyle = 'rgba(8,12,14,.7)'; g.lineWidth = Math.max(2, W * .009);
              g.beginPath(); g.moveTo(px[0] + px[2] * .22, px[1] - trim); g.lineTo(px[0] + px[2] * .5, px[1] - px[2] * .3); g.lineTo(px[0] + px[2] * .78, px[1] - trim); g.stroke();
              g.fillStyle = dark ? '#a66d3b' : '#917c61';
              g.fillRect(px[0] - trim, px[1] - trim, px[2] + 2 * trim, px[3] + 2 * trim);
              g.fillStyle = dark ? '#242a2b' : '#ddd6c8';
              g.fillRect(px[0], px[1], px[2], px[3]);
              g.strokeStyle = dark ? '#d1955b' : '#a28d6d'; g.lineWidth = Math.max(1.5, W * .006);
              g.strokeRect(px[0] + 2, px[1] + 2, px[2] - 4, px[3] - 4);
              g.fillStyle = dark ? '#f1eee6' : '#25292a';
            } else {
            g.fillStyle = o.hex;
            g.beginPath();
            g.roundRect(px[0], px[1], px[2], px[3], Math.min(8, px[3] / 4));
            g.fill();
            g.fillStyle = '#fff';
            }
            g.font = spec.scenario === 'content'
              ? `600 ${Math.round(px[3] * 0.42)}px system-ui, -apple-system, "Segoe UI", sans-serif`
              : `650 ${Math.round(px[3] * 0.42)}px system-ui, -apple-system, "Segoe UI", sans-serif`;
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillText(o.text, px[0] + px[2] / 2, px[1] + px[3] / 2 + 1, px[2] * 0.88);
            continue;
          }
          g.fillStyle = spec.scenario === 'content' ? (o.kind === 'face' ? '#f4b51e' : '#776b56') : o.hex;
          g.beginPath();
          const pts = fam.shapePoints(o);
          if (pts) {
            pts.forEach(([px, py], k) => (k ? g.lineTo(px * W, py * H) : g.moveTo(px * W, py * H)));
            g.closePath();
          } else if (spec.scenario === 'content' && o.kind === 'face') {
            const d = Math.min(w * W, h * H);
            g.ellipse((x + w / 2) * W, (y + h / 2) * H, d / 2, d / 2, 0, 0, 2 * Math.PI);
          } else {
            g.ellipse((x + w / 2) * W, (y + h / 2) * H, (w / 2) * W, (h / 2) * H, 0, 0, 2 * Math.PI);
          }
          g.fill();
          if (o.kind === 'face') paintFace(g, fam, o, W, H, spec.scenario === 'content');
          if (spec.scenario === 'content' && o.kind !== 'face' && o.kind !== 'label') {
            g.strokeStyle = '#a58e68'; g.lineWidth = Math.max(2, W * .012);
            g.strokeRect(x * W, y * H, w * W, h * H);
          }
        }
      },
      'paintFace': (base, S) => function paintFace(g, fam, o, W, H, round = false) {
        const { x, y, w, h } = o.sq;
        const d = Math.min(w * W, h * H);
        const X = (u) => round ? (x + w / 2) * W + (u - .5) * d : (x + u * w) * W;
        const Y = (v) => round ? (y + h / 2) * H + (v - .5) * d : (y + v * h) * H;
        g.strokeStyle = fam.FACE_INK;
        g.fillStyle = fam.FACE_INK;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        g.lineWidth = Math.max(2, 0.05 * (round ? d : w * W));
        g.beginPath();
        g.ellipse((x + w / 2) * W, (y + h / 2) * H, (w / 2) * W, (h / 2) * H, 0, 0, 2 * Math.PI);
        g.lineWidth = Math.max(1.5, 0.03 * (round ? d : w * W));
        g.strokeStyle = 'rgba(59,47,26,.55)';
        g.stroke();
        g.strokeStyle = fam.FACE_INK;
        for (const f of fam.facePrims(o.expr)) {
          g.beginPath();
          if (f.t === 'dot') {
            g.ellipse(X(f.x), Y(f.y), f.r * (round ? d : w * W), f.r * (round ? d : h * H), 0, 0, 2 * Math.PI);
            g.fill();
          } else if (f.t === 'rect') {
            g.roundRect(X(f.x), Y(f.y), f.w * (round ? d : w * W), f.h * (round ? d : h * H), 3);
            g.fill();
          } else {
            f.pts.forEach(([u, v], k) => (k ? g.lineTo(X(u), Y(v)) : g.moveTo(X(u), Y(v))));
            g.lineWidth = Math.max(2, f.w * (round ? d : w * W));
            g.stroke();
          }
        }
      },
      'box.render': (base, S) => function render(ctx) {
        const { ARROWS, CONTENT_BG, HANDLES, NAV_W, drawScene, ensureStyle, env, place, placeIn } = S;
        ensureStyle();
        const { spec, util, rng, size } = ctx;
        const fam = env.taskDef.helpers;
        const tools = spec.scenario === 'aspect' || spec.apply;
        const pan = spec.scenario === 'pan';
        let VW = 0; // pan: the window onto the image, in px (the image is spec.zoom times larger)
        let VH = 0;

        // Legacy image size (H 380..540 px) at the spec's aspect ratio, shrunk to fit the stage with room for
        // the wrap padding (handles overhang the image by 6 px), the toolbar and the readout.
        const availW = Math.floor(size.width - 2 * 8 - 2 * 14 - 4 - (pan ? NAV_W + 12 : 0));
        const availH = Math.floor(size.height - (spec.scenario === 'content' ? 108 : 2 * 8 + 2 * 14 + 24 + 10 + (tools ? 40 : 0)));
        S.H = Math.min(rng.int(380, 540), availH);
        if (spec.scenario === 'content') S.H = Math.min(690, availH);
        const visualAspect = spec.scenario === 'content' ? 0.656 : spec.aspect;
        S.W = Math.round(S.H * visualAspect);
        if (pan) {
          // The window keeps the legacy shape (aspect * zoom.y / zoom.x); the image behind it is larger.
          VH = S.H;
          VW = Math.round(VH * spec.aspect * spec.zoom.y / spec.zoom.x);
          if (VW > availW) {
            VW = availW;
            VH = Math.round(VW * spec.zoom.x / (spec.aspect * spec.zoom.y));
          }
          S.W = Math.round(VW * spec.zoom.x);
          S.H = Math.round(VH * spec.zoom.y);
        } else if (S.W > availW) {
          S.W = availW;
          S.H = Math.round(S.W / visualAspect);
        }

        const wrap = util.el('div', 'cr-wrap', ctx.stage);
        Object.assign(wrap.style, { gap: '14px', padding: '10px 14px' });
        let bar = null;
        if (tools) {
          bar = util.el('div', 'cr-tools', wrap);
          bar.dataset.role = 'toolbar';
        }
        // pan: [window | navigator] row; the frame (whole image) scrolls inside the window.
        const row = pan ? util.el('div', 'cr-row', wrap) : wrap;
        let view = null;
        if (pan) {
          view = util.el('div', 'cr-view', row);
          view.dataset.role = 'image-window';
          Object.assign(view.style, { width: VW + 'px', height: VH + 'px' });
        }
        S.frame = util.el('div', 'cr-frame', view || wrap);
        Object.assign(S.frame.style, { width: S.W + 'px', height: S.H + 'px' });
        const canvas = util.el('canvas', '', S.frame);
        canvas.dataset.role = 'image';
        canvas.width = S.W;
        canvas.height = S.H;
        drawScene(canvas.getContext('2d'), spec, fam, rng);
        if (spec.scenario === 'content' && !S.storefrontPhoto) {
          if (!S.storefrontLoad) S.storefrontLoad = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => { S.storefrontPhoto = img; resolve(img); };
            img.onerror = reject;
            img.src = CONTENT_BG;
          });
          S.storefrontLoad.then(() => {
            if (canvas.isConnected) drawScene(canvas.getContext('2d'), spec, fam, rng);
          }).catch(() => {});
        }

        const hole = util.el('div', 'cr-hole', util.el('div', 'cr-dim', S.frame));
        const box = util.el('div', 'cr-box', S.frame);
        box.dataset.role = 'crop-move';
        util.el('div', 'cr-grid', box);
        const handles = {};
        for (const name of HANDLES) {
          const h = util.el('div', 'cr-handle', box);
          h.dataset.role = 'handle-' + name;
          const [fx, fy] = fam.handlePoint({ l: 0, t: 0, r: 1, b: 1 }, name);
          Object.assign(h.style, { left: fx * 100 + '%', top: fy * 100 + '%' });
          handles[name] = h;
        }
        const readout = util.el('div', 'cr-readout', wrap);
        if (bar && rng.bool(0.4)) wrap.append(bar);

        // pan: the window position (spec.view-sized, model.pan) is the view's scroll offset; the wheel (when the
        // episode allows it) and a navigator thumbnail move it.
        let nav = null;
        let navRect = null;
        const panTo = (x, y) => {
          view.scrollLeft = Math.round(x * S.W);
          view.scrollTop = Math.round(y * S.H);
          const p = { x: Math.round((view.scrollLeft / S.W) * 1e4) / 1e4, y: Math.round((view.scrollTop / S.H) * 1e4) / 1e4 };
          paintNav(p);
          return p;
        };
        const paintNav = (p) => {
          if (!navRect) return;
          Object.assign(navRect.style, { left: p.x * 100 + '%', top: p.y * 100 + '%', width: spec.view.w * 100 + '%', height: spec.view.h * 100 + '%' });
        };
        if (pan) {
          const side = util.el('div', 'cr-side', row);
          const navH = Math.min(VH - 20, Math.round((NAV_W * S.H) / S.W));
          const navW = Math.min(NAV_W, Math.round((navH * S.W) / S.H));
          nav = util.el('div', 'cr-nav', side);
          nav.dataset.role = 'navigator';
          Object.assign(nav.style, { width: navW + 'px', height: navH + 'px' });
          const thumb = util.el('canvas', '', nav);
          thumb.width = navW;
          thumb.height = navH;
          thumb.getContext('2d').drawImage(canvas, 0, 0, navW, navH);
          navRect = util.el('div', 'cr-navwin', nav);
          util.el('div', 'cr-navcap', side, 'Navigator');
          // A press (or drag) on the thumbnail centres the window at that point.
          const centre = (e) => {
            const r = nav.getBoundingClientRect();
            const u = (e.clientX - r.left) / r.width;
            const v = (e.clientY - r.top) / r.height;
            const x = Math.min(1 - spec.view.w, Math.max(0, u - spec.view.w / 2));
            const y = Math.min(1 - spec.view.h, Math.max(0, v - spec.view.h / 2));
            ctx.update({ ...ctx.model, pan: panTo(x, y) });
          };
          nav.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            nav.setPointerCapture(e.pointerId);
            env.log('grab', { what: 'navigator' });
            centre(e);
            const move = (ev) => centre(ev);
            const end = () => {
              nav.removeEventListener('pointermove', move);
              nav.removeEventListener('pointerup', end);
              env.log('release', { what: 'navigator' });
            };
            nav.addEventListener('pointermove', move);
            nav.addEventListener('pointerup', end);
          });
          view.addEventListener('wheel', (e) => {
            if (!spec.panWheel) return;
            e.preventDefault();
            const k = e.deltaMode === 1 ? 16 : 1;
            let dx = e.deltaX * k;
            let dy = e.deltaY * k;
            if (e.shiftKey && !dx) [dx, dy] = [dy, 0];
            ctx.update({ ...ctx.model, pan: panTo(view.scrollLeft / S.W + dx / S.W, view.scrollTop / S.H + dy / S.H) });
          }, { passive: false });
        }

        const showBox = () => {
          const off = (spec.scenario === 'marquee' || pan) && !ctx.model.on;
          box.style.display = off ? 'none' : '';
          S.frame.classList.toggle('empty', off);
          S.frame.classList.toggle('cr-locked', !!fam.ratioValue(ctx.model.ratio));
        };
        let badge = null;
        const paintTools = () => {
          if (S.chips) for (const [r, c] of Object.entries(S.chips)) c.classList.toggle('on', (ctx.model.ratio || 'free') === r);
          if (badge) {
            const m = ctx.model;
            const ok = m.applied && ['l', 't', 'r', 'b'].every((k) => Math.abs(m.applied[k] - m[k]) <= 0.002);
            badge.textContent = ok ? 'Applied ✓' : '';
          }
        };
        // Every change of the rectangle (drag, marquee, preset, key) un-applies an applied crop.
        const commit = (m) => {
          ctx.update({ ...ctx.model, ...m, ...(spec.apply ? { applied: null } : {}) });
          showBox();
          paintTools();
        };

        S.chips = null;
        S.applyBtn = null;
        if (spec.scenario === 'aspect') {
          S.chips = {};
          for (const r of ['free', ...fam.RATIOS]) {
            const c = util.el('button', 'cr-chip', bar, r === 'free' ? 'Free' : r);
            c.type = 'button';
            c.dataset.role = 'preset';
            c.addEventListener('click', () => {
              const m = { ...fam.applyRatio(ctx.model, r, spec), ratio: r };
              S.crop.set(m);
              commit(m);
              env.log('preset', { ratio: r });
            });
            S.chips[r] = c;
          }
        }
        if (spec.apply) {
          if (S.chips) util.el('span', 'cr-sep', bar);
          S.applyBtn = util.el('button', 'cr-apply', bar, rng.pick(['Apply crop', 'Crop', 'Apply', 'Crop image', 'Done cropping']));
          S.applyBtn.type = 'button';
          S.applyBtn.dataset.role = 'apply';
          badge = util.el('span', 'cr-badge', bar);
          S.applyBtn.addEventListener('click', () => {
            const m = ctx.model;
            ctx.update({ ...m, applied: { l: m.l, t: m.t, r: m.r, b: m.b } });
            env.log('apply-crop');
            if (spec.judge && spec.judge.mode === 'confirm') ctx.flag('irreversible'); // Apply is the step to ask about
            paintTools();
          });
        }
        if (spec.scenario === 'content' && !spec.apply) {
          const lower = util.el('div', 'fluent-bottom-tools', wrap);
          const lowerWidth = Math.min(size.width < 1260 ? 760 : 900, size.width * (size.width < 1260 ? .58 : 1) - 36);
          Object.assign(lower.style, { position: 'absolute', width: lowerWidth + 'px', height: '60px', gap: size.width < 1260 ? '8px' : '18px', marginTop: '0', top: (S.H + 26) + 'px', flex: 'none' });
          const ratio = util.el('button', 'fluent-bottom-ratio', lower);
          ratio.type = 'button'; ratio.setAttribute('aria-label', 'Aspect ratio');
          util.el('span', 'ratio-icon', ratio, '▱'); util.el('span', '', ratio, 'Freeform'); util.el('span', 'ratio-chevron', ratio, '⌄');
          const actions = util.el('div', 'fluent-bottom-actions', lower);
          for (const [glyph, title] of [['↶', 'Rotate left'], ['↻', 'Rotate right'], ['◁▷', 'Flip horizontal'], ['↕', 'Flip vertical']]) {
            const icon = util.el('button', 'fluent-bottom-icon', actions, glyph);
            icon.type = 'button'; icon.title = title; icon.setAttribute('aria-label', title);
          }
          util.el('span', 'fluent-bottom-spacer', lower);
          S.applyBtn = util.el('button', 'cr-apply fluent-apply', lower, 'Apply crop');
          S.applyBtn.type = 'button'; S.applyBtn.dataset.role = 'apply';
          S.applyBtn.addEventListener('click', () => {
            const m = ctx.model;
            ctx.update({ ...m, applied: { l: m.l, t: m.t, r: m.r, b: m.b } });
            env.log('apply-crop');
            if (spec.judge && spec.judge.mode === 'confirm') ctx.flag('irreversible');
          });
          const center = size.width * (size.width < 1260 ? .39 : .44);
          const lowerLeft = Math.max(18, Math.min(size.width - lowerWidth - 18, center - lowerWidth / 2 + (size.width < 1260 ? 0 : Math.min(110, size.width * .066))));
          lower.style.left = (lowerLeft - (center - S.W / 2 - 14)) + 'px';
        }

        S.crop = env.ui.cropbox(S.frame, box, {
          value: { l: ctx.model.l, t: ctx.model.t, r: ctx.model.r, b: ctx.model.b },
          handles,
          apply: (r, action, dx, dy) => fam.applyDrag({ ...r, ratio: ctx.model.ratio }, action, dx, dy, spec),
          place: (el, m) => {
            place(hole, m);
            place(el, m);
            // Keep neighboring resize handles distinct even during a very narrow intermediate crop.
            const diameter = Math.min(18, (m.r - m.l) * S.W * .4, (m.b - m.t) * S.H * .4);
            for (const handle of Object.values(handles)) {
              Object.assign(handle.style, { width: diameter + 'px', height: diameter + 'px', margin: `${-diameter / 2}px 0 0 ${-diameter / 2}px` });
            }
            const px = (v, s) => Math.round(v * s);
            readout.textContent = (spec.scenario === 'marquee' || pan) && !ctx.model.on ? 'No selection - drag on the image to select'
              : `Crop: ${px(m.r - m.l, S.W)} × ${px(m.b - m.t, S.H)} px at (${px(m.l, S.W)}, ${px(m.t, S.H)})`;
          },
          onInput: (m) => commit(m),
        });

        // Marquee: a press on the image outside the box draws a new selection.
        if (spec.scenario === 'marquee' || pan) {
          S.frame.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || (box.style.display !== 'none' && box.contains(e.target))) return;
            e.preventDefault();
            S.frame.setPointerCapture(e.pointerId);
            const p0 = S.crop.toNorm([e.clientX, e.clientY]);
            env.log('grab', { what: 'marquee' });
            const move = (ev) => {
              const r = fam.marqueeRect(p0, S.crop.toNorm([ev.clientX, ev.clientY]), spec);
              if (!r) return;
              S.crop.set(r);
              commit({ ...r, on: true });
              S.crop.set(r);
            };
            const end = (ev) => {
              move(ev);
              S.frame.removeEventListener('pointermove', move);
              S.frame.removeEventListener('pointerup', end);
              env.log('release', { what: 'marquee' });
            };
            S.frame.addEventListener('pointermove', move);
            S.frame.addEventListener('pointerup', end);
          });
        }

        // Keyboard nudging of the focused box.
        if (spec.keys) {
          box.tabIndex = 0;
          box.addEventListener('pointerdown', () => box.focus({ preventScroll: true }));
          box.addEventListener('keydown', (e) => {
            if (!ARROWS.has(e.key)) return;
            e.preventDefault();
            const m = fam.nudge({ ...ctx.model, px: { W: S.W, H: S.H } }, (e.shiftKey ? 'Shift+' : '') + e.key, spec);
            S.crop.set(m);
            commit({ l: m.l, t: m.t, r: m.r, b: m.b });
          });
          box.addEventListener('focus', () => { if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true }); });
          box.addEventListener('blur', () => { if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false }); });
        }

        showBox();
        paintTools();
        S.crop.set(ctx.model);
        // Pin the column at its rendered width and keep the toolbar on one line at its own width: on a narrow image
        // (traits.aspect) the toolbar or readout can be wider than the image, and their text changing (Applied ✓, the
        // size readout) must not shift the image.
        if (bar) bar.style.width = 'max-content';
        wrap.style.width = `${S.W + 28}px`;
        placeIn(ctx, wrap, rng);
        if (spec.scenario === 'content') {
          const center = size.width * (size.width < 1260 ? .39 : .44);
          wrap.style.left = Math.max(8, Math.min(size.width - S.W - 36, center - S.W / 2 - 14)) + 'px';
          wrap.style.top = '0px';
        }
        // Mirror the rendered image size (unscored) for the keyboard / pan plan.
        ctx.update({ ...ctx.model, px: { W: S.W, H: S.H }, ...(pan ? { pan: panTo(ctx.model.pan.x, ctx.model.pan.y) } : {}) });
        return {
          anchors: [view || S.frame],
          sync: (m) => {
            S.crop.set(m);
            showBox();
            paintTools();
            if (pan && m.pan) panTo(m.pan.x, m.pan.y);
          },
        };
      },
    },
  },
});
