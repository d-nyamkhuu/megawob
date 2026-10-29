(() => {
  'use strict';
  env.site({
    name: 'design-read-figure-scroll-count-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      const display = ctx.display || 'header';
      document.body.className = `library instruction-${display}${ctx.finish ? ' finish-mode' : ''}`;
      const rail = u.el('nav', 'rail', document.body);
      [
        ['⌂', 'Home'],
        ['▱', 'Files'],
        ['⛁', 'Data'],
        ['▥', 'Reports'],
        ['⚙', 'Settings'],
      ].forEach((x, i) => {
        const a = u.el('div', `rail-item${i === 0 ? ' active' : ''}`, rail);
        u.el('b', '', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const app = u.el('main', 'app', document.body);
      const sidebar = u.el('aside', 'aside', app);
      const center = u.el('section', 'center', app);
      const top = u.el('header', 'top', center);
      u.el('span', 'library-title', top, 'Library');
      if (display === 'header') u.el('div', 'brief', top, ctx.instruction);
      const stage = u.el('section', 'stage', center);
      if (display === 'panel') {
        u.el('b', 'episode-title', sidebar, 'Task instructions');
        u.el('p', 'episode-instruction', sidebar, ctx.instruction);
      }
      u.el('h2', 'library-side-title', sidebar, 'Library');
      const folders = u.el('div', 'folder-list', sidebar);
      [
        ['▯', 'All Items', '42'],
        ['▯', 'Documents', '18'],
        ['▧', 'Images', '8'],
        ['▷', 'Videos', '6'],
        ['♫', 'Audio', '5'],
        ['▤', 'Archives', '5'],
      ].forEach((x, i) => {
        const row = u.el('div', `folder-row${i === 0 ? ' selected' : ''}`, folders);
        u.el('span', 'folder-icon', row, x[0]);
        u.el('span', 'folder-name', row, x[1]);
        u.el('span', 'folder-count', row, x[2]);
      });
      u.el('h2', 'side-heading', sidebar, 'Status');
      const status = u.el('div', 'status-list', sidebar);
      [
        ['Active', '32', '#38e82d'],
        ['Archived', '6', '#9aa9b8'],
        ['Draft', '4', '#f2be17'],
      ].forEach((x) => {
        const row = u.el('div', 'status-row', status);
        u.el('i', 'status-dot', row).style.background = x[2];
        u.el('span', '', row, x[0]);
        u.el('span', 'status-count', row, x[1]);
      });
      u.el('h2', 'tags-heading', sidebar, 'Tags');
      const tags = u.el('div', 'tag-list', sidebar);
      [
        ['Project', '12'],
        ['Reference', '9'],
        ['Personal', '8'],
        ['Review', '7'],
        ['Misc', '6'],
      ].forEach((x) => {
        const row = u.el('div', 'tag-row', tags);
        u.el('span', 'tag-glyph', row, '◇');
        u.el('span', '', row, x[0]);
        u.el('span', 'tag-count', row, x[1]);
      });
      const footer = u.el('footer', 'bottom', center);
      const labels = ctx.content?.END_LABELS || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const rng = ctx.rng.fork('chrome/end'),
        collide = ctx.rng.fork('chrome/collide');
      const standard = labels.map(labelOf).find((x) => x.toLowerCase() === 'submit') || labelOf(labels[0]);
      const label = rng.bool(0.5) ? standard : labelOf(rng.pick(labels));
      let submit = null;
      const button = (parent, cls, text, action) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.addEventListener('click', action);
        return b;
      };
      if (!ctx.finish) {
        const placement = rng.pick(['footer', 'footer', 'toolbar', 'icon']);
        if (placement === 'toolbar') {
          document.body.classList.add('has-toolbar');
          submit = button(top, 'episode-toolbar', label, ctx.submit);
        } else if (placement === 'icon') {
          submit = button(footer, 'episode-icon', '✓', ctx.submit);
          submit.title = label;
          submit.setAttribute('aria-label', label);
        } else submit = button(footer, 'submit', label, ctx.submit);
        if (collide.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (pool.length) {
            const text = labelOf(collide.pick(pool));
            button(footer, 'episode-xtra', text, () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      if (display === 'toast') {
        const t = u.el('div', 'episode-toast', center);
        u.el('b', '', t, 'Task note');
        u.el('p', '', t, ctx.instruction);
        center.insertBefore(t, stage);
      }
      if (ctx.finish) footer.remove();
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', `overlay ${ctx.kind}`, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind] || 'Workspace update');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
