(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-tictactoe-10',
    'task': 'solve-puzzle',
    'scenario': 'tictactoe',
    'style': 'beos',
    'title': 'Tic-Tac-Toe',
    'menu': 'Game    Settings    Help',
    'note': 'Turn',
    'layout': 'sheet',
    'subtitle': '',
    'aside':
      '1. You are X.\n2. Click an empty square to place your X.\n3. The computer will make its move (O).\n4. Keep playing until the game is over.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const er = ctx.rng.fork('chrome/end'),
        labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name)),
        placement = er.bool(0.5) ? 'reference' : er.pick(['toolbar', 'status']),
        endLabel = placement === 'reference' ? 'Submit' : er.pick(labels);
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const index = u.el('nav', 'sheet-index', app);
      index.setAttribute('aria-label', 'Sheet index');
      for (let i = 1; i <= 10; i++) u.el('div', i === 1 ? 'selected' : '', index, String(i));
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
      if (['qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
        const wc = u.el('div', 'native-window-controls', top);
        for (const kind of C.style === 'beos' ? ['min', 'close'] : ['min', 'max', 'close']) {
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
      const aside = u.el('aside', 'aside', app),
        turn = u.el('section', 'sheet-panel turn-panel', aside);
      u.el('div', 'panel-heading', turn, C.note);
      u.el('div', 'turn-value', turn);
      const legendPanel = u.el('section', 'sheet-panel legend-panel', aside);
      u.el('div', 'panel-heading', legendPanel, 'Legend');
      const legend = u.el('div', 'beos-legend', legendPanel);
      [
        ['X', ' = You'],
        ['O', ' = Computer'],
      ].forEach((row) => {
        const line = u.el('div', 'legend-line', legend);
        u.el('b', row[0] === 'X' ? 'x-mark' : 'o-mark', line, row[0]);
        u.el('span', '', line, row[1]);
      });
      const mark = u.el('div', 'beos-desktop-mark', document.body);
      mark.setAttribute('aria-label', 'BeOS');
      const logo = u.svg('svg', { width: 46, height: 34, viewBox: '0 0 46 34', 'aria-hidden': 'true' }, mark),
        defs = u.svg('defs', {}, logo),
        blue = u.svg('linearGradient', { id: 'beos-blue' }, defs),
        yellow = u.svg('linearGradient', { id: 'beos-yellow' }, defs);
      u.svg('stop', { offset: 0, 'stop-color': '#1433d4' }, blue);
      u.svg('stop', { offset: 1, 'stop-color': '#2356f2' }, blue);
      u.svg('stop', { offset: 0, 'stop-color': '#ffde24' }, yellow);
      u.svg('stop', { offset: 1, 'stop-color': '#f5c82c' }, yellow);
      u.svg('rect', { x: 1, y: 1, width: 21, height: 31, fill: 'url(#beos-blue)', stroke: '#17225c' }, logo);
      u.svg('rect', { x: 25, y: 1, width: 20, height: 31, fill: 'url(#beos-yellow)', stroke: '#755e17' }, logo);
      u.svg(
        'path',
        { d: 'M13 32V20Q13 18 16 18H32Q35 18 35 21V32Z', fill: '#d70006', stroke: '#101010', 'stroke-width': 1.6 },
        logo,
      );
      u.svg('path', { d: 'M12 32V21H22V32', fill: '#2938e5', stroke: '#141256', 'stroke-width': 1.2 }, logo);
      u.svg('path', { d: 'M24 19V32M35 32H44', fill: 'none', stroke: '#090909', 'stroke-width': 1.5 }, logo);
      u.el('span', '', mark, 'BeOS');
      const actions = u.el('section', 'sheet-panel sheet-actions', aside),
        endSlot = u.el('div', 'end-slot', actions);
      u.el('div', 'sheet-reset-row', actions);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'submit end-' + placement,
          placement === 'reference' ? endSlot : placement === 'toolbar' ? top : footer,
          endLabel,
        );
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options),
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
