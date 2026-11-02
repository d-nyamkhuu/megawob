// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';
  const assetRoot = new URL('.', document.currentScript.src);

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const heading = document.querySelector('.studio-heading');
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          util.el('div', 'studio-envelope', box, '✉');
          util.el('h2', 'studio-overlay-title', box, 'Get product updates');
        }
        if (kind === 'chat') util.el('h2', 'studio-overlay-title', box, 'Need help?');
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo' || kind === 'chat') {
          const input = util.el('input', 'studio-overlay-input', box);
          input.type = 'text';
          input.placeholder = kind === 'promo' ? 'Your email address' : 'Type a message…';
          input.setAttribute('aria-label', kind === 'promo' ? 'Email address' : 'Message');
        }
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
        if (kind === 'promo') {
          dismiss.classList.add('studio-overlay-close');
          dismiss.title = dismiss.textContent;
          dismiss.setAttribute('aria-label', dismiss.textContent);
          dismiss.textContent = '×';
        }
        if (kind === 'banner') {
          if (heading) heading.before(el);
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = document.documentElement.clientWidth;
        const H = document.documentElement.clientHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = true;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'Studio');
          brand.dataset.role = 'brand';
          const appIcon = util.el('span', 'app-title-icon', brand);
          appIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="15" cy="4" r="2.2" fill="#233e54"/><path d="m12 8 4 2 3-3M12 8l-3 5 5 2-2 6M10 12l-5 4-3 5M12 8 7 7 4 11" fill="none" stroke="#233e54" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          rng.sample(content.NAV_ITEMS, rng.int(3, 5));
          for (const item of ['Projects', 'Create', 'Assets', 'Team', 'Reports']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        const controls = util.el('div', 'app-window-controls', header);
        controls.setAttribute('aria-hidden', 'true');
        util.el('span', 'app-window-minimize', controls, '−');
        util.el('span', 'app-window-maximize', controls, '□');
        util.el('span', 'app-window-close', controls, '×');
        Object.assign(_c, { header });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);

        // Swiss editorial application frame: horizontal tabs and an index of recent records.
        header.classList.add('studio-header');
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, ctx, display, header, local, lr, rng, sidebar, util, word } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        const menu = util.el('div', 'app-menu', body);
        for (const item of ['File', 'Edit', 'View', 'Member', 'Tools', 'Reports', 'Help']) {
          util.el('span', 'app-menu-item', menu, item);
        }
        const toolbar = util.el('div', 'app-toolbar', body);
        const iconArt = {
          New: '<path d="M6 2h13l7 7v23H6z" fill="url(#paper)" stroke="#476d95"/><path d="M19 2v8h7" fill="#e0eaf7" stroke="#476d95"/>',
          TreePage: '<path d="M5 3h17l8 8v22H5z" fill="#d0e5fc" stroke="#345e8a" stroke-width="1.4"/><path d="M22 3v9h8" fill="#f3f8ff" stroke="#345e8a"/><path d="M7 5v26h21" fill="none" stroke="#fff" stroke-opacity=".8"/>',
          TreeFolder: '<path d="M3 8h12l4 4h13v21H3z" fill="#f0be46" stroke="#85641f" stroke-width="1.3"/><path d="M4 15h27v16H4z" fill="url(#gold)"/><path d="M5 16h25M5 17v13" fill="none" stroke="#fff6c7"/>',
          Open: '<path d="M2 9V5h12l4 4h13v21H2z" fill="#eeb633" stroke="#8a6414"/><path d="M2 30 7 13h27l-6 17z" fill="url(#gold)" stroke="#8a6414"/>',
          Print: '<path d="M9 2h18v11H9z" fill="url(#paper)" stroke="#4c6077"/><rect x="3" y="12" width="30" height="17" rx="3" fill="url(#metal)" stroke="#445a72"/><path d="M9 24h18v9H9z" fill="white" stroke="#4c6077"/><path d="M11 27h14m-14 3h14" stroke="#7490ac"/><circle cx="28" cy="17" r="1.5" fill="#2e8b41"/>',
          Reports: '<path d="M5 5h24v28H5z" fill="url(#paper)" stroke="#365b8a"/><rect x="12" y="2" width="10" height="6" rx="2" fill="#c4d5e7" stroke="#365b8a"/><path d="m9 13 2 2 4-5m-6 11 2 2 4-5m-6 11 2 2 4-5m3-12h7m-7 8h7m-7 8h7" fill="none" stroke="#315b8a"/><path d="m21 18 10-13 3 2-10 13-4 2z" fill="#d4e1ef" stroke="#365b8a"/>',
          Preferences: '<path d="m15 2 6 0 1 5 4 2 5-2 3 5-4 4v5l4 3-3 6-5-2-4 2-1 5h-6l-1-5-4-2-5 2-3-6 4-3v-5l-4-4 3-5 5 2 4-2z" fill="url(#gear)" stroke="#365879"/><circle cx="18" cy="18" r="6" fill="#eff6ff" stroke="#365879"/>',
        };
        const iconMarkup = label => label === 'Members'
          ? `<img src="${new URL('assets/members.svg', assetRoot).href}" alt="">`
          : `<svg viewBox="0 0 36 36" aria-hidden="true"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="white"/><stop offset="1" stop-color="#e4edf6"/></linearGradient><linearGradient id="gold" x2="0" y2="1"><stop stop-color="#fff7ad"/><stop offset=".45" stop-color="#ffd453"/><stop offset="1" stop-color="#e5a116"/></linearGradient><linearGradient id="metal" x2="0" y2="1"><stop stop-color="#f5f7f8"/><stop offset=".5" stop-color="#b3c4d5"/><stop offset="1" stop-color="#7b94ae"/></linearGradient><linearGradient id="gear" x2="0" y2="1"><stop stop-color="#b8d5f4"/><stop offset="1" stop-color="#5b8fc5"/></linearGradient></defs>${iconArt[label]}</svg>`;
        for (const [icon, label] of [
          ['📄', 'New'], ['📂', 'Open'], ['🖨', 'Print'],
          ['👥', 'Members'], ['📋', 'Reports'], ['⚙', 'Preferences'],
        ]) {
          const item = util.el('div', 'app-tool', toolbar);
          util.el('span', 'app-tool-icon', item).innerHTML = iconMarkup(label);
          util.el('span', 'app-tool-label', item, label);
        }
        const records = util.el('aside', 'studio-records', body);
        util.el('h2', 'studio-records-title', records, 'Recent Items');
        records.replaceChildren();
        util.el('h2', 'studio-records-title', records, 'Members');
        const tree = util.el('div', 'member-tree', records);
        const treeRow = (text, depth, icon, active) => {
          const row = util.el('div', `member-tree-row${active ? ' selected' : ''}`, tree);
          row.dataset.depth = String(depth);
          row.style.paddingLeft = `${text === 'Groups' || text === 'Reports' ? 40 : 30 + depth * 32}px`;
          if (text === 'All Members' || text === 'Groups') util.el('span', 'member-tree-expander', row, '−');
          const image = util.el('span', 'member-tree-icon', row);
          image.innerHTML = text === 'All Members' ? iconMarkup('Members') : iconMarkup(depth ? 'TreePage' : 'TreeFolder');
          util.el('span', 'member-tree-label', row, text);
        };
        treeRow('All Members', 0, '👥', true);
        treeRow('Active', 1, '📄', false);
        treeRow('Pending', 1, '📄', false);
        treeRow('Inactive', 1, '📄', false);
        treeRow('Groups', 0, '📁', false);
        treeRow('Reports', 0, '📁', false);
        const recent = [
          ['Cherry', 'Apr 14, 2016', '#c7353c'],
          ['Ocean', 'Apr 12, 2016', '#2374ad'],
          ['Lime', 'Apr 10, 2016', '#71a83d'],
          ['Sunflower', 'Apr 8, 2016', '#f7c51c'],
          ['Slate', 'Apr 6, 2016', '#778794'],
          ['Violet', 'Apr 3, 2016', '#8960b7'],
          ['Mint', 'Mar 30, 2016', '#59bca7'],
          ['Coral', 'Mar 28, 2016', '#ed7258'],
          ['Sky', 'Mar 25, 2016', '#69c2df'],
          ['Sand', 'Mar 22, 2016', '#cfc3a8'],
        ];
        for (const [title, date, color] of recent) {
          const row = util.el('div', 'studio-record', records);
          const sw = util.el('i', 'studio-record-swatch', row);
          sw.style.background = color;
          const copy = util.el('span', 'studio-record-copy', row);
          util.el('span', 'studio-record-name', copy, title);
          util.el('span', 'studio-record-date', copy, date);
        }
        const main = util.el('div', 'studio-main', body);
        const heading = util.el('div', 'studio-heading', main);
        util.el('h1', 'studio-title', heading, 'New Item');
        if (display === 'header') heading.append(header.querySelector('.ref-instruction'));
        const summary = util.el('div', 'member-summary', main);
        const summaryLeft = util.el('div', 'member-summary-col', summary);
        const summaryRow = (parent, label, value) => {
          const row = util.el('p', '', parent);
          util.el('span', '', row, label);
          util.el('span', value.startsWith('(') ? 'record-unset' : '', row, value);
        };
        summaryRow(summaryLeft, 'Member ID:', '(new)');
        summaryRow(summaryLeft, 'Name:', '(not set)');
        summaryRow(summaryLeft, 'Status:', 'Pending');
        const summaryRight = util.el('div', 'member-summary-col', summary);
        summaryRow(summaryRight, 'Group:', '(none)');
        summaryRow(summaryRight, 'Member Since:', '—');
        summaryRow(summaryRight, 'Last Updated:', '—');
        util.el('div', 'studio-rule', main);
        if (sidebar) {
          // Preserve the frame draws without the inherited navigation rail.
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        }
        const workspace = util.el('div', 'studio-workspace', main);
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', workspace);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        const stage = util.el('main', 'ref-stage', workspace);
        stage.classList.add('studio-stage');
        // Reuse the shared end/decoy controls in the application's icon toolbar.
        if (_c.headerTools) toolbar.append(_c.headerTools);
        const inspector = util.el('aside', 'member-inspector', body);
        util.el('h2', '', inspector, 'Member Details');
        const details = util.el('section', '', inspector);
        for (const [label, value] of [['Member ID:', '(new)'], ['Name:', '(not set)'], ['Employer:', '(not set)'], ['Username:', '(not set)'], ['Birth Date:', '(not set)']]) {
          const row = util.el('p', '', details);
          util.el('span', '', row, label);
          util.el('em', '', row, value);
        }
        const group = util.el('section', '', inspector);
        for (const [label, value] of [['Group:', '(none)'], ['Status:', 'Pending'], ['Member Since:', '—'], ['Last Updated:', '—']]) {
          const row = util.el('p', '', group);
          util.el('span', '', row, label);
          util.el('span', '', row, value);
        }
        const prefs = util.el('section', '', inspector);
        util.el('p', '', prefs, 'Report Frequency: (not set)');
        util.el('p', '', prefs, 'Profile Color:  □  (not set)');
        Object.assign(_c, { body, heading, main, recent, records, stage, workspace });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { closeLabel, ctx, display, heading, util } = _c;
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', heading);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.panel': (base, S) => function (_c) {},
    'frame.stage': (base, S) =>
      function (_c) {
        const { stage } = _c;
        S.frameAlign(_c, stage);
      },
  };

  env.site({
    name: 'design-complete-goals-profile-05',
    template: 'site/base',
    design: { parts },
  });
})();
