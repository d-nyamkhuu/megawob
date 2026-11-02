// Design of this site on the click-control/controls template (templates/click-control/controls.js): dark translucent slices with an icon above each label, and an Open/Close label under the hub.
(function () {
  'use strict';
  let hubLabel = null;
  env.widget({
    task: 'click-control',
    site: 'design-click-control-pie-12',
    name: 'design',
    split: 'train',
    scenarios: ['pie'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      pieMin: 200,
      pieMax: 384,
      pieHMul: .65,
      pieHSub: 0,
      pieWMul: .58,
      innerFrac: .1745,
      knobR: null,
      parts: {
        pieDefs: () => (ctx, svg) => {
          const defs = ctx.util.svg('defs', {}, svg);
          defs.innerHTML = '<linearGradient id="fl-pie-fill" x1="0" y1="0" x2=".3" y2="1"><stop stop-color="#3d3346" stop-opacity=".96"/><stop offset="1" stop-color="#252431" stop-opacity=".96"/></linearGradient>';
        },
        labelRadius: () => (inner, outer) => outer * .72,
        sliceLabel: (base, S) => (ctx, g, tx, p, label, i, lx, ly) => {
          const { util } = ctx;
          tx.setAttribute('y', ly - 20);
          const decoration = util.svg('g', { class: 'uc-sector-icon', transform: `translate(${lx - 17} ${ly + 2}) scale(2.1)` }, g);
          const glyphs = ['copy', 'cursor', 'crop', 'image', 'pencil', 'pencil'];
          const paths = { cursor: '<path d="M3 1l11 10-6 .5-2.5 4zM8 12l2 4"/>', crop: '<path d="M4 1v13h12M1 4h12v12"/>' };
          decoration.innerHTML = S.ICON_PATHS[glyphs[i % glyphs.length]] || paths[glyphs[i % glyphs.length]];
        },
        plus: (base, S) => (spread, c) => (
          S.ctx.util.svg('path', { d: `M${c - 14} ${c - 11}h28M${c} ${c - 25}v28`, class: 'uc-spread-i' }, spread)
        ),
        plusOrigin: () => (c) => `${c}px ${c - 11}px`,
        hubAfter: () => (ctx, spread, c) => {
          hubLabel = ctx.util.svg('text', { x: c, y: c + 24, class: 'uc-hub-label' }, spread);
          hubLabel.textContent = 'Open';
        },
        pieShow: () => (area) => (el, open) => {
          el.style.display = open ? '' : 'none';
          hubLabel.textContent = open ? 'Close' : 'Open';
          if (open) area.setAttribute('data-open', 'true');
          else area.removeAttribute('data-open');
        },
      },
    },
  });
})();
