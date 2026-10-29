(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-number-checkboxes-07',
    'task': 'read-figure',
    'scenario': 'number-checkboxes',
    'style': 'motif',
    'title': 'Pattern Trainer',
    'menu': 'File    Edit    View    Tools    Help',
    'note': 'Instructions     Examples     Shortcuts',
    'layout': 'dialog',
    'subtitle': '',
    'aside':
      'How to complete this task\n\n1. Look at the example on the left.\n2. Click the checkboxes on the right to draw the same number.\n\nNotes\n\n• The grid is arranged in rows and columns.\n• Click a checkbox to toggle it on or off.\n• Use Clear All to reset your answer if needed.',
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
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      const help = u.el('div', 'aside-copy', aside),
        helpTitle = u.el('h3', '', help, 'How to complete this task'),
        steps = u.el('ol', '', help);
      [
        'Look at the example on the left.',
        'Click the checkboxes on the right to draw the same number.',
      ].forEach((text) => u.el('li', '', steps, text));
      u.el('hr', '', help);
      u.el('h3', 'notes-title', help, 'Notes');
      const notes = u.el('ul', '', help);
      [
        'The grid is arranged in rows and columns.',
        'Click a checkbox to toggle it on or off.',
        'Use Clear All to reset your answer if needed.',
      ].forEach((text) => u.el('li', '', notes, text));
      const footer = u.el('footer', 'bottom', app);
      // New frame choices have independent streams so task sampling stays unchanged.
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const original = endRng.bool(0.5),
        placement = original ? 'footer' : endRng.pick(['toolbar', 'link']);
      const label = original ? 'Submit' : endRng.pick(endLabels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? top : footer;
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit end-' + placement, parent, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (event) => {
          event.preventDefault();
          ctx.submit();
        });
      }
      if (collideRng.bool(0.3)) {
        const pool = endLabels.filter((text) => text.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = collideRng.pick(pool),
            decoy = u.el('button', 'chrome-xtra', footer, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      // At compact sizes panel and toast notes use the original header treatment.
      const roomy = app.getBoundingClientRect().width >= 850 && app.getBoundingClientRect().height >= 680;
      if (roomy && ctx.display === 'panel') {
        aside.insertBefore(brief, help);
        brief.classList.add('episode-panel');
        aside.classList.add('has-episode-panel');
        center.classList.add('without-brief');
      } else if (roomy && ctx.display === 'toast') {
        document.body.append(brief);
        brief.classList.add('episode-toast');
        center.classList.add('without-brief');
      } else if (ctx.display === 'hidden') {
        brief.remove();
        center.classList.add('without-brief');
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
