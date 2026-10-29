// Design for the desktop listbox: integer row geometry, fitted labels, and raised scrollbar arrows.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-listbox-02',
  name: 'design',
  split: 'train',
  scenarios: ['listbox'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      field: (base) => (ctx, card) => {
        const field = base(ctx, card);
        const label = document.querySelector('[data-role="picker-label"]');
        if (label) label.textContent = ctx.spec.label.replace(/:$/, '') + ':';
        return field;
      },
      rail: () => (ctx, controls) => {
        const { util } = ctx;
        const scrollbar = util.el('div', 'fp-scrollbar', controls.lb);
        const up = util.el('button', 'fp-arrow up', scrollbar);
        up.type = 'button';
        up.setAttribute('aria-label', 'Scroll up');
        const track = util.el('div', 'fp-track', scrollbar);
        track.dataset.role = 'scrollbar';
        const thumb = util.el('div', 'fp-thumb', track);
        thumb.dataset.role = 'thumb';
        const down = util.el('button', 'fp-arrow down', scrollbar);
        down.type = 'button';
        down.setAttribute('aria-label', 'Scroll down');
        return { track, thumb, up, down };
      },
      prepare: (_base, S) => (ctx, controls) => {
        const rowH = Math.max(1, Math.floor(controls.list.clientHeight / ctx.spec.rows));
        controls.list.style.setProperty('--list-row-height', rowH + 'px');
        controls.list.style.setProperty('--list-height', rowH * ctx.spec.rows + 'px');
      },
      measured: (base) => (ctx, controls) => {
        base(ctx, controls);
        for (const option of ctx.spec.options) {
          const text = controls.rows[option].lastElementChild;
          text.style.setProperty('--label-scale', Math.min(0.87, text.clientWidth / Math.max(1, text.scrollWidth)));
        }
      },
    },
  },
});
