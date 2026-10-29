(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-count-05',
    'task': 'read-figure',
    'scenario': 'count',
    'style': 'plain',
    'title': 'Items to look at:',
    'menu': '',
    'note': '',
    'layout': 'split',
    'subtitle': '',
    'aside': '',
  };
  const FALLBACK_END = [
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
  const FALLBACK_DECOY = ['Help', 'Feedback', 'Preview', 'Save draft', 'Reset view', 'Share', 'Export', 'History'];
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: C.site,
    styles: ['site.css', 'brut.css'],
    frame(ctx) {
      document.body.className = 'brut strip instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      C.title = 'SHAPE COUNT';
      const tag = u.el('div', 'tagline', top);
      u.el('span', '', tag, 'SIMPLE TASKS');
      u.el('span', '', tag, 'REAL FOCUS');
      u.el('i', '', tag);
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
        display = ctx.display || 'header';
      const instruction = u.el(
        'div',
        'brief ' + (display === 'panel' ? 'mode-panel' : display === 'toast' ? 'mode-toast' : 'mode-header'),
        center,
        display === 'hidden' ? '' : ctx.instruction,
      );
      if (display === 'hidden') instruction.hidden = true;
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'EPISODE SETTINGS');
      u.el('p', 'aside-copy', aside, ctx.instruction);
      const footer = u.el('footer', 'bottom', app),
        endRng = ctx.rng.fork('chrome/end');
      let submit = null,
        label = 'Submit',
        placement = 'footer';
      if (!ctx.finish) {
        const labels = (
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : FALLBACK_END
        ).map(labelOf);
        label = endRng.bool(0.5) ? 'Submit' : endRng.pick(labels.filter((x) => x.toLowerCase() !== 'submit'));
        placement = endRng.pick(['footer', 'footer', 'footer', 'header', 'link']);
        const parent = placement === 'header' ? top : footer;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'submit end-link' : 'submit ' + (placement === 'header' ? 'end-header' : ''),
          parent,
          label,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = (
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : FALLBACK_END
        )
          .map(labelOf)
          .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const decoy = u.el('button', 'xtra collide', top, collideRng.pick(pool));
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
        }
      }
      const decoyRng = ctx.rng.fork('chrome/decoy');
      if (!ctx.finish && decoyRng.bool(0.25)) {
        const bank =
          ctx.content && Array.isArray(ctx.content.DECOY_LABELS) && ctx.content.DECOY_LABELS.length
            ? ctx.content.DECOY_LABELS
            : FALLBACK_DECOY;
        const decoy = u.el('button', 'xtra filler', top, labelOf(decoyRng.pick(bank)));
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent }));
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
