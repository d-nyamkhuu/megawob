(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-number-checkboxes-05',
    'task': 'read-figure',
    'scenario': 'number-checkboxes',
    'style': 'eink',
    'title': 'Number Practice',
    'menu': '',
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
        if (C.style === 'eink') {
          u.svg(
            'rect',
            { x: 2, y: 2, width: 22, height: 22, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7 },
            icon,
          );
          for (let i = 1; i < 3; i++) {
            u.svg(
              'path',
              {
                d: `M${2 + i * 5.5} 2v22M2 ${2 + i * 5.5}h22`,
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': 1.5,
              },
              icon,
            );
          }
        } else {
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
      }
      u.el('span', '', top, C.title);
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endWords = bank.map(labelOf);
      const original = endRng.bool(0.5);
      const submitLabel = endWords.find((x) => x.toLowerCase() === 'submit') || 'Submit';
      const label = original ? submitLabel : labelOf(endRng.pick(endWords.filter((x) => x.toLowerCase() !== 'submit')));
      const placement = original ? 'footer' : endRng.pick(['titlebar', 'footer-link']);
      const collision = collideRng.bool(0.3)
        ? collideRng.pick(endWords.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))
        : null;
      const decoy = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      let submit = null;
      if (!ctx.finish && placement === 'titlebar') {
        submit = u.el('button', 'submit titlebar-submit', top, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      }
      if (collision) decoy(top, collision);
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
      let display = ctx.display || 'header';
      const size = ctx.size || {};
      if ((display === 'panel' || display === 'toast') && (size.width < 1180 || size.height < 680)) display = 'header';
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display;
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      if (!ctx.finish && placement !== 'titlebar') {
        const cls = placement === 'footer-link' ? 'submit footer-link' : 'submit';
        submit = u.el('button', cls, footer, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      }
      return { stage, submit: ctx.finish ? null : submit };
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
