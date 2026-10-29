(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-tictactoe-12',
    'task': 'solve-puzzle',
    'scenario': 'tictactoe',
    'style': 'kde',
    'title': 'Tic-Tac-Toe Challenge',
    'menu': 'File    Edit    View    Settings    Help',
    'note': 'Game Info',
    'layout': 'kde-stage',
    'subtitle': '',
    'aside': 'You are: X\nOpponent: O\nTurn: Your move',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink', 'kde'].includes(C.style)) {
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
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink', 'kde'].includes(C.style)) {
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
      const rail = u.el('nav', 'tool-rail', app);
      [
        ['⟳', 'New Board'],
        ['♧', 'Hint'],
        ['↶', 'Undo'],
      ].forEach(([icon, label], i) => {
        const item = u.el('button', 'rail-tool', rail);
        item.type = 'button';
        u.el('span', 'rail-icon', item, icon);
        u.el('span', '', item, label);
        if (i === 0) item.addEventListener('click', () => document.querySelector('.reference-reset')?.click());
      });
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      const preview = u.el('button', 'preview-move', aside);
      preview.type = 'button';
      u.el('span', 'preview-eye', preview, '◉');
      u.el('span', '', preview, 'Preview Move');
      preview.addEventListener('click', () => env.log('decoy', { label: 'Preview Move' }));
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'reference' : endRng.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const actions = u.el('div', 'chrome-actions', top);
      let submit = null;
      if (!ctx.finish) {
        footer.classList.add('end-' + placement);
        submit = u.el(
          'button',
          'submit' + (placement === 'toolbar' ? ' toolbar-end' : placement === 'link' ? ' link-end' : ''),
          placement === 'toolbar' ? actions : footer,
          endLabel,
        );
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      if (collideRng.bool(0.3)) {
        const options = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideRng.pick(options),
            decoy = u.el('button', 'chrome-xtra', actions, label);
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
