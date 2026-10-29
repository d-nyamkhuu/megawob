(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-tictactoe-01',
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
      const nav = C.menu ? u.el('nav', 'menu', top, C.menu) : null;
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      const asideCopy = u.el('p', 'aside-copy', aside, C.aside);
      if (ctx.display === 'panel') {
        const goal = u.el('section', 'goal-note', aside);
        u.el('b', '', goal, 'Your goal');
        u.el('p', '', goal, ctx.instruction);
      } else if (ctx.display === 'hidden') {
        asideCopy.hidden = true;
      }
      const toast = ctx.display === 'toast' ? u.el('div', 'task-toast', document.body, ctx.instruction) : null;
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = ctx.content.END_LABELS.map((x) =>
            typeof x === 'string' ? x : x.label || x.text || x.name || String(x),
          ),
          original = er.bool(0.5),
          label = original ? 'Submit' : er.pick(labels.filter((x) => x.toLowerCase() !== 'submit')),
          placement = original ? 'footer' : er.pick(['link', 'header']);
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collide = cr.pick(options);
        }
        const make = (parent, cls, text) => {
          const b = u.el('button', 'submit ' + cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        const decoy = (parent, text) => {
          const b = u.el('button', 'gtk-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        };
        if (collide && nav) decoy(nav, collide);
        if (placement === 'header' && nav) submit = make(nav, 'gtk-header-submit', label);
        else if (placement === 'link') submit = make(footer, 'gtk-end-link', label);
        else submit = make(footer, '', label);
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
