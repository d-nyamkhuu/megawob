(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-color-07',
    'task': 'read-figure',
    'scenario': 'color',
    'style': 'pix',
    'title': 'Color Match',
    'menu': '',
    'note': '',
    'layout': 'utility',
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
      u.el('small', 'date', top, 'Mon Apr 25, 2005');
      const tabs = u.el('nav', 'tabs', top);
      ['Task', 'Results', 'Preferences'].forEach((t, i) => u.el('span', i ? 'tab' : 'tab on', tabs, t));
      const rail = u.el('div', 'rail', document.body);
      [
        ['Home', 'M3 13h3v-3h3V7h3V4h3V2h3v3h3v3h3v3h3v3h3v3h-4v13H6V17H3z', ''],
        ['Tasks', 'M2 5h11v3h17v23H2z', 'M4 7h8v3h16v19H4z'],
        ['Tools', 'M3 3h26v27H3z', 'M6 6h4v4H6zM13 6h13v4H13zM6 13h4v4H6zM13 13h13v4H13zM6 20h4v4H6zM13 20h13v4H13z'],
        [
          'Settings',
          'M12 1h8v4h4v3h4v4h4v8h-4v4h-4v4h-4v4h-8v-4H8v-4H4v-4H0v-8h4V8h4V4h4z',
          'M12 10h8v2h2v8h-2v2h-8v-2h-2v-8h2z',
        ],
        ['Help', 'M8 2h17v3h4v4h3v17h-4v4H5v-4H2V9h3V5h3z', 'M11 7h10v3h3v7h-4v4h-6v-7h5v-4h-6v3H8V9h3zM14 24h6v4h-6z'],
      ].forEach(([n, d, detail], i) => {
        const b = u.el('div', i === 1 ? 'ri on' : 'ri', rail);
        const svg = u.svg('svg', { width: 42, height: 42, viewBox: '0 0 34 34', 'shape-rendering': 'crispEdges' }, b);
        u.svg('path', { d, fill: i === 1 ? '#153653' : '#edf5f7' }, svg);
        if (detail) u.svg('path', { d: detail, fill: i === 1 ? '#edf5f7' : '#173b60' }, svg);
        u.el('span', '', b, n);
      });
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      brief.style.setProperty(
        '--instruction-size',
        'clamp(24px,' + Math.min(4.4, 130 / Math.max(1, ctx.instruction.length)) + 'vw,74px)',
      );
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      // Episode controls have independent streams, preserving all existing seeded choices.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const classic = er.bool(0.5),
        placement = classic ? 'footer' : er.pick(['header', 'link']);
      const label = classic ? labels.find((x) => x === 'Submit') || 'Submit' : er.pick(labels);
      const decoyBtn = (parent, text, collide) => {
        const b = u.el('button', 'clear episode-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        const clear = u.el('button', 'clear', footer, 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => env.log('decoy', { label: 'Clear' }));
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit end-' + placement,
          placement === 'header' ? top : footer,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (event) => {
          event.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const pool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) decoyBtn(footer, cr.pick(pool), true);
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
