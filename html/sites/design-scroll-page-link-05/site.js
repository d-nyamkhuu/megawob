// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
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
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, sidebarDraw, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, nav, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        {
          if (display !== 'header' || nav) rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header);
          brand.dataset.role = 'brand';
          const pines = util.el('span', 'ref-pine-mark', brand);
          pines.setAttribute('aria-hidden', 'true');
          pines.innerHTML =
            '<svg viewBox="0 0 20 20"><path d="M3 17C2 8 8 2 17 3c1 9-5 15-14 14z" fill="#4c9a3c" stroke="#2b6a24"/></svg>';
          util.el('span', 'ref-brand-copy', brand, 'EverNote');
          const wc = util.el('span', 'ref-wctl', brand);
          wc.innerHTML = '<i>▁</i><i>❐</i><i class="x">✕</i>';
          const n = util.el('nav', 'ref-nav', header);
          const oldNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          for (const item of ['File', 'Edit', 'View', 'Note', 'Format', 'Tools', 'Help']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
          const tb = util.el('div', 'ref-toolbar', header);
          const sv = (name) => {
            const shapes = {
              note: '<rect x="4" y="5" width="17" height="23" rx="2" fill="url(#tb-paper)"/><path d="M7 4v5m4-5v5m4-5v5m4-5v5" stroke="#6e6a4b" stroke-width="2.4"/><path d="M8 13h10M8 17h8M8 21h5" stroke="#9f9573"/><path d="m16 23 11-14 3 3-11 14-5 2z" fill="url(#tb-gold)"/><path d="m27 9 3 3M17 23l2 3" stroke="#815d30"/><path d="m15 25-1 3 4-1" fill="#655845"/>',
              folder: '<path d="M3 8V4h10l3 4h13v19H3z" fill="url(#tb-paper)"/><path d="M2 11h29l-4 17H2z" fill="url(#tb-gold)"/><path d="M4 13h24" stroke="#fff4be"/><path d="M5 5h7l2 3" fill="none" stroke="#fff9de"/>',
              tags: '<path d="m3 7 6-4 11 2 8 10-12 13L3 14z" fill="url(#tb-paper)"/><path d="m12 5 6-2 11 10-12 15-9-10V9z" fill="url(#tb-gold)"/><circle cx="15" cy="9" r="2.3" fill="#fff8d8"/><path d="m20 8 6 6-9 11" fill="none" stroke="#f9dfa0"/>',
              sync: '<path d="M5 13C5 2 21-1 26 8l3-3v10H19l4-4C20 5 11 7 10 13z" fill="url(#tb-green)" stroke="#426341"/><path d="M27 19c-1 12-17 13-22 4l-3 3V16h10l-4 4c3 6 12 5 14-1z" fill="url(#tb-green)" stroke="#426341"/><path d="M7 10c2-7 12-8 16-3M25 22c-3 6-12 7-17 2" stroke="#d9e6b5" fill="none"/>',
              trash: '<path d="M8 8h17l-2 21H10z" fill="url(#tb-metal)" stroke="#807d72"/><path d="M6 7h21M12 5V2h8v3" fill="none" stroke="#7c7a6d" stroke-width="2"/><path d="m12 11 1 15m4-15v15m5-15-1 15" fill="none" stroke="#8e8c80"/><path d="M10 9h13" stroke="#fffef1"/>'
            };
            return '<svg viewBox="0 0 33 33" width="30" height="30"><defs><linearGradient id="tb-paper" x2=".3" y2="1"><stop stop-color="#fffbea"/><stop offset="1" stop-color="#e6d6a5"/></linearGradient><linearGradient id="tb-gold" x2=".2" y2="1"><stop stop-color="#ffe2a0"/><stop offset=".4" stop-color="#eac46f"/><stop offset="1" stop-color="#d8a041"/></linearGradient><linearGradient id="tb-green" x2="0" y2="1"><stop stop-color="#a7c083"/><stop offset="1" stop-color="#5f8d48"/></linearGradient><linearGradient id="tb-metal" x2="1" y2=".2"><stop stop-color="#d5d4c9"/><stop offset=".5" stop-color="#f0eee3"/><stop offset="1" stop-color="#b0afa6"/></linearGradient></defs><g stroke="#796447" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">' + shapes[name] + '</g></svg>';
          };
          for (const [ic, t] of [
            [sv('note'), 'New Note'],
            [sv('folder'), 'All Notes'],
            [sv('tags'), 'Tags'],
            [sv('sync'), 'Sync'],
            [sv('trash'), 'Delete'],
          ]) {
            const b = util.el('span', 'ref-tb', tb);
            util.el('b', '', b).innerHTML = ic;
            b.append(t);
            b.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: t }));
          }
          util.el('span', 'ref-search', tb, 'Search notes');
        }
        Object.assign(_c, { header });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const storeIcons = util.el('span', 'ref-store-icons', headerTools);
        storeIcons.setAttribute('aria-hidden', 'true');
        storeIcons.innerHTML =
          '<svg viewBox="0 0 160 36" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#74142b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="17" cy="15" r="9"/><path d="m24 22 8 8"/><circle cx="77" cy="10" r="7"/><path d="M64 31c1-8 5-12 13-12s12 4 13 12z"/><path d="M120 7h7l6 19h20l5-14h-27M138 31h.1M153 31h.1"/></g><circle cx="151" cy="5" r="10" fill="#08717a"/><text x="151" y="9" text-anchor="middle" fill="#fff" font="bold 12px Arial">0</text></svg>';
        Object.assign(_c, { headerTools, storeIcons, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          const side = util.el('aside', 'ref-side', body);
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
          util.el('h3', 'ref-ins-h', side, 'Page Details');
          for (const [k, v] of [['Title', 'EverNote Help Center'], ['Type', 'Help Article'], ['Last Updated', 'Apr 12, 2010'], ['Size', '24 KB']]) {
            const r = util.el('div', 'ref-kv', side);
            util.el('span', '', r, k);
            util.el('span', '', r, v);
          }
          const tr = util.el('div', 'ref-kv', side);
          util.el('span', '', tr, 'Tags');
          const tg = util.el('span', 'ref-tags', tr);
          for (const t of ['help', 'getting started', 'features', 'sync']) util.el('em', '', tg, t);
          const inert = (a) => a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'side', label: a.textContent }); });
          util.el('h3', 'ref-ins-h', side, 'On This Page');
          const ol = util.el('ol', 'ref-ins-list', side);
          for (const t of ['Getting Started', 'Key Features', 'Using EverNote', 'Sync Across Devices', 'Plans and Pricing', 'Changelog', 'Tips and Resources']) inert(util.el('a', '', util.el('li', '', ol), t));
          util.el('h3', 'ref-ins-h', side, 'Related Articles');
          const ul = util.el('ul', 'ref-ins-list ref-rel', side);
          for (const t of ['Creating and editing notes', 'Using tags effectively', 'Syncing with mobile devices', 'Sharing notes with others', 'EverNote security overview']) inert(util.el('a', '', util.el('li', '', ul), t));
        }
        Object.assign(_c, { body });
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      const side = _c.body.querySelector('.ref-side');
      if (panel && side) side.insertBefore(panel, side.firstChild.nextSibling);
    },
  };

  env.site({
    name: 'design-scroll-page-link-05',
    template: 'site/base',
    design: { parts },
  });
})();
