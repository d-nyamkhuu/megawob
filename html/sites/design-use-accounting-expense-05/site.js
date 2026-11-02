// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#111a24', panel: '#192431', fg: '#e8f0fa', muted: '#aab9cc', line: '#344556' },
    dark: { bg: '#111a24', panel: '#192431', fg: '#e8f0fa', muted: '#aab9cc', line: '#344556' },
    warm: { bg: '#111a24', panel: '#192431', fg: '#e8f0fa', muted: '#aab9cc', line: '#344556' },
  };

  const ACCENTS = ['#1688ff', '#1688ff', '#1688ff', '#1688ff', '#1688ff', '#1688ff'];

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'banner') document.querySelector('.ref-task').after(el);
      if (kind === 'cookie' || kind === 'banner') {
        const svg = util.svg('svg', {viewBox:'0 0 24 24', class:'ledger-overlay-icon', 'aria-hidden':'true'}, box);
        const path = kind === 'cookie' ? 'M21 11A6 6 0 0 1 13 3a9 9 0 1 0 8 8zM7 8h.1M6 14h.1M11 17h.1M14 12h.1' : 'M3 9h6l10-5v16L9 15H3zM7 15l2 7h3l-2-7M22 9v6';
        util.svg('path', {d:path}, svg);
      }
      if (kind === 'chat') util.el('h3', 'ledger-chat-title', box, 'Need help?');
      if (kind === 'promo') {
        const art = util.el('div', 'ledger-newsletter-art', box);
        const svg = util.svg('svg', {viewBox:'0 0 200 180', 'aria-hidden':'true'}, art);
        util.svg('path', {d:'M20 75L100 10l80 65v90H20z', fill:'#5566eb'}, svg);
        util.svg('path', {d:'M45 25h110v110H45z', fill:'#e7eaff'}, svg);
        util.svg('path', {d:'M65 50h70M65 70h70M65 90h55', stroke:'#8996fb', 'stroke-width':7}, svg);
        util.svg('path', {d:'M20 75l80 60 80-60v90H20z', fill:'#7b8bff'}, svg);
        util.el('h3', 'ledger-newsletter-title', box, 'Get product updates');
      }
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo') {
        const email = util.el('input', 'ledger-newsletter-email', box);
        email.type = 'email'; email.placeholder = 'Your email address'; email.setAttribute('aria-label', 'Your email address');
        const preference = util.el('label', 'ledger-newsletter-preference', box);
        const check = util.el('input', '', preference); check.type = 'checkbox';
        util.el('span', '', preference, 'Send me product updates and tips');
      }
      if (kind === 'chat') {
        const input = util.el('input', 'ledger-chat-input', box);
        input.placeholder = 'Type a message…'; input.setAttribute('aria-label', 'Type a message');
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
        const close = util.el('button', 'ledger-overlay-close', box, '×');
        close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      const paper = document.querySelector('.ledger-paper');
      if (paper) {
        paper.style.zoom = '1';
        const pane = paper.parentElement.parentElement;
        if (pane.clientHeight) paper.style.zoom = String(Math.max(.6, Math.min(1, (pane.clientHeight - 1) / paper.scrollHeight)));
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
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
      const titlebar = util.el('div', 'ledger-titlebar', document.body);
      const drawIcon = (parent, path, cls) => {
        const svg = util.svg('svg', {viewBox:'0 0 24 24', class:cls || 'ledger-icon', 'aria-hidden':'true'}, parent);
        util.svg('path', {d:path}, svg);
        return svg;
      };
      const brandMark = util.el('span', 'ledger-mark', titlebar);
      drawIcon(brandMark, 'M2 8h5v14H2zM10 2h5v20h-5zM18 6h4v16h-4z', 'ledger-logo-svg');
      brandMark.setAttribute('aria-hidden', 'true');
      util.el('span', 'ledger-name', titlebar, 'FinLedger');
      const windowControls = util.el('div', 'ledger-window-controls', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'ledger-window-control', windowControls, glyph);
      Object.assign(_c, { brandMark, collide, cr, decoys, drawIcon, label, nav, placement, sidebar, titlebar, wantFooter, windowControls });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, ctx, display, drawIcon, header, local, nav, rng, util } = _c;
      const { K } = S;
      {
        const n = util.el('nav', 'ref-nav', header);
        // Keep the seeded navigation sampling for episode determinism; this design has fixed app sections.
        if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Dashboard', 'Banking', 'Expenses', 'Invoices', 'Accounting', 'Reports', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const search = util.el('div', 'ledger-search', header);
      drawIcon(search, 'M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0');
      util.el('span', '', search, 'Search transactions...');
      const bell = util.el('span', 'ledger-bell', header);
      drawIcon(bell, 'M9 20h6M5 17h14l-2-3V9a5 5 0 0 0-10 0v5zM12 2v2');
      util.el('span', 'ledger-avatar', header, 'JD');
      const summary = util.el('section', 'ledger-summary', document.body);
      const summaryHead = util.el('div', 'ledger-summary-head', summary);
      util.el('strong', 'ledger-summary-title', summaryHead, 'Expenses');
      util.el('span', 'ledger-report-picker', summaryHead, 'April 2024 - Team Expenses　⌄');
      if (display === 'header') util.el('div', 'ref-instruction ledger-instruction', summaryHead, ctx.instruction);
      const metrics = util.el('div', 'ledger-metrics', summary);
      for (const [value, label] of [['6', 'Receipts'], ['$892.17', 'Total Amount'], ['$892.17', 'Ready to File'], ['0', 'Flagged']]) {
        const metric = util.el('div', 'ledger-metric', metrics);
        util.el('strong', '', metric, value);
        util.el('span', '', metric, label);
      }
      const policy = util.el('div', 'ledger-policy', summary);
      const policyIcon = util.el('span', 'ledger-policy-icon', policy);
      drawIcon(policyIcon, 'M16 22H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v13zM16 22v-5h4M6 7h10M6 11h10M6 15h6');
      const policyCopy = util.el('div', '', policy);
      util.el('strong', '', policyCopy, 'Policy');
      util.el('span', '', policyCopy, 'Reimbursable expenses ≤ $1,000');
      util.el('span', '', policyCopy, 'Auto-approve');
      util.el('button', 'ledger-policy-button', policy, 'View Policy');
      Object.assign(_c, { bell, metrics, policy, policyCopy, policyIcon, search, summary, summaryHead });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, titlebar, util, wantFooter, windowControls } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      if (headerTools.childElementCount) titlebar.insertBefore(headerTools, windowControls);
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { display, summaryHead, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      S.frameSidebar(_c, body);
      const inspector = util.el('aside', 'ledger-inspector', body);
      util.el('h2', '', inspector, 'Report Properties');
      const field = (label, value, cls) => {
        util.el('label', '', inspector, label);
        const input = util.el(cls === 'area' ? 'textarea' : 'div', 'ledger-property ' + (cls || ''), inspector, value);
        return input;
      };
      field('Report Name', 'April Expenses');
      field('Report Period', 'Apr 1, 2018  –  Apr 30, 2018　▦');
      field('Project', 'Client Meeting　⌄');
      field('Description', '', 'area');
      util.el('h2', 'ledger-policy-head', inspector, 'Policy & Limits');
      util.el('div', 'ledger-policy-row', inspector, 'Meals & Entertainment　　 ≤ $75.00　　 ✓');
      util.el('div', 'ledger-policy-row', inspector, 'Ground Transportation　　 ≤ $50.00　　 ✓');
      util.el('div', 'ledger-policy-row', inspector, 'Lodging　　 ≤ $200.00　　 ✓');
      util.el('div', 'ledger-policy-row', inspector, 'Office Supplies　　 ≤ $100.00　　 ✓');
      util.el('a', 'ledger-policy-link', inspector, 'View full policy');
      util.el('h2', 'ledger-policy-head', inspector, 'Report Summary');
      util.el('div', 'ledger-policy-row', inspector, 'Receipts　　　　　　　　　4');
      util.el('div', 'ledger-policy-row', inspector, 'Total Amount (USD)　　　$165.74');
      util.el('div', 'ledger-policy-row', inspector, 'Uncategorized　　　　　　　0');
      if (display !== 'header') util.el('div', 'ref-spacer ledger-summary-spacer', summaryHead);
      Object.assign(_c, { body });
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-accounting-expense-05',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
