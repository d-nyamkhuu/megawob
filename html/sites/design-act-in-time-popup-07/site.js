(function () {
  'use strict';
  const C = { site: 'design-act-in-time-popup-07' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ds-desktop';
      const shell = u.el('div', 'ds-shell', document.body);
      const work = u.el('main', 'ds-work', shell);
      const icons = u.el('aside', 'ds-icons', work);
      [
        ['▣', 'Program Manager'],
        ['▤', 'File Manager'],
        ['✎', 'Write'],
        ['▦', 'Paintbrush'],
        ['▣', 'Minesweeper'],
      ].forEach(([i, t]) => {
        const item = u.el('div', 'ds-icon', icons);
        u.el('b', '', item, i);
        u.el('span', '', item, t);
      });
      const win = u.el('section', 'ds-appwin', work);
      const title = u.el('header', 'ds-app-title', win);
      u.el('span', 'ds-app-glyph', title, 'T');
      u.el('strong', '', title, 'Company Login');
      const controls = u.el('span', 'ds-window-controls', title, '▁  ×');
      const menu = u.el('nav', 'ds-app-menu', win);
      ['File', 'Edit', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const content = u.el('div', 'ds-app-content', win);
      const brand = u.el('div', 'ds-company', content);
      u.el('i', 'ds-factory', brand, '');
      const brandText = u.el('div', '', brand);
      u.el('b', '', brandText, 'Riverton Systems');
      u.el('span', '', brandText, 'Employee Access');
      u.el('div', 'ds-rule', content);
      const stage = u.el('div', 'ds-stage', content);
      u.el('div', 'ds-stage-rule', content);
      const status = u.el('footer', 'ds-status', win, 'Ready');
      const task = u.el('aside', 'ds-taskwin', shell);
      const taskbar = u.el('header', 'ds-task-title', task);
      u.el('b', '', taskbar, 'Task');
      u.el('span', 'ds-task-close', taskbar, '×');
      const note = u.el('div', `ds-task-note ds-note-${ctx.display}`, task);
      note.dataset.role = 'instruction';
      u.el('div', 'ds-instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'toast') note.classList.add('ds-note-toast');
      if (ctx.display === 'header') {
        taskbar.classList.add('ds-task-title-note');
        taskbar.appendChild(note);
      }
      const taskBottom = u.el('div', 'ds-task-bottom', task);
      let submit = null;
      if (!ctx.finish) {
        const rng = ctx.rng.fork('chrome/end-control');
        const pool = ctx.content && ctx.content.END_LABELS;
        const label = pool && pool.length ? rng.pick(pool) : 'Submit';
        const place = rng.pick(['bottom', 'bottom', 'bottom', 'bottom', 'header', 'link', 'menu', 'status']);
        const makeEnd = (parent, cls, text) => {
          const b = u.el(place === 'link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (place === 'header') submit = makeEnd(taskbar, 'ds-submit ds-submit-head', label);
        else if (place === 'menu') submit = makeEnd(menu, 'ds-submit ds-submit-menu', label);
        else if (place === 'status') submit = makeEnd(status, 'ds-submit ds-submit-status', label);
        else if (place === 'link') submit = makeEnd(taskBottom, 'ds-finish-link', `${label} ›`);
        else submit = makeEnd(taskBottom, 'ds-submit', label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const labels = pool && pool.length ? pool : ['Done', 'Finish', 'Save', 'Apply'];
          const other = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
          if (other.length) {
            const d = u.el('button', 'ds-xtra', taskBottom, cr.pick(other));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', `ds-overlay ds-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', 'ds-overlay-title', el, ctx.kind === 'cookie' ? 'Cookie Notice' : 'Reminder');
      u.el('div', 'ds-overlay-copy', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
