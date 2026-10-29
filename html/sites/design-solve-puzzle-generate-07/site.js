(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-generate-07',
    'task': 'solve-puzzle',
    'scenario': 'generate',
    'style': 'plain',
    'title': 'Odd Number Practice',
    'menu': '',
    'note': 'Notes',
    'layout': 'floating',
    'subtitle': '',
    'aside': 'Remember: Read the condition and check the current number.',
  };
  function notebookFrame(ctx) {
    const u = ctx.util,
      er = ctx.rng.fork('chrome/end'),
      placement = er.pick(['stage', 'stage', 'header', 'footer']),
      bank = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ],
      labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
      label = er.bool(0.5) ? 'Submit' : labelOf(er.pick(bank));
    document.body.className = 'notebook07 instruction-' + ctx.display;
    const app = u.el('main', 'app', document.body),
      top = u.el('header', 'nb-top', app);
    u.el('strong', 'nb-brand', top, 'WorkBench');
    u.el('span', 'nb-divider', top, '│');
    u.el('span', 'nb-product', top, 'Notebook');
    const nav = u.el('nav', 'nb-nav', top);
    ['Projects', 'Notes', 'Tools', 'Help'].forEach((x) => u.el('span', '', nav, x));
    u.el('span', 'nb-user', top, 'JS');
    const ws = u.el('div', 'nb-workspace', app),
      left = u.el('aside', 'nb-brief', ws),
      groups = [
        ['Task Brief', ctx.display === 'hidden' ? '' : ctx.instruction],
        [
          'Details',
          'Use the Generate button on the right to create a new number.\nKeep generating until the number shown is an odd number (1, 3, 5, 7, 9, …).',
        ],
        ['Goal', 'Complete the task using the controls on the right.'],
      ];
    groups.forEach((g, i) => {
      if (i === 0 && ctx.display === 'hidden') return;
      const sec = u.el('section', 'nb-brief-section', left),
        h = u.el('h2', '', sec);
      u.el('span', 'nb-index', h, String(i + 1));
      u.el('span', '', h, g[0]);
      if (i === 0) {
        if (ctx.display !== 'hidden') {
          const mode = ctx.display === 'header' ? ' nb-note-header' : ctx.display === 'toast' ? ' nb-note-toast' : '';
          u.el('div', 'nb-instruction' + mode, sec, g[1]);
        }
      } else if (i === 1) {
        const ul = u.el('ul', '', sec);
        g[1].split('\n').forEach((t) => u.el('li', '', ul, t));
      } else u.el('p', '', sec, g[1]);
    });
    const right = u.el('section', 'nb-right', ws),
      tabs = u.el('nav', 'nb-tabs', right);
    [
      ['01', 'Random Number'],
      ['02', 'Calculator'],
      ['03', 'Data'],
      ['04', 'Reports'],
    ].forEach((t, i) => {
      const tab = u.el('div', 'nb-tab' + (i === 0 ? ' active' : ''), tabs);
      u.el('b', '', tab, t[0]);
      u.el('span', '', tab, t[1]);
    });
    const panel = u.el('section', 'nb-panel', right);
    u.el('h1', 'nb-panel-title', panel, 'Random Number Generator');
    const stage = u.el('div', 'stage', panel),
      info = u.el('div', 'nb-info', right),
      recent = u.el('section', 'nb-card', info);
    u.el('h2', '', recent, 'Recent Numbers');
    const table = u.el('div', 'nb-table', recent);
    [
      '#　　 Value　　 Generated At',
      '1　　 4　　 10:24:12 AM',
      '2　　 8　　 10:24:07 AM',
      '3　　 6　　 10:24:03 AM',
      '4　　 2　　 10:23:58 AM',
      '5　　 4　　 10:23:54 AM',
    ].forEach((x) => u.el('div', '', table, x));
    const about = u.el('section', 'nb-card', info);
    u.el('h2', '', about, 'About');
    u.el('p', '', about, 'Each time you press Generate, a new random whole number from 1 to 10 is shown.');
    const footer = u.el('footer', 'bottom', app);
    let submit = null;
    if (!ctx.finish) {
      submit = u.el('button', 'submit nb-end-' + placement, footer, label);
      submit.type = 'button';
      submit.setAttribute('aria-label', label);
      submit.title = label;
      submit.addEventListener('click', ctx.submit);
    }
    const cr = ctx.rng.fork('chrome/collide');
    if (cr.bool(0.3)) {
      const options = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      if (options.length) {
        const b = u.el('button', 'nb-pq', nav, labelOf(cr.pick(options)));
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
      }
    }
    return { stage, submit };
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      if (C.site === 'design-solve-puzzle-generate-07') return notebookFrame(ctx);
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
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit nb-end-' + placement, footer, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
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
