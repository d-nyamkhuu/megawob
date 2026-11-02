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
      const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
      const end = document.querySelector('[data-role="submit"]');
      const endBox = end && end.getBoundingClientRect();
      const bottomReserve = endBox && endBox.top > window.innerHeight / 2 ? window.innerHeight - endBox.top + 10 : 10;
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${bottomReserve}px`;
      if (kind === 'banner') el.style.top = `${headerBottom}px`;
      if (kind === 'toast') el.style.top = `${headerBottom + 12}px`;
      if (kind === 'promo') el.style.inset = `${headerBottom + 8}px 8px ${bottomReserve}px`;
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
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      for (const [k, v] of Object.entries({bg:'#e7edf3',panel:'#f7f9fc',fg:'#142a43',muted:'#536b83',line:'#bdcddb',accent:'#1764a4'})) root.style.setProperty(`--${k}`, v);
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
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
      const logo = util.el('span', 'ns-logo', titlebar);
      logo.innerHTML = '<svg viewBox="0 0 46 46" aria-hidden="true"><path fill="white" d="m24 1 5 15 16-2-12 11 4 18-14-9L9 44l5-17L2 17h17z"/><path fill="#a9c8de" d="m24 1-1 23-14 20 9-22z"/><path fill="white" d="m34 5 3 5 6 1-6 2-3 5 1-6-4-3 5 1z"/></svg>';
      util.el('strong', 'aqua-window-title', titlebar, 'Northstar');
      util.el('span', 'aqua-product-title', titlebar, 'IT Administration Console');
      const accountTools = util.el('div', 'aqua-account-tools', titlebar);
      for (const item of ['Help', 'My Account', 'Sign Out']) util.el('span', '', accountTools, item);
      Object.assign(_c, { accountTools, collide, cr, decoys, label, logo, nav, placement, sidebar, titlebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const tabs = util.el('nav', 'aqua-tabs', header);
      for (const label of ['Home', 'Users', 'Groups', 'Access & Roles', 'Devices', 'Security', 'Reports', 'System']) {
        const tab = util.el('a', 'aqua-tab', tabs, label);
        tab.href = '#';
        tab.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      const globalSearch = util.el('div', 'aqua-global-search', header);
      util.el('span', 'aqua-search-placeholder', globalSearch, 'Search users, groups, or tickets...');
      util.el('span', 'aqua-search-icon', globalSearch).innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg>';
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Northstar Admin Console');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { globalSearch, header, tabs });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { W, accountTools, ctx, display, header, titlebar, util } = _c;
      if (display === 'header') {
        const note = util.el('div', 'ref-instruction', header, ctx.instruction);
        if (W >= 1440) titlebar.insertBefore(note, accountTools);
      }
      else util.el('div', 'ref-spacer', header);
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, titlebar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      titlebar.append(headerTools);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const inspector = util.el('aside', 'ns-inspector', body);
      util.el('h2', 'ns-section-title', inspector, 'User Details');
      const profile = util.el('div', 'ns-profile', inspector);
      const portrait = util.el('div', 'ns-portrait', profile);
      portrait.innerHTML = '<svg viewBox="0 0 80 86" aria-hidden="true"><circle cx="40" cy="27" r="16" fill="#526d7c"/><path d="M13 79v-9c0-30 54-30 54 0v9z" fill="#526d7c"/></svg>';
      const intro = util.el('div', '', profile);
      util.el('strong', 'ns-profile-name', intro, 'No user selected');
      util.el('p', 'ns-profile-description', intro, 'Select a user from the list to view details.');
      const info = util.el('section', 'ns-info', inspector);
      util.el('h3', '', info, 'Account Information');
      const properties = util.el('dl', '', info);
      for (const [label, key] of [['Display name','name'],['Username','username'],['Email address','email'],['Team','team'],['Job title','job'],['Location','location'],['Manager','manager']]) {
        util.el('dt', '', properties, label + ':');
        const value = util.el('dd', '', properties, '—'); value.dataset.property = key;
      }
      const status = util.el('section', 'ns-info', inspector);
      util.el('h3', '', status, 'Account Status');
      const statusList = util.el('dl', '', status);
      for (const [label, key] of [['Directory status','status'],['MFA status','mfa'],['Password last changed','password'],['Last sign-in','signin']]) {
        util.el('dt', '', statusList, label + ':');
        const value = util.el('dd', '', statusList, '—'); value.dataset.property = key;
      }
      for (const [title,text] of [['Group Memberships','Select a user to view group memberships.'],['Recent Activity','Select a user to view recent activity.']]) {
        const section = util.el('section', 'ns-info ns-info-small', inspector);
        util.el('h3', '', section, title); util.el('p', '', section, text);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, info, inspector, intro, portrait, profile, properties, status, statusList });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, info, inspector, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', inspector);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        inspector.insertBefore(panel, info);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
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
      Object.assign(_c, { search, stage, table, underHead, underlay });
    },
  };

  env.site({
    name: 'design-use-admin-console-resetuser-02',
    template: 'site/base',
    design: { parts },
  });
})();
