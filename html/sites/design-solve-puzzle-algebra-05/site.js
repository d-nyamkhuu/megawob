(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-algebra-05',
    'task': 'solve-puzzle',
    'scenario': 'algebra',
    'style': 'qt',
    'title': 'Math Practice - Linear Equations',
    'menu': 'File    Edit    View    Tools    Help',
    'note': 'Problems',
    'layout': 'horizontal',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'qt-plastik horizontal instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg(
        'rect',
        { x: 3, y: 2, width: 20, height: 22, rx: 1, fill: '#dce6ed', stroke: '#43576a', 'stroke-width': 1.5 },
        icon,
      );
      u.svg(
        'path',
        { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: '#294e7d', 'stroke-width': 1.5 },
        icon,
      );
      u.el('span', 'window-title', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const b = u.el('button', 'window-control ' + kind, wc, kind === 'min' ? '_' : kind === 'max' ? '□' : '×');
        b.type = 'button';
      }
      const menu = u.el('nav', 'menu', app);
      C.menu.split(/\s{2,}/).forEach((label) => u.el('span', 'menu-item', menu, label));
      const tools = u.el('div', 'toolbar', app);
      [
        ['▧', 'New'],
        ['📁', 'Open'],
        ['▣', 'Save'],
        ['▤', 'Print'],
        ['?', 'Help'],
      ].forEach((v, i) => {
        if (i === 3) u.el('i', 'tool-separator', tools);
        const b = u.el('button', 'tool-button', tools, '');
        b.type = 'button';
        u.el('span', 'tool-glyph', b, v[0]);
        u.el('span', '', b, v[1]);
      });
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide'),
        labels = ctx.content.END_LABELS;
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels =
        Array.isArray(labels) && labels.length
          ? labels.map(labelText)
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const placement = endRng.pick(['stage', 'stage', 'stage', 'footer', 'toolbar']);
      const endLabel = labelText(endRng.pick(endLabels));
      const collide = collideRng.bool(0.3)
        ? collideRng.pick(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      const center = u.el('div', 'center', app),
        aside = u.el('aside', 'problem-list', center);
      u.el('div', 'dock-title', aside, 'Problems');
      ['2x + 3 = 11', '3x + 5 = 26', 'x − 7 = 4', '5x + 1 = 16', '4x − 3 = 9'].forEach((v, i) => {
        const row = u.el('div', 'problem-row' + (i === 1 ? ' current' : ''), aside);
        u.el('span', 'problem-number', row, String(i + 1));
        u.el('span', '', row, v);
      });
      const meta = u.el('div', 'meta-strip', center);
      u.el('div', 'meta-left', meta, '');
      u.el('b', '', meta, 'Topic:');
      u.el('span', 'topic-value', meta, 'Linear Equations');
      const problem = u.el('div', 'problem-meta', meta);
      u.el('b', '', problem, 'Problem:');
      u.el('span', '', problem, '2 of 5');
      const metaRight = u.el('div', 'meta-right', meta);
      u.el('div', '', metaRight, 'Level:　 Practice');
      u.el('div', '', metaRight, 'Time:　 --:--');
      const small = ctx.size && ctx.size.width < 1260;
      const display = small && ctx.display !== 'hidden' ? 'header' : ctx.display;
      let brief = null;
      if (display !== 'hidden') {
        brief = u.el('div', 'brief instruction-' + display, center, ctx.instruction);
      }
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      for (const label of ['Clear', 'Check Answer']) {
        const b = u.el('button', 'task-action', footer, label);
        b.type = 'button';
        if (label === 'Clear')
          b.addEventListener('click', () => {
            const input = document.querySelector('.answer input');
            if (input) {
              input.value = '';
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.focus();
            }
          });
      }
      const status = u.el('div', 'status-bar', app);
      u.el('span', '', status, 'Ready');
      u.el('span', 'status-spacer', status, '');
      u.el('span', 'num-indicator', status, 'Num');
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'submit end-' + placement,
          placement === 'toolbar' ? tools : placement === 'footer' ? footer : stage,
          endLabel,
        );
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      }
      if (collide) {
        const b = u.el('button', 'tool-button pq-xtra', tools, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
