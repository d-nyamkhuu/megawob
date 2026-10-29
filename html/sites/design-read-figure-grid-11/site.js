(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-grid-11',
    'task': 'read-figure',
    'scenario': 'grid',
    'style': 'aero',
    'title': 'Map Skills Tutor',
    'menu': 'Home\nCoordinate Practice\nQuizzes\nProgress\nHelp',
    'note': 'Your Task',
    'layout': 'utility',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        display = ctx.display || 'header',
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
        brief = u.el('div', 'brief', center, display === 'header' || display === 'toast' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'task-copy', aside, display === 'panel' ? ctx.instruction : '');
      const reminder = u.el('div', 'aside-copy', aside),
        list = u.el('ul', '', reminder);
      u.el('b', '', reminder, 'Remember:');
      [
        'The first number is the x-coordinate (horizontal).',
        'The second number is the y-coordinate (vertical).',
        'The origin is (0, 0).',
        'Negative coordinates are shown on the axes.',
      ].forEach((text) => u.el('li', '', list, text));
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const labels = (ctx.content && ctx.content.END_LABELS) || [
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
          er = ctx.rng.fork('chrome/end'),
          placement = er.pick(['footer', 'footer', 'footer', 'header', 'link']),
          textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
          label = er.bool(0.5)
            ? 'Submit'
            : er.pick(labels.map(textOf).filter((x) => x.trim().toLowerCase() !== 'submit'));
        const button = (parent, cls, text, isLink) => {
          const b = u.el(isLink ? 'a' : 'button', cls, parent, text);
          b.type = isLink ? undefined : 'button';
          if (isLink) b.href = '#';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        const endParent = placement === 'header' ? top : footer;
        if (placement === 'link') {
          submit = button(endParent, 'submit end-link', label + ' ›', true);
        } else submit = button(endParent, 'submit', label, false);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels
            .map(textOf)
            .filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
          if (pool.length) {
            const text = pool[cr.int(0, pool.length - 1)],
              d = u.el('button', 'chrome-xtra', footer, text);
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        box = u.el('div', 'tip-box', el),
        head = u.el('div', 'tip-head', box);
      u.el('span', 'tip-bulb', head, '💡');
      u.el('strong', '', head, 'Tip of the day');
      const x = u.el('button', 'tip-x', head, '×');
      x.type = 'button';
      x.addEventListener('click', ctx.dismiss);
      u.el(
        'p',
        'tip-copy',
        box,
        'An ordered pair (x, y) tells you to move horizontally first (x), then vertically (y) from the origin.',
      );
      const foot = u.el('div', 'tip-foot', box),
        check = u.el('label', 'tip-check', foot),
        input = u.el('input', '', check);
      input.type = 'checkbox';
      u.el('span', '', check, 'Do not show again');
      const dismiss = u.el('button', 'tip-close', foot, 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
