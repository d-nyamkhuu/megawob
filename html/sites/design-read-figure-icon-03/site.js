(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-icon-03',
    task: 'read-figure',
    scenario: 'icon',
    style: 'metro',
    title: 'Assets',
    menu: ['Home', 'Files', 'Icons', 'Photos', 'Documents', 'Shared'],
    note: 'Icon Sets',
    categories: [
      ['All Icons', '120'],
      ['Actions', '24'],
      ['Alerts', '12'],
      ['Arrows', '16'],
      ['Communication', '14'],
      ['Devices', '16'],
      ['Editing', '18'],
      ['Files & Folders', '20'],
      ['People', '12'],
      ['Status', '8'],
    ],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      let display = ctx.display || 'header';
      document.body.className =
        'metro instruction-' + (display === 'panel' ? 'header' : display) + (ctx.finish ? ' finish-mode' : '');
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', 'app-title', top, C.title);
      const nav = u.el('nav', 'menu', top);
      C.menu.forEach((label, i) => {
        const item = u.el('span', 'nav-item' + (label === 'Icons' ? ' active' : ''), nav, label);
        item.setAttribute('role', 'presentation');
      });
      const utilities = u.el('div', 'utilities', top);
      u.el('span', 'search-icon', utilities, '⌕');
      u.el('span', 'utility-divider', utilities, '');
      u.el('span', 'settings-icon', utilities, '⚙');
      const wc = u.el('div', 'native-window-controls', top);
      for (const [kind, label] of [
        ['min', '−'],
        ['max', '□'],
        ['close', '×'],
      ])
        u.el('span', 'window-' + kind, wc, label);
      const center = u.el('div', 'center', app);
      let brief = null;
      if (display === 'header') brief = u.el('div', 'brief', center, ctx.instruction);
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body);
      if (display === 'panel') {
        u.el('b', 'episode-title', aside, 'Task instructions');
        u.el('p', 'episode-instruction', aside, ctx.instruction);
      }
      u.el('b', 'aside-heading', aside, C.note);
      const list = u.el('div', 'category-list', aside);
      C.categories.forEach(([name, count], i) => {
        const row = u.el('div', 'category-row' + (!i ? ' selected' : ''), list);
        u.el('span', '', row, name);
        u.el('span', 'count', row, count);
      });
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
        if (placement === 'footer') submit = endButton(top, 'submit episode-toolbar-label', label, ctx.submit);
        else if (placement === 'icon') {
          submit = endButton(top, 'episode-icon', '✓', ctx.submit);
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
      if (display === 'toast') {
        const toast = u.el('div', 'episode-toast', document.body);
        u.el('b', '', toast, 'Task note');
        u.el('p', '', toast, ctx.instruction);
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
