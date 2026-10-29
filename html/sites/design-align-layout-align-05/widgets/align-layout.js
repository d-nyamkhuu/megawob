// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-align-05',
  name: 'design',
  split: 'train',
  scenarios: ['align'],
  template: 'align-layout/canvas',
  design: {
    fillMix: 78, fillSaturation: 68, fillLightness: 76, borderSaturation: 26, borderLightness: 36,
    cardGap: 0, cardPadding: '0', bodyGap: 0, insetX: 1, insetY: 1,
    rulerWidth: 0, rulerHeight: 0, guideLabel: '',
    parts: {
      // The application's own toolbar and window title supply this decoration.
      // Consume the original title draw so task randomness stays unchanged.
      toolbar: (base, S) => (ctx) => {
        ctx.rng.pick(S.D.titles[ctx.spec.scenario]);
        return null;
      },
      pane: (base, S) => (ctx, parent) => ctx.util.el('div', 'lo-pane', parent),
      ruler: (base, S) => () => null,
      item: (base, S) => (ctx, canvas, it, i, locked) => {
        const el = base(ctx, canvas, it, i, locked);
        const label = el.querySelector('span');
        if (label) label.classList.add('lo-card-title');
        const icons = [
          '<svg viewBox="0 0 40 40"><path d="M3 11h13l4 5h17v20H3z"/><path d="M3 16h34"/></svg>',
          '<svg viewBox="0 0 40 40"><path d="M7 3h19l9 9v25H7z"/><path d="M26 3v10h9M13 21h16M13 27h16M13 33h12"/></svg>',
          '<svg viewBox="0 0 40 40"><path d="M6 34V23h6v11M17 34V13h6v21M28 34V5h6v29"/></svg>',
          '<svg viewBox="0 0 40 40"><rect x="4" y="8" width="32" height="28" rx="2"/><path d="M4 15h32M12 4v8M28 4v8M11 21h5M23 21h5M11 28h5M23 28h5"/></svg>'
        ];
        const icon = ctx.util.el('span', 'lo-card-icon', el);
        icon.innerHTML = locked ? icons[0] : icons[i % icons.length];
        const originalLock = el.querySelector('svg');
        if (locked && originalLock) originalLock.classList.add('lo-lock-symbol');
        const lines = ctx.util.el('span', 'lo-card-lines', el);
        for (let n = 0; n < 3; n++) ctx.util.el('i', '', lines);
        S.P.tint(el, it.hue);
        el.classList.add(locked ? 'lo-tone-blue' : `lo-tone-${['green', 'yellow', 'pink'][i % 3]}`);
        return el;
      },
      bindItem: (base, S) => (ctx, el, i, locked) => {
        let start = null;
        env.ui.track(el, {
          start() {
            if (locked) return false;
            start = { ...ctx.model.r[i] };
            S.P.raise(i);
            el.classList.add('dragging');
          },
          move(p) {
            const z = S.st.zoom || 1;
            S.P.setRect(i, env.taskDef.helpers.moveRect(ctx.spec, start, p.dx / z, p.dy / z));
          },
          end() { el.classList.remove('dragging'); },
        }, 'layout-card');
      },
      locate: (base, S) => (target) => {
        const z = S.st.zoom || 1;
        return base({ ...target, dx: (target.dx || 0) * z, dy: (target.dy || 0) * z });
      },
      place: (base, S) => (ctx, card) => {
        const { rng, size } = ctx;
        rng.pick([0, 0.5, 0.5, 1, rng.float()]);
        rng.pick([0.5, 0.5, 0, 1, rng.float()]);
        const cardWidth = card.offsetWidth;
        const cardHeight = card.offsetHeight;
        const stage = ctx.stage.getBoundingClientRect();
        const zoom = Math.min(2.1, (stage.width - 8) / cardWidth, (stage.height - 8) / cardHeight);
        S.st.zoom = Math.max(1, zoom);
        card.style.zoom = S.st.zoom;
        card.style.left = '0px';
        card.style.top = '0px';
        card.style.width = cardWidth + 'px';
        card.style.height = cardHeight + 'px';
      },
    },
  },
});
