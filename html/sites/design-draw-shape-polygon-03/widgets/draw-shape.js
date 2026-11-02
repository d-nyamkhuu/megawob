// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-polygon-03',
  name: 'design',
  split: 'train',
  scenarios: ['polygon'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'drawMap': (base, S) => function drawMap(B) {
        const { fmtPx } = S;
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const land = rng.pick(['#f3f1ea', '#eef0e6', '#f1efe9']);
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: land }, svg);
        if (spec.scenario === 'polygon' && spec.mode === 'pins') {
          const city = util.svg('g', { 'pointer-events': 'none' }, svg);
          for (const [x,y,w,h,fill] of [[.02,.03,.09,.09,'#dfe2e5'],[.14,.02,.06,.10,'#d7dbdf'],[.28,.02,.08,.08,'#dfe2e5'],[.42,.04,.07,.08,'#d8dce0'],[.55,.02,.08,.09,'#dfe2e5'],[.04,.17,.12,.07,'#cbe7bd'],[.82,.06,.10,.10,'#c5e4b8'],[.89,.20,.09,.08,'#dfe2e5'],[.02,.34,.11,.09,'#d8dce0'],[.03,.49,.12,.08,'#c9e5ba'],[.03,.65,.12,.09,'#dfe2e5'],[.82,.38,.08,.08,'#d9dde1'],[.88,.55,.10,.09,'#cbe7bd'],[.80,.68,.08,.09,'#dfe2e5'],[.03,.84,.10,.10,'#c7e4b8'],[.17,.84,.09,.10,'#dfe2e5'],[.31,.84,.10,.10,'#d8dce0'],[.46,.84,.09,.10,'#c9e5ba'],[.61,.84,.11,.10,'#dfe2e5'],[.76,.84,.09,.10,'#c9e5ba'],[.91,.84,.08,.10,'#d9dde1']]) {
            util.svg('rect', { x: W*x, y: H*y, width: W*w, height: H*h, rx: 2, fill, opacity: .76 }, city);
            if (fill.startsWith('#d')) {
              util.svg('rect', { x: W*(x+.012), y: H*(y+.014), width: W*w*.72, height: H*h*.58, rx: 2, fill: '#c8cdd2', opacity: .58 }, city);
              util.svg('rect', { x: W*(x+w*.61), y: H*(y+h*.62), width: W*w*.24, height: H*h*.22, rx: 1, fill: '#eef0f1', opacity: .85 }, city);
            }
          }
          const road = util.svg('g', { fill: 'none', 'pointer-events': 'none' }, city);
          for (const d of [`M0 ${H*.15} H${W}`,`M0 ${H*.82} H${W}`,`M${W*.17} 0 V${H}`,`M${W*.78} 0 V${H}`,`M${W*.95} 0 V${H}`]) {
            util.svg('path', { d, stroke: '#c7ccd2', 'stroke-width': H*.035, 'stroke-linecap': 'round' }, road);
            util.svg('path', { d, stroke: '#fff', 'stroke-width': H*.027, 'stroke-linecap': 'round' }, road);
          }
          const park = util.svg('g', { 'pointer-events': 'none' }, svg);
          util.svg('path', { d: `M${W*.22} ${H*.23} Q${W*.24} ${H*.18} ${W*.30} ${H*.19} L${W*.68} ${H*.21} Q${W*.72} ${H*.24} ${W*.73} ${H*.32} L${W*.71} ${H*.72} Q${W*.69} ${H*.79} ${W*.63} ${H*.78} L${W*.27} ${H*.75} Q${W*.22} ${H*.72} ${W*.22} ${H*.66} Z`, fill: '#bfe5ad', stroke: '#a7c998', 'stroke-width': 2, opacity: .9 }, park);
          util.svg('path', { d: `M${W*.28} ${H*.35} C${W*.37} ${H*.29} ${W*.42} ${H*.44} ${W*.50} ${H*.35} S${W*.64} ${H*.31} ${W*.69} ${H*.42} M${W*.25} ${H*.55} C${W*.34} ${H*.48} ${W*.42} ${H*.66} ${W*.52} ${H*.57} S${W*.63} ${H*.48} ${W*.70} ${H*.59} M${W*.31} ${H*.72} C${W*.38} ${H*.61} ${W*.45} ${H*.73} ${W*.57} ${H*.71}`, fill: 'none', stroke: '#f7f8ef', 'stroke-width': Math.max(9, H*.018), 'stroke-linecap': 'round', opacity: .95 }, park);
          util.svg('path', { d: `M${W*.40} ${H*.42} C${W*.43} ${H*.36} ${W*.51} ${H*.38} ${W*.53} ${H*.43} C${W*.56} ${H*.50} ${W*.52} ${H*.55} ${W*.48} ${H*.53} C${W*.44} ${H*.51} ${W*.38} ${H*.49} ${W*.40} ${H*.42} Z`, fill: '#82c9f3', opacity: .86 }, park);
          util.svg('path', { d: `M${W*.68} ${-H*.05} C${W*.63} ${H*.18} ${W*.74} ${H*.31} ${W*.69} ${H*.48} C${W*.65} ${H*.63} ${W*.79} ${H*.79} ${W*.74} ${H*1.05} L${W*.88} ${H*1.05} C${W*.92} ${H*.79} ${W*.81} ${H*.63} ${W*.85} ${H*.47} C${W*.89} ${H*.29} ${W*.78} ${H*.15} ${W*.82} ${-H*.05} Z`, fill: '#8acaf4', opacity: .92 }, park);
          util.svg('path', { d: `M${W*.75} ${-H*.02} C${W*.71} ${H*.2} ${W*.78} ${H*.36} ${W*.76} ${H*.51} S${W*.81} ${H*.82} ${W*.80} ${H*1.02}`, fill: 'none', stroke: '#62afe9', 'stroke-width': 2, 'stroke-dasharray': '9 10', opacity: .8 }, park);
          const riverLabel = util.svg('text', { x: W*.78, y: H*.58, transform: `rotate(62 ${W*.78} ${H*.58})`, 'text-anchor': 'middle', fill: '#287ac1', 'font-size': Math.max(18,H*.028), 'font-family': 'Arial, sans-serif', 'pointer-events': 'none' }, park);
          riverLabel.textContent = 'Riverton River';
          for (const [x,y,r] of [[.27,.28,.019],[.34,.25,.014],[.37,.34,.022],[.60,.27,.018],[.66,.33,.013],[.30,.43,.021],[.35,.61,.017],[.41,.68,.014],[.60,.68,.022],[.67,.61,.017],[.25,.68,.014],[.54,.29,.012],[.31,.54,.012],[.57,.48,.016],[.46,.72,.018],[.64,.43,.014],[.39,.28,.011],[.29,.61,.015]]) {
            const cx=W*x, cy=H*y, rad=H*r;
            util.svg('circle', { cx: cx+rad*.23, cy: cy+rad*.4, r: rad, fill: '#8abb85', opacity: .48 }, park);
            util.svg('circle', { cx: cx-rad*.2, cy: cy-rad*.2, r: rad*.55, fill: '#a2d39a', opacity: .65 }, park);
          }
          util.svg('text', { x: W*.48, y: H*.62, 'text-anchor': 'middle', fill: '#355e3d', 'font-size': Math.max(18,H*.027), 'font-family': 'Arial, sans-serif', 'pointer-events': 'none' }, park).textContent = 'Riverside Park';
        }
        // Blocks.
        const blocks = util.svg('g', { opacity: 0.55 }, svg);
        for (let i = 0; i < 14; i++) {
          const x = rng.float(0, W - 40);
          const y = rng.float(0, H - 30);
          util.svg('rect', { x, y, width: rng.float(24, 70), height: rng.float(18, 50), rx: 3, fill: rng.pick(['#e2ddd2', '#dcd8cd', '#e6e1d6']) }, blocks);
        }
        if (spec.river && !(spec.scenario === 'polygon' && spec.mode === 'pins')) {
          const pts = [];
          for (let i = 0; i <= 40; i++) {
            const x = (i / 40) * spec.board.w;
            pts.push([x, spec.river.y0 + spec.river.amp * Math.sin(x * 4 + spec.river.phase)]);
          }
          util.svg('polyline', { points: fmtPx(pts, px), fill: 'none', stroke: '#a5cbe6', 'stroke-width': 0.05 * scale, 'stroke-linecap': 'round', 'pointer-events': 'none' }, svg);
        }
        // A decorative park.
        const [pxx, pyy] = [rng.float(0.1, 0.9) * W, rng.float(0.1, 0.9) * H];
        util.svg('ellipse', { cx: pxx, cy: pyy, rx: rng.float(30, 60), ry: rng.float(20, 40), fill: '#cfe3c1', opacity: 0.8 }, svg);
        for (const s of spec.streets) {
          const a = px(s.a);
          const b = px(s.b);
          util.svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#ffffff', 'stroke-width': rng.pick([7, 9, 11]), 'stroke-linecap': 'round' }, svg);
          const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
          const t = rng.float(0.15, 0.3);
          const at = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
          const rot = Math.abs(ang) > 90 ? ang + 180 : ang;
          util.svg('text', { x: at[0], y: at[1] - 7, class: 'dw-street', transform: `rotate(${rot.toFixed(1)} ${at[0].toFixed(1)} ${at[1].toFixed(1)})` }, svg).textContent = s.name;
        }
      },
      'renderBoard': (base, S) => function renderBoard(ctx, flavor) {
        const { BUILD, HAS_BAR, ensureStyle, layersPanel, place } = S;
          ensureStyle();
          S.keyHandler = null;
          const { util, rng, size, spec } = ctx;
          const bar = HAS_BAR(spec);
          const foot = spec.scenario === 'signature';
          const wb = flavor === 'whiteboard';
          const atlas = flavor === 'atlas';
          const reserveH = 24 + (bar ? 70 : 0) + (foot ? 46 : 0) + 30 + (wb ? 52 : atlas ? 66 : 0);
          const sampledHeight = rng.int(400, 600);
          const fullMap = spec.scenario === 'polygon';
          const stageWidth = size.width;
          const stageHeight = size.height;
          const fit = Math.min(stageHeight - reserveH, (stageWidth - 32 - (wb ? 210 : 0)) / (spec.board.w / spec.board.h));
          const H = Math.max(120, Math.floor(Math.min(fit, fullMap ? Math.max(sampledHeight, fit) : sampledHeight)));
          const scale = H / spec.board.h;
          const W = Math.round(spec.board.w * scale);

          // whiteboard: an app frame (header, board column + layers panel); the board column is the usual wrap.
          let root;
          let body = null;
          let wrap;
          if (wb) {
            root = util.el('div', 'dw-wb', ctx.stage);
            const head = util.el('div', 'dw-wb-head', root);
            util.el('span', 't', head, rng.pick(['Untitled board', 'Team sketch', 'Brainstorm', 'Whiteboard 1']));
            for (const b of ['Select', 'Sticky', 'Text']) {
              const btn = util.el('button', '', head, b);
              btn.type = 'button';
              btn.addEventListener('click', () => ctx.log('decoy', { what: b }));
            }
            const share = util.el('button', 'go', head, 'Share');
            share.type = 'button';
            share.addEventListener('click', () => ctx.log('decoy', { what: 'share' }));
            body = util.el('div', 'dw-wb-body', root);
            wrap = util.el('div', 'dw-wrap', body);
          } else {
            wrap = util.el('div', 'dw-wrap', ctx.stage);
            wrap.style.left = '0px';
            wrap.style.top = '0px';
            root = wrap;
          }
          const barEl = bar ? util.el('div', 'dw-bar', wrap) : null;
          if (atlas) {
            wrap.classList.add('dw-atlas');
            const head = util.el('div', 'dw-atlas-head', wrap);
            util.el('span', '', head, rng.pick(['Atlas', 'Wayfinder', 'City map', 'Cartograph']));
            util.el('div', 's', head, 'Search places');
            for (const sign of ['+', '−']) {
              const b = util.el('button', '', head, sign);
              b.type = 'button';
              b.setAttribute('aria-label', sign === '+' ? 'Zoom in' : 'Zoom out');
              b.addEventListener('click', () => ctx.log('decoy', { what: 'zoom' }));
            }
          }
          const boardEl = util.el('div', 'dw-board', wrap);
          if (bar && (atlas || rng.bool(0.3))) wrap.append(barEl); // toolbar below the board (always on the atlas page)
          const svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, boardEl);
          svg.dataset.role = 'board';
          if (atlas) util.el('div', 'dw-attrib', wrap, 'Map data © contributors');
          const footEl = foot ? util.el('div', 'dw-foot', wrap) : null;
          const hintEl = util.el('div', 'dw-hint', wrap);
          const px = (p) => [p[0] * scale, p[1] * scale];
          const toBoard = ([x, y]) => {
            const r = svg.getBoundingClientRect();
            return [Math.round(((x - r.left) / scale) * 1e4) / 1e4, Math.round(((y - r.top) / scale) * 1e4) / 1e4];
          };
          const frame = {
            toBoard: ([x, y]) => {
              const r = svg.getBoundingClientRect();
              return [(x - r.left) / scale, (y - r.top) / scale];
            },
            fromBoard: ([bx, by]) => {
              const r = svg.getBoundingClientRect();
              return [r.left + bx * scale, r.top + by * scale];
            },
            bounds: { x0: 0, y0: 0, x1: spec.board.w, y1: spec.board.h },
          };
          let view = null;
          // The builders replace the model with their own fields; whiteboard keeps its layer state (layer, hide) across them.
          let bctx = ctx;
          if (wb) {
            bctx = Object.create(ctx);
            bctx.update = (m) => ctx.update({ layer: ctx.model.layer, hide: ctx.model.hide, ...m });
          }
          const B = {
            ctx: bctx, svg, px, toBoard, frame, W, H, scale, bar: barEl, foot: footEl, flavor,
            hint(text, swatch = true) {
              if (swatch) util.el('span', 'dw-swatch', hintEl);
              util.el('span', '', hintEl, text);
            },
            // The kit never calls sync() after ctx.update: redraw here after every change.
            up(m) {
              bctx.update(m);
              if (view) view.sync(ctx.model);
            },
          };
          let layers = null;
          if (wb) layers = layersPanel(ctx, body, boardEl, util);
          view = BUILD[spec.scenario](B);
          view.sync(ctx.model);
          if (fullMap && barEl) {
            Object.assign(barEl.style, { padding: '7px', gap: '7px', alignSelf: 'flex-start' });
            for (const button of barEl.querySelectorAll('.dw-btn')) {
              Object.assign(button.style, { height: '54px', padding: '0 18px', gap: '9px', fontSize: '16px' });
            }
          }
          hintEl.style.maxWidth = `${Math.max(W, 200)}px`;
          // The footer is as wide as the board (its row stays centred under it): on a narrow board (traits.aspect) the
          // "accepted" note appearing must not widen the column and shift the board.
          if (footEl) Object.assign(footEl.style, { width: `${W}px`, justifyContent: 'center' });
          place(root, ctx, rng.fork('place'));
          if (fullMap) {
            root.style.left = `${Math.max(0, Math.floor((size.width - root.offsetWidth) / 2))}px`;
            root.style.top = `${Math.max(0, Math.floor((size.height - root.offsetHeight) / 2))}px`;
          }
          S.st = { locate: (t) => (layers && layers.locate(t)) || view.locate(t) };
          return { anchors: [svg], sync: (m) => { view.sync(m); if (layers) layers.paint(); } };
      },
    },
  },
});
