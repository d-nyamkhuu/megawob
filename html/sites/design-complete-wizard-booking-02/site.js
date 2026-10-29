// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.appTitle = 'Heritage Hotels';
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Heritage Hotels');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'hotel-rail', body);
      util.el('div', 'hotel-rail-brand', rail, 'Heritage Hotels');
      util.el('div', 'hotel-engraving hotel-engraving-top', rail);
      util.el('div', 'hotel-tagline', rail, 'EXCEPTIONAL PLACES\nAROUND THE WORLD');
      util.el('div', 'hotel-rail-rule', rail);
      const railNav = util.el('nav', 'hotel-rail-nav', rail);
      for (const item of ['Find a Hotel', 'Our Destinations', 'Special Offers', 'Travel Guide', 'About Heritage Hotels']) {
        const a = util.el('a', 'hotel-rail-link', railNav, item);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      util.el('div', 'hotel-engraving hotel-engraving-bottom', rail);
      S.frameSidebar(_c, rail);
      Object.assign(_c, { body, rail, railNav });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) _c.rail.prepend(panel);
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const sheet = util.el('section', 'hotel-sheet', body);
      util.el('h1', 'hotel-sheet-title', sheet, 'Book Your Stay');
      const stage = util.el('main', 'ref-stage', sheet);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'booking-inspector', body);
      util.el('div', 'booking-inspector-title', inspector, 'Helpful Information');
      const helpItems = [
        ['Destination', 'Enter a city or region, such as Mombasa, Venice or Kyoto.'],
        ['Check-in date', 'Type the date in full, for example December 6, 2027.'],
        ['Nights', 'Select how many nights you’d like to stay.'],
        ['Guests', 'Enter the number of adults and children.'],
      ];
      for (const [title, copy] of helpItems) {
        const block = util.el('section', 'hotel-help-item', inspector);
        util.el('h3', '', block, title);
        util.el('div', '', block, copy);
      }
      util.el('div', 'hotel-engraving hotel-help-engraving', inspector);
      const help = util.el('div', 'hotel-help-bottom', inspector);
      util.el('strong', '', help, 'Need Help?');
      util.el('div', '', help, 'Visit our Travel Guide for destination ideas and practical tips.');
      Object.assign(_c, { help, helpItems, inspector, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = wantFooter
          ? (word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`, word('footSaved'), word('footHelp'),
            `v4.2.1 · ${word('footStatus')}`]) : rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
            'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal'])) : '';
        util.el('span', 'ref-foot-text', foot, footText);
        const dock = util.el('nav', 'hotel-dock-nav', foot);
        const dockItems = [['⌂', 'Home'], ['⌕', 'Find a Hotel'], ['▤', 'Our Destinations'], ['◆', 'Special Offers'], ['◉', 'Travel Guide'], ['♟', 'About Heritage Hotels']];
        for (const [icon, labelText] of dockItems) {
          const a = util.el('a', 'hotel-dock-link', dock);
          a.href = '#';
          util.el('span', 'hotel-dock-icon', a, icon);
          util.el('span', '', a, labelText);
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: labelText }); });
        }
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-complete-wizard-booking-02',
    template: 'site/base',
    design: { parts },
  });
})();
