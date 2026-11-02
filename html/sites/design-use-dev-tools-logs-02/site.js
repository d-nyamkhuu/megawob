// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
      root.dataset.theme = name;
      // Keep the material-paper palette independent of the inherited theme draw.
      for (const [k, v] of Object.entries({bg:'#eef1f5', panel:'#ffffff', fg:'#263249', muted:'#748098', line:'#dce2eb', accent:'#3076fa'})) root.style.setProperty(`--${k}`, v);
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.layout': (base, S) => function (_c) {
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
      document.body.classList.toggle('ref-has-header-note', display === 'header');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'DevWorkspace');
        brand.dataset.role = 'brand';
        brand.textContent = '';
        const logo = util.el('span', 'ref-logo', brand);
        logo.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 29 9 16 16 3 9Z M3 12l12 7v12L3 24Z M29 12l-12 7v12l12-7Z" fill="currentColor"/><path d="m8 9 8-4 8 4-8 4Z" fill="#28477f"/></svg>';
        util.el('span', 'ref-product', brand, 'Acme Platform');
        util.el('span', 'ref-project-chevron', brand, '⌄');
        util.el('span', 'ref-page-name', brand, 'Logs');
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const navLabels = ['Overview', 'Code', 'Pipelines', 'Logs', 'Database', 'Feature Flags', 'Settings'];
        const icons = [
          '<path d="m2 11 10-9 10 9h-4v10h-5v-7h-3v7H5V11Z" fill="currentColor" stroke="none"/>',
          '<path d="m8 6-6 6 6 6m8-12 6 6-6 6"/>',
          '<path d="m12 4-7 15m7-15 7 15M5 19h14"/><circle cx="12" cy="4" r="3" fill="currentColor"/><circle cx="5" cy="19" r="3" fill="currentColor"/><circle cx="19" cy="19" r="3" fill="currentColor"/>',
          '<rect x="3" y="2" width="18" height="20" rx="2" fill="currentColor" stroke="none"/><path d="M7 7h10M7 12h10M7 17h7" stroke="#3a65be" stroke-width="2"/>',
          '<ellipse cx="12" cy="5" rx="9" ry="4" fill="currentColor" stroke="none"/><path d="M3 7v5c0 5 18 5 18 0V7M3 14v5c0 5 18 5 18 0v-5" fill="currentColor" stroke="#1e2d43" stroke-width="1"/>',
          '<path d="M5 22V3m1 1h8l2 2h6v11h-9l-2-2H6" fill="currentColor"/>',
          '<path d="m10 1 4 0 1 4 3 1 3-1 2 4-3 3v2l3 3-2 4-4-1-2 2-1 3h-4l-1-4-3-1-3 1-2-4 3-3v-2L1 9l2-4 4 1 2-2Z" fill="currentColor" stroke="none"/><circle cx="12" cy="13" r="4" fill="#1e2d43" stroke="none"/>',
        ];
        for (const [i, item] of navLabels.entries()) {
          const a = util.el('a', 'ref-navlink', n);
          const icon = util.el('span', 'ref-nav-icon', a);
          icon.innerHTML = `<svg viewBox="0 0 24 26" aria-hidden="true">${icons[i]}</svg>`;
          util.el('span', 'ref-nav-label', a, item);
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
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const utilities = util.el('div', 'ref-utilities', header);
      for (const [what, paths] of [['Search', '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'], ['Notifications', '<path d="M6 9a6 6 0 0 1 12 0v6l2 3H4l2-3Zm4 12h4"/><circle cx="20" cy="3" r="2" fill="#e35154" stroke="none"/>']]) {
        const b = util.el('button', 'ref-utility', utilities);
        b.type = 'button'; b.title = what; b.setAttribute('aria-label', what);
        b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
        b.onclick = () => env.log('decoy', {label: what});
      }
      util.el('span', 'ref-user', utilities, 'JD');
      Object.assign(_c, { headerTools, submit, utilities });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        document.body.classList.add('ref-has-footer');
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
      if (placement === 'floating') {
        document.body.classList.add('ref-has-footer');
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      document.body.classList.toggle('ref-has-footer', !!document.querySelector('.ref-foot button, .ref-foot a, .ref-float-dock'));
      Object.assign(_c, { submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.floating': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-logs-02',
    template: 'site/base',
    design: { parts },
  });
})();
