// This design mirrors the field and current input among travel-search decoys.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-autocomplete-07',
  name: 'design',
  split: 'train',
  scenarios: ['autocomplete'],
  template: 'choose-option/widgets',
  design: {
    titleTag: null,
    marker: false,
    travelExtra: false,
    parts: {
      decorated: (base) => (ctx, card, field, wrap) => {
        base(ctx, card, field, wrap);
        const { util } = ctx;
        wrap.classList.add('ds-grid');
        const decoy = (cls, label, icon, text, ph, tail) => {
          const f = util.el('div', 'ds-df ' + cls, wrap);
          util.el('div', 'ds-dl', f, label);
          const c = util.el('div', 'ds-dc', f);
          util.el('span', 'ds-di ds-i-' + icon, c);
          const t = util.el('span', 'ds-dt' + (ph ? ' ph' : ''), c, text);
          if (tail) util.el('span', 'ds-dx ds-x-' + tail, c);
          return f;
        };
        decoy('c1 r1', 'From', 'plane', 'New York (JFK)', false, 'close');
        decoy('c2 r1', 'To', 'plane', 'Destination', true, '');
        decoy('c1 r2', 'Depart', 'cal', 'Apr 12, 2025', false, 'chev');
        decoy('c2 r2', 'Return', 'cal', 'Apr 19, 2025', false, 'chev');
        decoy('c1 r3', 'Travelers', 'person', '1 adult', false, 'chev');
        card.classList.add('c2', 'r3');
        util.el('div', 'ds-more c1 r4', wrap, 'More options');
      },
      autocompleteInput: (_base) => (ctx, controls) => {
        const { input } = controls;
        const brief = ctx.stage.closest('.ds-body');
        const detailField = brief.querySelector('.ds-detail-field');
        const detailInput = brief.querySelector('.ds-detail-input');
        if (detailField) detailField.textContent = ctx.spec.label + ' (autocomplete)';
        const updateDetail = () => {
          if (detailInput) detailInput.textContent = input.value || '—';
        };
        controls.updateDetail = updateDetail;
        input.addEventListener('input', updateDetail);
      },
      autocompletePainted: (_base) => (_ctx, controls) => controls.updateDetail(),
      suggestions: (_base) => (ctx, controls) => {
        const { pop, input } = controls;
        const opts = [...pop.querySelectorAll('.fp-opt')];
        const room = ctx.stage.getBoundingClientRect().bottom - input.getBoundingClientRect().bottom - 14;
        const preferred = ctx.size.height > 420 ? 45 : 32;
        const columns = opts.length * preferred > room ? 2 : 1;
        const rowHeight = Math.max(
          20,
          Math.min(preferred, Math.floor(room / Math.max(1, Math.ceil(opts.length / columns)))),
        );
        pop.style.setProperty('--fp-option-height', rowHeight + 'px');
        pop.classList.toggle('cols', columns > 1);
        if (columns > 1) {
          pop.style.gridTemplateRows = `repeat(${Math.ceil(opts.length / columns)},${rowHeight}px)`;
          pop.style.gridTemplateColumns = '1fr 1fr';
        } else {
          pop.style.gridTemplateRows = '';
          pop.style.gridTemplateColumns = '';
        }
        opts.forEach((o) => {
          o.style.height = rowHeight + 'px';
        });
      },
    },
  },
});
