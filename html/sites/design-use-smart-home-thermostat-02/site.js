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
      if (kind === 'banner' || kind === 'promo') {
        el.style.top = document.querySelector('.ref-task').getBoundingClientRect().bottom + 8 + 'px';
      }
      el.dataset.role = 'overlay';
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
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const instrumentIcon = (parent, name) => {
        const paths = {
          home: 'M3 11 12 3l5 4V4h3v6l2 2M5 10v12h15V10',
          temperature: 'M2 10 12 2l5 4V3h3v6l3 2M4 9v13h17V10M13 12v5a2 2 0 1 1-3 0v-5a1.5 1.5 0 0 1 3 0Z',
          humidity: 'M12 2S4 11 4 16a8 8 0 0 0 16 0c0-5-8-14-8-14Z',
          wind: 'M2 7h10c5 0 3-7-1-4M2 11h17c5 0 4-7 0-5M2 15h12c6 0 4 9-1 6',
        };
        const svg = util.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
          'stroke-width': 1.35, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, parent);
        util.svg('path', { d: paths[name] }, svg);
        return svg;
      };
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Home Console');
      brand.prepend(instrumentIcon(null, 'home'));
      brand.dataset.role = 'brand';
      if (nav) {
        local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      }
      Object.assign(_c, { brand, header, instrumentIcon });
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
      const windowControls = util.el('div', 'precision-window-controls', header);
      for (const name of ['minimize', 'maximize', 'close']) {
        util.el('span', 'precision-window-' + name, windowControls);
      }
      Object.assign(_c, { headerTools, submit, windowControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, ctx, display, local, lr, rng, sidebar, util, word } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      }
      let taskPanel = null;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        taskPanel = panel;
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const workspace = util.el('div', 'nestora-workspace', body);
      const stage = util.el('main', 'ref-stage', workspace);
      Object.assign(_c, { body, stage, taskPanel, workspace });
    },
    'frame.stage': (base, S) => function (_c) {
      const { instrumentIcon, stage, taskPanel, util, workspace } = _c;
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'nestora-inspector', workspace);
      util.el('div', 'nestora-inspector-title', inspector, 'Room Details');
      if (taskPanel) inspector.appendChild(taskPanel);
      const room = util.el('div', 'nestora-inspector-room', inspector);
      instrumentIcon(util.el('span', 'nestora-inspector-home', room), 'home');
      util.el('strong', '', room, 'Kitchen');
      const detail = (label, value, divider) => {
        const row = util.el('div', `nestora-detail${divider ? ' divided' : ''}`, inspector);
        util.el('span', '', row, label);
        util.el('strong', '', row, value);
      };
      detail('Current Setpoint', '20°C');
      detail('Mode', 'Cool');
      detail('Temperature Range', '16°C – 28°C');
      detail('Ambient Temperature', '21.4°C', true);
      detail('Humidity', '46%');
      detail('Status', 'Cooling');
      const measurements = util.el('div', 'nestora-measurements', workspace);
      const measurement = (icon, label, value) => {
        const item = util.el('div', 'nestora-measurement', measurements);
        instrumentIcon(util.el('span', 'nestora-measurement-icon', item), icon);
        const copy = util.el('div', 'nestora-measurement-copy', item);
        util.el('span', '', copy, label);
        util.el('strong', '', copy, value);
      };
      measurement('temperature', 'Room Temperature', '21.4°C');
      measurement('humidity', 'Humidity', '46%');
      measurement('wind', 'Status', 'Cooling');
      Object.assign(_c, { detail, inspector, measurement, measurements, room });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.panel': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-smart-home-thermostat-02',
    template: 'site/base',
    design: { parts },
  });
})();
