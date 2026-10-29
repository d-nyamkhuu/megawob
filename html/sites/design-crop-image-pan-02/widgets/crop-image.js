// Design on crop/reference: retain its controls and task wiring, with a portrait
// layout whose image dimensions match the pan window.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-pan-02',
  name: 'design',
  split: 'train',
  scenarios: ['pan'],
  template: 'crop-image/base',
  design: {
    parts: {
      // Keep the portrait presentation and the template's normalized pan coordinates
      // in agreement. All widget geometry belongs to this widget, not the frame CSS.
      'placeIn@0': (base, S) => function (ctx, wrap, rng, pad) {
        base(ctx, wrap, rng, pad); // Retain the template's seeded placement draws.
        const { width, height } = ctx.size;
        const compact = height < 530;
        const band = width < 940 ? 68 : 126;
        // Reserve the same toolbar space regardless of the requested action.
        const bottom = 90;
        const rowHeight = Math.max(80, height - band - bottom);
        const sideWidth = Math.floor(width * .38);
        const viewHeight = Math.max(40, rowHeight - 4);
        const viewWidth = Math.max(40, Math.min(Math.round(viewHeight * .78), width - sideWidth - 24));
        const set = (node, rules) => Object.assign(node.style, rules);
        set(wrap, { left: '0px', top: '0px', width: width + 'px', height: height + 'px', padding: '0', display: 'block', boxSizing: 'border-box' });
        const row = wrap.querySelector('.cr-row');
        set(row, { position: 'absolute', left: '0', right: '0', top: band + 'px', bottom: bottom + 'px', display: 'grid', gridTemplateColumns: `minmax(0, 1fr) ${sideWidth}px`, gap: '0', alignItems: 'start' });
        const view = wrap.querySelector('.cr-view');
        set(view, { width: viewWidth + 'px', height: viewHeight + 'px', margin: '0 auto', borderRadius: '0', boxShadow: '0 0 0 1px #b5b1a8, 0 0 0 5px #f8f6f0' });
        S.W = Math.round(viewWidth * ctx.spec.zoom.x);
        S.H = Math.round(viewHeight * ctx.spec.zoom.y);
        set(S.frame, { position: 'relative', width: S.W + 'px', height: S.H + 'px', borderRadius: '0' });
        set(S.frame.querySelector('canvas'), { width: '100%', height: '100%' });
        // The template placed an existing selection before this layout resized
        // the image. Repaint its pixel coordinates with the final dimensions.
        S.crop.set(ctx.model);
        set(wrap.querySelector('.cr-dim'), { opacity: '0' });
        set(wrap.querySelector('.cr-box'), { outline: '0', boxShadow: '0 0 0 1px #1c1a18' });
        for (const handle of wrap.querySelectorAll('.cr-handle')) set(handle, { width: '10px', height: '10px', margin: '-5px 0 0 -5px', background: '#fff', border: '1px solid #222', borderRadius: '0', boxShadow: 'none' });
        const side = wrap.querySelector('.cr-side');
        const sideHeight = rowHeight + (compact ? 0 : bottom);
        set(side, { position: 'relative', height: sideHeight + 'px', minWidth: '0', gap: '0', background: '#f5f3ed', boxShadow: 'inset 0 0 0 1px #c4c0b7' });
        const caption = wrap.querySelector('.cr-navcap');
        set(caption, { order: '-1', padding: '8px 12px', margin: '0', color: '#211e1a', background: 'linear-gradient(#f8f6f0,#e8e4db)', borderBottom: '1px solid #c5c0b7', font: 'bold 18px Georgia,serif' });
        const nav = wrap.querySelector('.cr-nav');
        const zoomHeight = compact ? 0 : Math.min(184, Math.round(height * .24));
        const navMargin = compact ? 12 : 38;
        const navHeight = Math.max(30, Math.min(compact ? 205 : 310, sideHeight - caption.offsetHeight - zoomHeight - navMargin - 12));
        const navWidth = Math.max(30, Math.min(Math.floor(sideWidth * .86), Math.round(navHeight * ctx.spec.aspect)));
        set(nav, { flex: 'none', width: navWidth + 'px', height: navHeight + 'px', margin: navMargin + 'px auto 10px', boxSizing: 'border-box', border: '1px solid #aaa', borderRadius: '0', boxShadow: '0 0 0 1px white' });
        set(nav.querySelector('canvas'), { width: '100%', height: '100%', opacity: '1' });
        set(wrap.querySelector('.cr-navwin'), { border: '2px solid #282522', background: 'transparent' });
        const readout = wrap.querySelector('.cr-readout');
        set(readout, { position: 'absolute', left: '12px', bottom: '4px', maxWidth: (width - sideWidth - 24) + 'px', font: '12px Georgia,serif' });
        const bar = wrap.querySelector('.cr-tools');
        if (bar) set(bar, { position: 'absolute', left: '0', bottom: '24px', width: (width - sideWidth) + 'px', justifyContent: 'center', height: '54px' });
        if (S.applyBtn) {
          set(S.applyBtn, { height: '44px', padding: '8px 20px', background: 'linear-gradient(#fffdf7,#d9d4c9)', color: '#171513', border: '1px solid #aaa398', borderRadius: '4px', boxShadow: '0 1px 2px #bbb', font: 'bold 18px Georgia,serif' });
        }
        if (!compact) {
          const zoom = ctx.util.el('div', 'studio-zoom', side, 'Zoom');
          set(zoom, { position: 'absolute', left: '0', right: '0', bottom: '0', height: zoomHeight + 'px', boxSizing: 'border-box', padding: '16px 18px', borderTop: '1px solid #c9c4ba', background: 'radial-gradient(circle,#777 0 6px,#aaa 7px,#eee 9px,transparent 10px) 38% 54%/22px 22px no-repeat,linear-gradient(#888,#888) 7% 54%/80% 2px no-repeat,linear-gradient(#f7f5ef,#f7f5ef) 7% 54%/80% 9px no-repeat,linear-gradient(#f8f6f0,#e6e2d9)', color: '#211e1a', font: 'bold 18px Georgia,serif' });
          const icons = ctx.util.el('div', 'studio-zoom-icons', zoom, '⊖             ⊕');
          set(icons, { position: 'absolute', left: '16px', bottom: '18px', padding: '7px 11px', border: '1px solid #aaa398', borderRadius: '4px', background: 'linear-gradient(#fffdf7,#d8d3c9)', font: '23px Arial,sans-serif' });
        }
      },
    },
  },
});
