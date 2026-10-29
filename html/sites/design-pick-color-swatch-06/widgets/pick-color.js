// Keeps this site's swatch panels, numeric display, labeled controls, and action buttons.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-swatch-06',
  name: 'design',
  split: 'train',
  scenarios: ['swatch'],
  traits: { controls: 'sv+hue' },
  template: 'pick-color/picker',
  design: {
    resetSelector: '[data-action="reset"]',
    resetLog: ['action', { label: 'Reset' }],
    parts: {
      fit: (base, S) => (ctx, card) => {
        const bounds = card.getBoundingClientRect();
        const W = Math.max(S.task.helpers.MIN_TRACK_PX, Math.floor(Math.min(bounds.width * .33, bounds.height * .763 / .967)));
        const H = Math.round(bounds.height * .763);
        return {
          W,
          H,
          hueH: H,
          radius: 0,
          hueW: Math.round(bounds.width * .039),
          knob: Math.max(18, Math.round(W * .085)),
          bounds,
          top: Math.round(bounds.height * .119),
          svLeft: Math.round(bounds.width * .1127),
          hueLeft: Math.round(bounds.width * .5136),
        };
      },
      axes: () => (ctx, card, g) => {
        const { util } = ctx;
        const ax = (cls, text, x, y) => {
          const el = util.el('div', 'ax ' + cls, card, text);
          Object.assign(el.style, { left: x + 'px', top: y + 'px' });
        };
        const axX = Math.round(g.bounds.width * .055);
        const arrowX = g.svLeft - Math.round(g.bounds.width * .024);
        ax('arrow', '↑', arrowX, g.bounds.height * .356);
        ax('', 'Saturation', axX, g.bounds.height * .48);
        ax('arrow', '↓', arrowX, g.bounds.height * .613);
        ax('value', 'Value →', g.svLeft + g.W * .525, g.bounds.height * .94);
        ax('hue', 'Hue', g.hueLeft + g.hueW / 2, g.bounds.height * .94);
      },
      hit: () => (ctx, el, kind, g) => {
        Object.assign(el.style, {
          left: (kind === 'sv' ? g.svLeft : g.hueLeft) + 'px',
          top: g.top + 'px',
        });
      },
      layout: (base, S) => (ctx, card) => {
        const { util, spec } = ctx;
        const st = S.st;
        const row = util.el('div', 'sw-row', card);
        const makePanel = (label) => {
          const col = util.el('div', 'sw-col', row);
          util.el('div', 'sw-label', col, label);
          return { swatch: util.el('div', 'cp-swatch', col) };
        };
        const target = makePanel(spec.targetLabel === 'Target' ? 'Target Swatch' : `${spec.targetLabel} Swatch`);
        const current = makePanel('Current Swatch');
        const box = util.el('section', 'picker-box', card);
        util.el('div', 'panel-label', box, 'Color Picker');
        const controlHost = util.el('div', 'picker-controls', box);
        const num = util.el('div', 'numeric', box);
        const title = util.el('div', 'num-title', num);
        util.el('b', '', title, 'Numeric Values');
        title.append(' (display only)');
        const vals = {};
        const group = (items) => {
          const g = util.el('div', 'num-grp', num);
          for (const [key, label, unit] of items) {
            const r = util.el('div', 'num-row', g);
            util.el('span', 'k', r, label);
            vals[key] = util.el('span', 'v', r);
            if (unit) util.el('span', 'u', r, unit);
          }
        };
        group([['h', 'H:', '°'], ['s', 'S:', '%'], ['v', 'V:', '%']]);
        group([['r', 'R:'], ['g', 'G:'], ['b', 'B:']]);
        group([['hex', '#']]);
        const displayColor = (panel, rgb) => { panel.swatch.style.background = S.math.hex(rgb); };
        displayColor(target, spec.rgb);
        st.controls = S.P.picker(ctx, controlHost, ctx.size.height, ctx.size.width);
        st.side = {
          anchors: [target.swatch, current.swatch],
          locators: {},
          paint(model) {
            const rgb = S.math.modelRgb(model);
            displayColor(current, rgb);
            vals.h.textContent = String(Math.round(model.h));
            vals.s.textContent = String(Math.round(model.s * 100));
            vals.v.textContent = String(Math.round(model.v * 100));
            vals.r.textContent = String(Math.round(rgb[0]));
            vals.g.textContent = String(Math.round(rgb[1]));
            vals.b.textContent = String(Math.round(rgb[2]));
            vals.hex.textContent = S.math.hex(rgb).replace('#', '').toUpperCase();
          },
        };
      },
      controlsPaint: () => (ctx, model) => {
        const hueBar = document.querySelector('.cp-hue .cp-bar');
        if (hueBar) hueBar.style.backgroundColor = `hsl(${model.h} 100% 50%)`;
      },
      rendered: (base, S) => (ctx) => {
        const random = document.querySelector('[data-action="random-color"]');
        if (random) random.onclick = () => {
          ctx.log('action', { label: 'Random Color' });
          S.commit({ h: (ctx.model.h + 137.508) % 360, s: .72, v: .68 });
        };
      },
    },
  },
});
