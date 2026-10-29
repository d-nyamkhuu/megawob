// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const THEMES = {
    light: { bg: '#edf8ff', panel: '#ffffff', fg: '#171724', muted: '#687f9f', line: '#a5cee9' },
    dark: { bg: '#edf8ff', panel: '#ffffff', fg: '#171724', muted: '#687f9f', line: '#a5cee9' },
    warm: { bg: '#edf8ff', panel: '#ffffff', fg: '#171724', muted: '#687f9f', line: '#a5cee9' },
  };

  const ACCENTS = ['#087bc6', '#087bc6', '#087bc6', '#087bc6', '#087bc6', '#087bc6'];

  const parts = {
    'frame.tools': (base) =>
      function (_c) {
        base(_c);
        _c.toolbar.append(_c.headerTools);
      },
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        const headerHeight = document.querySelector('.ref-task')?.getBoundingClientRect().bottom || 0;
        const bottomSpace = document.querySelector('.ref-float-dock')
          ? 42
          : document.querySelector('.ref-foot')
            ? 52
            : 0;
        el.style.setProperty('--fin-header-height', headerHeight + 'px');
        el.style.setProperty('--fin-bottom-space', bottomSpace + 'px');
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
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
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const winbar = util.el('div', 'fin-winbar', header);
        const appmark = util.el('span', 'fin-appmark', winbar);
        appmark.innerHTML =
          '<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="mark" x2="0" y2="1"><stop stop-color="#fff37a"/><stop offset="1" stop-color="#55b62e"/></linearGradient></defs><path d="M4 12 13 3l15 7-9 9z" fill="#f3c949" stroke="#527e37"/><path d="m4 16 9-9 15 7-9 9z" fill="url(#mark)" stroke="#397a37"/><path d="m4 20 9-9 15 7-9 9z" fill="#55b9e8" stroke="#366e91"/><path d="M5 21h5v5H5z" fill="#e9f5ff" stroke="#6789a0"/></svg>';
        util.el('strong', 'fin-wintitle', winbar, 'Finance Pro 2006 - Expenses');
        const wincontrols = util.el('div', 'fin-wincontrols', winbar);
        for (const [glyph, label] of [
          ['−', 'Minimize'],
          ['□', 'Maximize'],
          ['×', 'Close'],
        ]) {
          const c = util.el('span', `fin-winctrl fin-${label.toLowerCase()}`, wincontrols, glyph);
          c.setAttribute('aria-label', label);
        }
        const menubar = util.el('nav', 'fin-menubar', header);
        for (const label of ['File', 'Edit', 'View', 'Expenses', 'Banking', 'Reports', 'Tools', 'Help']) {
          const item = util.el('span', 'fin-menuitem', menubar, label);
          item.addEventListener('click', () => env.log('decoy', { what: 'menu', label }));
        }
        const toolbar = util.el('div', 'fin-toolbar', header);
        const toolIcons = {
          Home: '<path d="M23 4h4v9h-4z" fill="#849bb0" stroke="#607588"/><path d="M5 14 16 5l11 9v15H5z" fill="url(#g)" stroke="#748ba0"/><path d="M2 14 16 2l14 12-3 3L16 7 5 17z" fill="#c4d5e5" stroke="#72899e"/><path d="M13 18h7v11h-7z" fill="#6a859c" stroke="#4e6c83"/><path d="M8 16h3v5H8zM22 16h3v5h-3z" fill="#eaf8ff"/><path d="M3 30h26" stroke="#8ca1b1"/>',
          Expenses:
            '<path d="M10 2h18v28H10z" fill="#aac7ff" stroke="#7896d4"/><path d="M7 3h18v27H7z" fill="#eef4ff" stroke="#7397dc"/><path d="M4 5h18v25H4z" fill="url(#g)" stroke="#7297d2"/><path d="M8 10h11M8 14h11M8 18h11M8 22h11M8 26h11" stroke="#6b96db"/><path d="M10 3h7v4h-7z" fill="#dae6ff" stroke="#789ed7"/>',
          Reconcile:
            '<path d="M2 9 16 2l14 7v3H2z" fill="url(#g)" stroke="#6c7d8b"/><path d="M5 13h4v12H5zM14 13h4v12h-4zM23 13h4v12h-4z" fill="#c6d4df" stroke="#647c8e"/><path d="M6 14v10M15 14v10M24 14v10" stroke="#fff"/><path d="M3 25h26v3H3zM1 29h30v2H1z" fill="#9daebd" stroke="#728594"/>',
          Journal:
            '<path d="M2 7q7-4 14 0 7-4 14 0v22q-7-4-14 0-7-4-14 0z" fill="#63aaf0" stroke="#366b9c"/><path d="M5 5q6-2 11 2v19q-5-3-11-1zM27 5q-6-2-11 2v19q5-3 11-1z" fill="url(#g)" stroke="#799ac1"/><path d="M16 7v21" stroke="#5484b8"/><path d="M7 10h6M7 13h6M7 16h6M20 10h5M20 13h5M20 16h5" stroke="#93b6d7"/>',
          Payables:
            '<path d="M8 3h14l6 6v20H8z" fill="url(#g)" stroke="#627b90"/><path d="M22 3v7h6M12 15h12M12 19h12M12 23h9" fill="none" stroke="#627b90" stroke-width="1.5"/><path d="M4 7v23h20" fill="none" stroke="#9aafbd"/>',
          Reports:
            '<path d="M3 17h7v13H3z" fill="#efc637" stroke="#ad8d28"/><path d="M13 3h7v27h-7z" fill="#86cd38" stroke="#568c24"/><path d="M23 8h7v22h-7z" fill="#4aa3ef" stroke="#3476b6"/><path d="M4 18v10M14 4v24M24 9v19" stroke="#fff" opacity=".8"/>',
        };
        for (const [, label] of [
          ['⌂', 'Home'],
          ['▤', 'Expenses'],
          ['♜', 'Reconcile'],
          ['▣', 'Journal'],
          ['▤', 'Payables'],
          ['▥', 'Reports'],
        ]) {
          const item = util.el('div', `fin-tool${label === 'Expenses' ? ' selected' : ''}`, toolbar);
          const icon = util.el('span', 'fin-tool-icon', item);
          icon.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#a9d9f4"/></linearGradient></defs>${toolIcons[label]}</svg>`;
          util.el('span', 'fin-tool-label', item, label);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { appmark, header, menubar, toolIcons, toolbar, winbar, wincontrols });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, ctx, display, local, lr, rng, sidebar, toolIcons, util, word } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        const help = util.el('aside', 'fin-help', body);
        const helphead = util.el('div', 'fin-helphead', help);
        util.el('span', 'fin-help-icon', helphead, '?');
        util.el('strong', '', helphead, 'Help & Tips');
        const helpcopy = util.el('div', 'fin-helpcopy', help);
        util.el('h3', '', helpcopy, 'Entering Expenses from Receipts');
        util.el('p', '', helpcopy, '•  Select a receipt from the list to view the image.');
        util.el(
          'p',
          '',
          helpcopy,
          '•  Enter the date, merchant, category, amount and project exactly as shown on the receipt.',
        );
        util.el('p', '', helpcopy, '•  Use the File Receipt button to add the expense to your report.');
        util.el('h3', 'fin-tips-title', helpcopy, 'Tips');
        util.el('p', '', helpcopy, '•  Keep the amount and coding the same as the receipt.');
        util.el('p', '', helpcopy, '•  Use a clear, legible receipt image.');
        util.el('p', '', helpcopy, '•  You can add multiple receipts to the same report.');
        util.el('p', '', helpcopy, '•  Use projects to track costs by client, department or job.');
        const related = util.el('section', 'fin-related', helpcopy);
        util.el('h3', '', related, 'Related Tasks');
        for (const [icon, title, sub] of [
          ['⇄', 'Reconcile Bank Transactions', 'Match your bank feed with the ledger.'],
          ['▣', 'Enter a Journal Entry', 'Record adjustments and other entries.'],
          ['▤', 'Process Accounts Payable', 'Route invoices for approval.'],
          ['▥', 'Run Reports', 'View expense and ledger reports.'],
        ]) {
          const row = util.el('div', 'fin-related-row', related);
          const art = util.el('span', 'fin-related-icon', row);
          const name = title.startsWith('Enter')
            ? 'Journal'
            : title.startsWith('Process')
              ? 'Payables'
              : title.startsWith('Run')
                ? 'Reports'
                : 'Reconcile';
          const drawing =
            name === 'Reconcile'
              ? '<path d="M5 6h15V2l10 9-10 8v-5H7zM27 26H12v4L2 21l10-8v5h13z" fill="#8ecf32" stroke="#639b25" stroke-width="1.5"/><path d="M7 8h12M25 24H13" stroke="#e6ffb7" stroke-width="2"/>'
              : toolIcons[name];
          art.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="relatedGloss" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#a9d9f4"/></linearGradient></defs>${drawing.replaceAll('url(#g)', 'url(#relatedGloss)')}</svg>`;
          const copy = util.el('span', 'fin-related-copy', row);
          util.el('strong', '', copy, title);
          util.el('small', '', copy, sub);
        }
        if (sidebar) {
          const side = util.el('aside', 'ref-side', body);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
            const a = util.el('a', 'ref-sidelink', side, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
          help.append(side);
        }
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
          help.insertBefore(panel, helpcopy);
        }
        Object.assign(_c, { body, help, helpcopy, helphead, related });
      },
    'frame.panel': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-accounting-expense-04',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
