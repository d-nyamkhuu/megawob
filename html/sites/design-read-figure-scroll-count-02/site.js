(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-scroll-count-02',
    'task': 'read-figure',
    'scenario': 'scroll-count',
    'style': 'electron',
    'title': 'Library',
    'menu': '',
    'note': 'Icons',
    'layout': 'stagger',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      let display = ctx.display || 'header';
      if (window.innerWidth < 1250 && (display === 'panel' || display === 'toast')) display = 'header';
      document.body.className =
        C.style +
        ' ' +
        C.layout +
        ' instruction-' +
        (display === 'panel' ? 'header' : display) +
        (ctx.finish ? ' finish-mode' : '');
      const app = u.el('main', 'app', document.body),
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
            fill: '#d6b36a',
            stroke: '#2b1a11',
            'stroke-width': 1.5,
          },
          icon,
        );
        u.svg('path', { d: 'M6 6h14v5H6zM6 13h14v7H6z', fill: 'none', stroke: '#49301e', 'stroke-width': 1.5 }, icon);
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
      const center = u.el('div', 'center', app);
      let brief = null;
      if (display === 'header') brief = u.el('div', 'brief', center, ctx.instruction);
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body);
      if (display === 'panel') {
        u.el('b', 'episode-title', aside, 'Task instructions');
        u.el('p', 'episode-instruction', aside, ctx.instruction);
      }
      if (display === 'toast') {
        const toast = u.el('div', 'episode-toast', aside);
        u.el('b', '', toast, 'Task note');
        u.el('p', '', toast, ctx.instruction);
      }
      u.el('b', 'legend-title', aside, C.note);
      const legend = [
        ['plus', 'Folder (collapsed)'],
        ['minus', 'Folder (expanded)'],
        ['folder', 'Folder'],
        ['file', 'File'],
      ];
      for (const [kind, label] of legend) {
        const row = u.el('div', 'legend-row', aside),
          icon = u.el('span', 'legend-icon ' + kind, row);
        if (kind === 'plus') icon.textContent = '+';
        else if (kind === 'minus') icon.textContent = '−';
        else if (kind === 'folder') icon.textContent = '📁';
        else icon.textContent = '▤';
        u.el('span', '', row, label);
      }
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const submitWord = labels.map(labelOf).find((x) => x.toLowerCase() === 'submit') || labelOf(labels[0]);
      const original = endRng.bool(0.5),
        placement = original ? 'footer' : endRng.pick(['icon', 'toolbar']),
        label = original ? submitWord : labelOf(endRng.pick(labels));
      const endButton = (parent, cls, text, action) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', action);
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = endButton(footer, 'submit', label, ctx.submit);
        else if (placement === 'icon') {
          submit = endButton(footer, 'episode-icon', '✓', ctx.submit);
          submit.title = label;
          submit.setAttribute('aria-label', label);
        } else submit = endButton(top, 'episode-toolbar', label, ctx.submit);
        if (collideRng.bool(0.3)) {
          const pool = [
            ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
          ];
          if (pool.length) {
            const text = labelOf(collideRng.pick(pool));
            endButton(footer, 'episode-xtra', text, () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      if (ctx.finish) footer.remove();
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
