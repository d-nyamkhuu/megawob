// Design on templates/site/form-pick-autocomplete-01: soft neumorphic "Address Details" tool with a tip strip.
(function () {
  'use strict';
  const noop = () => {};
  env.site({
    name: 'design-choose-option-dependent-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: { site: 'design-choose-option-dependent-05', brand: 'Address Details', title: 'Address', instruction: 'top', rail: '', menu: '', briefTitle: 'Task' },
      parts: {
        'frame.6': (base, S) => function (_c) {
          const { top, u } = _c;
          const pin = u.el('span', 'ds-pin', top);
          pin.innerHTML = '<svg width="34" height="42" viewBox="0 0 24 30"><path d="M12 1C6.5 1 2.5 5.1 2.5 10.3 2.5 17 12 29 12 29s9.5-12 9.5-18.7C21.5 5.1 17.5 1 12 1z" fill="#3b82f6"/><circle cx="12" cy="10.5" r="3.6" fill="#fff"/></svg>';
          u.el('span', 'ds-brand', top, 'Address Details');
        },
        'frame.7': (base, S) => noop,
        'frame.20': (base, S) => noop,
        'frame.21': (base, S) => noop,
        'frame.22': (base, S) => noop,
        'frame.23': (base, S) => noop,
        'frame.35': (base, S) => function (_c) {
          const { foot, u } = _c;
          const tip = u.el('div', 'ds-tip', foot);
          const ic = u.el('span', 'ds-tip-ic', tip);
          ic.innerHTML = '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#1e4fc2" stroke-width="3"><circle cx="20" cy="20" r="17"/><path d="M20 18v10" stroke-linecap="round"/><circle cx="20" cy="12" r="1.6" fill="#1e4fc2" stroke="none"/></svg>';
          const tx = u.el('div', 'ds-tip-tx', tip);
          u.el('b', '', tx, 'Tip');
          u.el('div', '', tx, 'First choose a country. Then select a city from the list.');
          const cancel = u.el('button', 'ds-travel-cancel', foot, 'Cancel');
          cancel.hidden = true;
          _c.cancel = cancel;
        },
      },
    },
  });
})();
