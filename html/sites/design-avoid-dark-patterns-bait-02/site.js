// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
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
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        // The reference design has a fixed parchment-and-olive palette across episodes.
        for (const [k, v] of Object.entries({
          bg: '#fbfaf7',
          panel: '#fffefa',
          fg: '#171713',
          muted: '#655f55',
          line: '#e2ddd3',
          accent: '#29372a',
        }))
          root.style.setProperty(`--${k}`, v);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task market-header', document.body);
        const airbrand = util.el('div', 'market-brand', header);
        airbrand.innerHTML =
          '<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M7 44C15 24 25 10 44 6c-1 19-11 31-31 35M9 43l25-27M19 32l-1-9m9 1 9 1m-21 16 1-9m11-1 10 1" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copperleaf Market</span>';
        const search = util.el('div', 'market-search', header);
        util.el('span', 'market-search-icon', search, '⌕');
        util.el('span', '', search, 'Search for products, brands and more');
        const marketActions = util.el('div', 'market-actions', header);
        const cart = util.el('span', 'market-cart', marketActions);
        cart.innerHTML =
          '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M3 6h4l4 18h17l5-13H10M14 29a2 2 0 1 0 0 .1M27 29a2 2 0 1 0 0 .1" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        util.el('span', 'market-count', marketActions, '0');
        const user = util.el('span', 'market-user', marketActions);
        user.innerHTML =
          '<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="11" r="7" fill="currentColor"/><path d="M5 32c0-8 5-13 13-13s13 5 13 13" fill="currentColor"/></svg>';
        S.frameBrand(_c, header);
        Object.assign(_c, { airbrand, cart, header, marketActions, search, user });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body market-body', document.body);
        body.dataset.instruction = _c.display;
        const related = util.el('aside', 'market-related', body);
        const relatedItems = [
          [
            'Fitness tracker',
            '<svg viewBox="0 0 96 84"><path d="M36 5h24v20H36zM36 59h24v20H36z" fill="#20242a"/><rect x="27" y="20" width="42" height="46" rx="13" fill="#171a1e" stroke="#555b62" stroke-width="3"/><rect x="34" y="27" width="28" height="32" rx="8" fill="#080a0c"/><path d="M42 37h12M42 44h12M42 51h8" stroke="#f4f6f8" stroke-width="2" stroke-linecap="round"/></svg>',
          ],
          [
            'Running shoes',
            '<svg viewBox="0 0 96 84"><path d="M15 49c9-2 16-14 21-27l14 6c4 12 11 19 26 22 7 2 10 7 8 13H16c-7 0-8-10-1-14z" fill="#253b56"/><path d="M34 42l9-9m-4 15 11-11m-5 18 11-10" stroke="#38a3df" stroke-width="5" stroke-linecap="round"/><path d="M17 59h66" stroke="#f4f6f8" stroke-width="5" stroke-linecap="round"/><path d="M22 65h58" stroke="#293344" stroke-width="3"/></svg>',
          ],
          [
            'Steel bottle',
            '<svg viewBox="0 0 96 84"><rect x="39" y="12" width="18" height="9" rx="3" fill="#303943"/><path d="M37 22h22l5 9v38c0 5-4 8-9 8H41c-5 0-9-3-9-8V31z" fill="#9da9b4" stroke="#4c5863" stroke-width="2"/><path d="M39 29h5v40h-5z" fill="#e8edf0" opacity=".8"/><path d="M35 39h27" stroke="#788691" stroke-width="2"/></svg>',
          ],
          [
            'Travel pack',
            '<svg viewBox="0 0 96 84"><path d="M33 18c0-8 6-13 15-13s15 5 15 13v7h8c6 0 10 5 10 11v37c0 6-4 9-10 9H25c-6 0-10-3-10-9V36c0-6 4-11 10-11h8z" fill="#17619b" stroke="#233c54" stroke-width="3"/><path d="M36 25v-7c0-6 5-9 12-9s12 3 12 9v7" fill="none" stroke="#202f41" stroke-width="4"/><rect x="28" y="43" width="40" height="22" rx="6" fill="#1686bd" stroke="#253d51" stroke-width="2"/><path d="M25 30 18 70m53-40 7 40" stroke="#182c41" stroke-width="5"/></svg>',
          ],
          [
            'Wireless earbuds',
            '<svg viewBox="0 0 96 84"><path d="M25 13c-9 0-15 8-15 18 0 9 5 14 12 14 6 0 9-4 9-10V24c0-6-2-11-6-11zM71 13c9 0 15 8 15 18 0 9-5 14-12 14-6 0-9-4-9-10V24c0-6 2-11 6-11z" fill="#191d22"/><path d="M23 42v19c0 6 4 10 9 10s9-4 9-10V45m32-3v19c0 6-4 10-9 10s-9-4-9-10V45" fill="none" stroke="#111519" stroke-width="9" stroke-linecap="round"/><path d="M23 23c4-4 9-3 11 1m29 0c2-4 7-5 11-1" stroke="#707780" stroke-width="2"/></svg>',
          ],
          [
            'Yoga mat',
            '<svg viewBox="0 0 96 84"><path d="M18 28h53c8 0 14 6 14 14s-6 14-14 14H18z" fill="#5269b6"/><ellipse cx="70" cy="42" rx="14" ry="14" fill="#384d97"/><ellipse cx="70" cy="42" rx="6" ry="6" fill="#dce3f7"/><path d="M21 31h44" stroke="#8294d1" stroke-width="3"/></svg>',
          ],
        ];
        for (const [title, art] of relatedItems) {
          const row = util.el('div', 'market-related-item', related);
          util.el('span', 'market-thumb', row).innerHTML = art;
          util.el('span', 'market-related-title', row, title);
        }
        S.frameSidebar(_c, related);
        Object.assign(_c, { body, related, relatedItems });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, rng, util } = _c;
        const stage = util.el('main', 'ref-stage market-stage', body);
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        Object.assign(_c, { stage });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        {
          const foot = util.el('footer', 'ref-foot market-dock', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const dockNav = util.el('nav', 'market-dock-nav', foot);
          for (const [icon, item] of [
            ['◆', 'Home'],
            ['▦', 'Categories'],
            ['⬟', 'Deals'],
            ['♥', 'Saved'],
            ['▤', 'Orders'],
            ['●', 'Account'],
          ]) {
            const link = util.el('a', `market-dock-link${item === 'Categories' ? ' active' : ''}`, dockNav);
            util.el('span', 'market-dock-icon', link, icon);
            util.el('span', '', link, item);
          }
          const tools = util.el('div', 'ref-tools', foot);
          if (wantFooter && decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (wantFooter && collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (wantFooter && placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (wantFooter && placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-avoid-dark-patterns-bait-02',
    template: 'site/base',
    design: { parts },
  });
})();
