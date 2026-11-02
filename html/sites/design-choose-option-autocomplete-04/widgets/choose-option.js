// Design on the choose-option/widgets template.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-autocomplete-04',
  name: 'design',
  split: 'train',
  scenarios: ['autocomplete'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      travelExtra: () => (ctx) => {
        const { util } = ctx;
        const extra = util.el('section', 'ds-travel-extra', ctx.stage);
        [
          ['Check-in:', 'Apr 28, 1997', 1],
          ['Check-out:', 'May 2, 1997', 2],
        ].forEach(([t, v, i]) => {
          util.el('div', 'ds-lab ds-r' + i, extra, t);
          const inp = util.el('input', 'ds-date ds-r' + i, extra);
          inp.type = 'text';
          inp.value = v;
          const cb = util.el('span', 'ds-calbtn ds-r' + i, extra);
          cb.innerHTML =
            '<svg viewBox="0 0 32 32" width="100%" height="100%"><rect x="4" y="6" width="24" height="24" fill="#bac0d3" stroke="#24273b" stroke-width="2.5"/><path d="M5 7h22v6H5zM8 2h3v9H8zM22 2h3v9h-3z" fill="#272940"/><path d="M9 14v15M14 14v15M19 14v15M24 14v15M5 18h22M5 23h22M5 28h22" stroke="#2b2e44" stroke-width="1.3"/><path d="M5 14v14M6 14h20M9 3v5M23 3v5" stroke="#e3e7f0"/></svg>';
        });
        util.el('div', 'ds-lab ds-r3', extra, 'Travelers:');
        const tin = util.el('input', 'ds-date ds-trav', extra);
        tin.type = 'text';
        tin.value = '1';
        const spin = util.el('span', 'ds-spin', extra);
        util.el('span', 'ds-up', spin, '▲');
        util.el('span', 'ds-dn', spin, '▼');
        const opts = util.el('div', 'ds-opts', extra);
        util.el('div', 'ds-opts-title', opts, 'Trip Options');
        util.el('div', 'ds-opts-rule', opts);
        util.el('div', 'ds-olab ds-o1', opts, 'Trip type:');
        [
          ['Business', 1, 'ds-rad1'],
          ['Leisure', 0, 'ds-rad2'],
        ].forEach(([t, c, k]) => {
          const l = util.el('label', 'ds-radio ' + k, opts);
          const r = util.el('input', '', l);
          r.type = 'radio';
          r.name = 'ds-trip';
          r.checked = !!c;
          util.el('span', '', l, t);
        });
        util.el('div', 'ds-olab ds-o2', opts, 'Class:');
        const sel = util.el('div', 'ds-class', opts, 'Economy');
        util.el('span', 'ds-arrow', sel);
        [
          ['Nonstop flights only', 'ds-c1'],
          ['Flexible dates', 'ds-c2'],
        ].forEach(([t, k]) => {
          const l = util.el('label', 'ds-check ' + k, opts);
          const r = util.el('input', '', l);
          r.type = 'checkbox';
          util.el('span', '', l, t);
        });
        util.el('div', 'ds-bottomrule', extra);
      },
      autocompleteReady: () => (ctx, controls) => {
        const { input, show } = controls;
        const clear = document.querySelector('.ds-clear');
        if (clear)
          clear.addEventListener('click', () => {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            show();
          });
      },
    },
  },
});
