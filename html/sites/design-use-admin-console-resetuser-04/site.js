// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      if (kind === 'banner') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        if (rng.bool(0.5)) btn('Settings', null, false);
        btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
        dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
      } else if (kind === 'promo') {
        dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
        btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'aqua-titlebar', document.body);
      util.el('span', 'aqua-window-dots', titlebar, '● ● ●');
      util.el('strong', 'aqua-window-title', titlebar, 'Northstar Admin Console');
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, titlebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      document.body.dataset.instruction = display;
      const identity = util.el('div', 'ns-identity', header);
      util.el('div', 'ns-kicker', identity, 'Identity & Access');
      util.el('div', 'ns-title', identity, 'User management');
      util.el('div', 'ns-subtitle', identity, 'MANAGE ACCOUNTS, ROLES AND ACCESS');
      const metrics = util.el('div', 'ns-metrics', header);
      for (const [label, value, cls] of [['Total users', '2,482', ''], ['Active', '2,317', 'blue'], ['Disabled', '165', '']]) {
        const metric = util.el('div', `ns-metric ${cls}`, metrics);
        util.el('div', 'ns-metric-label', metric, label);
        util.el('strong', 'ns-metric-value', metric, value);
      }
      const searchbox = util.el('div', 'ns-search', header);
      util.el('span', 'ns-search-icon', searchbox, '⌕');
      util.el('span', '', searchbox, 'Search users, email or team');
      const tabs = util.el('nav', 'aqua-tabs', header);
      for (const label of ['Dashboard', 'Users', 'Groups', 'Computing', 'Storage', 'Applications', 'Reports']) {
        const tab = util.el('a', 'aqua-tab', tabs, label);
        tab.href = '#';
        tab.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Northstar Admin Console');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header, identity, metrics, searchbox, tabs });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'ns-rail', body);
      util.el('div', 'ns-mark', rail, '✦');
      util.el('div', 'ns-wordmark', rail, 'NORTHSTAR');
      util.el('div', 'ns-rail-caption', rail, 'IT CONSOLE');
      const railIcons = [
        'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 22v-3a6 6 0 0 1 6-5h4a6 6 0 0 1 6 5v3Z',
        'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M1 21v-3a6 6 0 0 1 6-5h4a6 6 0 0 1 6 5v3M17 4a4 4 0 0 1 0 7M19 14a6 6 0 0 1 4 5v2',
        'M3 4h18v14H3ZM1 21h22M9 18v3m6-3v3',
        'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z',
        'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Z',
        'M3 14h3v8H3ZM10 8h3v14h-3ZM17 2h3v20h-3Z',
        'M9 2h6l1 4 4 1 2 5-3 3v5l-5 2-3-3-5 1-3-5 2-4-1-5 5-1ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
      ];
      for (const [i, item] of ['Users', 'Groups', 'Devices', 'Applications', 'Security', 'Reports', 'Settings'].entries()) {
        const link = util.el('div', i === 0 ? 'ns-rail-item active' : 'ns-rail-item', rail);
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('viewBox', '0 0 24 24'); icon.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', railIcons[i]); icon.append(path); link.append(icon);
        util.el('span', '', link, item);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, railIcons });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const underlay = util.el('div', 'aqua-underlay', stage);
      const underHead = util.el('div', 'aqua-under-head', underlay);
      util.el('strong', '', underHead, '👥  User Accounts');
      const search = util.el('div', 'aqua-under-search', underHead);
      util.el('span', '', search, 'Search:');
      util.el('span', 'aqua-well', search, '');
      util.el('span', 'aqua-select', search, 'All Teams　⌄');
      util.el('span', 'aqua-select', search, 'Active Accounts　⌄');
      const table = util.el('div', 'aqua-under-table', underlay);
      util.el('div', 'aqua-under-row aqua-under-labels', table, 'Name　　　　　　　　　　　 Email Address　　　　　　　　　　　　　　 Team　　　　　　　　　 Status　　　　　 Last Sign In');
      for (const row of ['Aaliyah Patel　　 aaliyah.patel@northstar.example　　 Engineering　　 Active　　 14 Mar 2001, 09:12',
        'Aaron Kim　　　　 aaron.kim@northstar.example　　　　 Product　　　　 Active　　 12 Mar 2001, 16:03',
        'Bella Nguyen　　 bella.nguyen@northstar.example　　 Marketing　　　 Active　　 11 Mar 2001, 10:27',
        'Carlos Mendez　 carlos.mendez@northstar.example　 Engineering　　 Active　　 13 Mar 2001, 08:45',
        'Darius Jefferson　 darius-jefferson.5@northstar.example　 Sales　　　　　 Active　　 10 Mar 2001, 17:21',
        'Elena Rossi　　　 elena.rossi@northstar.example　　　 Finance　　　　 Active　　 13 Mar 2001, 11:06',
        'Fatima Al-Sayed　 fatima.al-sayed@northstar.example　 Customer Success　 Active　 14 Mar 2001, 09:58',
        'George Chen　　 george.chen@northstar.example　　 Engineering　　 Active　　 09 Mar 2001, 14:33',
        'Hannah Brooks　 hannah.brooks@northstar.example　 Product　　　　 Active　　 13 Mar 2001, 18:20',
        'Ivan Petrov　　　 ivan.petrov@northstar.example　　　 Engineering　　 Active　　 12 Mar 2001, 13:14']) util.el('div', 'aqua-under-row', table, row);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'ns-help', body);
      const helpHead = util.el('div', 'ns-help-head', help);
      util.el('span', 'ns-help-info', helpHead, 'i');
      util.el('span', '', helpHead, 'Help & tips');
      util.el('strong', 'ns-help-title', help, 'Reset an account');
      util.el('p', '', help, 'Select a user, choose an action and set whether to notify the user by email.');
      util.el('hr', '', help);
      util.el('strong', 'ns-help-title', help, 'Reset options');
      util.el('p', '', help, '•　Reset password\n　 Invalidate the current password and require the user to set a new one at next sign in.');
      util.el('p', '', help, '•　Reset MFA\n　 Remove the user’s MFA registration. They will be prompted to set it up again at next sign in.');
      util.el('hr', '', help);
      util.el('strong', 'ns-help-title', help, 'Email notification');
      util.el('p', '', help, 'Turn off email if you need to reset the account without notifying the user. A security audit record will still be created.');
      Object.assign(_c, { help, helpHead, search, stage, table, underHead, underlay });
    },
  };

  env.site({
    name: 'design-use-admin-console-resetuser-04',
    template: 'site/base',
    design: { parts },
  });
})();
