(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-number-checkboxes-06',
    'task': 'read-figure',
    'scenario': 'number-checkboxes',
    'style': 'plain',
    'title': '',
    'menu': '',
    'note': 'Controls',
    'layout': 'wide-form',
    'subtitle': '',
    'aside': 'Click the checkboxes to draw the number.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
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
        ],
        labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
        others = labels.map(labelText).filter((x) => x.trim().toLowerCase() !== 'submit'),
        placement = ctx.finish ? null : er.pick(['control', 'control', 'control', 'footer', 'link', 'footer']),
        endLabel = ctx.finish ? null : er.bool(0.5) ? 'Submit' : labelText(er.pick(others.length ? others : labels));
      if (placement) document.body.classList.add('end-' + placement);
      const cr = ctx.rng.fork('chrome/collide'),
        collide =
          !ctx.finish && cr.bool(0.3)
            ? labelText(
                cr.pick(labels.map(labelText).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
              )
            : null;
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
        brief = u.el('div', 'brief', center, ctx.display === 'header' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      if (ctx.display === 'panel') {
        const panel = u.el('section', 'episode-panel', aside);
        u.el('b', '', panel, 'Instructions');
        u.el('div', '', panel, ctx.instruction);
      }
      if (ctx.display === 'toast') u.el('div', 'episode-toast', aside, ctx.instruction);
      if (collide) {
        const d = u.el('button', 'pq-xtra', aside, collide);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'submit end-link' : 'submit',
          footer,
          endLabel + (placement === 'link' ? ' ›' : ''),
        );
        submit.type = 'button';
        if (placement === 'link') submit.href = '#';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
