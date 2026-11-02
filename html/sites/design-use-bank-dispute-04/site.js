// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = 'light';
      const root = document.documentElement;
      let accent = '#3346e8';
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      if (roomy) rng.bool(0.35);
      if (W >= 1180) rng.bool(0.5);
      const sidebar = false;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Harborview Bank');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header });
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
      const windowControls = util.el('div', 'bank-window-controls', header);
      for (const [glyph, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close window']]) {
        const control = util.el('span', 'bank-window-control', windowControls, glyph);
        control.setAttribute('aria-label', label);
      }
      const summary = util.el('section', 'bank-summary', document.body);
      const account = util.el('div', 'bank-summary-card bank-account-card', summary);
      util.el('strong', '', account, 'Everyday Checking  ⌄');
      util.el('span', '', account, '•••• 4821');
      util.el('b', '', account, '$3,926.14');
      util.el('span', '', account, 'Available balance');
      const activity = util.el('div', 'bank-summary-card bank-activity-card', summary);
      util.el('strong', '', activity, 'Recent activity');
      for (const row of [['Feb 27, 2027', 'Maple & Pine Cafe', '-$18.40', 'Dining'],
        ['Feb 25, 2027', 'Jadeport Trading', '-$227.20', 'Shopping'],
        ['Feb 24, 2027', 'Riverside Pharmacy', '-$42.10', 'Health'],
        ['Feb 22, 2027', 'City Transit', '-$3.50', 'Travel']]) {
        const line = util.el('div', 'bank-activity-row', activity);
        for (const value of row) util.el('span', '', line, value);
      }
      const card = util.el('div', 'bank-summary-card bank-card-card', summary);
      util.el('div', 'bank-card-art', card, 'VISA');
      util.el('strong', '', card, 'Harborview Visa Debit');
      util.el('span', '', card, '•••• 4821');
      util.el('span', 'bank-card-link', card, 'Manage card controls     ›');
      util.el('span', 'bank-card-link', card, 'View card details     ›');
      Object.assign(_c, { account, activity, card, headerTools, submit, summary, windowControls });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const bottomNav = util.el('nav', 'bank-bottom-nav', document.body);
      const dockItems = [
        ['Home', '<path d="M3 10.8 12 3l9 7.8v9.7a1.5 1.5 0 0 1-1.5 1.5h-4.8v-6.7h-5.4V22H4.5A1.5 1.5 0 0 1 3 20.5z"/>'],
        ['Transfers', '<path d="M4 7h15l-3.5-3.5M20 7l-4.5 4.5M20 17H5l3.5 3.5M4 17l4.5-4.5"/>'],
        ['Bill Pay', '<path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h6"/><path d="M9 3V1.8h6V3"/>'],
        ['Cards', '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 9h18M6 15h4"/>'],
        ['Transactions', '<circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l4 2.5"/>'],
        ['Insights', '<path d="M4 20V11M10 20V5M16 20v-7M22 20V8"/>'],
        ['Support', '<circle cx="12" cy="7.5" r="4"/><path d="M3.5 21c.6-4.3 3.8-6.5 8.5-6.5s7.9 2.2 8.5 6.5z"/>'],
      ];
      for (const [title, drawing] of dockItems) {
        const item = util.el('div', title === 'Cards' ? 'bank-dock-item active' : 'bank-dock-item', bottomNav);
        const icon = util.el('span', 'bank-dock-icon', item);
        icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${drawing}</svg>`;
        util.el('span', '', item, title);
      }
      Object.assign(_c, { bottomNav, dockItems, submit });
    },
  };

  env.site({
    name: 'design-use-bank-dispute-04',
    template: 'site/base',
    design: { parts },
  });
})();
