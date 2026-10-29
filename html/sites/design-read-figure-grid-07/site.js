(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-grid-07',
    'task': 'read-figure',
    'scenario': 'grid',
    'style': 'riso',
    'title': 'Coordinate Plotter',
    'menu': 'PLOT   /   EXPLORE   /   LEARN',
    'note': 'Coordinates',
    'layout': 'utility',
    'subtitle': '',
    'aside': 'No points plotted yet.',
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
      let brief = null;
      if (ctx.display !== 'hidden') {
        brief = u.el('div', 'brief', center);
        if (ctx.display === 'panel') {
          u.el('small', 'episode-note-label', brief, 'TASK NOTE');
          u.el('div', 'brief-copy', brief, ctx.instruction);
        } else brief.textContent = ctx.instruction;
      }
      const stage = u.el('section', 'stage', center);
      const tools = u.el('div', 'toolstrip', center);
      ['Select Point', 'Clear Points', 'Reset Grid'].forEach((label, i) => {
        const b = u.el('button', 'tool-button' + (!i ? ' active' : ''), tools, label);
        b.type = 'button';
        if (i)
          b.addEventListener('click', () => {
            const reset = document.querySelector('.reference-reset');
            if (reset) reset.click();
          });
      });
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide'),
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
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = er.bool(0.5) ? 'Submit' : labelOf(er.pick(labels));
      const placement = er.pick(['footer', 'footer', 'header', 'panel-link']),
        icon = placement === 'footer' && er.bool(0.2);
      let submit = null;
      if (!ctx.finish) {
        let parent = app,
          cls = 'submit',
          text = label;
        if (placement === 'footer') {
          parent = u.el('footer', 'bottom', app);
          if (icon) {
            cls += ' submit-icon';
            text = '✓';
          }
        } else if (placement === 'header') {
          cls += ' top-end';
        } else {
          parent = center;
          cls += ' panel-end-link';
          text = label + ' ›';
        }
        submit = u.el(placement === 'panel-link' ? 'a' : 'button', cls, parent, text);
        if (submit.tagName === 'A') submit.href = '#';
        else submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const options = labels
          .map(labelOf)
          .filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const decoy = u.el('button', 'end-xtra', center, String(cr.pick(options)));
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
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
