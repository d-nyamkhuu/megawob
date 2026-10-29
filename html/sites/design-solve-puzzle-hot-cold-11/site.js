(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-hot-cold-11',
    'task': 'solve-puzzle',
    'scenario': 'hot-cold',
    'style': 'human',
    'title': 'Discovery Zone',
    'menu': 'HELP     |     SETTINGS     |     EXIT',
    'note': 'Task Info',
    'layout': 'brief-left',
    'subtitle': 'EXPLORE • LEARN • FIND',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg(
          'rect',
          {
            x: 3,
            y: 2,
            width: 20,
            height: 22,
            rx: C.style === 'mint' ? 0 : 3,
            fill:
              C.style === 'mint'
                ? 'none'
                : C.style === 'dark'
                  ? '#8266ce'
                  : C.style === 'electron'
                    ? '#ee8520'
                    : '#d7e2e8',
            stroke: 'currentColor',
            'stroke-width': 1.5,
          },
          icon,
        );
        u.svg(
          'path',
          { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 },
          icon,
        );
      }
      const brand = u.el('span', 'brand-name', top);
      u.el('span', 'brand-discovery', brand, 'DISCOVERY');
      u.el('span', 'brand-zone', brand, 'ZONE');
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink'].includes(C.style)) {
        const wc = u.el('div', 'native-window-controls', top);
        for (const kind of ['min', 'max', 'close']) {
          const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
          u.svg(
            'path',
            {
              d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': 1.5,
            },
            svg,
          );
        }
      }
      if (C.subtitle) u.el('small', '', top, C.subtitle);
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const taskTitle = u.el('b', 'task-title', brief, 'Find the Hot Spot');
      brief.insertBefore(taskTitle, brief.firstChild);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const original = endR.bool(0.5),
        placement = original ? 'perimeter' : endR.pick(['toolbar', 'footer']);
      const label = original ? 'Submit' : endR.pick(endWords.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, placement === 'toolbar' ? top : footer, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', ctx.submit);
      }
      if (collideR.bool(0.3)) {
        const options = endWords.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const decoyLabel = collideR.pick(options),
            decoy = u.el('button', 'chrome-xtra', footer, decoyLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const secondary = ctx.kind === 'promo' && !ctx.initial && !!document.querySelector('.overlay.promo');
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind + (secondary ? ' secondary-overlay' : ''), document.body);
      if (ctx.kind === 'promo' && !secondary) {
        u.el('span', 'newsletter-copy', el, '');
        const email = u.el('input', 'newsletter-email', el);
        email.type = 'email';
        email.placeholder = 'Your email address';
        const signup = u.el('button', 'newsletter-signup', el, 'Sign Up');
        signup.type = 'button';
        const dismiss = u.el('button', 'newsletter-close', el, 'Close');
        dismiss.setAttribute('aria-label', 'Close newsletter');
        dismiss.addEventListener('click', ctx.dismiss);
        const decline = u.el('button', 'newsletter-decline', el, 'No thanks');
        decline.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      const messages = {
        promo: 'Park news and practice updates are available.',
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind] || '');
      const dismiss = u.el('button', '', el, 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
