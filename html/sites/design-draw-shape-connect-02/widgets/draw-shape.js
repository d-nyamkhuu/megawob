// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-connect-02',
  name: 'design',
  split: 'train',
  scenarios: ['connect'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'buildConnect': (base, S) => function buildConnect(B) {
        const { drawGrid, env } = S;
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const NODE = env.taskDef.helpers.NODE;
        drawGrid(util, rng, svg, W, H, rng.pick(['dots', 'plain', 'lines']));
        const defs = util.svg('defs', {}, svg);
        const map = util.svg('g', { class: 'pixel-world-map', transform: `scale(${W / 1000} ${H / 620})` }, svg);
        const continents = [
          'M45 183 Q65 132 115 126 L151 91 204 96 238 120 256 150 241 171 264 187 250 214 218 211 198 237 169 225 147 248 121 229 100 239 79 217 54 216Z',
          'M205 250 Q239 243 265 269 L281 304 270 344 254 362 253 407 232 450 214 425 220 386 197 354 190 316Z',
          'M393 145 L425 114 467 112 489 91 524 101 552 91 590 107 623 98 658 119 692 116 730 141 748 168 724 185 687 184 670 210 635 203 610 226 578 211 551 229 522 207 492 217 468 195 439 206 419 177 396 178Z',
          'M484 252 L514 234 550 247 573 278 568 320 550 361 530 382 514 351 508 320 488 301Z',
          'M635 253 L673 235 706 244 746 228 783 244 823 236 864 257 890 286 867 310 830 314 809 342 779 327 749 348 721 323 687 327 670 301 640 298Z',
          'M80 500 L133 478 192 485 231 474 276 492 319 492 357 520 344 546 296 542 267 561 220 545 183 562 143 545 108 552 74 529Z',
          'M657 516 L711 489 772 495 817 509 864 511 901 541 873 565 827 556 789 575 746 557 701 564 665 541Z',
          'M316 190 Q329 181 341 195 L337 212 323 218Z M757 195 Q771 187 779 200 L773 215 760 214Z M889 359 Q903 351 910 363 L902 377 890 374Z'
        ];
        continents.forEach((d) => util.svg('path', { d, fill: '#e3e3ca', stroke: '#dedfc7', 'stroke-width': 1.5 }, map));
        const borders = util.svg('g', { fill: 'none', stroke: '#d4d7c3', 'stroke-width': 1.4, opacity: .85 }, map);
        [
          'M108 158 Q145 179 181 159 T235 164', 'M119 204 Q153 184 187 204 T241 194',
          'M217 278 Q244 302 265 286 M222 344 Q249 330 269 345 M226 384 Q247 372 258 387',
          'M441 149 Q476 167 506 148 T571 152 T642 145 T704 158', 'M462 184 Q496 171 529 190 T596 180 T663 188 T722 171',
          'M524 267 Q545 288 560 270 M519 321 Q542 307 565 320', 'M685 266 Q721 284 754 262 T820 271 T867 270',
          'M695 301 Q730 284 762 305 T823 295 T862 305', 'M128 511 Q177 528 218 506 T296 516', 'M714 525 Q757 540 801 521 T865 535',
          'M87 176 Q107 165 128 178 T171 171 M91 196 Q112 187 133 198 T177 192 M150 139 Q165 155 180 142 T210 147',
          'M202 268 Q221 282 241 269 T268 274 M205 296 Q225 310 249 297 T274 302 M207 326 Q228 340 253 328 M213 365 Q233 353 257 367 M219 399 Q236 388 251 401',
          'M407 143 Q431 155 455 141 T502 145 M420 164 Q447 177 471 161 T516 169 M488 129 Q508 145 531 130 T571 137 M535 145 Q558 161 583 145 T625 152 M585 170 Q607 184 633 167 T677 174 M646 132 Q667 149 690 135 T720 144',
          'M522 262 Q538 276 555 262 M516 285 Q535 299 555 285 M514 311 Q534 323 557 310 M510 337 Q530 349 550 337 M515 361 Q531 350 546 362',
          'M663 254 Q685 267 706 253 T749 260 M679 280 Q701 292 725 278 T769 285 M731 246 Q751 259 773 247 T816 254 M777 273 Q799 286 822 273 T861 281 M755 312 Q777 323 799 310 T842 319',
          'M105 501 Q126 517 148 501 T191 507 M165 532 Q190 545 214 530 T259 536 M244 495 Q264 509 287 496 T322 504',
          'M681 518 Q704 532 728 518 T773 524 M757 545 Q781 558 805 543 T851 551',
          'M284 242 Q294 238 300 247 M302 224 Q310 218 316 228 M350 207 Q356 201 362 209 M372 195 Q378 189 383 197 M735 202 Q741 196 746 205 M790 214 Q797 208 801 217 M914 391 Q922 385 926 394'
        ].forEach((d) => util.svg('path', { d }, borders));
        const mk = util.svg('marker', { id: 'dw-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto' }, defs);
        util.svg('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill: color-mix(in srgb, var(--fg) 60%, transparent)' }, mk);
        const edgesG = util.svg('g', {}, svg);
        const nodesG = util.svg('g', {}, svg);
        const delsG = util.svg('g', { class: 'dw-edge' }, svg); // remove handles above the nodes
        const rubber = util.svg('line', { class: 'dw-rubber', visibility: 'hidden' }, svg);
        const portOf = (i, kind) => [spec.nodes[i].x + (kind === 'out' ? NODE.w / 2 : -NODE.w / 2), spec.nodes[i].y];
        const rx = rng.pick([4, 8, 14]);
        const ports = {};
        spec.nodes.forEach((n, i) => {
          const g = util.svg('g', { class: 'dw-node' }, nodesG);
          g.dataset.node = String(i);
          g.dataset.role = 'node';
          const [x, y] = px([n.x - NODE.w / 2, n.y - NODE.h / 2]);
          util.svg('rect', { x, y, width: NODE.w * scale, height: NODE.h * scale, rx }, g);
          const [cx, cy] = px([n.x, n.y]);
          util.svg('text', { x: cx, y: cy }, g).textContent = n.label;
          for (const kind of ['in', 'out']) {
            const [qx, qy] = px(portOf(i, kind));
            const c = util.svg('circle', { cx: qx, cy: qy, r: 7, class: 'dw-port' }, g);
            c.dataset.role = 'port';
            c.dataset.node = String(i);
            c.dataset.kind = kind;
            ports[`${i}:${kind}`] = c;
            env.ui.track(c, {
              start(p, e) { e.stopPropagation(); rubber.setAttribute('x1', qx); rubber.setAttribute('y1', qy); },
              move(p) {
                const r = svg.getBoundingClientRect();
                rubber.setAttribute('x2', p.x - r.left);
                rubber.setAttribute('y2', p.y - r.top);
                rubber.setAttribute('visibility', 'visible');
              },
              end(p) {
                rubber.setAttribute('visibility', 'hidden');
                const hit = document.elementsFromPoint(p.x, p.y).find((el) => el.closest && el.closest('.dw-node'));
                if (!hit) return;
                const j = Number(hit.closest('.dw-node').dataset.node);
                if (j === i) return;
                const e = kind === 'out' ? [i, j] : [j, i];
                const m = ctx.model;
                if (m.edges.some((f) => f[0] === e[0] && f[1] === e[1])) return;
                ctx.log('connect', { from: e[0], to: e[1] });
                B.up({ ...m, edges: m.edges.concat([e]) });
              },
            }, 'port');
          }
        });
        let dels = {};
        function sync(m) {
          edgesG.replaceChildren();
          delsG.replaceChildren();
          dels = {};
          for (const [edgeIndex, [i, j]] of m.edges.entries()) {
            const a = px(portOf(i, 'out'));
            const b = px(portOf(j, 'in'));
            // Horizontal tangents (node-editor style); backward links bend less so they stay on the board.
            const k = b[0] > a[0] ? Math.max(40, (b[0] - a[0]) / 2) : 60;
            const c1 = [a[0] + Math.min(k, (W - a[0]) * 1.2), a[1]];
            const c2 = [b[0] - Math.min(k, b[0] * 1.2), b[1]];
            const g = util.svg('g', { class: 'dw-edge' }, edgesG);
            util.svg('path', { class: 'e', d: `M${a[0]},${a[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${b[0]},${b[1]}`, stroke: ['#18a43a','#1679e8','#ee401e'][edgeIndex % 3], 'marker-end': 'url(#dw-arrow)' }, g);
            const mid = [0.125 * a[0] + 0.375 * c1[0] + 0.375 * c2[0] + 0.125 * b[0], 0.125 * a[1] + 0.375 * c1[1] + 0.375 * c2[1] + 0.125 * b[1]];
            const del = util.svg('g', { class: 'del' }, delsG);
            del.dataset.role = 'remove-edge';
            util.svg('circle', { cx: mid[0], cy: mid[1], r: 8 }, del);
            util.svg('path', { d: `M${mid[0] - 3.5},${mid[1] - 3.5} L${mid[0] + 3.5},${mid[1] + 3.5} M${mid[0] + 3.5},${mid[1] - 3.5} L${mid[0] - 3.5},${mid[1] + 3.5}` }, del);
            del.addEventListener('click', () => {
              ctx.log('disconnect', { from: i, to: j });
              B.up({ ...ctx.model, edges: ctx.model.edges.filter((e) => !(e[0] === i && e[1] === j)) });
            });
            dels[`${i}>${j}`] = del;
          }
        }
        B.hint(rng.pick(['Drag from a node\'s right-hand dot to another node to connect them. Click × on an arrow to remove it.',
          'Connections run from the out port (right) to the in port (left). Hover an arrow to remove it.']));
        return {
          sync,
          locate(t) {
            if (t.port) return env.util.center(ports[`${t.port[0]}:${t.port[1]}`]);
            if (t.edgeDel) {
              const el = dels[`${t.edgeDel[0]}>${t.edgeDel[1]}`];
              return el ? env.util.center(el.querySelector('circle')) : null;
            }
            return null;
          },
        };
      },
      'renderCanvasboard': (base, S) => function renderCanvasboard(ctx) {
        const { CB_APPS, CB_AV, CB_BOARDS, CB_CSS, CB_FRAMES, CB_ICONS, CB_NOTES, CB_NOTE_TEXT, CB_TOOL_LABELS, env, r4 } = S;
        const { spec, util, rng, size } = ctx;
        ctx.css('cb-style', CB_CSS);
        const fam = env.taskDef;
        const v = spec.scenario;
        S.cbKey = null;
        if (S.cbView && S.cbView.off) S.cbView.off();

        // Room: the stage minus a floating end control that overlaps it.
        let W = size.width;
        let H = size.height;
        const st = ctx.stage.getBoundingClientRect();
        const sub = env.submitEl && env.submitEl.getBoundingClientRect();
        if (sub && sub.width && sub.left < st.right && sub.right > st.left && sub.top < st.bottom && sub.bottom > st.top) {
          const cutH = st.bottom - sub.top + 10;
          const cutW = st.right - sub.left + 10;
          if (cutH * W <= cutW * H) H -= cutH;
          else W -= cutW;
        }
        const appW = Math.round(Math.min(W - 2 * rng.int(4, 14), 1360));
        const appH = Math.round(Math.min(H - 2 * rng.int(4, 10), 820));
        const app = util.el('div', 'cb-app', ctx.stage);
        app.style.width = `${appW}px`;
        app.style.height = `${appH}px`;
        app.style.left = `${Math.round(rng.float(0, 1) * Math.max(0, W - appW))}px`;
        app.style.top = `${Math.round(rng.float(0, 1) * Math.max(0, H - appH))}px`;
        const cw = app.clientWidth;
        const ch = app.clientHeight;
        const canvas = util.el('canvas', 'cb-canvas', app);
        canvas.dataset.role = 'board';
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
        canvas.style.width = `${cw}px`;
        canvas.style.height = `${ch}px`;
        const g = canvas.getContext('2d');

        // Colors from the theme (canvas needs concrete values).
        const cs = getComputedStyle(app);
        const tv = (k, d) => {
          const s = (cs.getPropertyValue(`--${k}`) || '').trim();
          if (!s) return d;
          g.fillStyle = '#010203';
          g.fillStyle = s;
          return g.fillStyle === '#010203' && s !== '#010203' ? d : g.fillStyle;
        };
        const col = { bg: tv('bg', '#f4f5f7'), panel: tv('panel', '#ffffff'), fg: tv('fg', '#1d2330'), muted: tv('muted', '#6b7280'),
          line: tv('line', '#d5d9e0'), accent: tv('accent', '#2f6fed') };
        const lum = (c) => {
          const m = /^#([0-9a-f]{6})$/i.exec(c);
          if (!m) return 1;
          const n = parseInt(m[1], 16);
          return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
        };
        const dark = lum(col.bg) < 0.45;
        const font = getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif';

        // ---- DOM frame
        const head = util.el('div', 'cb-float cb-head', app);
        const appName = rng.pick(CB_APPS);
        util.el('span', 'logo', head, appName[0]);
        util.el('span', 'name', head, rng.pick(CB_BOARDS));
        util.el('span', 'crumb', head, appName);
        const share = util.el('div', 'cb-float cb-share', app);
        const people = rng.sample(['AK', 'JM', 'RT', 'SL', 'PD', 'NO'], rng.int(2, 3));
        people.forEach((p, i) => { const a = util.el('span', 'av', share, p); a.style.background = CB_AV[(i + rng.int(0, 5)) % CB_AV.length]; });
        const shareBtn = util.el('button', '', share, 'Share');
        shareBtn.type = 'button';
        shareBtn.addEventListener('click', () => ctx.log('decoy', { what: 'share' }));

        const toolsEl = util.el('div', 'cb-float cb-tools', app);
        const btn = {};
        const mkBtn = (parent, key, title, kbd) => {
          const b = util.el('button', 'cb-btn', parent);
          b.type = 'button';
          b.dataset.key = key;
          b.title = title;
          b.setAttribute('aria-label', title);
          if (CB_ICONS[key]) b.insertAdjacentHTML('beforeend', CB_ICONS[key]);
          if (kbd) util.el('kbd', '', b, kbd);
          return b;
        };
        const keyOf = (t) => (spec.keys && fam.helpers.TOOL_KEYS[t] ? fam.helpers.TOOL_KEYS[t].toUpperCase() : null);
        let tools;
        if (v === 'tool') tools = rng.bool(0.5) ? ['pen', 'line', 'rect', 'ellipse'] : ['line', 'rect', 'ellipse', 'pen'];
        else if (v === 'erase') tools = rng.bool(0.5) ? ['pen', 'eraser'] : ['eraser', 'pen'];
        else if (v === 'connect') tools = ['select'];
        else tools = ['pen'];
        const decoys = v === 'connect' ? ['sticky', 'text'] : rng.bool(0.5) ? ['sticky'] : ['text'];
        for (const t of ['hand', ...tools]) {
          btn[t] = mkBtn(toolsEl, t, CB_TOOL_LABELS[t], keyOf(t));
          btn[t].dataset.role = 'tool';
        }
        for (const t of decoys) {
          const b = mkBtn(toolsEl, t, CB_TOOL_LABELS[t]);
          b.addEventListener('click', () => ctx.log('decoy', { what: t }));
        }
        const ctl = {};
        if (v === 'tool' || v === 'erase' || v === 'multi') {
          util.el('span', 'sep', toolsEl);
          ctl.undo = mkBtn(toolsEl, 'undo', 'Undo', spec.keys && v !== 'multi' ? '⌃Z' : null);
          ctl.undo.dataset.role = 'control';
          if (v === 'multi') {
            ctl.clear = mkBtn(toolsEl, 'clear', rng.pick(['Clear', 'Clear all']));
            ctl.clear.dataset.role = 'control';
          }
        }
        const zoomEl = util.el('div', 'cb-float cb-zoom', app);
        const zOut = mkBtn(zoomEl, 'zout', 'Zoom out');
        zOut.textContent = '−';
        const pct = util.el('span', 'pct', zoomEl, '100%');
        const zIn = mkBtn(zoomEl, 'zin', 'Zoom in');
        zIn.textContent = '+';
        const zFit = mkBtn(zoomEl, 'fit', 'Zoom to fit');
        const hints = {
          line: 'Press and drag on the frame to draw; a new stroke replaces the last one.',
          circle: 'Press and drag on the frame to draw; a new stroke replaces the last one.',
          trace: 'Press and drag on the frame to draw; a new stroke replaces the last one.',
          tool: 'Pick a tool, then drag on the frame. Undo removes the last shape.',
          connect: 'Drag from a note’s right-hand dot onto another note to connect them. Hover a connector for its ×.',
          erase: 'The eraser deletes any doodle it touches. Undo brings it back.',
          multi: 'Every stroke stays and counts. Undo removes the last one.',
        };
        const hintEl = util.el('div', 'cb-float cb-hint', app, `${hints[v]} Hand tool or middle-drag pans.`);

        // ---- free area for the frame (inside the floating frame)
        const ar = app.getBoundingClientRect();
        const rel = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - ar.left, t: r.top - ar.top, r: r.right - ar.left, b: r.bottom - ar.top }; };
        const zr = rel(zoomEl);
        hintEl.style.maxWidth = `${Math.max(120, zr.l - 26)}px`;
        const free = { x: rel(toolsEl).r + 18, y: Math.max(rel(head).b, rel(share).b) + 30, r: cw - 18, b: Math.min(zr.t, rel(hintEl).t) - 16 };
        const bw = spec.board.w;
        const bh = spec.board.h;
        const fitK = Math.min((free.r - free.x) / bw, (free.b - free.y) / bh);
        const cam = { k: 0, x: 0, y: 0 };
        let k0 = fitK;
        function fit(frac, fx, fy) {
          cam.k = fitK * frac;
          cam.x = free.x + (free.r - free.x - bw * cam.k) * fx;
          cam.y = free.y + (free.b - free.y - bh * cam.k) * fy;
        }
        fit(rng.float(0.84, 0.97), rng.float(0.25, 0.75), rng.float(0.3, 0.7));
        k0 = cam.k;
        const K100 = rng.pick([440, 480, 520]); // px per board unit shown as 100%
        const toS = ([x, y]) => [cam.x + x * cam.k, cam.y + y * cam.k];
        const toB = ([x, y]) => [(x - cam.x) / cam.k, (y - cam.y) / cam.k];
        const z = () => cam.k / k0; // zoom relative to the start (stroke widths, text)
        const vp = (s) => { const r = canvas.getBoundingClientRect(); return [r.left + s[0], r.top + s[1]]; };
        const local = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
        const clampB = ([x, y]) => [r4(Math.min(bw, Math.max(0, x))), r4(Math.min(bh, Math.max(0, y)))];

        // ---- world clutter outside the frame (seeded): notes, shapes and a second frame
        const cr = rng.fork('clutter');
        const clutter = [];
        const frame2 = cr.bool(0.6) ? { x: bw + cr.float(0.3, 0.45), y: cr.float(-0.1, 0.25), w: cr.float(0.7, 1.0), h: cr.float(0.6, 0.85), name: cr.pick(['Frame 2', 'Parking lot', 'Archive', 'Ideas']) } : null;
        const nClutter = cr.int(4, 7);
        for (let i = 0; i < nClutter; i++) {
          const side = cr.pick(['left', 'left', 'below', 'above', 'right']);
          const w = cr.float(0.16, 0.24);
          let x;
          let y;
          if (side === 'left') { x = -w - cr.float(0.12, 0.6); y = cr.float(-0.2, bh); }
          else if (side === 'right') { x = bw + cr.float(0.12, 0.2); y = cr.float(-0.2, bh); }
          else if (side === 'below') { x = cr.float(-0.2, bw); y = bh + cr.float(0.14, 0.4); }
          else { x = cr.float(-0.2, bw); y = -w - cr.float(0.2, 0.4); }
          if (frame2 && x + w > frame2.x - 0.05 && x < frame2.x + frame2.w + 0.05 && y + w > frame2.y - 0.05 && y < frame2.y + frame2.h + 0.05) continue;
          clutter.push({ kind: cr.pick(['note', 'note', 'note', 'shape']), x, y, w, h: w, color: cr.pick(CB_NOTES), text: cr.pick(CB_NOTE_TEXT), rot: cr.float(-0.05, 0.05) });
        }
        if (frame2) for (let i = 0; i < cr.int(2, 3); i++) {
          const w = cr.float(0.16, 0.2);
          clutter.push({ kind: 'note', x: frame2.x + 0.06 + i * (w + 0.05), y: frame2.y + cr.float(0.08, frame2.h - w - 0.05), w, h: w, color: cr.pick(CB_NOTES), text: cr.pick(CB_NOTE_TEXT), rot: cr.float(-0.04, 0.04) });
        }
        const frameName = rng.pick(CB_FRAMES);
        const paper = v === 'erase' && dark ? '#f3f2ee' : col.panel; // the doodles' ink colors need a light page
        const gridStep = rng.pick([0.04, 0.05, 0.0625]);
        const inkCol = v === 'erase' ? '#25262b' : rng.pick([col.accent, '#1c63d6', '#c2255c', '#2b8a3e']);
        const inkW = rng.pick([3, 3.5, 4]);
        const noteCols = (spec.nodes || []).map(() => rng.pick(CB_NOTES));
        const eraseW = rng.pick([4, 5, 6]);

        // ---- drawing helpers (canvas px)
        function text(s, x, y, size, color, weight = 700, align = 'center', halo = paper) {
          g.font = `${weight} ${size}px ${font}`;
          g.textAlign = align;
          g.textBaseline = 'middle';
          if (halo) { g.lineWidth = 4; g.strokeStyle = halo; g.lineJoin = 'round'; g.strokeText(s, x, y); }
          g.fillStyle = color;
          g.fillText(s, x, y);
        }
        function dotAt(p, hollow) {
          const [x, y] = toS(p);
          g.beginPath();
          if (hollow) {
            g.arc(x, y, 7.5, 0, 2 * Math.PI);
            g.fillStyle = paper;
            g.fill();
            g.lineWidth = 2.5;
            g.strokeStyle = col.fg;
            g.stroke();
            return;
          }
          g.arc(x, y, 9, 0, 2 * Math.PI);
          g.fillStyle = paper;
          g.fill();
          g.beginPath();
          g.arc(x, y, 6.5, 0, 2 * Math.PI);
          g.fillStyle = col.fg;
          g.fill();
        }
        const unitV = (a, b) => { const dx = a[0] - b[0]; const dy = a[1] - b[1]; const l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
        function labelAt(p, d, s, small, off = 20) {
          const [x, y] = toS(p);
          const [fx0, fy0] = toS([0, 0]);
          const [fx1, fy1] = toS([bw, bh]);
          const lx = Math.min(fx1 - 16, Math.max(fx0 + 16, x + d[0] * off));
          const ly = Math.min(fy1 - 10, Math.max(fy0 + 12, y + d[1] * off));
          if (small) text(s.toUpperCase(), lx, ly, 12, col.muted, 600);
          else text(s, lx, ly, 15, col.fg, 700);
        }
        function poly(pts, color, width, dash, alpha = 1) {
          if (!pts || pts.length < 1) return;
          g.save();
          g.globalAlpha = alpha;
          g.beginPath();
          pts.forEach((p, i) => { const [x, y] = toS(p); if (i) g.lineTo(x, y); else g.moveTo(x, y); });
          if (pts.length === 1) { const [x, y] = toS(pts[0]); g.lineTo(x + 0.01, y); }
          g.lineWidth = width;
          g.strokeStyle = color;
          g.lineCap = 'round';
          g.lineJoin = 'round';
          g.setLineDash(dash || []);
          g.stroke();
          g.restore();
        }
        function arrowRoute(path) {
          poly(path, col.muted, 16, null, 0.18);
          poly(path, col.muted, 2, [6, 6]);
          const tip = toS(path[path.length - 1]);
          const d = unitV(toS(path[path.length - 1]), toS(path[path.length - 2]));
          const n = [-d[1], d[0]];
          const back = [tip[0] - d[0] * 18, tip[1] - d[1] * 18];
          g.beginPath();
          g.moveTo(tip[0], tip[1]);
          g.lineTo(back[0] + n[0] * 9, back[1] + n[1] * 9);
          g.lineTo(back[0] - n[0] * 9, back[1] - n[1] * 9);
          g.closePath();
          g.fillStyle = col.fg;
          g.fill();
          g.lineWidth = 1.5;
          g.strokeStyle = paper;
          g.stroke();
        }
        function dashedCircle(c, r) {
          const [x, y] = toS(c);
          g.save();
          g.beginPath();
          g.arc(x, y, r * cam.k, 0, 2 * Math.PI);
          g.lineWidth = 2;
          g.strokeStyle = col.muted;
          g.globalAlpha = 0.8;
          g.setLineDash([8, 7]);
          g.stroke();
          g.restore();
        }
        function item(it, color, width, dash, alpha) {
          const p = it.pts;
          if (!p || !p.length) return;
          if (it.kind === 'pen') { poly(p, color, width, dash, alpha); return; }
          if (it.kind === 'line') { poly([p[0], p[p.length - 1]], color, width, dash, alpha); return; }
          const [x0, y0] = toS(p[0]);
          const [x1, y1] = toS(p[p.length - 1]);
          g.save();
          g.globalAlpha = alpha ?? 1;
          g.beginPath();
          if (it.kind === 'rect') g.rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
          else g.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, 0, 2 * Math.PI);
          g.lineWidth = width;
          g.strokeStyle = color;
          g.lineJoin = 'round';
          g.setLineDash(dash || []);
          g.stroke();
          g.restore();
        }
        function sticky(x, y, w, h, color, label, rot, size) {
          // x, y, w, h in canvas px (top-left box)
          g.save();
          g.translate(x + w / 2, y + h / 2);
          g.rotate(rot || 0);
          g.shadowColor = 'rgba(0,0,0,.18)';
          g.shadowBlur = 8;
          g.shadowOffsetY = 3;
          g.fillStyle = color;
          g.beginPath();
          const f = Math.min(12, w * 0.14);
          g.moveTo(-w / 2, -h / 2);
          g.lineTo(w / 2, -h / 2);
          g.lineTo(w / 2, h / 2 - f);
          g.lineTo(w / 2 - f, h / 2);
          g.lineTo(-w / 2, h / 2);
          g.closePath();
          g.fill();
          g.shadowColor = 'transparent';
          g.fillStyle = 'rgba(0,0,0,.08)';
          g.beginPath();
          g.moveTo(w / 2, h / 2 - f);
          g.lineTo(w / 2 - f, h / 2 - f);
          g.lineTo(w / 2 - f, h / 2);
          g.closePath();
          g.fill();
          if (label) {
            let s = size;
            g.font = `600 ${s}px ${font}`;
            while (s > 8 && g.measureText(label).width > w - 12) { s -= 1; g.font = `600 ${s}px ${font}`; }
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillStyle = '#26221a';
            g.fillText(label, 0, 0);
          }
          g.restore();
        }

        // ---- connect geometry (board units -> canvas px)
        const NODE = fam.helpers.NODE;
        const portOf = (i, kind) => [spec.nodes[i].x + (kind === 'out' ? NODE.w / 2 : -NODE.w / 2), spec.nodes[i].y];
        function edgeGeom(i, j) {
          const a = toS(portOf(i, 'out'));
          const b = toS(portOf(j, 'in'));
          const Wl = toS([0, 0])[0];
          const Wr = toS([bw, 0])[0];
          const kk = b[0] > a[0] ? Math.max(40 * z(), (b[0] - a[0]) / 2) : 60 * z();
          const c1 = [a[0] + Math.min(kk, (Wr - a[0]) * 1.2), a[1]];
          const c2 = [b[0] - Math.min(kk, (b[0] - Wl) * 1.2), b[1]];
          const at = (t) => {
            const u = 1 - t;
            return [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
              u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]];
          };
          return { a, b, c1, c2, at, mid: at(0.5) };
        }
        const noteRect = (i) => {
          const [x, y] = toS([spec.nodes[i].x - NODE.w / 2, spec.nodes[i].y - NODE.h / 2]);
          return { x, y, w: NODE.w * cam.k, h: NODE.h * cam.k };
        };
        const portR = () => Math.max(5, Math.min(8, 6 * z()));

        // ---- paint
        let hover = null; // { edge: 'i>j' } | { port: 'i:kind' }
        let live = null; // the gesture being drawn: { kind, pts, ... }
        function paint() {
          const m = ctx.model;
          g.setTransform(dpr, 0, 0, dpr, 0, 0);
          g.fillStyle = col.bg;
          g.fillRect(0, 0, cw, ch);
          // infinite dot grid in world space
          let step = gridStep;
          while (step * cam.k < 12) step *= 2;
          const [wx0, wy0] = toB([0, 0]);
          const [wx1, wy1] = toB([cw, ch]);
          g.fillStyle = col.line;
          const rad = Math.max(0.8, Math.min(1.6, 1.2 * z()));
          for (let gx = Math.floor(wx0 / step) * step; gx <= wx1; gx += step) {
            for (let gy = Math.floor(wy0 / step) * step; gy <= wy1; gy += step) {
              const [x, y] = toS([gx, gy]);
              g.fillRect(x - rad, y - rad, 2 * rad, 2 * rad);
            }
          }
          // clutter
          if (frame2 && v !== 'connect') {
            const [x, y] = toS([frame2.x, frame2.y]);
            g.fillStyle = col.panel;
            g.globalAlpha = 0.85;
            g.fillRect(x, y, frame2.w * cam.k, frame2.h * cam.k);
            g.globalAlpha = 1;
            g.strokeStyle = col.line;
            g.lineWidth = 1;
            g.strokeRect(x, y, frame2.w * cam.k, frame2.h * cam.k);
            text(frame2.name, x, y - 11, 12, col.muted, 600, 'left', null);
          }
          if (v !== 'connect') for (const c of clutter) {
            const [x, y] = toS([c.x, c.y]);
            if (c.kind === 'note') sticky(x, y, c.w * cam.k, c.h * cam.k, c.color, c.text, c.rot, Math.max(9, 13 * z()));
            else {
              g.save();
              g.strokeStyle = col.muted;
              g.globalAlpha = 0.7;
              g.lineWidth = 2;
              g.beginPath();
              g.ellipse(x + c.w * cam.k / 2, y + c.h * cam.k / 2, c.w * cam.k / 2, c.h * cam.k / 3, 0, 0, 2 * Math.PI);
              g.stroke();
              g.restore();
            }
          }
          // the frame
          const [fx, fy] = toS([0, 0]);
          const fw = bw * cam.k;
          const fh = bh * cam.k;
          g.save();
          g.shadowColor = dark ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.12)';
          g.shadowBlur = 14;
          g.shadowOffsetY = 3;
          g.fillStyle = paper;
          g.fillRect(fx, fy, fw, fh);
          g.restore();
          g.strokeStyle = col.line;
          g.lineWidth = 1;
          g.strokeRect(fx + 0.5, fy + 0.5, fw - 1, fh - 1);
          text(frameName, fx, fy - 12, 12, col.muted, 600, 'left', null);
          g.save();
          g.beginPath();
          g.rect(fx, fy, fw, fh);
          g.clip();
          paintScenario(m);
          g.restore();
          if (v === 'connect') paintConnect(m); // notes and ports may sit at the frame edge
          pct.textContent = `${Math.round((cam.k / K100) * 100)}%`;
        }

        function paintScenario(m) {
          if (v === 'line') {
            if (spec.mode === 'connect') {
              dotAt(spec.a);
              dotAt(spec.b);
              labelAt(spec.a, unitV(spec.a, spec.b), 'A');
              labelAt(spec.b, unitV(spec.b, spec.a), 'B');
            } else {
              if (spec.dir === 'guide') {
                const d = [Math.cos(spec.angle), Math.sin(spec.angle)];
                const h = spec.guide.len / 2;
                const a = [spec.guide.c[0] - d[0] * h, spec.guide.c[1] - d[1] * h];
                const b = [spec.guide.c[0] + d[0] * h, spec.guide.c[1] + d[1] * h];
                poly([a, b], col.muted, 4);
                for (const e of [a, b]) { const [x, y] = toS(e); g.beginPath(); g.arc(x, y, 4, 0, 2 * Math.PI); g.fillStyle = col.muted; g.fill(); }
                const nrm = [-d[1], d[0]];
                labelAt(spec.guide.c, nrm[1] > 0 ? [-nrm[0], -nrm[1]] : nrm, 'guide', true, 18);
              }
              const [x, y] = toS(spec.p);
              g.save();
              g.beginPath();
              g.arc(x, y, 15, 0, 2 * Math.PI);
              g.setLineDash([3, 4]);
              g.lineWidth = 1.5;
              g.strokeStyle = col.muted;
              g.stroke();
              g.restore();
              dotAt(spec.p);
            }
            const k = (m.strokes || [])[m.strokes.length - 1];
            poly(live ? live.pts : k, inkCol, inkW * z());
          } else if (v === 'circle') {
            if (spec.show === 'guide') {
              dashedCircle(spec.c, spec.r);
              dotAt(spec.c);
              if (spec.rimDot) dotAt(spec.rim, true);
            } else {
              dotAt(spec.c);
              dotAt(spec.rim, true);
            }
            const k = (m.strokes || [])[m.strokes.length - 1];
            poly(live ? live.pts : k, inkCol, inkW * z());
          } else if (v === 'trace') {
            arrowRoute(spec.path);
            dotAt(spec.path[0]);
            labelAt(spec.path[0], unitV(spec.path[0], spec.path[1]), 'start', true, 24);
            const k = (m.strokes || [])[m.strokes.length - 1];
            poly(live ? live.pts : k, inkCol, inkW * z());
          } else if (v === 'tool') {
            if (spec.target === 'line') {
              dotAt(spec.a);
              dotAt(spec.b);
              labelAt(spec.a, unitV(spec.a, spec.b), 'A');
              labelAt(spec.b, unitV(spec.b, spec.a), 'B');
            } else if (spec.target === 'pen') {
              arrowRoute(spec.path);
              dotAt(spec.path[0]);
              labelAt(spec.path[0], unitV(spec.path[0], spec.path[1]), 'start', true, 24);
            } else if (spec.show === 'outline') {
              const [x0, y0] = toS(spec.a);
              const [x1, y1] = toS(spec.b);
              g.save();
              g.setLineDash([7, 6]);
              g.lineWidth = 2;
              g.strokeStyle = col.muted;
              g.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
              g.restore();
              g.fillStyle = col.muted;
              for (const [cx, cy] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) g.fillRect(cx - 3.5, cy - 3.5, 7, 7);
            } else {
              dotAt(spec.a);
              dotAt(spec.b);
            }
            for (const it of m.items || []) item(it, it.kind === 'pen' ? col.fg : inkCol, inkW * z(), null, it.kind === 'pen' ? 0.85 : 1);
            if (live && live.pts.length >= 2) {
              const t = m.tool;
              item(t === 'pen' ? { kind: 'pen', pts: live.pts } : { kind: t, pts: [live.pts[0], live.pts[live.pts.length - 1]] }, inkCol, inkW * z(), t === 'pen' ? null : [5, 4], 0.8);
            }
          } else if (v === 'erase') {
            spec.strokes.forEach((s, i) => { if (!(m.erased || []).includes(i)) poly(s.pts, fam.helpers.INKS[s.color], eraseW * z()); });
            for (const s of m.drawn || []) poly(s, '#25262b', 3 * z());
            if (live && m.tool === 'pen') poly(live.pts, '#25262b', 3 * z(), null, 0.7);
          } else if (v === 'multi') {
            for (const t of spec.targets) {
              if (t.type === 'line') {
                dotAt(t.a);
                dotAt(t.b);
                labelAt(t.a, unitV(t.a, t.b), t.labels[0]);
                labelAt(t.b, unitV(t.b, t.a), t.labels[1]);
              } else {
                dashedCircle(t.c, t.r);
                dotAt(t.c);
              }
            }
            for (const s of m.strokes || []) poly(s, inkCol, inkW * z()); // a live stroke is already the model's last
          }
        }

        function paintConnect(m) {
          // Connect uses a cartographic paper board; node and port coordinates stay unchanged.
          g.save();
          g.fillStyle='#f2f0dc';g.fillRect(0,0,cw,ch);g.fillStyle='#e2e2c9';g.globalAlpha=.78;
          const land=[
            [[.04,.27],[.08,.19],[.14,.17],[.18,.11],[.24,.13],[.28,.19],[.25,.24],[.30,.27],[.26,.33],[.21,.31],[.19,.38],[.14,.35],[.12,.41],[.08,.37],[.07,.31]],
            [[.21,.40],[.27,.40],[.30,.46],[.29,.53],[.26,.57],[.26,.64],[.23,.70],[.20,.64],[.22,.58],[.18,.52],[.20,.47]],
            [[.39,.22],[.43,.17],[.49,.16],[.52,.13],[.57,.16],[.62,.14],[.67,.18],[.73,.17],[.77,.21],[.75,.25],[.70,.27],[.67,.32],[.62,.29],[.59,.34],[.55,.30],[.51,.33],[.47,.28],[.43,.30],[.41,.26]],
            [[.49,.36],[.53,.33],[.57,.36],[.59,.42],[.57,.49],[.54,.55],[.52,.50],[.51,.44],[.48,.41]],
            [[.64,.39],[.68,.36],[.73,.38],[.78,.35],[.83,.38],[.89,.38],[.92,.43],[.87,.47],[.82,.48],[.79,.53],[.75,.50],[.71,.52],[.68,.47],[.64,.46]],
            [[.06,.81],[.13,.78],[.20,.80],[.25,.78],[.31,.81],[.37,.82],[.40,.87],[.36,.90],[.30,.89],[.26,.92],[.19,.89],[.14,.91],[.09,.88]],
            [[.66,.83],[.72,.80],[.79,.81],[.84,.84],[.90,.85],[.93,.89],[.87,.92],[.81,.90],[.76,.93],[.70,.90],[.65,.87]]
          ];
          for(const pts of land){g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x*cw,y*ch):g.moveTo(x*cw,y*ch));g.closePath();g.fill();}
          g.globalAlpha=1;g.strokeStyle='#cbd0c2';g.lineWidth=1;g.setLineDash([5,4]);
          for(let x=cw*.08;x<cw;x+=cw*.125){g.beginPath();g.moveTo(x,0);g.lineTo(x,ch);g.stroke();}
          for(let y=ch*.1;y<ch;y+=ch*.125){g.beginPath();g.moveTo(0,y);g.lineTo(cw,y);g.stroke();}
          g.setLineDash([]);g.restore();
          // connectors under the notes, remove handles above them
          const arrow = (e) => {
            const d = unitV(e.b, e.at(0.96));
            const n = [-d[1], d[0]];
            const back = [e.b[0] - d[0] * 10, e.b[1] - d[1] * 10];
            g.beginPath();
            g.moveTo(e.b[0], e.b[1]);
            g.lineTo(back[0] + n[0] * 5, back[1] + n[1] * 5);
            g.lineTo(back[0] - n[0] * 5, back[1] - n[1] * 5);
            g.closePath();
            g.fill();
          };
          const edges = (m.edges || []).map(([i, j]) => ({ i, j, e: edgeGeom(i, j) }));
          g.save();
          g.strokeStyle = '#19a536';
          g.fillStyle = '#19a536';
          g.globalAlpha = 0.65;
          g.lineWidth = Math.max(2.5,3*z());
          for (const [edgeIndex,{ e }] of edges.entries()) {
            g.strokeStyle=['#18a43a','#1679e8','#ee401e'][edgeIndex%3];g.fillStyle=g.strokeStyle;
            g.beginPath();
            g.moveTo(e.a[0], e.a[1]);
            g.bezierCurveTo(e.c1[0], e.c1[1], e.c2[0], e.c2[1], e.b[0], e.b[1]);
            g.stroke();
            arrow(e);
          }
          g.restore();
          const size = Math.max(10, Math.min(20, 0.05 * cam.k));
          spec.nodes.forEach((n, i) => {
            const r = noteRect(i);
            g.save();g.fillStyle='#fff';g.strokeStyle='#0a2d57';g.lineWidth=2.5;g.fillRect(r.x,r.y,r.w,r.h);g.strokeRect(r.x,r.y,r.w,r.h);
            const headH=Math.min(22,r.h*.32);g.fillStyle='#fff';g.fillRect(r.x+1,r.y+1,r.w-2,headH);
            g.fillStyle='#edf5fb';g.fillRect(r.x+6,r.y+headH,r.w-12,r.h-headH-4);
            g.fillStyle='#092b59';g.font=`bold ${Math.max(11,Math.min(17,size))}px ${font}`;g.textAlign='center';g.textBaseline='middle';g.fillText(n.label,r.x+r.w/2,r.y+headH*.48);
            const baseY=r.y+r.h*.83,unit=Math.max(2,Math.min(5,r.w*.035));g.fillStyle=['#d48436','#517b9e','#c66e34','#557c66'][i%4];
            for(let k=0;k<5;k++){const bh=unit*(2+(i*3+k*5)%5);g.fillRect(r.x+r.w*.2+k*unit*2.2,baseY-bh,unit*1.5,bh);}
            g.fillStyle='#173b62';g.fillRect(r.x+r.w*.48,baseY-unit*2,unit*.7,unit*2);g.restore();
            for (const kind of ['in', 'out']) {
              const [x, y] = toS(portOf(i, kind));
              const on = hover && hover.port === `${i}:${kind}`;
              g.beginPath();
              g.arc(x, y, portR() + (on ? 2 : 0), 0, 2 * Math.PI);
              g.fillStyle = on ? col.accent : (kind === 'in' ? '#1679e8' : '#19a536');
              g.fill();
              g.lineWidth = 2;
              g.strokeStyle = on ? col.accent : col.fg;
              g.stroke();
            }
          });
          for (const { i, j, e } of edges) {
            const on = hover && hover.edge === `${i}>${j}`;
            g.save();
            g.globalAlpha = on ? 1 : 0.35;
            g.beginPath();
            g.arc(e.mid[0], e.mid[1], 8, 0, 2 * Math.PI);
            g.fillStyle = on ? '#e03131' : col.panel;
            g.fill();
            g.lineWidth = 1.5;
            g.strokeStyle = on ? '#e03131' : col.muted;
            g.stroke();
            g.beginPath();
            g.moveTo(e.mid[0] - 3.5, e.mid[1] - 3.5);
            g.lineTo(e.mid[0] + 3.5, e.mid[1] + 3.5);
            g.moveTo(e.mid[0] + 3.5, e.mid[1] - 3.5);
            g.lineTo(e.mid[0] - 3.5, e.mid[1] + 3.5);
            g.strokeStyle = on ? '#fff' : col.fg;
            g.stroke();
            g.restore();
          }
          if (live && live.kind === 'link') {
            g.save();
            g.setLineDash([6, 5]);
            g.lineWidth = 2;
            g.strokeStyle = col.accent;
            g.beginPath();
            g.moveTo(live.from[0], live.from[1]);
            g.lineTo(live.cur[0], live.cur[1]);
            g.stroke();
            g.restore();
          }
        }

        // ---- model updates
        function up(m) {
          ctx.update(m);
          sync(ctx.model);
        }
        let hand = false;
        function sync(m) {
          for (const t of Object.keys(btn)) {
            const on = t === 'hand' ? hand : !hand && (v === 'tool' || v === 'erase' ? m.tool === t : true);
            btn[t].setAttribute('aria-pressed', String(on));
          }
          if (ctl.undo) ctl.undo.disabled = v === 'tool' ? !(m.items || []).length : v === 'erase' ? !(m.ops || []).length : !(m.strokes || []).length;
          if (ctl.clear) ctl.clear.disabled = !(m.strokes || []).length;
          canvas.style.cursor = hand ? 'grab' : v === 'connect' ? 'default' : v === 'erase' && m.tool === 'eraser' ? 'cell' : 'crosshair';
          paint();
        }
        const undo = () => {
          const m = ctx.model;
          if (v === 'tool') { if (m.items.length) up({ ...m, items: m.items.slice(0, -1) }); return; }
          if (v === 'multi') { if (m.strokes.length) up({ strokes: m.strokes.slice(0, -1) }); return; }
          const op = m.ops[m.ops.length - 1];
          if (!op) return;
          const ops = m.ops.slice(0, -1);
          if (op[0] === 'e') up({ ...m, ops, erased: m.erased.filter((i) => i !== op[1]) });
          else up({ ...m, ops, drawn: m.drawn.slice(0, -1) });
        };
        btn.hand.addEventListener('click', () => { hand = !hand; ctx.log('tool', { tool: hand ? 'hand' : 'off' }); sync(ctx.model); });
        for (const t of tools) {
          btn[t].addEventListener('click', () => {
            hand = false;
            ctx.log('tool', { tool: t });
            if (v === 'tool' || v === 'erase') up({ ...ctx.model, tool: t });
            else sync(ctx.model);
          });
        }
        if (ctl.undo) ctl.undo.addEventListener('click', undo);
        if (ctl.clear) ctl.clear.addEventListener('click', () => { if (ctx.model.strokes.length) up({ strokes: [] }); });
        if (spec.keys && (v === 'tool' || v === 'erase')) {
          S.cbKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); return; }
            if (e.ctrlKey || e.metaKey) return;
            const t = tools.find((k) => fam.helpers.TOOL_KEYS[k] === e.key.toLowerCase());
            if (t) { hand = false; up({ ...ctx.model, tool: t }); }
          };
        }
        function zoomBy(f) {
          const kmin = k0 * 0.45;
          const kmax = k0 * 2.6;
          const nk = Math.min(kmax, Math.max(kmin, cam.k * f));
          const c = [(free.x + free.r) / 2, (free.y + free.b) / 2];
          const w = toB(c);
          cam.k = nk;
          cam.x = c[0] - w[0] * nk;
          cam.y = c[1] - w[1] * nk;
          ctx.log('zoom', { pct: Math.round((nk / K100) * 100) });
          paint();
        }
        zIn.addEventListener('click', () => zoomBy(1.25));
        zOut.addEventListener('click', () => zoomBy(0.8));
        zFit.addEventListener('click', () => { fit(0.92, 0.5, 0.5); ctx.log('zoom', { fit: true }); paint(); });

        // ---- hit testing
        const near = (a, b, r) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= r;
        function portAt(s) {
          for (let i = spec.nodes.length - 1; i >= 0; i--) {
            for (const kind of ['out', 'in']) if (near(toS(portOf(i, kind)), s, portR() + 5)) return { i, kind };
          }
          return null;
        }
        function edgeHandleAt(s) {
          for (const [i, j] of ctx.model.edges || []) if (near(edgeGeom(i, j).mid, s, 10)) return [i, j];
          return null;
        }
        function edgeNear(s) {
          for (const [i, j] of ctx.model.edges || []) {
            const e = edgeGeom(i, j);
            for (let t = 0; t <= 1.0001; t += 1 / 24) if (near(e.at(t), s, 7)) return [i, j];
          }
          return null;
        }
        function noteAt(s) {
          for (let i = spec.nodes.length - 1; i >= 0; i--) {
            const r = noteRect(i);
            const pad = portR() + 4;
            if (s[0] >= r.x - pad && s[0] <= r.x + r.w + pad && s[1] >= r.y && s[1] <= r.y + r.h) return i;
          }
          return -1;
        }
        // erase: a doodle within 10 px of p (board units through the camera)
        let erasedNow = 0;
        function eraseAt(points) {
          const R = 10 / cam.k;
          let m = ctx.model;
          let changed = false;
          for (; erasedNow < points.length; erasedNow++) {
            const p = points[erasedNow];
            spec.strokes.forEach((s, i) => {
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
                  ctx.log('erase', { stroke: i });
                  return;
                }
              }
            });
          }
          if (changed) up(m);
        }

        // ---- pointer
        let drag = null;
        function inkLive() {
          const pts = live.pts.slice();
          if (v === 'line' || v === 'circle' || v === 'trace' || v === 'multi') ctx.update({ strokes: live.base.concat([pts]) });
          else if (v === 'erase' && ctx.model.tool === 'eraser') { eraseAt(live.pts); return; }
          paint();
        }
        function inkEnd() {
          const pts = live.pts.slice();
          const kind = v;
          live = null;
          ctx.log('stroke', { phase: 'end', points: pts.length });
          if (kind === 'line' || kind === 'circle' || kind === 'trace' || kind === 'multi') up({ strokes: ctx.model.strokes.slice(0, -1).concat([pts]) });
          else if (kind === 'tool') {
            const it = fam.helpers.itemFromStroke(ctx.model.tool, pts);
            if (it) up({ ...ctx.model, items: ctx.model.items.concat([it]) });
            else paint();
          } else if (kind === 'erase') {
            if (ctx.model.tool === 'eraser') { eraseAt(pts); erasedNow = 0; paint(); return; }
            erasedNow = 0;
            if (pts.length >= 2) up({ ...ctx.model, drawn: ctx.model.drawn.concat([pts]), ops: ctx.model.ops.concat([['d']]) });
            else paint();
          }
        }
        const onDown = (e) => {
          if (drag) return;
          const s = local(e);
          if (e.button === 1 || (e.button === 0 && hand)) {
            e.preventDefault();
            drag = { kind: 'pan', s0: s, c0: { ...cam } };
            canvas.style.cursor = 'grabbing';
          } else if (e.button === 0) {
            if (v === 'connect') {
              const p = portAt(s);
              const del = !p && edgeHandleAt(s);
              if (p) {
                drag = { kind: 'link', i: p.i, port: p.kind };
                live = { kind: 'link', from: toS(portOf(p.i, p.kind)), cur: s };
              } else if (del) drag = { kind: 'del', edge: del, s0: s };
              else if (noteAt(s) < 0) drag = { kind: 'pan', s0: s, c0: { ...cam } };
              else return;
            } else {
              const p = clampB(toB(s));
              drag = { kind: 'ink', last: s };
              live = { kind: 'ink', pts: [p], base: (ctx.model.strokes || []).slice() };
              erasedNow = 0;
              ctx.log('stroke', { phase: 'start' });
              inkLive();
            }
          } else return;
          canvas.setPointerCapture(e.pointerId);
        };
        const onMove = (e) => {
          const s = local(e);
          if (!drag) {
            if (v !== 'connect') return;
            const p = portAt(s);
            const ed = !p && (edgeHandleAt(s) || edgeNear(s));
            const h = p ? { port: `${p.i}:${p.kind}` } : ed ? { edge: `${ed[0]}>${ed[1]}` } : null;
            if (JSON.stringify(h) !== JSON.stringify(hover)) { hover = h; paint(); }
            canvas.style.cursor = hand ? 'grab' : p ? 'crosshair' : ed && edgeHandleAt(s) ? 'pointer' : 'default';
            return;
          }
          if (drag.kind === 'pan') {
            cam.x = drag.c0.x + s[0] - drag.s0[0];
            cam.y = drag.c0.y + s[1] - drag.s0[1];
            paint();
          } else if (drag.kind === 'link') {
            live.cur = s;
            paint();
          } else if (drag.kind === 'ink') {
            const evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
            let added = false;
            for (const ce of evs.length ? evs : [e]) {
              const q = local(ce);
              if (Math.hypot(q[0] - drag.last[0], q[1] - drag.last[1]) < 1) continue;
              drag.last = q;
              live.pts.push(clampB(toB(q)));
              added = true;
            }
            if (added) inkLive();
          }
        };
        const onUp = (e) => {
          if (!drag) return;
          const d = drag;
          drag = null;
          const s = local(e);
          try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
          if (d.kind === 'pan') {
            if (s[0] !== d.s0[0] || s[1] !== d.s0[1]) ctx.log('pan', { dx: Math.round(s[0] - d.s0[0]), dy: Math.round(s[1] - d.s0[1]) });
            sync(ctx.model);
          } else if (d.kind === 'link') {
            live = null;
            const j = noteAt(s);
            if (j >= 0 && j !== d.i) {
              const edge = d.port === 'out' ? [d.i, j] : [j, d.i];
              const m = ctx.model;
              if (!m.edges.some((f) => f[0] === edge[0] && f[1] === edge[1])) {
                ctx.log('connect', { from: edge[0], to: edge[1] });
                up({ ...m, edges: m.edges.concat([edge]) });
                return;
              }
            }
            paint();
          } else if (d.kind === 'del') {
            const [i, j] = d.edge;
            if (near(edgeGeom(i, j).mid, s, 10)) {
              ctx.log('disconnect', { from: i, to: j });
              hover = null;
              up({ ...ctx.model, edges: ctx.model.edges.filter((f) => !(f[0] === i && f[1] === j)) });
            }
          } else if (d.kind === 'ink') {
            const p = clampB(toB(s));
            const l = live.pts[live.pts.length - 1];
            if (p[0] !== l[0] || p[1] !== l[1]) live.pts.push(p);
            inkEnd();
          }
        };
        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('pointermove', onMove);
        canvas.addEventListener('pointerup', onUp);
        canvas.addEventListener('pointercancel', onUp);
        canvas.addEventListener('auxclick', (e) => e.preventDefault());
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        sync(ctx.model);

        S.cbView = {
          locate(t) {
            if (t.point) return vp(toS(t.point));
            if (t.tool) return btn[t.tool] ? env.util.center(btn[t.tool]) : null;
            if (t.control) return ctl[t.control] ? env.util.center(ctl[t.control]) : null;
            if (t.port) return vp(toS(portOf(t.port[0], t.port[1])));
            if (t.edgeDel) {
              const [i, j] = t.edgeDel;
              return (ctx.model.edges || []).some((e) => e[0] === i && e[1] === j) ? vp(edgeGeom(i, j).mid) : null;
            }
            if (t.grab !== undefined) return vp(toS(spec.strokes[t.grab].grab));
            return null;
          },
        };
        return { anchors: [canvas], sync };
      },
    },
  },
});
