// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.toggle('ref-display-header', display === 'header');
        document.body.classList.toggle('ref-display-panel', display === 'panel');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
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
    'frame.header': (base, S) =>
      function (_c) {
        const { content, local, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Deliveries');
        brand.dataset.role = 'brand';
        brand.setAttribute('aria-label', word ? word(lr.pick(K.brand)) : title);
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          const tabNames = ['Deliveries', 'Collections', 'Redeliveries', ''];
          for (const i of [0, 1, 2, 3, 4]) {
            const item = navItems[i] || content.NAV_ITEMS[i];
            if (!tabNames[i]) continue;
            const a = util.el('a', 'ref-navlink', n, tabNames[i]);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { brand, header, title });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const pagehead = util.el('div', 'ref-pagehead', header);
        util.el('div', 'ref-page-title', pagehead, 'Deliveries');
        const stats = util.el('aside', 'ref-stats', pagehead);
        util.el('div', 'ref-stats-title', stats, 'Recent deliveries');
        for (const [key, value] of [
          ['Scheduled:', '12'],
          ['Completed:', '7'],
          ['Remaining:', '5'],
        ]) {
          const row = util.el('div', 'ref-stats-row', stats);
          util.el('span', '', row, key);
          util.el('span', '', row, value);
        }
        Object.assign(_c, { pagehead, stats });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const records = util.el('aside', 'delivery-index', body);
        const indexHead = util.el('div', 'delivery-index-head', records);
        util.el('strong', '', indexHead, 'Recent deliveries');
        const search = util.el('div', 'delivery-search', indexHead, '⌕　Search deliveries');
        const productArt = {
          BOX: '<svg viewBox="0 0 100 80" aria-hidden="true"><defs><linearGradient id="bx" x2="0" y2="1"><stop stop-color="#d8b48d"/><stop offset="1" stop-color="#b8875a"/></linearGradient></defs><ellipse cx="51" cy="68" rx="35" ry="5" fill="#9da3a6" opacity=".22"/><path d="M17 22 61 13 83 23 39 33Z" fill="#e0bf9a"/><path d="M17 22 39 33 39 66 17 53Z" fill="#be9468"/><path d="M39 33 83 23 83 55 39 66Z" fill="url(#bx)"/><path d="m47 37 20-5v15l-20 5z" fill="#f4f1e9"/><path d="M50 40h14M50 44h11M50 47h8" stroke="#83878a" stroke-width="1.4"/><path d="m61 13 1 19" stroke="#ba926a" stroke-width="2"/></svg>',
          HEADPHONES:
            '<svg viewBox="0 0 100 80" aria-hidden="true"><ellipse cx="50" cy="67" rx="28" ry="4" fill="#8b9094" opacity=".2"/><path d="M26 47V37a24 24 0 0 1 48 0v10" fill="none" stroke="#25292c" stroke-width="8"/><path d="M27 39a23 23 0 0 1 46 0" fill="none" stroke="#454a4d" stroke-width="3"/><rect x="20" y="41" width="15" height="26" rx="6" fill="#171a1c"/><rect x="65" y="41" width="15" height="26" rx="6" fill="#171a1c"/><rect x="24" y="45" width="7" height="18" rx="3" fill="#60676a"/><rect x="69" y="45" width="7" height="18" rx="3" fill="#60676a"/></svg>',
          JACKET:
            '<svg viewBox="0 0 100 80" aria-hidden="true"><ellipse cx="50" cy="69" rx="25" ry="4" fill="#778170" opacity=".22"/><path d="m37 14 13 6 13-6 10 9 9 31-12 5-5-15v22H35V44l-5 15-12-5 9-31z" fill="#596b3f"/><path d="m37 14 13 6-8 12-8-9zM63 14l-13 6 8 12 8-9z" fill="#738654"/><path d="M50 20v46M45 28l5 5 5-5" stroke="#35432b" stroke-width="2"/><path d="M36 45h8M56 45h8" stroke="#87976a" stroke-width="2"/></svg>',
          LAMP: '<svg viewBox="0 0 100 80" aria-hidden="true"><ellipse cx="51" cy="69" rx="23" ry="4" fill="#858b90" opacity=".2"/><path d="m30 24 9-15h26l9 15-8 4H38z" fill="#f5f1e5" stroke="#d5d1c7"/><path d="M50 28v31" stroke="#b7b4aa" stroke-width="3"/><path d="M44 59h12l11 7H33z" fill="#e5e2da" stroke="#bbb8b0"/><circle cx="50" cy="29" r="3" fill="#aaa69d"/></svg>',
          COFFEE:
            '<svg viewBox="0 0 100 80" aria-hidden="true"><ellipse cx="50" cy="68" rx="25" ry="4" fill="#757a7d" opacity=".22"/><path d="M31 14h38l5 9v39H27V23z" fill="#202426"/><path d="M37 18h27v15H37z" fill="#363b3e"/><rect x="41" y="22" width="19" height="7" rx="2" fill="#aeb5b7"/><circle cx="65" cy="27" r="2" fill="#df4b2b"/><path d="M37 38h27v3H37z" fill="#797f82"/><path d="M38 45h24v16H38z" fill="#bfc5c6"/><path d="M41 48h18v10H41z" fill="#51433c"/><path d="M62 46h5v12h-5" fill="none" stroke="#d9ddde" stroke-width="2"/></svg>',
          SHOES:
            '<svg viewBox="0 0 100 80" aria-hidden="true"><ellipse cx="51" cy="66" rx="32" ry="5" fill="#848b90" opacity=".22"/><path d="M19 48q10 0 18-14l9 3q4 13 17 15 10 2 17 10v5H20q-7-2-5-10z" fill="#f6f6f2" stroke="#c9ced0" stroke-width="2"/><path d="M36 42q12 8 29 10" fill="none" stroke="#d8dcdd" stroke-width="3"/><path d="m39 42 9 7m-3-10 10 10m-2-8 9 8" stroke="#9ca3a7" stroke-width="2"/><path d="M16 61h64v6H20q-6-1-4-6" fill="#d4d7d7"/></svg>',
          BAG: '<svg viewBox="0 0 100 80" aria-hidden="true"><ellipse cx="50" cy="69" rx="25" ry="4" fill="#70777c" opacity=".22"/><path d="M34 24q0-12 16-12t16 12" fill="none" stroke="#23292d" stroke-width="5"/><path d="M28 25q0-5 7-7l6-3h18l7 3q7 2 7 7l5 38q0 4-5 4H21q-5 0-5-4z" fill="#30383d"/><path d="M31 30q19-8 38 0l3 27q-22 7-44 0z" fill="#414a50"/><path d="M38 40h24v14H38z" rx="3" fill="#252c30"/><path d="M41 44h18v7H41z" fill="#596268"/><path d="M26 29 21 58m53-29 5 29" stroke="#151a1d" stroke-width="4"/></svg>',
          BOTTLE:
            '<svg viewBox="0 0 100 80" aria-hidden="true"><ellipse cx="50" cy="69" rx="17" ry="4" fill="#858c90" opacity=".2"/><path d="M44 12h12v9l6 6v34q0 5-6 5H44q-6 0-6-5V27l6-6z" fill="#d9dddc" stroke="#afb6b6" stroke-width="2"/><path d="M44 12h12v8H44z" fill="#353a3c"/><path d="M41 31h18v27q-9 4-18 0z" fill="#f1f3f1"/><path d="M43 34v19" stroke="#fff" stroke-width="3" opacity=".8"/><path d="M44 15h12" stroke="#777e80" stroke-width="2"/></svg>',
        };
        const rows = [
          ['BOX', 'TRK498271603', 'Kitchen Blender Pro', 'Redelivery requested', '6 May 2025', 'warm'],
          ['HEADPHONES', 'TRK775614320', 'Wireless Headphones', 'Delivered', '28 Apr 2025', 'ok'],
          ['JACKET', 'TRK662309118', 'Men’s Hiking Jacket', 'Delivered', '22 Apr 2025', 'ok'],
          ['LAMP', 'TRK881045776', 'Table Lamp', 'Delivered', '14 Apr 2025', 'ok'],
          ['COFFEE', 'TRK339017554', 'Coffee Maker', 'Delivered', '3 Apr 2025', 'ok'],
          ['SHOES', 'TRK904883221', 'Running Shoes', 'Returned', '12 Mar 2025', 'bad'],
          ['BAG', 'TRK771299405', 'Daypack 20L', 'Delivered', '28 Feb 2025', 'ok'],
          ['BOTTLE', 'TRK558331990', 'Insulated Water Bottle', 'Delivered', '17 Feb 2025', 'ok'],
        ];
        for (const [icon, code, product, status, date, tone] of rows) {
          const row = util.el('div', `delivery-row ${tone === 'warm' ? 'is-current' : ''}`, records);
          const thumb = util.el('span', `delivery-thumb art-${icon.toLowerCase()}`, row);
          thumb.innerHTML = productArt[icon];
          const info = util.el('div', 'delivery-info', row);
          util.el('strong', '', info, code);
          util.el('span', '', info, product);
          const meta = util.el('div', 'delivery-meta', row);
          util.el('span', `delivery-status ${tone}`, meta, status);
          util.el('span', '', meta, date);
        }
        Object.assign(_c, { indexHead, productArt, records, rows, search, stage });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, placement, rng, util } = _c;
        let { submit } = _c;
        {
          const foot = util.el('footer', 'ref-foot', document.body);
          rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          const dock = util.el('nav', 'delivery-dock', foot);
          const dockItems = [
            ['⌂', 'Home'],
            ['♧', 'Deliveries'],
            ['⬡', 'Inventory'],
            ['▥', 'Reports'],
            ['⚙', 'Settings'],
          ];
          for (const [icon, text] of dockItems) {
            const item = util.el('div', `dock-item ${text === 'Deliveries' ? 'active' : ''}`, dock);
            util.el('span', 'dock-icon', item, icon);
            util.el('span', '', item, text);
          }
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        Object.assign(_c, { submit });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-recall-info-code-04',
    template: 'site/base',
    design: { parts },
  });
})();
