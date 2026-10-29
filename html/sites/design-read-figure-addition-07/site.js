(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-addition-07',
    'task': 'read-figure',
    'scenario': 'addition',
    'style': 'fluent',
    'title': 'Math Practice',
    'menu': '',
    'note': 'Task Details',
    'layout': 'workbench',
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
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 5, fill: '#1688c9' }, icon);
      u.svg('circle', { cx: 13, cy: 13, r: 5, fill: '#f4a623' }, icon);
      u.el('span', '', top, C.title);
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
      const endR = ctx.rng.fork('chrome/end'),
        placement = ctx.finish ? null : endR.pick(['footer', 'footer', 'footer', 'header', 'link']),
        endLabels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name)),
        label = ctx.finish
          ? null
          : endR.bool(0.5)
            ? endLabels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit'
            : endR.pick(
                endLabels.filter((x) => x.trim().toLowerCase() !== 'submit').length
                  ? endLabels.filter((x) => x.trim().toLowerCase() !== 'submit')
                  : endLabels,
              ),
        collideR = ctx.rng.fork('chrome/collide'),
        collides = !ctx.finish && collideR.bool(0.3),
        otherWords = label ? endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()) : [],
        collideLabel = collides && otherWords.length ? collideR.pick(otherWords) : null;
      const endBtn = (parent, cls, text) => {
          const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
          b.type = 'button';
          if (cls === 'end-link') b.href = '#';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        },
        decoyBtn = (parent, text) => {
          const b = u.el('button', 'chrome-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          return b;
        };
      let submit = null;
      if (placement === 'header') submit = endBtn(top, 'chrome-end', label);
      if (placement === 'link') submit = endBtn(top, 'end-link', label + ' ›');
      if (placement === 'footer') {
        const strip = u.el('div', 'fluent-action-strip', app);
        submit = endBtn(strip, 'chrome-end', label);
      }
      if (collideLabel) decoyBtn(top, collideLabel);
      const center = u.el('div', 'center', app);
      let brief = null;
      if (ctx.display === 'header') brief = u.el('div', 'brief', center, ctx.instruction);
      else if (ctx.display === 'toast') brief = u.el('div', 'brief toast-note', center, ctx.instruction);
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Task Details');
      const details = u.el('div', 'details', aside);
      [
        ['Operation', 'Addition'],
        ['Block type', 'Unit blocks'],
        ['Groups', '2'],
        ['Find', 'Total number of blocks'],
      ].forEach(([k, v]) => {
        const row = u.el('div', 'detail-row', details);
        u.el('span', '', row, k);
        u.el('span', '', row, v);
      });
      if (ctx.display === 'panel') {
        const note = u.el('div', 'episode-note', aside);
        u.el('b', '', note, 'Task instructions');
        u.el('div', '', note, ctx.instruction);
      }
      u.el('div', 'inspector-rule', aside);
      u.el('h2', '', aside, 'Visual Key');
      const key = u.el('div', 'visual-key', aside);
      u.el('span', 'key-cube', key);
      u.el('span', '', key, '= 1 block');
      const tip = u.el('div', 'inspector-tip', aside);
      u.el('span', 'info-icon', tip, 'i');
      u.el('span', '', tip, 'Count all the blocks in both groups.');
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
