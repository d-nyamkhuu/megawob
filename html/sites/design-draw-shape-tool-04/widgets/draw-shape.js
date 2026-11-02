// CRM layout on draw/reference; drawing, tools, undo and scoring use the template.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-tool-04',
  name: 'design',
  split: 'train',
  scenarios: ['tool'],
  template: 'draw-shape/base',
  design: {
    parts: {
      // The CRM toolbar and board share the stage so every real control is visible.
      'ensureStyle@0': (base) => () => {
        base();
        if (document.getElementById('crm-draw-style')) return;
        const style = document.createElement('style');
        style.id = 'crm-draw-style';
        style.textContent = `
        .crm-draw { position:absolute; inset:0; display:flex; flex-direction:column; gap:13px; }
        .crm-draw-toolbar { height:65px; flex:none; padding:6px; gap:3px; border-radius:4px;
          border:1px solid #cfdeea; background:linear-gradient(#f7fafc,#eef4f8); }
        .crm-draw-toolbar .dw-btn { flex:none; width:66px; height:52px; padding:0; justify-content:center;
          border:1px solid #cddae5; border-radius:2px; background:white; color:#142338; }
        .crm-draw-toolbar .dw-btn svg { width:29px; height:29px; }
        .crm-draw-toolbar .dw-btn span,.crm-draw-toolbar .dw-btn kbd { display:none; }
        .crm-draw-toolbar .dw-btn .crm-draw-icon { display:block; font:29px Arial,"Segoe UI",sans-serif; }
        .crm-draw-toolbar .dw-btn:disabled { opacity:1; }
        .crm-draw-toolbar .dw-btn[aria-pressed="true"] { background:#d9ecfb; box-shadow:inset 0 0 0 2px #b7d9f4; }
        .crm-draw-toolbar [data-key="pen"] { order:0; }
        .crm-draw-toolbar [data-key="line"] { order:1; }
        .crm-draw-toolbar [data-key="rect"] { order:2; }
        .crm-draw-toolbar [data-key="ellipse"] { order:3; }
        .crm-draw-toolbar .sep { order:4; height:42px; margin:0 17px; }
        .crm-draw-toolbar [data-key="undo"] { order:5; border-radius:4px; }
        .crm-draw-body { display:flex; gap:16px; flex:1; min-height:0; }
        .crm-draw-board { flex:none; border:1px solid #bfcfdd; border-radius:4px; overflow:hidden; background:white; }
        .crm-draw-board svg { display:block; touch-action:none; user-select:none; cursor:crosshair; }
        .crm-draw-board svg>rect[fill="url(#dw-grid)"] { display:none; }
        .crm-legend { width:206px; flex:none; border:1px solid #d4e0e9; border-radius:4px; background:white; color:#40546c; }
        .crm-legend h3 { margin:0; padding:14px 17px; border-bottom:1px solid #e0e8ee; background:#f1f6f9; font-size:16px; font-weight:600; color:#1d2c40; }
        .crm-legend>div { height:48px; display:flex; align-items:center; gap:17px; padding:0 20px; font-size:14px; }
        .dashbox { width:42px; height:29px; border:2px dashed #233247; }
        .dot { width:9px; height:9px; border-radius:50%; background:#15243a; margin:0 16px; }
        .guide { width:40px; border-top:2px solid #15243a; }
        @media(max-width:1150px) {
          .crm-draw { gap:10px; }
          .crm-draw-toolbar .dw-btn { width:48px; height:46px; }
          .crm-legend>div { padding:0 9px; gap:8px; font-size:12px; }
        }
        `;
        document.head.append(style);
      },
      button: (base) => (util, parent, key, text, opts) => {
        const button = base(util, parent, key, text, {...opts, icon:false});
        util.el('span', 'crm-draw-icon', button, {pen:'✎',line:'／',rect:'□',ellipse:'◯',undo:'↶'}[key] || text);
        button.title = text;
        button.setAttribute('aria-label', text);
        return button;
      },
      renderBoard: (base, S) => (ctx, flavor) => {
        if (ctx.spec.scenario !== 'tool') return base(ctx, flavor);
        S.ensureStyle();
        S.keyHandler = null;
        const {util, rng, spec, size} = ctx;
        const small = size.width < 750;
        const gap = small ? 10 : 13;
        const legendWidth = small ? 150 : 206;
        const W = Math.max(1, Math.floor(size.width - legendWidth - 18));
        const H = Math.max(1, Math.floor(size.height - 65 - gap - 2));
        const scale = Math.min(W / spec.board.w, H / spec.board.h);
        const dx = Math.max(0, W - spec.board.w * scale);
        const dy = Math.max(0, (H - spec.board.h * scale) / 2);
        // Preserve the template's board-size and toolbar-placement draws.
        rng.int(400, 600);
        const root = util.el('div', 'crm-draw', ctx.stage);
        const bar = util.el('div', 'dw-bar crm-draw-toolbar', root);
        const row = util.el('div', 'crm-draw-body', root);
        const board = util.el('div', 'crm-draw-board', row);
        board.style.width = `${W + 2}px`;
        const svg = util.svg('svg', {width:W, height:H, viewBox:`0 0 ${W} ${H}`}, board);
        svg.dataset.role = 'board';
        rng.bool(0.3);
        const legend = util.el('aside', 'crm-legend', row);
        legend.style.width = `${legendWidth}px`;
        legend.innerHTML = '<h3>Shapes &amp; Markup</h3><div><b class="dashbox"></b>Reference shape</div><div><b class="dot"></b>Reference point</div><div><b class="guide"></b>Guide line</div>';
        const px = ([x,y]) => [dx + x * scale, dy + y * scale];
        const toBoard = ([x,y]) => {
          const r = svg.getBoundingClientRect();
          return [(x-r.left-dx)/scale, (y-r.top-dy)/scale];
        };
        const frame = {toBoard, fromBoard:([x,y]) => {
          const r = svg.getBoundingClientRect(), p = px([x,y]);
          return [r.left+p[0], r.top+p[1]];
        }, bounds:{x0:0,y0:0,x1:spec.board.w,y1:spec.board.h}};
        let view;
        view = S.BUILD.tool({ctx, svg, px, toBoard, frame, W, H, scale, bar, flavor,
          hint() {},
          up(model) { ctx.update(model); view.sync(ctx.model); }
        });
        view.sync(ctx.model);
        S.place(root, ctx, rng.fork('place'));
        S.st = {locate: target => view.locate(target)};
        return {anchors:[svg], sync:model => view.sync(model)};
      },
    },
  },
});
