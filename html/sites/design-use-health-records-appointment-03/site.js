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
      if (kind === 'banner') {
        const note = document.querySelector('.ref-task');
        el.style.top = `${Math.max(34, note ? note.getBoundingClientRect().bottom : 34)}px`;
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
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      const appTitle = util.el('div', 'ehr-titlebar', document.body);
      util.el('span', 'ehr-title-icon', appTitle, '▣');
      util.el('span', 'ehr-title-text', appTitle, 'Rivermede Health System  |  Electronic Health Record');
      const winBtns = util.el('span', 'ehr-window-buttons', appTitle);
      for (const glyph of ['_', '□', '×']) util.el('span', 'ehr-window-button', winBtns, glyph);
      const menu = util.el('nav', 'ehr-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Patient', 'Schedule', 'Orders', 'Nursing', 'Reports', 'Window', 'Help']) {
        util.el('span', 'ehr-menu-item', menu, item);
      }
      const toolbar = util.el('div', 'ehr-toolbar', document.body);
      const dockItems = [['▦','Appointments'],['●','Patients'],['▤','Orders'],['◆','Medications'],['▣','Nursing'],['▰','Beds'],['▥','Reports']];
      const dockPaths = {
        Appointments: '<rect x="3" y="5" width="22" height="21" rx="1"/><path d="M8 2v6m12-6v6M3 11h22M8 15h2m5 0h2m-9 5h2m5 0h2"/>',
        Patients: '<circle cx="14" cy="8" r="5" fill="currentColor" stroke="none"/><path d="M4 26v-5c0-5 4-8 10-8s10 3 10 8v5" fill="currentColor" stroke="none"/>',
        Orders: '<rect x="5" y="3" width="18" height="23" rx="1"/><path d="M9 8h3m4 0h3M9 13h3m4 0h3M9 18h3m4 0h3M9 22h10"/>',
        Medications: '<path d="M6 23a6 6 0 0 1 0-8L16 5a6 6 0 0 1 8 8L14 23a6 6 0 0 1-8 0Zm5-13 8 8"/>',
        Nursing: '<rect x="5" y="5" width="18" height="22" rx="1"/><path d="M10 3h8v5h-8zM9 13h10M9 18h10M9 23h7"/>',
        Beds: '<path d="M3 5v21m0-6h23v6M3 14h20c2 0 3 1 3 3v3M8 14V9h13v5"/><circle cx="7" cy="9" r="3"/>',
        Reports: '<path d="M6 25V15m8 10V6m8 19V11" stroke-width="4"/>'
      };
      for (const [icon, label] of dockItems) {
        const item = util.el('span', 'ehr-tool-icon', toolbar);
        const glyph = util.el('b', 'ehr-tool-glyph', item, icon);
        glyph.innerHTML = '<svg viewBox="0 0 28 30" aria-hidden="true">' + dockPaths[label] + '</svg>';
        util.el('span', 'ehr-tool-label', item, label);
      }
      Object.assign(_c, { H, W, appTitle, display, dockItems, dockPaths, menu, roomy, tall, toolbar, winBtns });
    },
  };

  env.site({
    name: 'design-use-health-records-appointment-03',
    template: 'site/base',
    design: { parts },
  });
})();
