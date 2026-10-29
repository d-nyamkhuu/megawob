(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-tictactoe-11',
    'task': 'solve-puzzle',
    'scenario': 'tictactoe',
    'style': 'notebook',
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
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      document.body.className = 'notebook instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        tabs = u.el('nav', 'tabs', app);
      ['Play', 'Notes', 'Strategy', 'History', 'About'].forEach((label, i) => {
        const tab = u.el('div', 'tab' + (i === 0 ? ' active' : ''), tabs, label);
        tab.addEventListener('click', () => env.log('decoy', { label }));
      });
      const top = u.el('header', 'top', app);
      u.el('span', '', top, C.title);
      const center = u.el('div', 'center', app),
        brief = ctx.display === 'hidden' ? null : u.el('div', 'brief', center, ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', center);
      if (ctx.display === 'panel') aside.append(brief);
      u.el('b', '', aside, 'How to Play');
      u.el(
        'p',
        'aside-copy',
        aside,
        '1. You are X.\n2. Click an empty square to place your X.\n3. The computer will make its move.\n4. Get three in a row, or force a draw.',
      );
      const footer = u.el('footer', 'bottom', app);
      // All episode choices use independent streams; the task's existing draws stay intact.
      const er = ctx.rng.fork('chrome/end'),
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
        labels = ctx.content.END_LABELS.map(labelOf),
        classic = er.bool(0.5),
        placement = classic ? 'footer' : er.pick(['header', 'link']),
        label = classic ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? top : footer;
        submit = u.el('button', 'submit end-' + placement, parent, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', ctx.submit);
        app.classList.add('end-at-' + placement);
      } else {
        app.classList.add('finish-mode');
        u.el('span', 'edition-mark', footer, 'Practice notebook · Page 1');
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options),
            decoy = u.el('button', 'xtra-end', footer, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
        banner:
          'We’re performing scheduled maintenance later today. The game is fully playable now, but some features may be unavailable for a short time.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el(
        'button',
        '',
        el,
        ctx.kind === 'cookie' ? 'Accept' : ctx.kind === 'banner' ? 'Collapse Announcement ▲' : 'Dismiss',
      );
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
