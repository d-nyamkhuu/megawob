(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shape-03',
    'task': 'read-figure',
    'scenario': 'shape',
    'style': 'openlook',
    'title': 'Shape Viewer',
    'menu': 'File    Edit    View    Options',
    'note': 'Task Guide',
    'layout': 'ol',
    'subtitle': '',
    'aside': '02\n\nWhat to do\n\n1. Look at the shapes and letters.\n2. Read the task.\n3. Click on it.',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'ol.css'],
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
      const gadget = u.el('div', 'window-gadget', top);
      const arrow = u.svg('svg', { viewBox: '0 0 36 36', width: 30, height: 30 }, gadget);
      u.svg('path', { d: 'M8 18h19m-6-6 6 6-6 6', fill: 'none', stroke: '#080909', 'stroke-width': 3 }, arrow);
      u.el('span', '', top, C.title);
      if (['openlook'].includes(C.style)) {
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
      if (C.menu) {
        const menu = u.el('nav', 'menu', top);
        ['File', 'Edit', 'View', 'Options', 'Help'].forEach((label) => {
          const item = u.el('span', 'menu-item' + (label === 'Help' ? ' menu-help' : ''), menu);
          const pin = u.svg('svg', { viewBox: '0 0 24 28', width: 24, height: 28, 'aria-hidden': 'true' }, item);
          u.svg(
            'path',
            {
              d: 'M7 2h10v3h-2v11l5 3v2H4v-2l5-3V5H7zM12 21v7',
              fill: '#080909',
              stroke: '#080909',
              'stroke-width': 1.5,
            },
            pin,
          );
          u.el('span', '', item, label);
        });
      }
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const workspace = u.el('div', 'workspace', center),
        stage = u.el('section', 'stage', workspace),
        tools = u.el('div', 'tool-strip', workspace);
      tools.setAttribute('aria-hidden', 'true');
      const paths = [
        'M8 4v33l9-9 7 15 6-3-7-15 14-1z',
        'M8 13h30v24H8z',
        'M38 25a15 15 0 1 0-30 0 15 15 0 1 0 30 0',
        'M23 10l16 28H7z',
        null,
        'M9 39l29-29',
        'M9 12h29v29H9z',
      ];
      paths.forEach((path, i) => {
        const cell = u.el('div', 'tool-cell', tools),
          svg = u.svg('svg', { viewBox: '0 0 48 48', width: 48, height: 48 }, cell);
        if (path)
          u.svg(
            'path',
            {
              d: path,
              fill: i === 0 ? '#050505' : i === 6 ? '#454545' : 'none',
              stroke: i === 6 ? '#454545' : '#080909',
              'stroke-width': i === 0 ? 1 : 2.5,
            },
            svg,
          );
        else {
          const t = u.svg(
            'text',
            {
              x: 24,
              y: 41,
              'text-anchor': 'middle',
              'font-size': 45,
              'font-family': 'Times New Roman',
              'font-weight': 700,
              fill: '#080909',
            },
            svg,
          );
          t.textContent = 'T';
        }
      });
      const status = u.el('div', 'document-status', workspace);
      u.el('div', 'page-status', status, 'Page 1 of 1');
      u.el('div', 'zoom-status', status, '100%');
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      const er = ctx.rng.fork('chrome/end'),
        placement = ctx.finish ? null : er.pick(['header', 'footer', 'footer', 'link', 'footer']);
      const choices =
        ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const submits = choices.filter((x) => textOf(x).trim().toLowerCase() === 'submit');
      const alternates = choices.filter((x) => textOf(x).trim().toLowerCase() !== 'submit');
      const label =
        er.bool(0.62) && submits.length
          ? textOf(submits[0])
          : textOf(er.pick(alternates.length ? alternates : choices));
      let submit = null;
      const endButton = (parent, cls, text) => {
        const b = u.el(cls === 'ol-end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'footer') submit = endButton(footer, 'submit', label);
      else if (placement === 'header') submit = endButton(top, 'submit ol-end-header', label);
      else if (placement === 'link') submit = endButton(footer, 'ol-end-link', label + ' ›');
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = choices.map(textOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const d = u.el('button', 'ol-xtra', document.querySelector('.menu'), textOf(cr.pick(pool)));
          document.querySelector('.menu').insertBefore(d, document.querySelector('.menu-help'));
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
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
