(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-algebra-09',
    'task': 'solve-puzzle',
    'scenario': 'algebra',
    'style': 'nextstep',
    'title': 'Algebra Practice',
    'menu': '',
    'note': 'Solve for x',
    'layout': 'command-wide-content',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        r = ctx.rng,
        content = ctx.content;
      const endR = r.fork('chrome/end'),
        collideR = r.fork('chrome/collide');
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const system = u.el('header', 'system-menu', document.body),
        workspace = u.el('b', 'workspace', system, 'Workspace');
      ['File', 'Edit', 'View', 'Go', 'Tools', 'Help'].forEach((x) => u.el('span', 'menu-item', system, x));
      u.el('time', 'clock', system, 'Mon Apr 12  9:24 AM');
      const app = u.el('main', 'app', document.body),
        rail = u.el('nav', 'command-rail', app);
      [
        ['▤', 'Docs'],
        ['▱', 'Apps'],
        ['>_', 'Terminal'],
        ['✎', 'Notes'],
        ['▥', 'Trash'],
      ].forEach(([ico, label]) => {
        const item = u.el('div', 'rail-item', rail);
        u.el('span', 'rail-icon', item, ico);
        u.el('span', 'rail-label', item, label);
      });
      const top = u.el('header', 'top', app);
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
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink', 'nextstep'].includes(C.style)) {
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
      if (ctx.display === 'toast') brief.classList.add('toast-note');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      if (ctx.display === 'panel') {
        u.el('b', 'episode-note-title', aside, 'Task Inspector');
        u.el('p', 'episode-note', aside, ctx.instruction);
      }
      const footer = u.el('footer', 'bottom', app);
      let submit = null,
        label = 'Submit',
        placement = 'footer',
        collide = null;
      if (!ctx.finish) {
        const labels = (content && content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          '✓',
        ];
        const labelOptions = labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name)),
          canonical = endR.bool(0.5);
        label = canonical
          ? labelOptions.find((x) => String(x).toLowerCase() === 'submit') || 'Submit'
          : String(endR.pick(labelOptions));
        placement = canonical ? 'footer' : endR.pick(['footer', 'header', 'link']);
        document.body.classList.add('end-' + placement);
        const make = (parent, cls, text, tag) => {
          const b = u.el(tag || 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'header') submit = make(top, 'episode-end', label);
        else if (placement === 'link') submit = make(footer, 'episode-end-link', label, 'a');
        else submit = make(footer, 'submit', label);
        const pool = (content && content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          '✓',
        ];
        if (collideR.bool(0.3)) {
          const opts = pool
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
            .filter((x) => String(x).toLowerCase() !== label.toLowerCase());
          if (opts.length) collide = String(collideR.pick(opts));
        }
        if (collide) {
          const parent = placement === 'header' ? top : footer,
            b = u.el('button', 'episode-xtra', parent, collide);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
