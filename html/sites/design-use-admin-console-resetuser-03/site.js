// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  // Small shaded desktop glyphs, shared by the toolbar and page masthead.
  function desktopIcon(parent, kind) {
    const art = {
      users: '<circle cx="9" cy="6" r="4" fill="#819bb6"/><path d="M2 22v-6c0-7 14-7 14 0v6Z" fill="#426b97"/><circle cx="19" cy="7" r="3" fill="#b4aea1"/><path d="M17 22v-7q0-4 5-4q6 1 6 6v5Z" fill="#716f61"/>',
      groups: '<circle cx="7" cy="7" r="3.5" fill="#87a6c6"/><path d="M0 23v-6q1-8 13-4v10Z" fill="#527aa5"/><circle cx="20" cy="6" r="4.5" fill="#789bc2"/><path d="M11 25v-8q0-8 10-8q9 1 9 10v5Z" fill="#365e88"/>',
      licenses: '<rect x="5" y="1" width="20" height="25" rx="1" fill="#fafafa"/><path d="M10 7h2m3 0h6M10 12h2m3 0h6M10 17h2m3 0h6M10 22h11" fill="none" stroke="#2f5d94" stroke-width="1.5"/>',
      devices: '<path d="M6 2h19v17H6Z" fill="#52739a"/><path d="M8 4h15v12H8Z" fill="#b9d8ee"/><path d="m5 19-4 5h29l-5-5Z" fill="#b9bfc3"/><path d="M12 22h7" stroke="#fff" stroke-width="1.4"/>',
      reset: '<path d="M26 11A11 11 0 0 0 6 6L3 3v9h9L8 8a7 7 0 0 1 15 4M3 17a11 11 0 0 0 21 4l3 4v-9h-9l4 3a7 7 0 0 1-15-3" fill="#3166b2" stroke="none"/>',
      email: '<rect x="2" y="5" width="26" height="19" rx="2" fill="#f4ca83"/><path d="m3 6 12 11L27 6" fill="#ffedc9"/><path d="m3 23 8-8m16 8-8-8" stroke="#99734b" fill="none"/>',
      reports: '<rect x="2" y="16" width="5" height="11" fill="#b78347"/><rect x="12" y="9" width="5" height="18" fill="#e5b873"/><rect x="22" y="2" width="5" height="25" fill="#eec58a"/>',
    };
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 30 30'); svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', `desktop-glyph desktop-glyph-${kind}`);
    svg.innerHTML = `<g stroke="#34465b" stroke-width="1.2" stroke-linejoin="round">${art[kind] || art.licenses}</g>`;
    parent.append(svg); return svg;
  }

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'promo') {
        const art = util.el('div', 'desktop-promo-art', box);
        desktopIcon(art, 'email');
        util.el('h2', 'desktop-promo-heading', box, 'Stay in the Know');
      }
      if (kind === 'chat') util.el('strong', 'desktop-chat-heading', box, 'Northstar Support');
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
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.classList.toggle('ref-header-note', display === 'header');
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('desktop-panel-note', display === 'panel');
      Object.assign(_c, { H, W, display, roomy, tall });
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
      util.el('strong', 'aqua-window-title', titlebar, 'Northstar IT Admin Console');
      const windowControls = util.el('div', 'aqua-window-controls', titlebar);
      for (const [label, glyph, cls] of [['Minimize', '−', 'minimize'], ['Maximize', '□', 'maximize'], ['Close', '×', 'close']]) {
        const control = util.el('span', `aqua-window-control ${cls}`, windowControls, glyph);
        control.setAttribute('aria-label', label);
      }
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, titlebar, wantFooter, windowControls });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const tabs = util.el('nav', 'aqua-tabs', header);
      for (const label of ['File', 'Edit', 'View', 'Directory', 'Account', 'Tools', 'Reports', 'Help']) {
        const tab = util.el('a', 'aqua-tab', tabs, label);
        tab.href = '#';
        tab.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      const toolbar = util.el('nav', 'aqua-toolbar', header);
      const toolItems = [
        ['♟', 'Users'], ['♟', 'Groups'], ['▤', 'Licenses'], ['▣', 'Devices'],
        ['⟳', 'Reset'], ['✉', 'Email'], ['▥', 'Reports'],
      ];
      for (const [icon, label] of toolItems) {
        const item = util.el('a', 'aqua-tool', toolbar);
        item.href = '#';
        desktopIcon(util.el('span', 'aqua-tool-icon', item), label.toLowerCase());
        util.el('span', '', item, label);
        item.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Northstar Admin Console');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header, tabs, toolItems, toolbar });
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
      const summary = util.el('section', 'aqua-summary', header);
      const summaryTitle = util.el('div', 'aqua-summary-title', summary);
      desktopIcon(util.el('span', 'aqua-summary-icon', summaryTitle), 'groups');
      const summaryCopy = util.el('div', 'aqua-summary-copy', summaryTitle);
      util.el('strong', '', summaryCopy, 'User Management');
      util.el('span', '', summaryCopy, 'Manage user accounts, access, and security settings across Northstar.');
      const metrics = util.el('div', 'aqua-metrics', summary);
      for (const [label, value, cls] of [['Total Users', '1,482', ''], ['Active', '1,356', 'active'], ['Disabled', '126', 'disabled'], ['Pending', '0', 'pending']]) {
        const metric = util.el('div', `aqua-metric ${cls}`, metrics);
        util.el('span', '', metric, label);
        util.el('strong', '', metric, value);
      }
      Object.assign(_c, { headerTools, metrics, submit, summary, summaryCopy, summaryTitle });
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
    name: 'design-use-admin-console-resetuser-03',
    template: 'site/base',
    design: { parts },
  });
})();
