(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-kanban-12',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design beos';
      const shell = u.el('div', 'shell', document.body);
      const tbar = u.el('div', 'titlebar', shell);
      const leaf = u.el('span', 'leaf', tbar);
      leaf.innerHTML =
        '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M18 2l3 3 3 1-1 5c1 4-2 8-6 11-4 4-9 4-12 1-3-3-2-8 1-11l7-6 3-1z" fill="#d1a84d" stroke="#242818" stroke-width="1.5"/><path d="M6 17c2-4 6-7 10-9l3-3" fill="none" stroke="#ffe895" stroke-width="2"/><path d="M8 24c5 0 12-5 14-11" fill="none" stroke="#8a762b" stroke-width="2"/></svg>';
      u.el('span', 'ttl', tbar, 'Card Sorter');
      const wb = u.el('span', 'wbtns', tbar);
      for (const g of ['minimize', 'maximize', 'close']) u.el('span', 'wbtn ' + g, wb);
      const mbar = u.el('div', 'menubar', shell);
      for (const m of ['File', 'View', 'Options', 'Help']) u.el('span', 'mi', mbar, m);
      u.el('span', 'mspacer', mbar);
      u.el('span', 'beos-mark', mbar, 'BeOS');
      u.el('span', 'clock', mbar, '9:14 AM');
      const endRng = ctx.rng.fork('chrome/end');
      const labelBank = ctx.content && ctx.content.END_LABELS;
      const endLabels =
        Array.isArray(labelBank) && labelBank.length
          ? labelBank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelValue = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = labelValue(endRng.pick(endLabels));
      const placement = ctx.finish ? null : endRng.bool(0.5) ? 'panel' : endRng.pick(['toolbar', 'footer']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = endLabels.map(labelValue).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) collision = collideRng.pick([...new Set(pool)]);
      }
      const addEnd = (parent, cls) => {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.onclick = () => ctx.submit();
        return b;
      };
      const decoy = (parent) => {
        const b = u.el('button', 'end-xtra', parent, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: collision, collide: true });
      };
      if (collision) decoy(mbar);
      let toolbarSubmit = null;
      if (placement === 'toolbar') toolbarSubmit = addEnd(mbar, 'toolbar-submit');
      const page = u.el('div', 'page', shell);
      const note = u.el('header', 'task-note', page);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const close = u.el('button', 'note-close', note, '×');
        close.type = 'button';
        close.onclick = () => {
          note.style.visibility = 'hidden';
        };
      }
      const stage = u.el('main', 'stage', page);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      footer.hidden = ctx.finish || placement !== 'panel';
      let submit = toolbarSubmit;
      if (!ctx.finish && placement === 'panel') {
        u.el('div', 'ap-title', footer, 'View');
        const sv = u.el('button', 'saveview', footer, 'Save view');
        sv.type = 'button';
        sv.onclick = () => env.log('save-view', {});
        u.el('div', 'ap-rule', footer);
        submit = addEnd(footer, 'submit');
      } else if (!ctx.finish && placement === 'footer') {
        submit = addEnd(shell, 'submit footer-submit');
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = {
        cookie: 'Privacy notice',
        toast: 'Changes saved',
        chat: 'Help',
        promo: 'Notebook news',
        banner: 'Notice',
      };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el(
        'p',
        '',
        box,
        ctx.kind === 'cookie'
          ? 'Allow optional cookies for this page?'
          : 'You can close this note to return to the activity.',
      );
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  });
})();
