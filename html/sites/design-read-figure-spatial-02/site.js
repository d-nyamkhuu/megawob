(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-spatial-02',
    'task': 'read-figure',
    'scenario': 'spatial',
    'style': 'electron',
    'title': 'Picture Finder',
    'menu': '',
    'note': 'Items',
    'layout': 'stagger',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      let display = ctx.display || 'header';
      if (window.innerWidth < 1800 && (display === 'panel' || display === 'toast')) display = 'header';
      document.body.className =
        C.style +
        ' ' +
        C.layout +
        ' instruction-' +
        (display === 'panel' ? 'header' : display) +
        (ctx.finish ? ' finish-mode' : '');
      const app = u.el('main', 'app', document.body),
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
      const menu = C.menu ? u.el('nav', 'menu', top, C.menu) : null;
      const center = u.el('div', 'center', app);
      let brief = null;
      if (display === 'header') brief = u.el('div', 'brief', center, ctx.instruction);
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body),
        strip = u.el('div', 'item-strip', app);
      u.el('div', 'item-heading', strip, 'Items');
      const ART = {
        Apple:
          '<path d="M16 9c-3-4-10-2-10 6 0 7 5 12 10 10 5 2 10-3 10-10 0-8-7-10-10-6" fill="#e60012" stroke="#000" stroke-width="2"/><path d="M16 8c0-5 4-7 8-6-1 4-4 6-8 6" fill="#008526" stroke="#000" stroke-width="1.5"/>',
        Bell: '<path d="M7 23h18l-2-4V12a7 7 0 0 0-14 0v7zM13 26h6" fill="#ffd900" stroke="#000" stroke-width="2" stroke-linejoin="round"/>',
        Book: '<path d="M6 5h18v23H6z" fill="#0065eb" stroke="#000" stroke-width="2"/><path d="M10 5v23" stroke="#000" stroke-width="1.5"/>',
        Candle:
          '<path d="M16 2c-5 5 2 6-1 9-3-2-5 0-4 4 1 4 8 4 10 0 2-4-4-7-5-13" fill="#ffd900" stroke="#000"/><path d="M11 14h10v14H11zM7 28h18v2H7z" fill="#fff" stroke="#000" stroke-width="2"/>',
        Car: '<path d="M4 17h24l-2-7h-5l-4-5h-7l-4 5H5z" fill="#0065eb" stroke="#000" stroke-width="2"/><circle cx="9" cy="21" r="3" fill="#111"/><circle cx="23" cy="21" r="3" fill="#111"/>',
        Crown:
          '<path d="m4 9 7 5 5-9 5 9 7-5-2 17H6z" fill="#ffd900" stroke="#000" stroke-width="2"/><circle cx="11" cy="20" r="1.5" fill="#e60012"/><circle cx="17" cy="20" r="1.5" fill="#e60012"/><circle cx="23" cy="20" r="1.5" fill="#e60012"/>',
        Dog: '<path d="M5 14c2-5 9-5 14-2l4-4 4 2-2 5-4 1-2 8h-3l-1-6h-6l-1 6H9l-1-7-4-2z" fill="#9a5a20" stroke="#000" stroke-width="2"/>',
        Flower:
          '<path d="M16 17v13M16 25c-5-5-8-3-8-1 2 4 5 4 8 1M16 27c5-5 8-3 8-1-2 4-5 4-8 1" fill="#008526" stroke="#000"/><g fill="#e64b57" stroke="#000"><circle cx="16" cy="7" r="4"/><circle cx="22" cy="11" r="4"/><circle cx="20" cy="17" r="4"/><circle cx="12" cy="17" r="4"/><circle cx="10" cy="11" r="4"/></g><circle cx="16" cy="12" r="3" fill="#ffd900"/>',
        Heart: '<path d="M16 28 5 17C-1 9 9 2 16 10 23 2 33 9 27 17z" fill="#e60012" stroke="#000" stroke-width="2"/>',
        House:
          '<path d="M3 15 16 4l13 11M6 14v15h20V14" fill="#e60012" stroke="#000" stroke-width="2"/><path d="M10 20h5v6h-5zM20 19h4v10h-4z" fill="#0065eb" stroke="#000"/>',
        Key: '<circle cx="9" cy="14" r="6" fill="#ffd900" stroke="#000" stroke-width="2"/><path d="M14 14h15v4h-4v3h-4v-3h-7" fill="#ffd900" stroke="#000" stroke-width="2"/>',
        Moon: '<path d="M11 3c-2 11 3 19 15 18-6 9-21 7-23-3-2-7 2-13 8-15" fill="#ffd900" stroke="#000" stroke-width="2"/>',
        Star: '<path d="m16 3 4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z" fill="#ffd900" stroke="#000" stroke-width="2"/>',
        Tree: '<path d="M14 18h4v12h-4z" fill="#8a4d13" stroke="#000"/><path d="M16 2C11 2 9 7 11 9 5 9 5 17 11 18c1 3 8 3 10 0 6-1 6-9 0-9 2-3-1-7-5-7" fill="#008526" stroke="#000" stroke-width="2"/>',
        Umbrella:
          '<path d="M3 15a13 13 0 0 1 26 0c-3-3-6 3-9 0-3-3-6 3-9 0-3-3-5 3-8 0" fill="#0065eb" stroke="#000" stroke-width="2"/><path d="M16 15v12c0 4 7 4 7-1" fill="none" stroke="#000" stroke-width="3"/>',
      };
      [
        ['Apple'],
        ['Bell'],
        ['Book'],
        ['Candle'],
        ['Car'],
        ['Crown'],
        ['Dog'],
        ['Flower'],
        ['Heart'],
        ['House'],
        ['Key'],
        ['Moon'],
        ['Star'],
        ['Tree'],
        ['Umbrella'],
      ].forEach(([name]) => {
        const item = u.el('div', 'item-choice', strip);
        const svg = u.svg('svg', { viewBox: '0 0 32 32', class: 'item-symbol' }, item);
        svg.innerHTML = ART[name];
        u.el('span', 'item-label', item, name);
      });
      if (display === 'panel') {
        u.el('b', 'episode-title', aside, 'Task instructions');
        u.el('p', 'episode-instruction', aside, ctx.instruction);
      }
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const submitWord = labels.map(labelOf).find((x) => x.toLowerCase() === 'submit') || labelOf(labels[0]);
      const original = endRng.bool(0.5),
        placement = original ? 'footer' : endRng.pick(['icon', 'toolbar']),
        label = original ? submitWord : labelOf(endRng.pick(labels));
      const endButton = (parent, cls, text, action) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', action);
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = endButton(footer, 'submit', label, ctx.submit);
        else if (placement === 'icon') {
          submit = endButton(footer, 'episode-icon', '✓', ctx.submit);
          submit.title = label;
          submit.setAttribute('aria-label', label);
        } else submit = endButton(top, 'episode-toolbar', label, ctx.submit);
        if (collideRng.bool(0.3)) {
          const pool = [
            ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
          ];
          if (pool.length) {
            const text = labelOf(collideRng.pick(pool));
            endButton(footer, 'episode-xtra', text, () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      if (display === 'toast') {
        const toast = u.el('div', 'episode-toast', document.body);
        u.el('b', '', toast, 'Task note');
        u.el('p', '', toast, ctx.instruction);
      }
      if (ctx.finish) footer.remove();
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
