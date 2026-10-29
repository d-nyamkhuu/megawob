(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shades-08',
    'task': 'read-figure',
    'scenario': 'shades',
    'style': 'neu',
    'title': 'Math Notebook',
    'menu': 'Notebook    Problems    Draw    Highlight    Erase',
    'note': 'Notes',
    'layout': 'stagger',
    'subtitle': '',
    'aside':
      'Quick Notes:\n\n1. Count the blocks in each group.\n2. Add the two numbers.\n3. Type the total into the textbox.',
  };
  const labelOf = (value) => (typeof value === 'string' ? value : value.label || value.text || value.name);
  function endChoice(ctx) {
    const r = ctx.rng.fork('chrome/end');
    const labels = ctx.content.END_LABELS.map(labelOf);
    const original = labels.find((label) => label === 'Submit') || 'Submit';
    if (r.bool(0.5)) return { label: original, placement: 'footer' };
    return {
      label: r.pick(labels.filter((label) => label !== original)),
      placement: r.pick(['margin-header', 'margin-link']),
    };
  }
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
      const end = endChoice(ctx);
      const headerTools = u.el('div', 'margin-tools', aside);
      if (ctx.display !== 'hidden') {
        u.el('h3', '', aside, 'Instructions');
        u.el('p', 'ins', aside, ctx.instruction);
      }
      u.el('h3', '', aside, 'Notes');
      const ul = u.el('ul', 'notes', aside);
      for (const t of [
        'Click any tile to select or deselect it.',
        'You can select multiple tiles.',
        'Only tiles of the requested color should be selected.',
      ])
        u.el('li', '', ul, t);
      const noteTools = u.el('div', 'note-tools', aside);
      const footer = u.el('footer', 'bottom', aside);
      let submit = null;
      const clr = u.el('button', 'clear', footer, 'Clear selection');
      clr.type = 'button';
      clr.addEventListener('click', () => {
        document
          .querySelectorAll('.up-tile[aria-checked="true"]')
          .forEach((t) => t.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true })));
      });
      if (!ctx.finish) {
        const parent =
          end.placement === 'margin-header' ? headerTools : end.placement === 'margin-link' ? noteTools : footer;
        const isLink = end.placement === 'margin-link';
        submit = u.el(isLink ? 'a' : 'button', isLink ? 'end-link' : 'submit', parent, end.label);
        if (isLink) submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = end.label;
        submit.setAttribute('aria-label', end.label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = [...new Set(ctx.content.END_LABELS.map(labelOf))].filter(
          (label) => label.trim().toLowerCase() !== end.label.trim().toLowerCase(),
        );
        if (choices.length) {
          const label = cr.pick(choices);
          const tools = u.el('div', 'xtra-tools', aside);
          aside.insertBefore(tools, footer);
          const decoy = u.el('button', 'clear xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
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
