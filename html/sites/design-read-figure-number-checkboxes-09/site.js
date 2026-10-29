(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-number-checkboxes-09',
    'task': 'read-figure',
    'scenario': 'number-checkboxes',
    'style': 'motif',
    'title': 'GridTask Pro 2.1.0  -  Number Patterns',
    'menu': 'File       Edit       View       Tools       Help',
    'note': 'Tools',
    'layout': 'dialog',
    'subtitle': '',
    'aside': 'Terminal\nText Editor\nFile Manager\nHelp',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      let display = ctx.display || 'header';
      document.body.className =
        C.style + ' ' + C.layout + ' instruction-' + display + (ctx.finish ? ' finish-mode' : '');
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
      const endRng = ctx.rng.fork('chrome/end'),
        labels = ctx.content?.END_LABELS || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ],
        asLabel = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)),
        defaultEnd = !ctx.finish && endRng.bool(0.5),
        labelItem = defaultEnd
          ? labels.find((x) => asLabel(x).trim().toLowerCase() === 'submit') || 'Submit'
          : endRng.pick(labels),
        label = asLabel(labelItem),
        placement = ctx.finish ? null : defaultEnd ? 'footer' : endRng.pick(['footer', 'toolbar', 'link', 'icon']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const opts = [
          ...new Set(
            labels
              .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
              .filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase()),
          ),
        ];
        if (opts.length) collide = collideRng.pick(opts);
      }
      const menu = C.menu ? u.el('nav', 'menu', top) : null;
      if (menu) u.el('span', 'menu-label', menu, C.menu);
      const makeEnd = (parent, cls, text, accessible = label) => {
        const b = u.el(cls === 'episode-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', accessible);
        b.title = accessible;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const makeDecoy = (parent, text, collides) => {
        const b = u.el('button', 'episode-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      let submit = null;
      if (menu) {
        if (collide) makeDecoy(menu, collide, true);
        if (placement === 'toolbar') submit = makeEnd(menu, 'episode-end', label);
        if (placement === 'icon') submit = makeEnd(menu, 'episode-end episode-icon', '✓');
      }
      const center = u.el('div', 'center', app);
      let brief = null;
      if (display !== 'hidden')
        brief = u.el(
          display === 'panel' ? 'aside' : 'div',
          display === 'panel' ? 'brief instruction-card' : 'brief',
          center,
          ctx.instruction,
        );
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(footer, 'submit episode-end', label);
        else if (placement === 'link') submit = makeEnd(footer, 'episode-link', label + '  ›');
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
