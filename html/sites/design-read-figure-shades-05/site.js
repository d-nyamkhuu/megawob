(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shades-05',
    'task': 'read-figure',
    'scenario': 'shades',
    'style': 'electron',
    'title': 'Math Notebook',
    'menu': 'Notebook    Problems    Draw    Highlight    Erase',
    'note': 'Notes',
    'layout': 'stagger',
    'subtitle': '',
    'aside':
      'Quick Notes:\n\n1. Count the blocks in each group.\n2. Add the two numbers.\n3. Type the total into the textbox.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        mb = u.el('div', 'mac-menubar', document.body);
      const apple = u.svg('svg', { viewBox: '0 0 24 30', class: 'mac-apple', 'aria-hidden': 'true' }, mb);
      const defs = u.svg('defs', {}, apple),
        grad = u.svg('linearGradient', { id: 'apple-rainbow', x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
      for (const [offset, color] of [
        ['0%', '#62b849'],
        ['26%', '#62b849'],
        ['26%', '#f9da35'],
        ['42%', '#f9da35'],
        ['42%', '#ed8c25'],
        ['56%', '#ed8c25'],
        ['56%', '#d34449'],
        ['70%', '#d34449'],
        ['70%', '#9b4b9c'],
        ['84%', '#9b4b9c'],
        ['84%', '#4295ce'],
        ['100%', '#4295ce'],
      ])
        u.svg('stop', { offset, 'stop-color': color }, grad);
      u.svg(
        'path',
        {
          d: 'M12 8C9 5 3 7 2 12C0 18 5 27 8 27C10 27 11 25 13 26C18 30 21 22 22 19C17 17 17 12 21 10C18 6 15 6 12 8Z',
          fill: 'url(#apple-rainbow)',
          stroke: '#333',
          'stroke-width': 1.2,
        },
        apple,
      );
      u.svg('path', { d: 'M12 7C11 3 15 1 18 1C18 4 15 7 12 7Z', fill: '#54a949', stroke: '#333' }, apple);
      for (const m of ['File', 'Edit', 'View', 'Special', 'Help']) u.el('span', 'mac-mi', mb, m);
      u.el('span', 'mac-clock', mb, '10:24 AM');
      const monitor = u.svg('svg', { viewBox: '0 0 28 30', class: 'mac-monitor', 'aria-hidden': 'true' }, mb);
      u.svg(
        'path',
        { d: 'M4 2h19v22H4zM1 27h26l-4-4H5z', fill: '#c4c5cc', stroke: '#333', 'stroke-width': 1.5 },
        monitor,
      );
      u.svg('rect', { x: 7, y: 5, width: 13, height: 12, fill: '#7945ba', stroke: '#222' }, monitor);
      u.svg('path', { d: 'M8 7h10M8 9v5M11 20h6', stroke: '#eee', fill: 'none' }, monitor);
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (false && ['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
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
      u.el('i', 'mac-box', top);
      u.el('span', 'mac-title', top, 'Color Challenge');
      u.el('i', 'mac-box r', top);
      if (false && ['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink'].includes(C.style)) {
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
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      // Independent frame streams preserve all existing task and layout draws.
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = !endRng.bool(0.5);
      const placement = referenceEnd ? 'footer' : endRng.pick(['toolbar', 'footer-link']);
      const label = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const decoyBtn = (parent, text, collide = false) => {
        const b = u.el('button', 'mac-btn chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        return b;
      };
      const clear = u.el('button', 'mac-btn clear', footer, 'Clear Selections');
      clear.type = 'button';
      clear.addEventListener('click', () => stage.dispatchEvent(new CustomEvent('clear-selections')));
      if (collideRng.bool(0.3)) {
        const options = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const decoy = decoyBtn(mb, collideRng.pick(options), true);
          mb.insertBefore(decoy, mb.querySelector('.mac-clock'));
        }
      }
      if (!ctx.finish) {
        const cancel = decoyBtn(footer, 'Cancel');
        cancel.classList.add('cancel');
        submit = u.el(
          placement === 'footer-link' ? 'a' : 'button',
          placement === 'footer'
            ? 'submit'
            : placement === 'toolbar'
              ? 'mac-btn chrome-end-toolbar'
              : 'chrome-end-link',
          placement === 'toolbar' ? mb : footer,
          label,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        if (placement === 'toolbar') mb.insertBefore(submit, mb.querySelector('.mac-clock'));
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
