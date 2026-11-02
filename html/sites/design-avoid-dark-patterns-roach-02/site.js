// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      // This design is the Brightpage desktop app: its left rail and account tabs
      // are part of the application frame on every episode.
      Object.assign(_c, { sidebar: true, nav: true });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Brightpage Books');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Home', 'Browse', 'My Library', 'Account', 'Help']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const accountTools = util.el('div', 'bp-account-tools', header);
      util.el('span', 'bp-search', accountTools, 'Search');
      util.el('span', 'bp-profile', accountTools, 'Alex');
      Object.assign(_c, { accountTools, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        util.el('div', 'bp-logo', side, '♟');
        const sidebarItems = rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        for (const item of ['Account Overview', 'Membership', 'My Library', 'Reading History', 'Settings', 'Help & Support']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.panel': (base, S) => function (_c) {
      const body = _c.body;
      _c.body = body.querySelector('.ref-side');
      base(_c);
      _c.body = body;
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const status = document.querySelector('.ref-foot-text');
      if (status) status.textContent = 'Brightpage Books · Ready';
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const pageHead = util.el('div', 'bp-pagehead', stage);
      util.el('div', 'bp-title', pageHead, 'Account Overview');
      const tabs = util.el('div', 'bp-tabs', pageHead);
      for (const [i, tab] of ['Overview', 'Purchase History', 'Membership', 'Personal Details'].entries()) {
        const t = util.el('span', i === 0 ? 'bp-tab active' : 'bp-tab', tabs, tab);
      }
      const help = util.el('aside', 'bp-help', body);
      util.el('div', 'bp-help-title', help, 'My Reading');
      const stats = util.el('div', 'bp-stats', help);
      for (const [n, label] of [['12','Books in library'],['3','Books finished'],['5','In progress'],['4','Saved for later']]) {
        const row = util.el('div', 'bp-stat', stats);
        util.el('b', '', row, n); util.el('span', '', row, label);
      }
      const perks = util.el('div', 'bp-perks', help);
      util.el('div', 'bp-perks-title', perks, 'Member Perks');
      for (const [icon, perk] of [['★','Early access to new releases'],['◆','Exclusive member deals'],['▱','Read offline'],['♟','Members’ book club']]) {
        const row = util.el('div', 'bp-perk', perks);
        util.el('span', 'bp-perk-icon', row, icon); util.el('span', '', row, perk);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { help, pageHead, perks, stage, stats, tabs });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-roach-02',
    template: 'site/base',
    design: { parts },
  });
})();
