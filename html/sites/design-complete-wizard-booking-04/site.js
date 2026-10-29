// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.appTitle = 'Hotel Reservation';
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Hotel Reservation');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = ['Destinations', 'Stays', 'Offers', 'Our hotels', 'Travel guide'];
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of navItems) {
          const a = util.el('a', 'ref-navlink', n, item);
          if (item === 'Stays') a.classList.add('is-active');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
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
      const hero = util.el('section', 'booking-hero', document.body);
      util.el('div', 'booking-hero-title', hero, 'Lviv');
      util.el('div', 'booking-hero-kicker', hero, 'HISTORY LIVES HERE');
      util.el('div', 'booking-hero-rule', hero);
      util.el('div', 'booking-hero-copy', hero, 'Cobblestone streets, remarkable architecture and a vibrant café culture.');
      Object.assign(_c, { headerTools, hero, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, label, rng, util } = _c;
      const intro = util.el('aside', 'booking-intro', body);
      util.el('h1', 'booking-intro-title', intro, 'Book\nyour stay');
      util.el('div', 'booking-intro-rule', intro);
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      const inspector = util.el('aside', 'booking-inspector', body);
      util.el('div', 'booking-inspector-title', inspector, 'Your booking');
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
          util.el('b', '', row, '—');
        }
      }
      Object.assign(_c, { inspector, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-complete-wizard-booking-04',
    template: 'site/base',
    design: { parts },
  });
})();
