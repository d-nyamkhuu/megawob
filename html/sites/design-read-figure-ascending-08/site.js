(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-ascending-08',
    'task': 'read-figure',
    'scenario': 'ascending',
    'style': 'beos',
    'title': 'Number Order',
    'menu': 'File     Edit     Options     Help',
    'note': '',
    'layout': 'offset',
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
            rx: C.style === 'mint' ? 0 : C.style === 'beos' ? 0 : 3,
            fill:
              C.style === 'mint'
                ? 'none'
                : C.style === 'dark'
                  ? '#8266ce'
                  : C.style === 'electron'
                    ? '#ee8520'
                    : C.style === 'beos'
                      ? '#fff'
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
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink', 'beos'].includes(C.style)) {
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
      if (ctx.display !== 'hidden') u.el('div', 'brief-note', brief, ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const tools = u.el('div', 'document-tools', app);
      for (const [kind, label] of [
        ['pointer', 'Pointer'],
        ['select', 'Selection'],
        ['eraser', 'Eraser'],
      ]) {
        const tool = u.el('button', 'document-tool ' + kind, tools);
        tool.type = 'button';
        tool.title = label;
        tool.setAttribute('aria-label', label);
        const svg = u.svg('svg', { width: 30, height: 34, viewBox: '0 0 30 34', 'aria-hidden': 'true' }, tool);
        if (kind === 'pointer')
          u.svg('path', { d: 'M7 3v25l6-7 5 11 5-3-6-10h9Z', fill: '#fff', stroke: '#111', 'stroke-width': 1.3 }, svg);
        else if (kind === 'select')
          u.svg(
            'rect',
            {
              x: 4,
              y: 6,
              width: 22,
              height: 22,
              fill: 'none',
              stroke: '#111',
              'stroke-width': 1.5,
              'stroke-dasharray': '4 2',
            },
            svg,
          );
        else {
          u.svg(
            'path',
            { d: 'M3 21 19 4q2-2 4 0l5 5q2 2 0 4L13 30H8Z', fill: '#ddd', stroke: '#111', 'stroke-width': 1.5 },
            svg,
          );
          u.svg('path', { d: 'm7 17 10 10M10 30l3-4', fill: 'none', stroke: '#111', 'stroke-width': 1.2 }, svg);
        }
        tool.addEventListener('click', () => env.log('decoy', { label }));
      }
      const footer = u.el('footer', 'bottom', app),
        toolbar = u.el('div', 'chrome-actions', top);
      const er = ctx.rng.fork('chrome/end'),
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
        labels = ctx.content.END_LABELS.map(labelOf),
        classic = er.bool(0.5),
        placement = classic ? 'footer' : er.pick(['toolbar', 'footer-left']),
        label = classic ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, placement === 'toolbar' ? toolbar : footer, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = cr.pick(pool),
            decoy = u.el('button', 'chrome-xtra', placement === 'toolbar' ? footer : toolbar, text);
          decoy.type = 'button';
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
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
