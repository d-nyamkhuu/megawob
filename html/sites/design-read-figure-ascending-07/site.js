(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-ascending-07',
    'task': 'read-figure',
    'scenario': 'ascending',
    'style': 'mac',
    'title': 'Number Practice',
    'menu': 'File     Edit     Task     Options     Window     Help',
    'note': 'Task Details',
    'layout': 'split',
    'subtitle': '',
    'aside':
      'Click on the numbers in ascending order.\nEach number can be clicked once.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'mac-split instruction-' + ctx.display;
      const u = ctx.util;
      const menubar = u.el('header', 'mac-menubar', document.body),
        apple = u.svg('svg', { viewBox: '0 0 30 34', width: 30, height: 34, 'aria-hidden': 'true' }, menubar);
      u.svg(
        'path',
        {
          d: 'M16 9C11 5 4 10 4 18c0 8 5 14 8 14 2 0 3-2 5-2s3 2 5 2c3 0 5-4 6-8-7-2-7-11-1-13-3-4-7-4-11-2zM16 7c0-5 4-7 8-7 0 4-3 8-8 7z',
          fill: '#000',
        },
        apple,
      );
      for (const label of ['File', 'Edit', 'Task', 'Options', 'Window', 'Help'])
        u.el('span', 'mac-menu-item', menubar, label);
      const help = u.el('button', 'mac-help', menubar, '?');
      help.type = 'button';
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      u.el('span', 'mac-clock', menubar, '10:24 AM');
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
      const grow = u.svg('svg', { viewBox: '0 0 28 28', class: 'grow-icon', 'aria-hidden': 'true' }, top);
      u.svg('rect', { x: 1, y: 1, width: 26, height: 26, fill: '#fff', stroke: '#000', 'stroke-width': 2 }, grow);
      u.svg(
        'path',
        { d: 'M6 10h9v11H6zM10 6h11v10M14 7l7-1-1 7M11 17L21 6', fill: 'none', stroke: '#000', 'stroke-width': 1.8 },
        grow,
      );
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
      const overview = u.el('div', 'overview', center),
        doc = u.svg('svg', { viewBox: '0 0 64 90', class: 'document-icon', 'aria-hidden': 'true' }, overview);
      u.svg('path', { d: 'M2 2h43l17 18v68H2zM45 2v18h17', fill: '#fff', stroke: '#000', 'stroke-width': 3 }, doc);
      u.svg(
        'path',
        {
          d: 'M12 27h17M12 36h39M12 42h39M12 48h39M12 54h39M12 60h39M12 66h39',
          fill: 'none',
          stroke: '#000',
          'stroke-width': 2.5,
        },
        doc,
      );
      const source = u.el('div', 'overview-copy', overview);
      u.el('b', '', source, 'Numbers to click:');
      u.el('div', 'overview-range', source, 'All numbers are present below.');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      const asideCopy = u.el('p', 'aside-copy', aside, 'Each number can be clicked once.');
      if (ctx.display === 'panel') aside.append(brief);
      else if (ctx.display === 'toast') overview.append(brief);
      if (ctx.display === 'hidden') brief.remove();
      const endR = ctx.rng.fork('chrome/end'),
        referenceEnd = endR.bool(0.5),
        endLabels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels.filter((x) => x !== 'Submit')),
        placement = referenceEnd ? 'footer' : endR.pick(['header', 'link']);
      if (ctx.display === 'header')
        asideCopy.textContent = `${ctx.instruction}
Each number can be clicked once.`;
      app.classList.add('end-' + placement);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'submit ' + (placement === 'link' ? 'end-link' : ''),
          placement === 'header' ? top : footer,
          endLabel,
        );
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const pool = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = collideR.pick(pool),
            decoy = u.el('button', 'chrome-xtra', top, label);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
