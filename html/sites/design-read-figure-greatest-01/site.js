(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-greatest-01',
    'task': 'read-figure',
    'scenario': 'greatest',
    'style': 'directory',
    'title': 'WorldGuide',
    'menu': 'Your Guide to the World Wide Web',
    'note': 'My Notes',
    'layout': 'stagger',
    'subtitle': '',
    'aside': 'Notes:\n\nLook carefully at the numbers. Select the greatest value.',
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
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center, ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      const asideCopy = u.el('p', 'aside-copy', aside, C.aside);
      if (ctx.display === 'header') {
        brief.classList.add('episode-header-note');
        top.appendChild(brief);
      } else if (ctx.display === 'panel') {
        brief.remove();
        asideCopy.textContent = ctx.instruction;
        asideCopy.classList.add('episode-panel-note');
      } else if (ctx.display === 'toast') {
        brief.remove();
        const note = u.el('div', 'episode-toast', document.body, ctx.instruction);
      } else {
        brief.remove();
      }
      const footer = u.el('footer', 'bottom', app);
      const endRng = ctx.rng.fork('chrome/end'),
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
        ];
      const labelPool = labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const defaultEnd = endRng.bool(0.5),
        alternatives = labelPool.filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = defaultEnd ? 'Submit' : alternatives.length ? endRng.pick(alternatives) : 'Done';
      const placement = defaultEnd ? 'footer' : endRng.pick(['header', 'footer', 'link']);
      const decoyBtn = (parent, text, collide) => {
        const b = u.el('button', 'episode-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        return b;
      };
      const submitBtn = (parent, cls, text) => {
        const b = u.el(cls === 'episode-end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const pool = [...new Set(labelPool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = { text: collideRng.pick(pool), where: collideRng.pick(['header', 'footer']) };
      }
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') submit = submitBtn(top, 'episode-end-header', label);
        if (placement === 'footer') submit = submitBtn(footer, 'submit', label);
        if (placement === 'link') submit = submitBtn(footer, 'episode-end-link', label + ' ›');
      }
      if (collide) {
        const parent = collide.where === 'header' ? top : footer;
        decoyBtn(parent, collide.text, true);
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
