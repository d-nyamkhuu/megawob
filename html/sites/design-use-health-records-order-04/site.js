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
      const header = document.querySelector('.ref-task');
      const bottomTools = document.querySelector('.ref-foot, .ref-float-dock');
      const bottomSpace = bottomTools ? bottomTools.getBoundingClientRect().height : 0;
      const chartBanner = document.querySelector('.ehr-banner');
      if (kind === 'banner') document.querySelector('.ehr-root').append(el);
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${bottomSpace + (kind === 'chat' ? 10 : 0)}px`;
      if (kind === 'promo') { el.style.top = `${Math.max(header.getBoundingClientRect().bottom, chartBanner?.getBoundingClientRect().bottom || 0)}px`; el.style.bottom = `${Math.max(bottomSpace, 10)}px`; }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
      // This design is a fixed monochrome desktop application. Keep the legacy draws above
      // so seeded task/frame streams remain stable, then apply its own window palette.
      for (const [k, v] of Object.entries({ bg: '#e7f0f7', panel: '#f8fbfe', fg: '#10254a', muted: '#536b84', line: '#b4cce0' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#27679f');
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES); // preserve the legacy frame draw
      const brand = util.el('div', 'ref-brand', header);
      const cross = util.svg('svg', {viewBox:'0 0 26 28', class:'ref-brand-icon'}, brand);
      util.svg('path', {d:'M9 2h7v8h8v7h-8v9H9v-9H1v-7h8z',fill:'#54cef4',stroke:'#d9f7ff','stroke-width':'2'}, cross);
      util.svg('path', {d:'M12 3v21M3 13h19',stroke:'#fff','stroke-width':'2'}, cross);
      util.el('span', '', brand, 'Riverside Medical Center');
      brand.dataset.role = 'brand';
      {
        const n = util.el('nav', 'ref-nav', header);
        if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5)); // preserve legacy conditional draws
        const icons = [
          'M8 4h12v19H8zM4 8h10v15H4zM11 7h6M11 11h6M7 12v7M5 15h4',
          'M5 5h17v18H5zM10 3h7v5h-7zM8 12h3M15 12h4M8 17h3M15 17h4',
          'M6 5h15v18H6zM10 3h7v4h-7zM15 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8M15 11v3l2 1',
          'M5 3h17v21H5zM8 7h11M8 11h3M14 11h5M8 15h11M8 19h11',
          'M5 4h10l5 5v14H5zM15 4v6h6M9 12l3 3 6-7',
          'M8 9a5 5 0 1 1 9 0l-1 4 5 4 1 7H3l1-7 5-4zM9 4h8M13 1v7',
          'M3 5v18M3 18h20v5M6 11h16v7H6zM6 8h6v3H6z',
          'M4 5h19v19H4zM8 2v6M18 2v6M4 10h19M8 13h3M15 13h4M8 17h3M15 17h4M8 21h3',
          'M5 3h12l5 5v16H5zM17 3v6h5M8 11h11M8 15h11M8 19h11M8 7h5',
          'M4 7h19v17H4zM9 7V4h9v3M14 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6M10 21h8'
        ];
        for (const [i, item] of ['Patient List', 'Patient Chart', 'Orders', 'Results', 'Medications', 'Nursing', 'Bed Management', 'Scheduling', 'Reports', 'Administration'].entries()) {
          const a = util.el('a', 'ref-navlink', n);
          const svg = util.svg('svg', {viewBox:'0 0 27 28',class:'ref-nav-icon'}, a);
          util.svg('path', {d:icons[i]}, svg);
          if (i !== 1) util.svg('path', {d:i%2?'M8 15h10M8 19h6':'M10 10v7M7 13h6',stroke:i%3?'#45a667':'#e4b644','stroke-width':'2'}, svg);
          util.el('span', '', a, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, cross, header });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, headerTools, label, lr, placement, rng, util, wantFooter, word } = _c;
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
        if (placement !== 'footer' && placement !== 'link') {
          for (const button of [...tools.children]) headerTools.append(button);
          foot.remove();
        }
      }
      Object.assign(_c, { submit });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, headerTools, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      header.style.setProperty('--tools-width', `${headerTools.getBoundingClientRect().width}px`);
      Object.assign(_c, { submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-health-records-order-04',
    template: 'site/base',
    design: { parts },
  });
})();
