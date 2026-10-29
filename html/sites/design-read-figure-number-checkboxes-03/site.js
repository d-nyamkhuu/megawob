(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-number-checkboxes-03',
    'task': 'read-figure',
    'scenario': 'number-checkboxes',
    'style': 'motif',
    'title': 'Pattern Practice',
    'menu': 'File       Edit       View       Tools       Help',
    'note': 'Tools',
    'layout': 'dialog',
    'subtitle': '',
    'aside': 'Tasks\nSettings\nHelp\nExit',
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
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      brief.dataset.display = ctx.display;
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      ['Tasks', 'Settings', 'Help', 'Exit'].forEach((label, i) => {
        const item = u.el('div', 'rail-item', aside);
        u.el('span', 'rail-icon', item, ['⌂', '⚙', '▤', '⇥'][i]);
        u.el('span', '', item, label);
      });
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          keep = er.bool(0.5),
          labels = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ],
          placement = keep ? 'footer' : er.pick(['toolbar', 'link']),
          picked = keep ? 'Submit' : er.pick(labels),
          label = typeof picked === 'string' ? picked : picked.label || picked.text || String(picked),
          makeEnd = (parent, cls, text) => {
            const b = u.el(placement === 'link' && cls === 'end-link' ? 'a' : 'button', cls, parent, text);
            b.type = 'button';
            if (b.tagName === 'A') b.href = '#';
            b.dataset.role = 'submit';
            b.title = label;
            b.setAttribute('aria-label', label);
            b.addEventListener('click', (e) => {
              e.preventDefault();
              ctx.submit();
            });
            return b;
          };
        if (placement === 'footer') submit = makeEnd(footer, 'submit', label);
        else if (placement === 'toolbar') submit = makeEnd(document.querySelector('.menu'), 'toolbar-end', label);
        else submit = makeEnd(footer, 'end-link', label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))
            .filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
          if (pool.length) {
            const d = u.el(
              'button',
              'pq-xtra',
              cr.bool(0.5) ? document.querySelector('.menu') : footer,
              cr.pick(pool),
            );
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
      }
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
