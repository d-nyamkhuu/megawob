(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-number-checkboxes-01',
    'task': 'read-figure',
    'scenario': 'number-checkboxes',
    'style': 'motif',
    'title': 'Training Exercise',
    'menu': 'File    Edit    Help',
    'note': 'Tools',
    'layout': 'dialog',
    'subtitle': '',
    'aside': 'Terminal\nText Editor\nFile Manager\nHelp',
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
      const menu = C.menu ? u.el('nav', 'menu', top, C.menu) : null;
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'header' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      if (ctx.display === 'panel') {
        const panel = u.el('section', 'instruction-panel', document.body);
        u.el('b', '', panel, 'Exercise');
        u.el('div', 'instruction-panel-copy', panel, ctx.instruction);
      }
      if (ctx.display === 'toast') {
        const toast = u.el('div', 'instruction-toast-note', document.body);
        u.el('div', 'instruction-toast-copy', toast, ctx.instruction);
      }
      const footer = u.el('footer', 'bottom', app);
      const ends =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const er = ctx.rng.fork('chrome/end');
      let placement = null,
        label = labelOf(ends.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || 'Submit');
      if (!ctx.finish) {
        if (er.bool(0.5)) placement = 'footer';
        else {
          placement = er.pick(['titlebar', 'menu']);
          label = labelOf(er.pick(ends));
        }
      }
      const addEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      let submit = null;
      if (placement === 'titlebar') submit = addEnd(top, 'chrome-end chrome-title-end', label);
      if (placement === 'menu') submit = addEnd(menu, 'chrome-end chrome-menu-end', label);
      if (placement === 'footer') submit = addEnd(footer, 'submit chrome-end', label);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = ends.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) collide = { label: cr.pick(choices), where: cr.pick(['menu', 'footer']) };
      }
      if (collide) {
        const parent = collide.where === 'menu' ? menu : footer;
        const b = u.el('button', 'chrome-xtra', parent, collide.label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
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
