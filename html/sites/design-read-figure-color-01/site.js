(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-color-01',
    'task': 'read-figure',
    'scenario': 'color',
    'style': 'mint',
    'title': 'WorkBoard',
    'menu': 'Notebook / Visual Tasks',
    'note': '',
    'layout': 'utility',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
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
      u.el('span', '', top, C.title);
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
        brief = u.el('div', 'brief', center, ctx.display === 'header' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      const labels = ctx.content && ctx.content.END_LABELS;
      const labelText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const bank =
        Array.isArray(labels) && labels.length
          ? labels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endR = ctx.rng.fork('chrome/end');
      const label = endR.bool(0.5) ? 'Submit' : labelText(endR.pick(bank));
      const places = ['footer', 'footer', 'footer', 'header', 'footer-link', 'header-icon'];
      const placement = endR.pick(places);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = bank.map(labelText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = collideR.pick(pool);
      }
      const controls = u.el('div', 'chrome-controls', top);
      const button = (parent, text, cls, active, accessible = text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.title = accessible;
        b.setAttribute('aria-label', accessible);
        b.addEventListener('click', active ? ctx.submit : () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') submit = button(controls, label, 'submit chrome-submit', true);
        else if (placement === 'header-icon')
          submit = button(controls, '✓', 'submit chrome-submit chrome-icon', true, label);
        else if (placement === 'footer-link') {
          submit = u.el('a', 'chrome-endlink', footer, label + ' ›');
          submit.href = '#';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          submit = button(footer, label, 'submit', true);
        }
      }
      if (collide) {
        const parent = placement === 'header' || placement === 'header-icon' ? controls : footer;
        button(parent, collide, 'chrome-xtra', false);
      }
      if (ctx.display === 'panel') {
        const panel = u.el('aside', 'episode-panel', document.body);
        u.el('b', '', panel, 'Task note');
        u.el('div', '', panel, ctx.instruction);
      }
      if (ctx.display === 'toast') {
        const toast = u.el('div', 'episode-toast', document.body);
        u.el('b', '', toast, 'Task note');
        u.el('div', '', toast, ctx.instruction);
      }
      if (ctx.finish) footer.classList.add('finish-footer');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
