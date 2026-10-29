// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        const copyBox = kind === 'promo' ? util.el('div', 'lc-promo-content', box) : box;
        if (kind === 'promo') {
          const art = util.el('div', 'lc-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 180 210" aria-hidden="true"><path d="M35 100l55-46 55 46v77H35z" fill="#1478ff"/><rect x="48" y="72" width="84" height="87" rx="5" fill="white"/><path d="M61 89h57M61 101h57M61 113h41" stroke="#8cb4ff" stroke-width="4"/><path d="M35 100l55 44 55-44v77H35z" fill="#1478ff"/><path d="M35 177l42-43m68 43l-42-43" stroke="#b1d2ff" stroke-width="2"/><path d="M137 28v17m-8-8h17M29 53v12m-6-6h12" stroke="#1478ff" stroke-width="3"/></svg>';
          util.el('strong', 'lc-promo-heading', copyBox, 'Get the latest updates');
          const close = util.el('button', 'lc-overlay-close', box, '×');
          close.setAttribute('aria-label', 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
        }
        if (kind === 'chat') util.el('strong', 'lc-chat-heading', box, 'Chat with us');
        if (kind === 'cookie') util.el('span', 'lc-cookie-icon', box, '🍪');
        if (kind === 'banner') util.el('strong', 'lc-announcement-heading', box, 'New budgeting tools are here!');
        util.el(
          'div',
          'ref-ov-text',
          copyBox,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') util.el('div', 'lc-email-placeholder', copyBox, 'Your email address');
        if (kind === 'chat') {
          const compose = util.el('div', 'lc-chat-compose', box);
          util.el('span', '', compose, 'Type a message…');
          util.el('span', '', compose, '➤');
        }
        const row = util.el('div', 'ref-ov-row', copyBox);
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
    'frame.lang': (base, S) =>
      function (_c) {
        const { ctx, rng } = _c;
        // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const lr = rng.fork('chrome/lang');
        const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
        const closeLabel = word ? word('close') : 'Close';
        const svg = (name) => {
          const paths = {
            Transactions: '<rect x="3" y="4" width="20" height="17" rx="3"/><path d="M3 9h20M7 14h4m7 2h1"/>',
            Accounts: '<path d="M3 9l10-6 10 6H3zm2 3v8m5-8v8m6-8v8m5-8v8M2 23h22"/>',
            Budgets: '<path d="M12 3v10h10A10 10 0 1112 3zm4 0v6h6a9 9 0 00-6-6z"/>',
            Reports: '<path d="M4 22V13h3v9m4 0V7h3v15m4 0V2h3v20"/>',
            Categories: '<path d="M3 13L14 2h9v9L12 22z"/><circle cx="18" cy="7" r="1"/>',
            Payees: '<circle cx="13" cy="7" r="4"/><path d="M5 23v-3a8 8 0 0116 0v3H5z"/>',
            Rules:
              '<path d="M10 3h6l1 3 3 1 3 3v6l-3 1-1 3-3 3h-6l-1-3-3-1-3-3v-6l3-1 1-3z"/><circle cx="13" cy="13" r="5"/>',
            list: '<path d="M9 6h14M9 13h14M9 20h14"/><circle cx="3" cy="6" r=".8"/><circle cx="3" cy="13" r=".8"/><circle cx="3" cy="20" r=".8"/>',
            grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="16" y="3" width="7" height="7" rx="1"/><rect x="3" y="16" width="7" height="7" rx="1"/><rect x="16" y="16" width="7" height="7" rx="1"/>',
            help: '<circle cx="13" cy="13" r="9"/><path d="M10 10a3 3 0 116 0c0 2-3 2-3 5m0 3v1"/>',
            tips: '<path d="M9 19h8m-7 3h6M9 16c0-3-3-4-3-8a7 7 0 1114 0c0 4-3 5-3 8z"/>',
            search: '<circle cx="10" cy="10" r="7"/><path d="M15 15l7 7"/>',
          };
          return `<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.Reports}</svg>`;
        };
        Object.assign(_c, { closeLabel, local, lr, svg, word });
      },
    'frame.placement': (base, S) =>
      function (_c) {
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
        const titlebar = util.el('div', 'lc-titlebar', document.body);
        util.el('span', 'lc-appicon', titlebar, '');
        util.el('strong', '', titlebar, 'Transactions');
        const winbuttons = util.el('div', 'lc-window-buttons', titlebar);
        for (const glyph of ['−', '□', '×']) util.el('span', '', winbuttons, glyph);
        const menubar = util.el('div', 'lc-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menubar, item);
        Object.assign(_c, {
          collide,
          cr,
          decoys,
          label,
          menubar,
          nav,
          placement,
          sidebar,
          titlebar,
          wantFooter,
          winbuttons,
        });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { svg, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const tabs = util.el('nav', 'lc-tabs', header);
        for (const [i, item] of ['☷', '▦', '▥'].entries()) {
          const tab = util.el('span', `lc-tab${i === 0 ? ' selected' : ''}`, tabs, item);
          tab.innerHTML = svg(['list', 'grid', 'Reports'][i]);
        }
        const account = util.el('div', 'lc-account', header, 'All Accounts');
        S.frameBrand(_c, header);
        Object.assign(_c, { account, header, tabs });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const {
          collide,
          decoyBtn,
          decoys,
          display,
          endBtn,
          header,
          label,
          placement,
          svg,
          titlebar,
          util,
          wantFooter,
        } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const search = util.el('div', 'lc-search', header, '⌕　 Search transactions');
        search.innerHTML = svg('search') + '<span>Search transactions</span>';
        header.style.setProperty(
          '--lc-tools-width',
          headerTools.children.length ? `${headerTools.offsetWidth + 12}px` : '0px',
        );
        if (display === 'header') {
          const note = header.querySelector('.ref-instruction');
          const height = Math.max(100, note.offsetHeight + 70);
          titlebar.style.height = `${height}px`;
          header.style.height = `${height}px`;
        }
        Object.assign(_c, { headerTools, search, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { display, lr, rng, svg, util, word } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        const side = util.el('aside', 'ref-side', body);
        for (const [icon, item] of [
          ['▣', 'Transactions'],
          ['▤', 'Accounts'],
          ['◷', 'Budgets'],
          ['▥', 'Reports'],
          ['◇', 'Categories'],
          ['♙', 'Payees'],
          ['⚙', 'Rules'],
        ]) {
          const a = util.el('a', `ref-sidelink${item === 'Transactions' ? ' active' : ''}`, side);
          util.el('span', 'lc-nav-icon', a).innerHTML = svg(item);
          util.el('span', '', a, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'sidebar', label: item });
          });
        }
        let panelHeading = null;
        if (display === 'panel') {
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          panelHeading = word ? word(lr.pick(K.panel)) : heading;
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        const stats = util.el('div', 'lc-stats', body);
        for (const [label, value] of [
          ['Rows', '8'],
          ['Columns', '4'],
          ['Cards', '32'],
          ['Status', 'Ready'],
        ]) {
          const cell = util.el('div', 'lc-stat', stats);
          util.el('span', '', cell, label);
          util.el('strong', '', cell, value);
        }
        Object.assign(_c, { body, panelHeading, side, stats });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, ctx, panelHeading, rng, svg, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        stage.style.justifyContent = 'center';
        stage.style.alignItems = 'center';
        const help = util.el('aside', 'lc-help', body);
        if (panelHeading) {
          const panel = util.el('section', 'ref-panel', help);
          util.el('div', 'ref-panel-title', panel, panelHeading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
        }
        const helpCard = (icon, heading, copy, cls) => {
          const card = util.el('section', `lc-help-card ${cls || ''}`, help);
          util.el('span', 'lc-help-icon', card).innerHTML = svg(heading.toLowerCase());
          util.el('strong', '', card, heading);
          util.el('div', 'lc-help-copy', card, copy);
          return card;
        };
        helpCard('?', 'Help', 'This table shows your recent transactions across all accounts.', 'intro');
        const tips = helpCard('♧', 'Tips', '', 'tips');
        const tipList = util.el('ul', '', tips);
        for (const text of [
          'Drag the column dividers to resize columns.',
          'Each column can be set to a different width.',
          'Cell chips show the type, status, and other details for each transaction.',
          'You can use the filters under each column header to narrow the list.',
        ])
          util.el('li', '', tipList, text);
        const legend = util.el('section', 'lc-help-card lc-legend', help);
        util.el('span', 'lc-help-icon', legend).innerHTML = svg('Reports');
        util.el('strong', '', legend, 'Status legend');
        for (const [label, desc, cls] of [
          ['Cleared', 'Transaction is complete.', 'cleared'],
          ['Pending', 'Transaction is processing.', 'pending'],
          ['Failed', 'Transaction did not go through.', 'failed'],
        ]) {
          const row = util.el('div', 'lc-legend-row', legend);
          util.el('span', `lc-status ${cls}`, row, label);
          util.el('span', '', row, desc);
        }
        Object.assign(_c, { help, helpCard, legend, stage, tipList, tips });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, root, titlebar, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        root.style.setProperty('--lc-header-height', `${titlebar.offsetHeight}px`);
        const footer = document.querySelector('.ref-foot');
        root.style.setProperty(
          '--lc-bottom-clearance',
          `${placement === 'floating' ? 70 : footer ? footer.offsetHeight : 0}px`,
        );
        Object.assign(_c, { footer, submit });
      },
    'frame.panel': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-align-layout-columns-03',
    template: 'site/base',
    design: { parts },
  });
})();
