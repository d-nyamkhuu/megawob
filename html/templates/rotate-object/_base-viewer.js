// rotate-object/_base-viewer: reference viewer widget registration, loaded by rotate-object/base.
// Retains the original unit scopes, part keys and order of setup / RNG draws.
(function () {
  'use strict';
  env.template('rotate-object/_base-viewer', () => ({
    register({ env, scriptOf, __parts, __has, setScope }) {
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get F() { return F; },
        get fx() { return fx; },
        get view() { return view; }, set view(v) { view = v; },
        get ctxRef() { return ctxRef; }, set ctxRef(v) { ctxRef = v; },
        get ensureStyle() { return ensureStyle; },
        get m3d() { return m3d; },
        get icon() { return icon; },
        get renderViewer() { return renderViewer; },
        get placeCard() { return placeCard; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+3.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('ensureStyle@3')) ensureStyle = __parts['ensureStyle@3'](ensureStyle, __scope);
      if (__has('m3d@3')) m3d = __parts['m3d@3'](m3d, __scope);
      if (__has('icon')) icon = __parts['icon'](icon, __scope);
      if (__has('renderViewer')) renderViewer = __parts['renderViewer'](renderViewer, __scope);
      if (__has('placeCard@3')) placeCard = __parts['placeCard@3'](placeCard, __scope);

      const CSS = __has('CSS@3') ? __parts['CSS@3'](undefined, __scope) : (`
      .rv-card {
        position: relative; display: flex; align-items: stretch; gap: 30px; padding: 18px;
        border: 1px solid var(--line); border-radius: 14px; background: var(--panel);
        box-shadow: 0 2px 10px rgba(0,0,0,.06);
      }
      .rv-pad {
        position: relative; overflow: hidden; border-radius: 10px; cursor: grab; touch-action: none;
        background: radial-gradient(ellipse at 50% 38%, color-mix(in srgb, var(--panel) 92%, #fff), color-mix(in srgb, var(--fg) 9%, var(--panel)) 78%);
      }
      .rv-pad.dragging { cursor: grabbing; }
      .rv-tilt, .rv-box, .rv-face, .rv-plat { position: absolute; left: 0; top: 0; }
      .rv-tilt, .rv-box { transform-style: preserve-3d; pointer-events: none; }
      .rv-face {
        box-sizing: border-box; display: flex; align-items: center; justify-content: center;
        backface-visibility: hidden; -webkit-backface-visibility: hidden; border: 1px solid rgba(0,0,0,.25);
      }
      .rv-print {
        width: 76%; max-height: 82%; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; gap: 6px;
        padding: 8px 6px; border-radius: 6px; background: rgba(255,255,255,.93); color: #1d2330; text-align: center;
        font: 700 13px "Helvetica Neue", Arial, system-ui, sans-serif; line-height: 1.15; overflow: hidden;
      }
      .rv-print svg { display: block; }
      .rv-shade { position: absolute; inset: -1px; background: #000; pointer-events: none; }
      .rv-plat { border-radius: 50%; box-sizing: border-box;
        background: radial-gradient(circle, color-mix(in srgb, var(--fg) 10%, var(--panel)) 0 58%, color-mix(in srgb, var(--fg) 22%, var(--panel)) 59% 61%, color-mix(in srgb, var(--fg) 14%, var(--panel)) 62%);
        border: 2px solid color-mix(in srgb, var(--fg) 28%, var(--panel)); }
      .rv-mark { position: absolute; width: 8px; height: 8px; margin: -4px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 45%, var(--panel)); }
      .rv-badge { position: absolute; left: 12px; top: 12px; padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 700;
        background: color-mix(in srgb, var(--fg) 82%, transparent); color: var(--panel); pointer-events: none; letter-spacing: .02em; }
      .rv-hint { position: absolute; left: 0; right: 0; bottom: 10px; text-align: center; font-size: 12px; color: var(--muted); pointer-events: none; }
      .rv-info { width: 250px; display: flex; flex-direction: column; gap: 10px; padding: 6px 4px; }
      .rv-crumb { font-size: 12px; color: var(--muted); }
      .rv-name { font-size: 19px; font-weight: 650; line-height: 1.25; color: var(--fg); }
      .rv-stars { color: #f0a400; font-size: 14px; letter-spacing: 1px; }
      .rv-stars span { color: var(--muted); font-size: 12px; letter-spacing: 0; margin-left: 6px; }
      .rv-price { font-size: 24px; font-weight: 700; color: var(--fg); }
      .rv-swatches { display: flex; gap: 8px; }
      .rv-sw { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--panel); box-shadow: 0 0 0 1px var(--line); }
      .rv-buy { margin-top: 6px; padding: 10px 14px; border: 0; border-radius: 8px; background: color-mix(in srgb, var(--fg) 10%, var(--panel));
        color: var(--fg); font: inherit; font-weight: 650; cursor: pointer; }
      .rv-muted { font-size: 13px; color: var(--muted); line-height: 1.4; }
      `);

      let view = __has('view@3') ? __parts['view@3'](undefined, __scope) : undefined;
      let ctxRef = __has('ctxRef@3') ? __parts['ctxRef@3'](undefined, __scope) : undefined;

      function ensureStyle() {
        if (document.getElementById('rv-style')) return;
        const s = document.createElement('style');
        s.id = 'rv-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      const F = __has('F@3') ? __parts['F@3'](undefined, __scope) : { F: () => env.taskDef }.F;
      const fx = __has('fx@3') ? __parts['fx@3'](undefined, __scope) : { fx: (v) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(6) }.fx;
      function m3d(q, t = [0, 0, 0]) {
        const m = F().helpers.quat.matrix(q);
        const v = [m[0][0], m[1][0], m[2][0], 0, m[0][1], m[1][1], m[2][1], 0, m[0][2], m[1][2], m[2][2], 0, t[0], t[1], t[2], 1];
        return `matrix3d(${v.map(fx).join(',')})`;
      }

      // A small printed icon for a package side (SVG markup), drawn from the label's kind.
      function icon(label, rng, w) {
        const h = Math.round(w * 0.55);
        const s = (body) => `<svg width="${w}" height="${h}" viewBox="0 0 100 55">${body}</svg>`;
        const k = label.toLowerCase();
        if (k.includes('barcode') || k.includes('batch')) {
          let x = 6;
          let b = '';
          while (x < 92) {
            const bw = rng.pick([1.5, 2.5, 4]);
            b += `<rect x="${x}" y="4" width="${bw}" height="40" fill="#111"/>`;
            x += bw + rng.pick([1.5, 2.5, 3.5]);
          }
          return s(b + `<text x="50" y="53" font-size="9" text-anchor="middle" fill="#111">${rng.int(100000, 999999)} ${rng.int(100000, 999999)}</text>`);
        }
        if (k.includes('qr')) {
          let b = '';
          for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) if (rng.bool(0.45)) b += `<rect x="${32 + i * 4}" y="${4 + j * 4}" width="4" height="4" fill="#111"/>`;
          for (const [x, y] of [[32, 4], [56, 4], [32, 28]]) b += `<rect x="${x}" y="${y}" width="12" height="12" fill="#fff" stroke="#111" stroke-width="3"/>`;
          return s(b + '<rect x="30" y="2" width="40" height="40" fill="none" stroke="#111" stroke-width="1"/>');
        }
        if (k.includes('logo') || k.includes('photo')) {
          return s(`<circle cx="50" cy="26" r="22" fill="none" stroke="#111" stroke-width="4"/><path d="M36,36 L48,18 L56,30 L60,24 L68,36 Z" fill="#111"/>`);
        }
        if (k.includes('warning') || k.includes('allergen')) {
          return s('<path d="M50,4 L78,50 L22,50 Z" fill="none" stroke="#111" stroke-width="4" stroke-linejoin="round"/><rect x="48" y="20" width="4" height="16" fill="#111"/><rect x="48" y="40" width="4" height="4" fill="#111"/>');
        }
        if (k.includes('recycl')) {
          return s('<path d="M50,6 L74,46 L26,46 Z" fill="none" stroke="#111" stroke-width="4" stroke-dasharray="18 6"/>');
        }
        if (k.includes('recipe') || k.includes('serving') || k.includes('storage')) {
          return s('<path d="M24,26 H76 A26,22 0 0 1 24,26 Z" fill="#111"/><path d="M40,20 q-4,-8 0,-14 M50,20 q-4,-8 0,-14 M60,20 q-4,-8 0,-14" fill="none" stroke="#111" stroke-width="3"/>');
        }
        if (k.includes('care') || k.includes('warranty')) {
          return s('<path d="M22,12 L30,46 H70 L78,12" fill="none" stroke="#111" stroke-width="4"/><path d="M28,24 q6,-6 11,0 t11,0 t11,0 t11,0" fill="none" stroke="#111" stroke-width="3"/>');
        }
        let b = '';
        for (let i = 0; i < 5; i++) b += `<rect x="10" y="${4 + i * 10}" width="${rng.int(40, 80)}" height="4" fill="#111" opacity="${i ? 0.55 : 1}"/>`;
        return s(b);
      }

      function renderViewer(ctx) {
        const { util, rng, size, spec, content } = ctx;
        const fam = F();
        const P = Math.floor(Math.min(460, size.height - 60, size.width - 380));
        const S = Math.round(P * rng.float(0.3, 0.36)); // box width = depth
        const H = Math.round(S * rng.float(0.9, 1.35)); // box height
        const tilt = rng.float(12, 20); // camera elevation, visual only
        // MAX_DRAG degrees must fit between the pad center and the viewport edge (horizontal drags only).
        const gain = Math.max(rng.float(0.42, 0.7), fam.helpers.MAX_DRAG / (P / 2 + 10));
        const light = [rng.float(-0.6, 0.2), -0.4, 1];

        const card = util.el('div', 'rv-card', ctx.stage);
        const pad = util.el('div', 'rv-pad', card);
        pad.dataset.role = 'viewer';
        Object.assign(pad.style, { width: P + 'px', height: P + 'px', perspective: rng.int(900, 1400) + 'px' });
        const tiltEl = util.el('div', 'rv-tilt', pad);
        Object.assign(tiltEl.style, { width: P + 'px', height: P + 'px', transform: `translateY(${Math.round(-P * 0.03)}px) rotateX(${(-tilt).toFixed(2)}deg)` });
        const box = util.el('div', 'rv-box', tiltEl);
        Object.assign(box.style, { width: S + 'px', height: H + 'px', left: (P - S) / 2 + 'px', top: (P - H) / 2 + 'px' });

        // Turntable platter under the box (spins with it), marks around its rim.
        const D = Math.round(S * rng.float(1.7, 1.95));
        const plat = util.el('div', 'rv-plat', box);
        Object.assign(plat.style, { width: D + 'px', height: D + 'px', left: (S - D) / 2 + 'px', top: (H - D) / 2 + 'px',
          transform: `translateY(${H / 2 + 2}px) rotateX(90deg)` });
        for (let k = 0; k < 12; k++) {
          const m = util.el('div', 'rv-mark', plat);
          const a = (k * 30 * Math.PI) / 180;
          m.style.left = D / 2 + Math.sin(a) * (D / 2 - 10) + 'px';
          m.style.top = D / 2 - Math.cos(a) * (D / 2 - 10) + 'px';
          if (k === 0) m.style.background = 'var(--accent)';
        }

        const faces = spec.faces.map((f, i) => {
          const side = i < 4;
          const fw = S;
          const fh = side ? H : S;
          const face = util.el('div', 'rv-face', box);
          Object.assign(face.style, { width: fw + 'px', height: fh + 'px', left: (S - fw) / 2 + 'px', top: (H - fh) / 2 + 'px', background: f.color });
          const n = fam.helpers.faceWorld([1, 0, 0, 0], i).normal;
          face.style.transform = m3d(fam.helpers.FACES[i].q, n.map((v) => (v * (i < 4 ? S : H)) / 2));
          const print = util.el('div', 'rv-print', face);
          print.innerHTML = icon(f.label, rng, Math.round(fw * 0.5));
          const t = util.el('div', '', print, f.label);
          t.style.fontSize = Math.max(11, Math.round(fw * (f.label.length > 12 ? 0.075 : 0.09))) + 'px';
          return { face, shade: util.el('div', 'rv-shade', face) };
        });

        util.el('div', 'rv-badge', pad, rng.pick(['⟲ 360°', '360° view', '360°']));
        util.el('div', 'rv-hint', pad, rng.pick(['◀  Drag to spin  ▶', 'Drag left or right to rotate', 'Click and drag to turn the product']));

        // Product info column (inert decoys).
        const info = util.el('div', 'rv-info', card);
        const prod = content.pick(rng, content.PRODUCTS, { csplit: spec.csplit });
        util.el('div', 'rv-crumb', info, `Shop › ${rng.pick(['New arrivals', 'Best sellers', 'All products', 'Deals'])}`);
        util.el('div', 'rv-name', info, prod.name);
        const stars = util.el('div', 'rv-stars', info, '★★★★' + rng.pick(['★', '☆']));
        util.el('span', '', stars, `${rng.int(12, 980)} reviews`);
        util.el('div', 'rv-price', info, `$${rng.float(prod.priceMin, prod.priceMax).toFixed(2)}`);
        const sws = util.el('div', 'rv-swatches', info);
        for (const c of rng.sample(Object.values(content.COLORS || env.content.COLORS || {}), 3)) util.el('div', 'rv-sw', sws).style.background = c;
        util.el('div', 'rv-muted', info, rng.pick(['Free returns within 30 days.', 'Ships in 1-2 business days.', 'In stock. Order today.']));
        const buy = util.el('button', 'rv-buy', info, rng.pick(['Add to wishlist', 'Compare', 'Save for later']));
        buy.type = 'button';

        function paint() {
          const q = ctx.model.q;
          box.style.transform = m3d(q);
          faces.forEach((f, i) => {
            const n = fam.helpers.faceWorld(q, i).normal;
            const lit = Math.max(0, (n[0] * light[0] + n[1] * light[1] + n[2] * light[2]) / Math.hypot(...light));
            f.shade.style.opacity = (0.4 * (1 - lit)).toFixed(3);
          });
        }

        // Horizontal drags spin the product about the vertical axis; vertical motion is ignored.
        let q0 = null;
        const ball = env.ui.trackball(pad, {
          label: 'turntable',
          gain: [gain, gain],
          onStart() {
            q0 = ctx.model.q.slice();
            pad.classList.add('dragging');
          },
          onInput([yaw]) {
            ctx.update({ q: fam.helpers.quat.normalize(fam.helpers.quat.mul(fam.helpers.rotation(yaw, 0), q0)) });
            paint();
          },
          onChange() {
            pad.classList.remove('dragging');
          },
        });

        paint();
        view = {
          card,
          anchors: [pad],
          sync() { paint(); },
          locate(t) {
            if (t.grab) return ball.locateGrab();
            if (t.rotateBy) return ball.locate([t.rotateBy[0], 0]);
            return null;
          },
        };
      }

      function placeCard(card, ctx) {
        const s = ctx.stage.getBoundingClientRect();
        const r = card.getBoundingClientRect();
        const lo = [s.left - r.left + 4, s.top - r.top + 4];
        const hi = [s.right - r.right - 4, s.bottom - r.bottom - 4];
        const pick = (a, b) => (b > a ? Math.round(ctx.rng.float(Math.max(a, -90), Math.min(b, 90))) : 0);
        card.style.position = 'relative';
        card.style.left = pick(lo[0], hi[0]) + 'px';
        card.style.top = pick(lo[1], hi[1]) + 'px';
      }

      env.widget({
        task: 'rotate-object',
        site: 'base',
        name: 'viewer',
        split: 'train',
        scenarios: ['cube'],
        traits: { turntable: true },

        render(ctx) {
          ensureStyle();
          ctxRef = ctx;
          renderViewer(ctx);
          placeCard(view.card, ctx);
          return { anchors: view.anchors, sync: view.sync };
        },

        locate(t) {
          const p = view && view.locate(t);
          if (!p) throw new Error(`rotate-object/viewer cannot locate ${JSON.stringify(t)} (variant ${ctxRef && ctxRef.spec.scenario})`);
          return p;
        },
      });
    
    },
  }));
})();
