// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.appTitle = 'Hotel Reservation';
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Hotel Reservation');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      for (const [glyph, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const control = util.el('button', 'ref-window-control', headerTools, glyph);
        control.type = 'button';
        control.title = label;
        control.setAttribute('aria-label', label);
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'booking-inspector', body);
      const inspectorValues = new Map();
      util.el('div', 'booking-inspector-title', inspector, 'Trip Details');
      for (const [section, rows] of [
        ['Stay', ['Destination:', 'Check-in date:', 'Nights:', 'Guests:']],
        ['Guest', ['Full name:', 'E-mail:', 'Phone:']],
        ['Room', ['Room type:', 'Breakfast:']],
        ['Review', ['Status:']],
      ]) {
        const block = util.el('section', 'booking-inspector-section', inspector);
        util.el('h3', '', block, section);
        for (const label of rows) {
          const row = util.el('div', 'booking-inspector-row', block);
          util.el('span', '', row, label);
          const value = util.el('b', '', row, '—');
          value.dataset.forLabel = label.toLowerCase().replace(/[^a-z]/g, '');
          inspectorValues.set(value.dataset.forLabel, value);
        }
      }
      const refreshInspector = (event) => {
        for (const [label, text] of event.detail) {
          const value = inspectorValues.get(label);
          if (value) value.textContent = text || '—';
        }
      };
      stage.addEventListener('booking-values', refreshInspector);
      Object.assign(_c, { inspector, refreshInspector, stage });
    },
  };

  env.site({
    name: 'design-complete-wizard-booking-01',
    template: 'site/base',
    design: { parts },
  });
})();
