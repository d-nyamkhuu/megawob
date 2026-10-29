// Keeps the single-column scrolling dropdown and its video settings decoys.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-dropdown-09',
  name: 'design',
  split: 'train',
  scenarios: ['dropdown'],
  template: 'choose-option/widgets',
  design: {
    details: false,
    motif: false,
    revealOptions: true,
    parts: {
      heading: (base, S) => (ctx, card) => {
        const { util, spec } = ctx;
        [['Video quality', 'Auto (recommended)'], ['Playback speed', 'Normal']].forEach(([label, value]) => {
          const row = util.el('div', 'fp-field sw-xtra', card);
          util.el('div', 'fp-label', row, label);
          const control = util.el('div', 'fp-ctl', row);
          util.el('span', 'fp-val', control, value);
          control.insertAdjacentHTML(
            'beforeend',
            '<svg class="fp-chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg>',
          );
        });
        util.el('div', 'fp-note', card, spec.note);
      },
      decorated: (base, S) => (ctx, card) => {
        const { util } = ctx;
        ['Captions display', 'Audio output'].forEach((label) => {
          const row = util.el('div', 'fp-field sw-xtra sw-after', card);
          util.el('div', 'fp-label', row, label);
        });
      },
      selectLayout: (base, S) => (ctx, controls) => {
        const { rows, trigger, pop } = controls;
        if (!rows.size) return;
        const sr = ctx.stage.getBoundingClientRect();
        const tr = trigger.getBoundingClientRect();
        const avail = sr.bottom - tr.bottom - 4 - 10 - 12;
        const h = Math.max(22, tr.height * 0.735);
        pop.style.maxHeight = Math.max(100, Math.min(avail, tr.height * 5.3)) + 'px';
        pop.classList.remove('cols');
        pop.style.gridTemplateRows = '';
        pop.style.gridTemplateColumns = '';
        const w = tr.width;
        const left = Math.min(0, sr.right - 8 - (tr.left + w));
        pop.style.left = left + 'px';
        pop.style.right = 'auto';
        pop.style.width = w + 'px';
        for (const row of rows.values()) {
          row.style.height = h + 'px';
          row.style.fontSize = h < 28 ? '14px' : '';
        }
      },
      reveal: (base, S) => (ctx, controls, value) => {
        const row = controls.rows.get(value);
        const pop = controls.pop;
        if (!row || pop.hidden) return;
        const top = row.offsetTop;
        if (top < pop.scrollTop) pop.scrollTop = top;
        else if (top + row.offsetHeight > pop.scrollTop + pop.clientHeight)
          pop.scrollTop = top + row.offsetHeight - pop.clientHeight;
      },
    },
  },
});
