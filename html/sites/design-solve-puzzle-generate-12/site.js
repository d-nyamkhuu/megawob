(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-generate-12',
    'task': 'solve-puzzle',
    'scenario': 'generate',
    'style': 'sgi',
    'title': 'Number Task – Console',
    'menu': 'File     Edit     View     Tools     Windows     Help',
    'note': '',
    'layout': 'workstation',
    'subtitle': '',
    'aside': 'Remember: Read the condition and check the current number.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      const display = ctx.display || 'header';
      const er = ctx.rng.fork('chrome/end'),
        labels = (ctx.content && ctx.content.END_LABELS) || [
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
        endLabel = er.bool(0.5) ? 'Submit' : labelOf(er.pick(labels)),
        placement = er.pick(['widget', 'widget', 'widget', 'footer', 'toolbar']);
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display + ' end-' + placement;
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const opts = [
          ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (opts.length) collide = cr.pick(opts);
      }
      const desk = u.el('div', 'desktop', document.body),
        sys = u.el('div', 'system-menu', desk),
        brand = u.el('b', 'irix-brand', sys, '◢ IRIX ▸');
      ['File', 'Edit', 'View', 'Tools', 'Windows', 'Help'].forEach((x) => u.el('span', 'sys-item', sys, x));
      u.el('span', 'clock', sys, 'Mon Apr 14   10:27 AM');
      const shelf = u.el('div', 'tool-shelf', desk);
      if (collide) {
        const d = u.el('button', 'chrome-xtra collide', shelf, collide);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      [
        ['▰', 'Explorer'],
        ['›_', 'Terminal'],
        ['●', 'Graphics'],
        ['▤', 'DataMgr'],
        ['▣', 'Print'],
        ['⚒', 'Prefs'],
        ['?', 'Help'],
      ].forEach((a) => {
        const x = u.el('div', 'tool', shelf);
        u.el('b', 'tool-icon', x, a[0]);
        u.el('span', '', x, a[1]);
      });
      const app = u.el('main', 'app', desk),
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
        brief = u.el('div', 'brief', center);
      if (display === 'header') brief.textContent = ctx.instruction;
      else if (display === 'panel') {
        u.el('b', 'panel-caption', brief, 'Task memo');
        u.el('span', 'panel-instruction', brief, ctx.instruction);
      }
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      u.el(
        'span',
        'status-note',
        footer,
        display === 'toast' ? ctx.instruction : 'Generate a new number until it satisfies the condition.',
      );
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit', footer, endLabel);
        submit.type = 'button';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
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
