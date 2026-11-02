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
      const footer = document.querySelector('.ref-foot, .ref-float-dock');
      const bottomSpace = footer ? footer.getBoundingClientRect().height + 12 : 16;
      if (kind === 'banner' && header) {
        const bounds = header.getBoundingClientRect();
        el.style.top = (bounds.bottom + 6) + 'px';
        el.style.left = bounds.left + 16 + 'px';
      }
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = bottomSpace + 'px';
      if (kind === 'promo') {
        el.style.bottom = bottomSpace + 'px';
        if (header) el.style.top = header.getBoundingClientRect().bottom + 'px';
      }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      let copy = box;
      if (kind === 'promo') {
        const art = util.el('div', 'ref-promo-art', box);
        const envelope = util.svg('svg', {viewBox:'0 0 160 160', fill:'none', 'aria-hidden':'true'}, art);
        util.svg('circle', {cx:80, cy:80, r:69, fill:'#eaf4ff'}, envelope);
        util.svg('path', {d:'M27 64 80 28l53 36v66H27Z',fill:'#0874f9'}, envelope);
        util.svg('path', {d:'M44 37h72v68H44Z',fill:'#fff'}, envelope);
        util.svg('path', {d:'M57 55h46M57 68h46M57 81h29',stroke:'#c5d2df','stroke-width':5}, envelope);
        util.svg('path', {d:'m27 67 53 40 53-40v63H27Z',fill:'#308fff'}, envelope);
        util.svg('path', {d:'m27 130 53-41 53 41',fill:'#0874f9'}, envelope);
        copy = util.el('div', 'ref-promo-copy', box);
        util.el('h2', '', copy, 'Stay in the loop');
      }
      util.el('div', 'ref-ov-text', copy, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo') {
        const email = util.el('input', 'ref-promo-email', copy);
        email.type = 'text'; email.placeholder = 'Enter your email'; email.setAttribute('aria-label', 'Email for updates');
      }
      if (kind === 'chat') util.el('div', 'ref-chat-input', box, 'Type a message…　➤');
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
    'frame.header': (base, S) => function (_c) {
      const { ctx, display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.display = display;
      const drawIcon = (parent, paths, cls) => {
        const svg = util.svg('svg', {viewBox:'0 0 24 24', class:cls, fill:'none', stroke:'currentColor', 'stroke-width':1.6, 'stroke-linecap':'round', 'stroke-linejoin':'round', 'aria-hidden':'true'}, parent);
        for (const d of paths) util.svg('path', {d}, svg);
        return svg;
      };
      {
        const brand = util.el('div', 'ref-brand', header, '☁  Acme Cloud');
        brand.dataset.role = 'brand';
      }
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        const icons = [
          ['m3 6 9-5 9 5v12l-9 5-9-5Z','m3 6 9 5 9-5','M12 11v12'],
          ['m7 6-5 6 5 6','m17 6 5 6-5 6','m14 3-4 18'],
          ['M5 3 21 12 5 21Z'],
          ['M9 15c-1-5 3-12 12-13 0 9-6 14-11 13Z','m9 15-5 5','M6 12l-3 1-1 6 6-1','m12 18-1 4 6-2 1-7','M17 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4'],
          ['M5 22V3','M5 4c6-5 8 5 16 0v11c-8 5-10-5-16 0'],
          ['M3 22h19','M5 22V12h4v10','M11 22V2h4v20','M17 22V8h4v14'],
          ['M3 5c0-5 18-5 18 0s-18 5-18 0','M3 5v14c0 5 18 5 18 0V5','M3 12c0 5 18 5 18 0'],
          ['M9 2h6l1 4 4 1 2 5-3 3v4l-5 3-3-2-4 1-4-4 1-4-2-3 3-4h4Z','M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0'],
        ];
        for (const [i, item] of ['Product', 'Code', 'Builds', 'Deploys', 'Feature Flags', 'Observability', 'Databases', 'Settings'].entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          drawIcon(a, icons[i], 'ref-rail-icon');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const summary = util.el('section', 'ref-summary', header);
      const intro = util.el('div', 'ref-summary-intro', summary);
      const productIcon = util.el('div', 'ref-product-icon', intro);
      drawIcon(productIcon, ['m3 6 9-5 9 5v12l-9 5-9-5Z','m3 6 9 5 9-5','M12 11v12'], 'ref-product-cube');
      util.el('div', 'ref-product', intro, 'Product');
      util.el('div', 'ref-page-title', intro, 'Feature Flags');
      util.el('div', 'ref-subtitle', intro, 'Manage feature flags across environments and segments. Control feature access, roll out changes, and monitor impact.');
      const metrics = util.el('div', 'ref-metrics', summary);
      for (const [title, value, tone] of [['Total Flags', '42', ''], ['Enabled', '18', 'good'], ['Disabled', '24', 'neutral'], ['Configuration Version', 'v3.17.4', 'version']]) {
        const card = util.el('div', 'ref-metric', metrics);
        util.el('div', 'ref-metric-label', card, title);
        const val = util.el('div', 'ref-metric-value', card, value);
        if (tone) val.dataset.tone = tone;
        if (tone === 'version') util.el('div', 'ref-metric-caption', card, 'Updated 2 hours ago');
      }
      const health = util.el('div', 'ref-health', summary);
      util.el('strong', '', health, 'Flag Health');
      for (const [label, count, tone] of [['Healthy', '38', 'healthy'], ['Warn', '3', 'warn'], ['Error', '1', 'error']]) {
        const row = util.el('div', 'ref-health-row', health);
        util.el('span', `ref-health-dot ${tone}`, row);
        util.el('span', '', row, label);
        util.el('span', 'ref-health-count', row, count);
      }
      if (display === 'header') {
        const note = util.el('div', 'ref-instruction', intro, ctx.instruction);
        intro.insertBefore(note, intro.querySelector('.ref-subtitle'));
      }
      else util.el('div', 'ref-spacer', header);
      Object.assign(_c, { drawIcon, header, health, intro, metrics, productIcon, summary });
    },
    'frame.body': (base, S) => function (_c) {
      const { ctx, display, header, lr, rng, summary, util, word } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        header.appendChild(panel);
        summary.classList.add('ref-summary-with-panel');
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, drawIcon, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('div', 'ref-inspector-title', inspector, 'Details');
      for (const [key, value] of [['Flag ID', '—'], ['Description', 'Select a flag to view its details'], ['Owner', '—'], ['Type', '—'], ['Created', '—'], ['Last updated', '—']]) {
        const row = util.el('div', 'ref-inspector-row', inspector);
        util.el('span', '', row, key);
        util.el('span', '', row, value);
      }
      util.el('div', 'ref-inspector-label', inspector, 'Tags');
      const tags = util.el('div', 'ref-tags', inspector);
      for (const tag of ['api', 'stability', 'backend']) util.el('span', '', tags, tag);
      const rollout = util.el('div', 'ref-inspector-rollout', inspector);
      util.el('span', '', rollout, 'Rollout strategy');
      util.el('span', '', rollout, 'Boolean flag');
      util.el('div', 'ref-inspector-label', inspector, 'Links');
      for (const [text, paths] of [
        ['View in code', ['m8 6-5 6 5 6','m16 6 5 6-5 6']],
        ['View metrics', ['M5 21V12','M12 21V3','M19 21V8']],
        ['View activity', ['M22 12a10 10 0 1 0-20 0 10 10 0 0 0 20 0','M12 6v6l4 2']],
      ]) {
        const link = util.el('div', 'ref-inspector-link', inspector);
        drawIcon(link, paths, 'ref-link-icon');
        util.el('span', '', link, text);
        drawIcon(link, ['M14 3h7v7','M21 3l-12 12','M10 5H3v16h16v-7'], 'ref-external-icon');
      }
      Object.assign(_c, { inspector, rollout, stage, tags });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
    'frame.panel': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-flag-03',
    template: 'site/base',
    design: { parts },
  });
})();
