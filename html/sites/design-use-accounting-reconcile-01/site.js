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
      el.style.setProperty('--civic-header-bottom', document.querySelector('.civic-masthead').getBoundingClientRect().bottom + 'px');
      const endDock = document.querySelector('.ref-foot, .ref-float-dock');
      el.style.setProperty('--civic-footer-height', (endDock ? endDock.getBoundingClientRect().height : 0) + 'px');
      el.dataset.role = 'overlay';
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
      if (kind === 'banner') {
        document.body.insertBefore(el, document.querySelector('.ref-body'));
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const masthead = util.el('div', 'civic-masthead', document.body);
      const topline = util.el('div', 'civic-topline', masthead);
      util.el('h1', 'civic-app-title', topline, 'Accounting');
      const organization = util.el('div', 'civic-organization', topline);
      util.el('span', 'civic-org-label', organization, 'Riverton Community Services ﹀');
      util.el('span', 'civic-user', organization, 'JS');
      util.el('span', 'civic-user-chevron', organization, '⌄');
      const navIcons = {
        Dashboard: 'M3 11 12 3l9 8v10h-6v-7H9v7H3Z',
        Transactions: 'M4 2h16v20H4ZM7 6h10M7 10h10M7 14h7',
        Reconcile: 'M2 8 12 2l10 6ZM4 10v9m5-9v9m6-9v9m5-9v9M2 22h20',
        'Journal Entries': 'M2 4q5-2 10 1 5-3 10-1v17q-5-2-10 0-5-2-10 0ZM12 5v16M16 7h3m-3 4h3m-3 4h3',
        Expenses: 'M5 2h12l3 3v17l-4-2-4 2-4-2-3 2ZM8 7h8m-8 4h8m-8 4h5',
        'Accounts Payable': 'M4 2h16v20H4ZM7 6h10M7 10h10M7 14h7',
        Reports: 'M3 13h4v9H3Zm7-11h4v20h-4Zm7 6h4v14h-4Z',
        'Chart of Accounts': 'M9 1h6v6H9ZM1 17h6v6H1Zm8 0h6v6H9Zm8 0h6v6h-6ZM12 7v10M4 17v-5h16v5',
        Settings: 'M10 2h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
      };
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header);
        util.el('span', 'civic-brand-line', brand, 'Riverton');
        util.el('span', 'civic-brand-line', brand, 'Community Services');
        brand.dataset.role = 'brand';
        const mark = util.svg('svg', { viewBox: '0 0 24 24', class: 'civic-brand-icon', 'aria-hidden': 'true' }, brand);
        util.svg('path', { d: navIcons.Reconcile }, mark);
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Dashboard', 'Transactions', 'Reconcile', 'Journal Entries', 'Expenses', 'Accounts Payable', 'Reports', 'Chart of Accounts', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          const icon = util.svg('svg', { viewBox: '0 0 24 24', class: 'civic-nav-icon', 'aria-hidden': 'true' }, a);
          util.svg('path', { d: navIcons[item] }, icon);
          a.dataset.role = 'nav';
          if (item === 'Reconcile') a.classList.add('is-current');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (display === 'header') {
        const note = util.el('div', 'ref-instruction', topline, ctx.instruction);
        topline.insertBefore(note, organization);
      }
      else util.el('div', 'ref-spacer', header);
      Object.assign(_c, { header, masthead, navIcons, organization, topline });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, topline, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', topline);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        const footerCaption = word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText;
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        if (!tools.children.length) foot.remove();
      }
      Object.assign(_c, { submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-accounting-reconcile-01',
    template: 'site/base',
    design: { parts },
  });
})();
