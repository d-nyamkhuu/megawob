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
      // Obstructions share the Workbench frame and leave both header and footer controls clear.
      if (kind === 'banner') document.querySelector('.ref-task').after(el);
      if (kind === 'cookie') document.querySelector('.ref-foot').before(el);
      if (kind === 'promo') {
        el.style.setProperty('--wb-header-bottom', document.querySelector('.ref-task').getBoundingClientRect().bottom + 'px');
        const title = util.el('div', 'wb-overlay-title', box, 'Stay in the loop');
        box.prepend(title);
        const x = util.el('button', 'wb-overlay-close', title, '×');
        x.type = 'button';
        x.setAttribute('aria-label', word ? word('close') : 'Close');
        x.addEventListener('click', () => ctx.dismiss('close'));
      }
      if (kind === 'chat') {
        const title = util.el('div', 'wb-overlay-title', el, 'Support Chat');
        el.prepend(title);
        title.append(row);
        const input = util.el('div', 'wb-chat-compose', el, 'Type a message…');
        input.setAttribute('aria-hidden', 'true');
      }
      const bulbSurface = document.querySelector('.wb-light');
      if (bulbSurface && bulbSurface.workbenchFit) bulbSurface.workbenchFit();
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.toggle('ref-task-note', display === 'header');
      const appIcon = util.el('span', 'workbench-home-icon', header);
      appIcon.setAttribute('aria-hidden', 'true');
      const home = env.util.svg('svg', { viewBox: '0 0 32 30', 'shape-rendering': 'crispEdges' }, appIcon);
      env.util.svg('path', { d: 'M5 12H27V28H5Z', fill: '#eee', stroke: '#111', 'stroke-width': 2 }, home);
      env.util.svg('path', { d: 'M22 3H26V11H22Z', fill: '#eee', stroke: '#111', 'stroke-width': 2 }, home);
      env.util.svg('path', { d: 'M2 13L16 2L30 13Z', fill: '#e9bc3b', stroke: '#111', 'stroke-width': 2 }, home);
      env.util.svg('path', { d: 'M17 28V17H23V28M8 17H13V22H8Z', fill: '#c4a466', stroke: '#111', 'stroke-width': 2 }, home);
      const brand = util.el('div', 'ref-brand', header, 'Home & Media Console');
      brand.dataset.role = 'brand';
      Object.assign(_c, { appIcon, brand, header, home });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      {
        const foot = util.el('footer', 'ref-foot', document.body);
        util.el('span', 'workbench-info', foot, 'ℹ');
        const footText = util.el('span', 'ref-foot-text', foot,
          'Drag the hue ring to choose a color.  Use the slider to set brightness.');
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      const winControls = util.el('div', 'workbench-window-controls', header);
      for (const glyph of ['−', '□', '×']) util.el('span', 'workbench-window-button', winControls, glyph);
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.querySelector('.ref-foot'));
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      Object.assign(_c, { submit, winControls });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.floating': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-smart-home-lightcolor-04',
    template: 'site/base',
    design: { parts },
  });
})();
