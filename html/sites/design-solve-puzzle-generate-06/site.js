(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-generate-06',
    'task': 'solve-puzzle',
    'scenario': 'generate',
    'style': 'macintosh',
    'title': 'Number Practice',
    'menu': '    File    Edit    Goodies    Font    Style    Windows',
    'note': 'Task',
    'layout': 'notebook',
    'subtitle': '',
    'aside': '',
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
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      brief.classList.add('instruction-' + ctx.display);
      if (ctx.display === 'panel') brief.setAttribute('aria-label', 'Task notes');
      if (ctx.display === 'toast') brief.setAttribute('role', 'status');
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body);
      ['Task', 'Notes', 'Examples', 'About'].forEach((label, i) => u.el('div', 'notebook-tab tab-' + i, aside, label));
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const r = ctx.rng.fork('chrome/end');
        const placements = ['widget', 'widget', 'header', 'footer'];
        const placement = r.pick(placements),
          labels = ctx.content && ctx.content.END_LABELS;
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const labelList =
          Array.isArray(labels) && labels.length
            ? labels.map(labelOf)
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const sampledLabel = r.bool(0.5) ? 'Submit' : r.pick(labelList);
        const label = placement === 'widget' ? 'Submit' : sampledLabel;
        document.body.classList.add('end-' + placement);
        if (placement === 'header' || placement === 'footer') {
          submit = u.el(
            'button',
            'submit chrome-end ' + (placement === 'header' ? 'end-header' : 'end-footer'),
            app,
            label,
          );
          submit.type = 'button';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', ctx.submit);
        } else {
          submit = u.el('button', 'submit chrome-end end-widget', footer, label);
          submit.type = 'button';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', ctx.submit);
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const own = label.trim().toLowerCase(),
            options = [...new Set(labelList)].filter((x) => x.trim().toLowerCase() !== own);
          if (options.length) {
            const text = cr.pick(options),
              where = cr.pick(['header', 'footer']);
            const d = u.el('button', 'chrome-xtra xtra-' + where, app, text);
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
