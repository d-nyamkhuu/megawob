// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-align-02',
  name: 'design',
  split: 'train',
  scenarios: ['align'],
  template: 'align-layout/canvas',
  design: {
    titles: { align: ['Properties', 'Properties', 'Properties'] },
    guideLabel: '', rulerWidth: 0, rulerHeight: 0, gridSize: 0,
    panel: '#fff', line: '#e2e8f0', accent: '#3b82f6', muted: '#667085', fg: '#111827',
    cardPadding: '0', bodyGap: 0, itemRadius: 6, titleSize: 13, itemSize: 14,
    borderSaturation: 0, borderLightness: 75, fillSaturation: 0, fillLightness: 100, fillMix: 100,
    parts: {
      style: (base) => (ctx) => {
        base(ctx);
        ctx.css('property-canvas-style', `
          .lo-card { background:transparent;border:0;box-shadow:none; }
          .lo-bar,.lo-cap,.lo-rt,.lo-rl { display:none; }
          .lo-body,.lo-pane,.lo-frame { position:absolute;inset:0;display:block; }
          .lo-canvas { position:absolute;left:0;top:0;outline:0;
            background:transparent;background-image:none; }
          .lo-guide.h { border:0;height:2px;
            background:repeating-linear-gradient(90deg,#3b82f6 0 8px,transparent 8px 13px); }
          .lo-guide.v { border:0;width:2px;
            background:repeating-linear-gradient(0deg,#3b82f6 0 8px,transparent 8px 13px); }
          .lo-guide span { display:none; }
          .lo-item.property-card { display:flex;flex-direction:column;align-items:stretch;justify-content:flex-end;
            padding:0;gap:0;white-space:normal;background:#fff;color:#111827;
            border:1px solid #e2e8f0;border-radius:6px;box-shadow:0 1px 3px #0f172a18; }
          .property-photo { display:block;flex:1 1 auto;min-height:0;width:100%;pointer-events:none; }
          .property-name { display:block;flex:none;padding:5px 7px;color:#111827;font-size:12px;font-weight:650;line-height:15px; }
          .lo-item.property-card.locked { border:2px solid #8ab4ff;background:#fff; }
          .lo-item.property-card.locked svg { position:absolute;right:10px;top:10px;width:25px;height:25px;padding:5px;border-radius:5px;background:#2580ed;color:white; }
        `);
      },
      rendered: (_base, S) => (ctx) => {
        S.card.style.left = '0';
        S.card.style.top = '0';
        S.card.style.width = `${ctx.size.width}px`;
        S.card.style.height = `${ctx.size.height}px`;
      },
      item: (base) => (ctx, canvas, item, index, locked) => {
        const el = base(ctx, canvas, item, index, locked);
        el.classList.add('property-card');
        const photo = ctx.util.el('div', `property-photo property-photo-${index % 4}`, el);
        photo.setAttribute('aria-hidden', 'true');
        const label = el.querySelector('span');
        if (label) label.classList.add('property-name');
        el.insertBefore(photo, el.firstChild);
        return el;
      },
    },
  },
});
