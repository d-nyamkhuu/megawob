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
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'promo') {
        const artwork = util.el('div', 'relay-promo-art', box);
        const plane = util.svg('svg', {viewBox:'0 0 100 100', fill:'none'}, artwork);
        util.svg('path', {d:'M16 44 82 16 65 84 45 62 33 76 34 54Z', fill:'#087fff'}, plane);
        util.svg('path', {d:'M34 54 82 16 45 62', stroke:'#fff', 'stroke-width':3}, plane);
        util.el('strong', 'relay-promo-title', box, 'Get product updates');
      }
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo') {
        const email = util.el('input', 'relay-promo-email', box);
        email.type = 'email'; email.placeholder = 'Enter your email address'; email.setAttribute('aria-label', 'Email address');
      }
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => {
          if (how) {
            ctx.dismiss(how);
          } else env.log('overlay-click', { label });
        });
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
        const x = util.el('button', 'relay-promo-close', box, '×');
        x.setAttribute('aria-label', word ? word('close') : 'Close'); x.addEventListener('click', () => ctx.dismiss('close'));
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      if (kind === 'banner') {
        document.querySelector('.irix-tabs').after(el);
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.theme': (base, S) => function (_c) {
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
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // Fixed workstation palette: keep the original draws above for seed stability.
      root.style.setProperty('--bg', '#f5f6f8');
      root.style.setProperty('--panel', '#ffffff');
      root.style.setProperty('--fg', '#111827');
      root.style.setProperty('--muted', '#475569');
      root.style.setProperty('--line', '#e1e5eb');
      root.style.setProperty('--accent', '#ff5a08');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
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
      const frame = util.el('div', 'irix-titlebar', document.body);
      util.el('span', 'irix-menu-glyph', frame, '≡');
      util.el('strong', 'irix-title', frame, 'Relayboard  -  Customer Support Flow');
      const win = util.el('div', 'irix-window-controls', frame);
      for (const label of ['−', 'T', '×']) util.el('button', 'irix-winbtn', win, label);
      const menu = util.el('nav', 'irix-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Workflow', 'Node', 'Window', 'Help']) util.el('span', 'irix-menuitem', menu, label);
      const tabs = util.el('nav', 'irix-tabs', document.body);
      const relayBrand = util.el('strong', 'relay-brand', tabs);
      const relayMark = util.el('span', 'relay-brand-mark', relayBrand);
      for (let i = 0; i < 6; i++) util.el('i', '', relayMark);
      util.el('span', '', relayBrand, 'Relayboard');
      for (const [i, label] of ['Workflows', 'Integrations', 'Activity', 'Templates', 'Settings'].entries()) {
        const tab = util.el('button', i === 0 ? 'irix-tab active' : 'irix-tab', tabs, label);
        tab.type = 'button';
      }
      util.el('span', 'relay-top-spacer', tabs);
      const navIcon = (parent, path) => {
        const svg = util.svg('svg', {viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':1.8, 'stroke-linecap':'round', 'stroke-linejoin':'round'}, parent);
        util.svg('path', {d:path}, svg);
      };
      navIcon(util.el('span', 'relay-top-icon', tabs), 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6');
      navIcon(util.el('span', 'relay-top-icon', tabs), 'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5zm5 3h4');
      util.el('span', 'relay-avatar', tabs, 'JD');
      const summary = util.el('section', 'relay-summary', document.body);
      const intro = util.el('article', 'relay-summary-card relay-intro', summary);
      navIcon(util.el('div', 'relay-app-icon', intro), 'M3 5h18v14H3zM3 5l9 8 9-8');
      const titleBlock = util.el('div', 'relay-intro-copy', intro);
      util.el('strong', '', titleBlock, 'Customer Onboarding');
      util.el('span', 'relay-workflow-description', titleBlock, 'Welcomes new customers, creates an account, and sends a series of messages.');
      const chips = util.el('div', 'relay-chips', titleBlock);
      for (const label of ['Onboarding', 'Marketing', '6 steps']) util.el('span', '', chips, label);
      const meta = util.el('article', 'relay-summary-card relay-meta', summary);
      util.el('div', '', meta, 'Status');
      util.el('strong', '', meta, '●  Active');
      util.el('div', '', meta, 'Last edited');
      util.el('strong', '', meta, 'Apr 24, 2026, 10:14 AM');
      util.el('span', 'relay-editor-by', meta, 'by Jordan Diaz');
      util.el('div', '', meta, 'Version');
      util.el('strong', '', meta, '3.2.0');
      const stats = util.el('article', 'relay-summary-card relay-stats', summary);
      util.el('div', '', stats, 'Runs (30 days)');
      util.el('strong', '', stats, '1,284');
      util.el('div', '', stats, 'Success rate');
      util.el('strong', '', stats, '98%');
      Object.assign(_c, { chips, collide, cr, decoys, frame, intro, label, menu, meta, nav, navIcon, placement, relayBrand, relayMark, sidebar, stats, summary, tabs, titleBlock, wantFooter, win });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { chips, ctx, display, header, titleBlock, util } = _c;
      if (display === 'header') {
        titleBlock.querySelector('.relay-workflow-description').hidden = true;
        const note = util.el('div', 'ref-instruction', titleBlock, ctx.instruction);
        titleBlock.insertBefore(note, chips);
      }
      else util.el('div', 'ref-spacer', header);
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, tabs, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools relay-end-tools', tabs);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, tabs, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side relay-workspace-menu', tabs);
        side.hidden = true;
        tabs.querySelector('.irix-tab').addEventListener('click', () => { side.hidden = !side.hidden; });
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-use-workflow-editor-remove-04',
    template: 'site/base',
    design: { parts },
  });
})();
