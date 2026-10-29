(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-tictactoe-07',
    'task': 'solve-puzzle',
    'scenario': 'tictactoe',
    'style': 'gtk',
    'title': 'Tic-Tac-Toe',
    'menu': 'Game    Settings    Help',
    'note': 'How to play',
    'layout': 'margin',
    'subtitle': '',
    'aside':
      '1. You are X.\n2. Click an empty square to place your X.\n3. The computer will make its move (O).\n4. Keep playing until the game is over.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && (window.innerWidth < 1260 || window.innerHeight < 700))
        display = 'header';
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display;
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
      if (['qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
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
        brief = u.el('div', 'brief', center, display === 'header' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      if (display === 'panel' || display === 'toast') {
        const note = u.el('div', 'episode-note ' + display, app, ctx.instruction);
        note.setAttribute('aria-label', display === 'panel' ? 'Task instructions' : 'Task notification');
      }
      u.el('div', 'dot-grid dots-left', app);
      u.el('div', 'dot-grid dots-right', app);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, '×');
      u.el('p', 'aside-copy', aside, '= You');
      u.el('b', '', aside, '○');
      u.el('p', 'aside-copy', aside, '= Computer');
      const palette = u.el('section', 'floating-settings', document.body);
      const ph = u.el('header', 'palette-head', palette);
      u.el('span', 'gear', ph, '⚙');
      u.el('strong', '', ph, 'Game Settings');
      u.el('span', 'close', ph, '×');
      u.el('label', '', palette, 'Difficulty');
      u.el('div', 'settings-value', palette, 'Normal　⌄');
      u.el('label', '', palette, 'First Player');
      const players = u.el('div', 'player-switch', palette);
      u.el('span', 'active', players, 'You (X)');
      u.el('span', '', players, 'Computer (O)');
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide'),
          bank = ctx.content && ctx.content.END_LABELS;
        const labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const label = er.bool(0.5) ? 'Submit' : String(er.pick(labels));
        const placement = er.pick(['stack', 'stack', 'top', 'link']);
        const make = (parent, cls, text) => {
          const b = u.el(placement === 'link' && cls === 'submit' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'top') submit = make(app, 'submit placement-top', label);
        else if (placement === 'link') submit = make(footer, 'submit placement-link', label + ' ›');
        else submit = make(footer, 'submit', label);
        if (cr.bool(0.3)) {
          const options = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const text = String(cr.pick(options)),
              decoy = u.el('button', 'xtra', footer, text);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
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
