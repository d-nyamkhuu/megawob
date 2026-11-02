// Design on templates/crop-image/base.js: Clearlooks dialog layout, fitted to the
// stage without changing the template's task controls or seeded state.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-aspect-04',
  name: 'design',
  split: 'train',
  scenarios: ['aspect'],
  template: 'crop-image/base',
  design: {
    parts: {
      'ensureStyle@0': (base) => () => {
        base();
        if (document.getElementById('gtk-crop-layout')) return;
        const style = document.createElement('style');
        style.id = 'gtk-crop-layout';
        style.textContent = `
        .gtk .cr-wrap { display:grid; grid-template-columns:165px auto;
          grid-template-rows:auto; align-items:start; gap:12px 16px;
          padding:54px 14px 74px; transform-origin:top left; }
        .gtk .cr-wrap:before { box-sizing:border-box; }
        .gtk .cr-wrap:not(:has(.cr-apply)) { padding-bottom:14px; }
        .gtk .cr-tools { position:static; grid-column:1; grid-row:1;
          display:flex; flex-direction:column; align-items:stretch;
          box-sizing:border-box; width:134px; gap:6px; padding-top:40px; margin:0; }
        .gtk .cr-tools:before { position:absolute; left:28px; top:56px; }
        .gtk .cr-chip { width:100%; flex:1; min-height:24px; max-height:44px; padding:4px 10px; }
        .gtk .cr-frame { grid-column:2; grid-row:1; padding:5px; }
        .gtk .cr-handle { width:14px; height:14px; margin:-7px 0 0 -7px; }
        .gtk .cr-tools .cr-apply { position:absolute; left:calc(50% + 90px);
          bottom:14px; transform:translateX(-50%); width:220px; height:44px;
          padding:5px 12px; }
        .gtk .cr-dim,.gtk .cr-grid,.gtk .cr-sep,.gtk .cr-badge,.gtk .cr-readout,
        .gtk .cr-chip[data-role="preset"]:first-child { display:none; }
        @media(max-width:1100px) {
          .gtk .cr-wrap { grid-template-columns:130px auto; gap:8px; padding:48px 14px 60px; }
          .gtk .cr-tools { width:112px; gap:6px; padding-top:30px; }
          .gtk .cr-tools:before { top:48px; }
          .gtk .cr-chip { max-height:34px; }
          .gtk .cr-tools .cr-apply { left:calc(50% + 69px); width:165px; height:36px; }
        }
        `;
        document.head.append(style);
      },
      'placeIn@0': (base, S) => (ctx, wrap, rng, pad = 8) => {
        // Preserve the template's seeded placement draws, then fit the entire dialog,
        // including Apply crop, inside the stage reserved by the frame.
        const compact = ctx.size.width < 1100;
        const bar = wrap.querySelector('.cr-tools');
        if (bar) {
          bar.style.width = (compact ? 112 : 134) + 'px';
          bar.style.height = Math.max(compact ? 234 : 286, S.H + 10) + 'px';
        }
        base(ctx, wrap, rng, pad);
        const width = wrap.offsetWidth, height = wrap.offsetHeight;
        const scale = Math.min(1, (ctx.size.width - 2 * pad) / width,
          (ctx.size.height - 2 * pad) / height);
        wrap.style.left = (ctx.size.width - width * scale) / 2 + 'px';
        wrap.style.top = (ctx.size.height - height * scale) / 2 + 'px';
        wrap.style.transform = 'scale(' + scale + ')';
      },
    },
  },
});
