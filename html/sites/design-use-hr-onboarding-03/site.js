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
      if (kind === 'cookie') {
        const info = util.el('span', 'human-overlay-info', el, 'i');
        el.prepend(info);
      }
      if (kind === 'chat') {
        const title = util.el('div', 'human-chat-title', box, 'HR Support');
        box.prepend(title);
        const input = util.el('input', 'human-chat-input', box);
        input.type = 'text'; input.placeholder = 'Type a message…';
        input.setAttribute('aria-label', 'Message HR Support');
      }
      if (kind === 'promo') {
        const title = util.el('strong', 'human-promo-title', box, 'Stay in the know');
        box.prepend(title);
        const close = util.el('button', 'human-promo-close', box, '×');
        close.type = 'button'; close.setAttribute('aria-label', word ? word('close') : 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      }
      if (kind === 'banner') {
        const heading = document.querySelector('.human-heading');
        const note = heading && heading.querySelector('.ref-instruction');
        if (note) note.after(el);
        else if (heading) heading.prepend(el);
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

      // GNOME Human-era desktop menu; the task window itself is the existing page frame.
      const desk = util.el('div', 'gem-menubar', document.body);
      util.el('span', 'gem-mark', desk, '✿');
      for (const item of ['File', 'Edit', 'View', 'Go', 'People', 'Tools', 'Help']) util.el('span', 'gem-menu-item', desk, item);
      Object.assign(_c, { H, W, desk, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowTitle = util.el('div', 'gem-window-title', header);
      util.el('span', 'gem-window-icon', windowTitle, '✿');
      util.el('strong', '', windowTitle, 'People Operations');
      const windowControls = util.el('span', 'gem-window-controls', windowTitle);
      util.el('span', 'gem-window-control', windowControls, '−');
      util.el('span', 'gem-window-control', windowControls, '□');
      util.el('span', 'gem-window-control gem-window-close', windowControls, '×');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowControls, windowTitle });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, desk, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      desk.append(headerTools);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      S.frameSidebar(_c, body);
      // Fixed GNOME Human navigation rail. Keep the optional reference-site sidebar
      // draws above intact; this rail is static frame and consumes no episode randomness.
      const appRail = util.el('nav', 'ref-hr-rail', body);
      const appItems = [
        ['home', 'Dashboard'], ['people', 'Recruiting'], ['checklist', 'Onboarding'], ['person', 'Employees'],
        ['calendar', 'Leave'], ['chart', 'Reporting'], ['building', 'Company'],
      ];
      appItems.forEach(([icon, label], i) => {
        const a = util.el('a', `ref-hr-rail-link${i === 2 ? ' is-current' : ''}`, appRail);
        a.href = '#';
        a.dataset.role = 'nav';
        const glyph = util.svg('svg', { class: 'ref-hr-rail-icon', viewBox: '0 0 32 32', 'aria-hidden': 'true' }, a);
        const shapes = {
          home: '<path fill="#fff9ec" d="M5 14 16 4l11 10v15H6z"/><path fill="#e87c27" d="m2 14 14-12 14 12-3 3L16 7 5 17z"/><path fill="#729cb2" d="M13 18h7v11h-7z"/><path fill="#e57c37" d="M23 3h4v8h-4z"/>',
          person: '<path fill="#70add1" d="M4 29v-5c0-6 6-7 9-9C6 6 14-1 19 3c4 3 3 8 0 12 4 3 9 3 9 9v5z"/><path fill="#d2e8ef" d="M13 4c-4 4-1 10 2 12"/>',
          people: '<path fill="#f3d55f" d="M2 25v-5c0-4 4-5 7-7C3 6 8 0 12 3c4 3 2 8 0 10 4 2 6 4 6 7v5z"/><path fill="#70add1" d="M11 30v-5c0-5 5-6 8-8-6-8 0-14 5-11 4 3 2 8 0 11 4 2 6 3 6 8v5z"/>',
          checklist: '<rect fill="#e2a145" x="5" y="5" width="23" height="25" rx="2"/><rect fill="#fff" x="8" y="8" width="17" height="20"/><path fill="#87aec0" d="M12 4V2h8v5h-8z"/><path d="M11 12h2m3 0h6m-11 5h2m3 0h6m-11 5h2m3 0h6" stroke="#59616a"/>',
          calendar: '<rect fill="#fff" x="3" y="5" width="27" height="25" rx="2"/><path fill="#f78d24" d="M3 5h27v8H3z"/><path d="M9 2v7m14-7v7M8 17h3m4 0h3m4 0h3M8 22h3m4 0h3m4 0h3M8 26h3m4 0h3"/>',
          chart: '<path fill="#8cc0d1" d="M4 29V16h5v13zm10 0V9h5v20zm10 0V3h5v26z"/><path stroke="#e8cf43" stroke-width="3" d="M12 29V17m10 12V13"/><path d="M2 30h29"/>',
          building: '<path fill="#b2d7e5" d="M6 30V2h21v28z"/><path fill="#486e82" d="M10 6h3v3h-3zm8 0h3v3h-3zm-8 7h3v3h-3zm8 0h3v3h-3zm-8 7h3v3h-3zm8 0h3v3h-3zm-3 5h4v5h-4z"/>',
        };
        glyph.innerHTML = shapes[icon];
        util.el('span', '', a, label);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      });
      Object.assign(_c, { appItems, appRail, body });
    },
  };

  env.site({
    name: 'design-use-hr-onboarding-03',
    template: 'site/base',
    design: { parts },
  });
})();
