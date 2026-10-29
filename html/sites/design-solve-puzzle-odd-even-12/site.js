(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-odd-even-12',
    'task': 'solve-puzzle',
    'scenario': 'odd-even',
    'style': 'riso',
    'title': 'Number Practice',
    'menu': '',
    'note': '',
    'layout': 'horizontal',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      let display = ctx.display;
      // Compact windows keep the task note above the stage.
      if (
        (display === 'panel' && document.documentElement.clientWidth < 1260) ||
        (display === 'toast' && document.documentElement.clientHeight < 700)
      )
        display = 'header';
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink', 'riso'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg(
          'rect',
          { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#7250df', stroke: 'currentColor', 'stroke-width': 1.5 },
          icon,
        );
        u.svg(
          'path',
          {
            d: 'M7 6h12v5H7z M8 14h2v2H8z M12 14h2v2h-2z M16 14h2v2h-2z M8 18h2v2H8z M12 18h6v2h-6z',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.5,
          },
          icon,
        );
      }
      u.el('span', '', top, C.title);
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink', 'riso'].includes(C.style)) {
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
      const footer = u.el('footer', 'bottom', app);
      u.el('div', 'settings', footer, '⚙  Settings');
      const art = u.el('div', 'footer-art', footer),
        trees = u.el('img', '', art);
      trees.src = 'sites/' + C.site + '/assets/footer-trees.webp';
      trees.alt = '';
      u.el('div', 'footer-tagline', footer, 'A BRIGHTER\nTOMORROW\nADDS UP'); // These streams do not consume any existing frame or task draws.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5),
        placement = original ? 'footer' : er.pick(['toolbar', 'link']);
      const label = original ? labels.find((x) => x === 'Submit') || 'Submit' : er.pick(labels);
      const tools = u.el('div', 'episode-tools', top);
      top.insertBefore(tools, top.querySelector('.native-window-controls'));
      if (cr.bool(0.3)) {
        const choices = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const text = cr.pick(choices),
            decoy = u.el('button', 'episode-xtra', tools, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.title = text;
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, placement === 'toolbar' ? tools : footer, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const warn = ctx.kind === 'banner';
      if (warn) {
        const icon = u.svg('svg', { width: 68, height: 68, viewBox: '0 0 68 68', class: 'warning-icon' }, el);
        u.svg('path', { d: 'M34 5 64 58H4z', fill: '#e7a400' }, icon);
        const mark = u.svg(
          'text',
          { x: 34, y: 48, 'text-anchor': 'middle', fill: '#fff', 'font-size': 43, 'font-weight': 700 },
          icon,
        );
        mark.textContent = '!';
        const copy = u.el('div', 'warning-copy', el);
        u.el('b', '', copy, 'Unsaved layout changes');
        u.el(
          'span',
          '',
          copy,
          'You have unsaved layout changes. You can continue without saving and your answers will be preserved.',
        );
      } else u.el('span', '', el, 'This application stores preferences on your device.');
      const dismiss = u.el('button', '', el, warn ? 'Continue without saving' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
