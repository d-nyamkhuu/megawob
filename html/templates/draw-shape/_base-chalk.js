/* draw-shape/_base-chalk: the reference chalk scope, with all original unit hooks.
 * Registered by draw-shape/base in the original scope order. */
(function () {
  'use strict';
  env.template('draw-shape/_base-chalk', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get SLATES() { return SLATES; },
        get CHALK() { return CHALK; },
        get GRAY() { return GRAY; },
        get INKS() { return INKS; },
        get HAND() { return HAND; },
        get MARGIN() { return MARGIN; },
        get slate() { return slate; }, set slate(v) { slate = v; },
        get stroke() { return stroke; }, set stroke(v) { stroke = v; },
        get ensureStyle() { return ensureStyle; },
        get layer() { return layer; },
        get chalkPath() { return chalkPath; },
        get chalkDot() { return chalkDot; },
        get chalkText() { return chalkText; },
        get unit() { return unit; },
        get drawSlate() { return drawSlate; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+1.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('ensureStyle@1')) ensureStyle = __parts['ensureStyle@1'](ensureStyle, __scope);
      if (__has('layer')) layer = __parts['layer'](layer, __scope);
      if (__has('chalkPath')) chalkPath = __parts['chalkPath'](chalkPath, __scope);
      if (__has('chalkDot')) chalkDot = __parts['chalkDot'](chalkDot, __scope);
      if (__has('chalkText')) chalkText = __parts['chalkText'](chalkText, __scope);
      if (__has('unit@1')) unit = __parts['unit@1'](unit, __scope);
      if (__has('drawSlate')) drawSlate = __parts['drawSlate'](drawSlate, __scope);

      const CSS = __has('CSS@1') ? __parts['CSS@1'](undefined, __scope) : (`
      .ck-wrap { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 8px; }
      .ck-frame {
        padding: 14px 14px 0; border-radius: 8px;
        background: linear-gradient(180deg, #a8743f, #8a5a2b 40%, #7a4d22);
        box-shadow: inset 0 0 0 2px rgba(255,255,255,.12), 0 2px 4px rgba(0,0,0,.25), 0 10px 26px rgba(0,0,0,.22);
      }
      .ck-slate { position: relative; cursor: crosshair; touch-action: none;
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.45), inset 0 2px 10px rgba(0,0,0,.5); border-radius: 2px; }
      .ck-slate canvas { position: absolute; left: 0; top: 0; display: block; }
      .ck-tray { height: 30px; display: flex; align-items: center; gap: 10px; padding: 0 8px; }
      .ck-stick { width: 34px; height: 7px; border-radius: 3px; box-shadow: 0 1px 1px rgba(0,0,0,.35); }
      .ck-eraser { margin-left: auto; width: 78px; height: 22px; padding: 0 0 8px; border: 0; border-radius: 3px;
        background: linear-gradient(180deg, #d9c49c 0 62%, #4b4038 62%); color: #4a3520; cursor: pointer;
        font: 700 10px/14px "Comic Neue", "Comic Sans MS", "Chalkboard", cursive; letter-spacing: .12em;
        text-transform: uppercase; box-shadow: 0 1px 2px rgba(0,0,0,.45); }
      .ck-hint { font: 14px "Comic Neue", "Comic Sans MS", cursive; color: var(--muted); text-align: center; }
      `);
      const SLATES = __has('SLATES') ? __parts['SLATES'](undefined, __scope) : (['#2f4a3a', '#2b3d36', '#263238', '#33473f']);
      const CHALK = __has('CHALK') ? __parts['CHALK'](undefined, __scope) : ('#f1efe6');
      const GRAY = __has('GRAY') ? __parts['GRAY'](undefined, __scope) : ('#a5aea9');
      const INKS = __has('INKS') ? __parts['INKS'](undefined, __scope) : (['#f6e27a', '#f7a9c4', '#9ed4f7', '#b7ef9a']);
      const HAND = __has('HAND') ? __parts['HAND'](undefined, __scope) : ('"Comic Neue", "Comic Sans MS", "Chalkboard", cursive');
      const MARGIN = __has('MARGIN') ? __parts['MARGIN'](undefined, __scope) : (22); // px of slate around the scored board

      let slate = __has('slate') ? __parts['slate'](undefined, __scope) : undefined;
      let stroke = __has('stroke') ? __parts['stroke'](undefined, __scope) : undefined;

      function ensureStyle() {
        if (document.getElementById('ck-style')) return;
        const s = document.createElement('style');
        s.id = 'ck-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      function layer(parent, w, h) {
        const c = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
        c.style.width = `${w}px`;
        c.style.height = `${h}px`;
        parent.append(c);
        const g = c.getContext('2d');
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        return g;
      }

      // A chalk line: a solid core plus a grainy dashed pass, so it reads as chalk rather than ink.
      function chalkPath(g, pts, color, width, dash) {
        if (pts.length < 1) return;
        const trace = () => {
          g.beginPath();
          g.moveTo(pts[0][0], pts[0][1]);
          for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
          if (pts.length === 1) g.lineTo(pts[0][0] + 0.1, pts[0][1]);
        };
        g.save();
        g.lineCap = dash ? 'butt' : 'round';
        g.lineJoin = 'round';
        g.strokeStyle = color;
        g.setLineDash(dash || []);
        g.globalAlpha = 0.82;
        g.lineWidth = width;
        trace();
        g.stroke();
        g.globalAlpha = 0.35;
        g.lineWidth = width * 0.45;
        g.setLineDash(dash ? dash : [1.2, 2.3]);
        g.lineDashOffset = 1;
        g.strokeStyle = '#ffffff';
        trace();
        g.stroke();
        g.restore();
      }

      function chalkDot(g, [x, y], hollow) {
        g.save();
        g.fillStyle = CHALK;
        g.strokeStyle = CHALK;
        g.beginPath();
        if (hollow) {
          g.globalAlpha = 0.95;
          g.lineWidth = 3;
          g.arc(x, y, 8, 0, Math.PI * 2);
          g.stroke();
        } else {
          g.globalAlpha = 0.95;
          g.arc(x, y, 7.5, 0, Math.PI * 2);
          g.fill();
        }
        g.restore();
      }

      function chalkText(g, [x, y], text, size, W, H) {
        g.save();
        g.font = `700 ${size}px ${HAND}`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillStyle = CHALK;
        g.globalAlpha = 0.92;
        g.fillText(text, Math.min(W - 18, Math.max(18, x)), Math.min(H - 14, Math.max(14, y)));
        g.restore();
      }

      function unit(a, b) {
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const l = Math.hypot(dx, dy) || 1;
        return [dx / l, dy / l];
      }

      function drawSlate(g, spec, rng, Wc, Hc, px) {
        g.fillStyle = rng.pick(SLATES);
        g.fillRect(0, 0, Wc, Hc);
        // Old eraser smudges (faint, large, never near-dot sized).
        for (let i = 0; i < 7; i++) {
          const x = rng.float(0, Wc);
          const y = rng.float(0, Hc);
          const r = rng.float(80, 200);
          const grd = g.createRadialGradient(x, y, 0, x, y, r);
          grd.addColorStop(0, `rgba(255,255,255,${rng.float(0.025, 0.05).toFixed(3)})`);
          grd.addColorStop(1, 'rgba(255,255,255,0)');
          g.fillStyle = grd;
          g.fillRect(0, 0, Wc, Hc);
        }
        const W = Wc;
        const H = Hc;
        const at = (p, d, off) => { const q = px(p); return [q[0] + d[0] * off, q[1] + d[1] * off]; };
        if (spec.scenario === 'line') {
          if (spec.mode === 'connect') {
            chalkDot(g, px(spec.a));
            chalkDot(g, px(spec.b));
            chalkText(g, at(spec.a, unit(spec.b, spec.a), 24), 'A', 24, W, H);
            chalkText(g, at(spec.b, unit(spec.a, spec.b), 24), 'B', 24, W, H);
            return;
          }
          if (spec.dir === 'guide') {
            const d = [Math.cos(spec.angle), Math.sin(spec.angle)];
            const h = spec.guide.len / 2;
            const a = px([spec.guide.c[0] - d[0] * h, spec.guide.c[1] - d[1] * h]);
            const b = px([spec.guide.c[0] + d[0] * h, spec.guide.c[1] + d[1] * h]);
            chalkPath(g, [a, b], GRAY, 5);
            const nrm = [-d[1], d[0]];
            const side = nrm[1] > 0 ? [-nrm[0], -nrm[1]] : nrm;
            g.save();
            g.font = `600 15px ${HAND}`;
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillStyle = GRAY;
            const q = at(spec.guide.c, side, 20);
            g.fillText('guide', Math.min(W - 24, Math.max(24, q[0])), Math.min(H - 12, Math.max(12, q[1])));
            g.restore();
          }
          const p = px(spec.p);
          g.save();
          g.strokeStyle = GRAY;
          g.lineWidth = 1.6;
          g.setLineDash([2, 4]);
          g.beginPath();
          g.arc(p[0], p[1], 16, 0, Math.PI * 2);
          g.stroke();
          g.restore();
          chalkDot(g, p);
          return;
        }
        if (spec.scenario === 'circle') {
          const c = px(spec.c);
          if (spec.show === 'guide') {
            const r = px([spec.r, 0])[0] - px([0, 0])[0];
            const n = 72;
            const pts = Array.from({ length: n + 1 }, (_, i) => [c[0] + r * Math.cos((i / n) * 2 * Math.PI), c[1] + r * Math.sin((i / n) * 2 * Math.PI)]);
            chalkPath(g, pts, GRAY, 2.5, [9, 8]);
            chalkDot(g, c);
            if (spec.rimDot) chalkDot(g, px(spec.rim), true);
          } else {
            chalkDot(g, c);
            chalkDot(g, px(spec.rim), true);
          }
          return;
        }
        // trace: a faint smeared band, a dashed chalk center line, a start dot and an arrowhead.
        const path = spec.path.map(px);
        g.save();
        g.globalAlpha = 0.13;
        g.strokeStyle = CHALK;
        g.lineWidth = 18;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        g.beginPath();
        g.moveTo(path[0][0], path[0][1]);
        for (const q of path.slice(1)) g.lineTo(q[0], q[1]);
        g.stroke();
        g.restore();
        chalkPath(g, path, GRAY, 2.5, [7, 6]);
        const tip = path[path.length - 1];
        const d = unit(path[path.length - 2], tip);
        const n = [-d[1], d[0]];
        const back = [tip[0] - d[0] * 20, tip[1] - d[1] * 20];
        g.save();
        g.fillStyle = CHALK;
        g.globalAlpha = 0.92;
        g.beginPath();
        g.moveTo(tip[0], tip[1]);
        g.lineTo(back[0] + n[0] * 10, back[1] + n[1] * 10);
        g.lineTo(back[0] - n[0] * 10, back[1] - n[1] * 10);
        g.closePath();
        g.fill();
        g.restore();
        chalkDot(g, path[0]);
        const s = unit(spec.path[1], spec.path[0]);
        g.save();
        g.font = `700 16px ${HAND}`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillStyle = CHALK;
        const q = [path[0][0] + s[0] * 28, path[0][1] + s[1] * 28];
        g.fillText('start', Math.min(W - 26, Math.max(26, q[0])), Math.min(H - 12, Math.max(12, q[1])));
        g.restore();
      }

      env.widget({
        task: 'draw-shape',
        site: 'base',
        name: 'chalkboard',
        split: 'train',
        scenarios: ['line', 'circle', 'trace'],

        render(ctx) {
          ensureStyle();
          const { util, rng, size, spec } = ctx;
          const aspect = spec.board.w / spec.board.h;
          const chromeH = 14 + 2 * MARGIN + 30 + 8 + 22 + 24; // frame top, margins, tray, gap, hint, margins
          const chromeW = 2 * 14 + 2 * MARGIN + 32;
          const fit = Math.min(size.height - chromeH, (size.width - chromeW) / aspect);
          const scale = Math.max(100, Math.floor(Math.min(fit, rng.int(400, 540)))); // px per board unit
          const Wc = Math.round(spec.board.w * scale) + 2 * MARGIN;
          const Hc = scale + 2 * MARGIN;
          const px = (p) => [MARGIN + p[0] * scale, MARGIN + p[1] * scale];

          const wrap = util.el('div', 'ck-wrap', ctx.stage);
          const frame = util.el('div', 'ck-frame', wrap);
          slate = util.el('div', 'ck-slate', frame);
          slate.dataset.role = 'board';
          slate.style.width = `${Wc}px`;
          slate.style.height = `${Hc}px`;
          drawSlate(layer(slate, Wc, Hc), spec, rng, Wc, Hc, px);
          const ink = layer(slate, Wc, Hc);
          const inkColor = rng.pick(INKS);
          const inkWidth = rng.pick([4, 5, 6]);

          const tray = util.el('div', 'ck-tray', frame);
          for (const c of rng.sample(['#f1efe6', ...INKS], rng.int(2, 3))) util.el('span', 'ck-stick', tray).style.background = c;
          const eraser = util.el('button', 'ck-eraser', tray, 'eraser');
          eraser.type = 'button';
          eraser.dataset.role = 'eraser';

          // The board frame: board units -> slate px through the margin; read the slate's live position.
          stroke = env.ui.stroke(slate, {
            toBoard: ([x, y]) => {
              const r = slate.getBoundingClientRect();
              return [(x - r.left - MARGIN) / scale, (y - r.top - MARGIN) / scale];
            },
            fromBoard: ([bx, by]) => {
              const r = slate.getBoundingClientRect();
              return [r.left + MARGIN + bx * scale, r.top + MARGIN + by * scale];
            },
            bounds: { x0: 0, y0: 0, x1: spec.board.w, y1: spec.board.h },
            strokes: ctx.model.strokes,
            minDist: 1.5,
            render: (points) => {
              ink.clearRect(0, 0, Wc, Hc);
              chalkPath(ink, points.map(px), inkColor, inkWidth);
            },
            onStroke: (points, strokes) => ctx.update({ strokes }),
            onChange: (strokes) => ctx.update({ strokes }),
            label: 'chalk',
          });
          eraser.addEventListener('click', () => {
            ctx.log('erase');
            stroke.set([]);
            ctx.update({ strokes: [] });
          });

          const hint = util.el('div', 'ck-hint', wrap, 'Hold the mouse button to draw with chalk. A new stroke wipes the old one.');
          hint.style.maxWidth = `${Wc + 28}px`;
          // Seeded spot inside the stage's free space.
          const r = wrap.getBoundingClientRect();
          const pr = rng.fork('place');
          const fx = pr.pick([0, 0.5, 0.5, 1, pr.float(0, 1)]);
          const fy = pr.pick([0, 0.5, 0.5, 1, pr.float(0, 1)]);
          const mx = Math.min(16, Math.max(0, (size.width - r.width) / 2));
          const my = Math.min(12, Math.max(0, (size.height - r.height) / 2));
          wrap.style.left = `${Math.round(mx + fx * Math.max(0, size.width - 2 * mx - r.width))}px`;
          wrap.style.top = `${Math.round(my + fy * Math.max(0, size.height - 2 * my - r.height))}px`;
          return { anchors: [slate], sync: (m) => stroke.set(m.strokes) };
        },

        locate(t) {
          if (!t || !t.point) throw new Error(`draw-shape/chalkboard cannot locate ${JSON.stringify(t)}`);
          return stroke.locate(t.point);
        },
      });
    
    },
  }));
})();
