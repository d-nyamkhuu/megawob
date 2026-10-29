(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-arithmetic-09',
    'task': 'solve-puzzle',
    'scenario': 'arithmetic',
    'style': 'homepage',
    'title': 'Math Practice',
    'menu': '',
    'note': 'A quick calculation',
    'layout': 'notebook',
    'subtitle': '',
    'aside': 'Use the order of operations to solve the problem.\nType your answer in the box.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className =
        C.style + ' ' + C.layout + ' instruction-' + ctx.display + (ctx.finish ? ' episode-finish' : '');
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', '', top, C.title);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const branch = u.svg(
          'svg',
          { class: 'leaf-art', viewBox: '0 0 150 110', fill: 'none', 'aria-hidden': 'true' },
          aside,
        ),
        ink = { stroke: '#9b884e', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
      u.svg(
        'path',
        {
          ...ink,
          d: 'M8 103C27 79 40 58 57 38S89 14 125 7M30 77C23 60 24 45 36 23C43 45 41 60 30 77ZM39 66C55 55 68 40 75 20C56 31 45 45 39 66ZM51 47C46 30 50 16 63 4C66 23 62 37 51 47ZM44 61C62 59 79 64 96 77C76 79 59 74 44 61ZM68 31C85 21 101 19 121 24C105 37 87 39 68 31ZM31 77C49 75 66 81 79 95C60 96 44 90 31 77Z',
        },
        branch,
      );
      [
        [30, 77, 38, 23],
        [39, 66, 75, 20],
        [51, 47, 63, 4],
        [44, 61, 96, 77],
        [68, 31, 121, 24],
        [31, 77, 79, 95],
      ].forEach(([x1, y1, x2, y2]) =>
        u.svg('path', { ...ink, d: `M${x1} ${y1}Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - 4} ${x2} ${y2}` }, branch),
      );
      const footer = u.el('footer', 'bottom', app),
        tools = u.el('div', 'reference-tools', app),
        clear = u.el('button', 'tool-button', tools, '✎　Clear answer'),
        calc = u.el('button', 'tool-button', tools, '▦　Show calculator'),
        panel = u.el('div', 'calculator-panel', app);
      clear.type = calc.type = 'button';
      clear.addEventListener('click', () => {
        const field = document.querySelector('.answer input');
        if (field) {
          field.value = '';
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.focus();
        }
      });
      panel.hidden = true;
      calc.addEventListener('click', () => {
        panel.hidden = !panel.hidden;
        calc.textContent = panel.hidden ? '▦　Show calculator' : '▦　Hide calculator';
      });
      for (const key of ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '⌫', 'C']) {
        const keyButton = u.el('button', 'calc-key', panel, key);
        keyButton.type = 'button';
        keyButton.addEventListener('click', () => {
          const field = document.querySelector('.answer input');
          if (!field) return;
          field.value = key === 'C' ? '' : key === '⌫' ? field.value.slice(0, -1) : field.value + key;
          field.dispatchEvent(new Event('input', { bubbles: true }));
        });
      } // Every new choice has its own stream; task and existing frame draws are unchanged.
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const regular = endRng.bool(0.5),
        placement = regular ? 'footer' : endRng.pick(['header', 'link']);
      const label = regular ? 'Submit' : endRng.pick(endLabels);
      document.body.classList.add('end-placement-' + placement);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(placement === 'link' ? 'a' : 'button', 'reference-submit', app, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.placement = placement;
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (event) => {
          event.preventDefault();
          ctx.submit();
        });
      }
      if (collideRng.bool(0.3)) {
        const pool = endLabels.filter((word) => word.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = collideRng.pick(pool),
            decoy = u.el('button', 'end-xtra', app, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      if (ctx.display === 'panel') aside.append(brief);
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
