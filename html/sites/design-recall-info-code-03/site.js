// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const sidebar = false;
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Account Manager');
      brand.dataset.role = 'brand';
      brand.setAttribute('aria-label', word ? word(lr.pick(K.brand)) : title);
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const tabNames = ['Accounts', 'Security', 'Devices', 'Activity', 'Preferences'];
        for (const i of [0, 1, 2, 3, 4]) {
          const item = navItems[i] || content.NAV_ITEMS[i];
          const a = util.el('a', 'ref-navlink', n, tabNames[i] || item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header, title });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const pagehead = util.el('div', 'ref-pagehead', header);
      for (const menu of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', 'ref-menu-item', pagehead, menu);
      Object.assign(_c, { pagehead });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const side = util.el('aside', 'ref-side', body);
      const add = util.el('button', 'ref-add-account', side);
      add.type = 'button';
      util.el('span', 'ref-add-plus', add, '+');
      util.el('span', '', add, 'Add Account');
      const search = util.el('div', 'ref-search', side);
      util.el('span', 'ref-search-icon', search);
      util.el('span', '', search, 'Search accounts…');
      const addAccount = (icon, title, address, active) => {
        const row = util.el('div', `ref-account${active ? ' is-active' : ''}`, side);
        util.el('span', `ref-account-icon icon-${icon}`, row);
        const copy = util.el('span', 'ref-account-copy', row);
        util.el('strong', '', copy, title); util.el('small', '', copy, address);
      };
      addAccount('person', 'alex.rivera@example.com', 'Personal', true);
      addAccount('work', 'Work', 'alex.rivera@workmail.com');
      addAccount('task', 'Family', 'rivera.family@mail.com');
      addAccount('cart', 'Shopping', 'alex_shop@example.com');
      addAccount('news', 'News', 'alex.rivera@newsletter.com');
      Object.assign(_c, { add, addAccount, body, search, side });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      const inspectorHead = util.el('div', 'ref-inspector-head', inspector);
      util.el('strong', '', inspectorHead, 'Account Details');
      util.el('span', '', inspectorHead, '⋮');
      const identity = util.el('div', 'ref-identity', inspector);
      util.el('span', 'ref-avatar', identity);
      const identityText = util.el('div', '', identity);
      util.el('strong', '', identityText, 'alex.rivera@example.com');
      util.el('span', '', identityText, 'Personal Account');
      const details = util.el('div', 'ref-detail-list', inspector);
      for (const [k, v] of [['Name', 'Alex Rivera'], ['Email', 'alex.rivera@example.com'], ['Phone', '+1 415 555 0189'],
        ['Recovery email', 'alex.rivera@backupmail.com'], ['Country', 'United States'], ['Member since', 'Mar 12, 2016']]) {
        const row = util.el('div', 'ref-detail-row', details);
        util.el('span', '', row, k); util.el('span', '', row, v);
      }
      const sections = [['Security', [['Two-step verification', 'On'], ['Recovery method', 'Email and SMS'], ['Last password change', 'Jan 3, 2018']]],
        ['Recent activity', [['Sign in from Linux', 'Apr 10, 2018'], ['Password changed', 'Jan 3, 2018'], ['Recovery info updated', 'Dec 21, 2017']]]];
      for (const [title, rows] of sections) {
        const section = util.el('section', 'ref-inspector-section', inspector);
        util.el('strong', '', section, title);
        for (const [k, v] of rows) {
          const row = util.el('div', 'ref-inspector-row', section);
          util.el('span', '', row, k); util.el('span', '', row, v);
        }
      }
      Object.assign(_c, { details, identity, identityText, inspector, inspectorHead, sections, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-recall-info-code-03',
    template: 'site/base',
    design: { parts },
  });
})();
