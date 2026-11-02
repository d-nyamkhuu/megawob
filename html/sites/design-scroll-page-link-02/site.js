// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const winbar = util.el('div', 'ref-windowbar', document.body);
      util.el('span', 'ref-window-title', winbar, 'AcmeCloud Docs');
      const wincontrols = util.el('div', 'ref-window-controls', winbar);
      util.el('span', '', wincontrols, '−');
      util.el('span', '', wincontrols, '□');
      util.el('span', '', wincontrols, '×');
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, sidebarDraw, wantFooter, winbar, wincontrols });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        if (display !== 'header' || nav) rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header);
        brand.dataset.role = 'brand';
        util.el('span', 'ref-cloud-mark', brand, '☁');
        util.el('span', 'ref-brand-copy', brand, 'AcmeCloud Docs');
        const n = util.el('nav', 'ref-nav', header);
        const oldNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Products⌄', 'Guides', 'Reference', 'Resources⌄']) {
          const a = util.el('a', 'ref-navlink', n, item);
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
      const search = util.el('div', 'ref-search', headerTools, '⌕　 Search documentation...');
      search.setAttribute('aria-hidden', 'true');
      util.el('span', 'ref-theme-icon', headerTools, '☼');
      util.el('span', 'ref-user-avatar', headerTools, 'JD');
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, search, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        util.el('strong', 'ref-side-heading', side, 'AcmeCloud Platform');
        for (const [label, value] of [
          ['Overview', ''], ['Get started', '›'], ['Your account', '›'], ['Projects', '›'], ['Billing', '›'],
          ['Security', '›'], ['Networking', '›'], ['Storage', '›'], ['Databases', '›'], ['AI and machine learning', ''],
          ['Observability', '›'], ['Developer tools', '›'], ['Integrations', '›'], ['Migration', '›'],
          ['Troubleshooting', '›'], ['FAQ', '']
        ]) {
          const row = util.el('section', 'ref-inspector-row', side);
          util.el('strong', '', row, label);
          util.el('div', '', row, value);
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const related = util.el('aside', 'ref-related', body);
      util.el('strong', 'ref-related-title', related, 'Related articles');
      for (const [title, sub] of [
        ['Platform overview', 'Introductory guide'], ['Get started with AcmeCloud', 'Quickstart guide'],
        ['Create your first project', 'Step-by-step tutorial'], ['Account and billing FAQ', 'FAQ'],
        ['Security best practices', 'Security'], ['Networking fundamentals', 'Networking'],
        ['Storage options', 'Storage'], ['Database services overview', 'Databases'],
        ['Introduction to observability', 'Observability'], ['Developer tools', 'Developer tools'],
        ['Integrations and APIs', 'Integrations'], ['Migration strategies', 'Migration'],
        ['Troubleshooting common issues', 'Troubleshooting']
      ]) {
        const row = util.el('div', 'ref-related-row', related);
        util.el('span', 'ref-related-icon', row, '▤');
        const copy = util.el('div', 'ref-related-copy', row);
        util.el('div', '', copy, title);
        util.el('small', '', copy, sub);
      }
      Object.assign(_c, { related, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      const dock = util.el('div', 'ref-bottom-dock', document.body);
      for (const [icon, text] of [['⌂', 'Home'], ['▣', 'Docs'], ['◫', 'Library'], ['☁', 'Cloud Console'], ['⚙', 'Settings']]) {
        const item = util.el('div', text === 'Docs' ? 'ref-dock-item active' : 'ref-dock-item', dock);
        util.el('span', 'ref-dock-icon', item, icon);
        util.el('span', '', item, text);
      }
      Object.assign(_c, { dock, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-scroll-page-link-02',
    template: 'site/base',
    design: { parts },
  });
})();
