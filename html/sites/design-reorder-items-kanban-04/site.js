(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-kanban-04', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design breeze';
      const shell = u.el('div', 'shell', document.body);
      const tb = u.el('div', 'titlebar', shell);
      const icon = u.el('span', 'app-icon', tb);
      icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="white"><path d="M10 5h2v6l5-6h3l-6 7 6 7h-3l-5-6v6h-2z"/><circle cx="6" cy="7" r="1.5"/><circle cx="5" cy="12" r="1.6"/><circle cx="6" cy="17" r="1.5"/><path d="M7 9h2v6H7z"/></g></svg>';
      u.el('span', 'app-title', tb, 'Card Sorter');
      const wc = u.el('span', 'win-ctl', tb);
      u.el('i', 'wc-min', wc); u.el('i', 'wc-max', wc); u.el('i', 'wc-close', wc, '✕');
      const menu = u.el('div', 'menubar', shell);
      for (const m of ['File', 'Edit', 'View', 'Help']) {
        const b = u.el('button', 'menu-item', menu, m);
        b.type = 'button';
        b.onclick = () => env.log('menu', { name: m });
      }
      const endRng = ctx.rng.fork('chrome/end');
      const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelText = (x) => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
      const varyEnd = !ctx.finish && endRng.bool(0.5);
      const endLabel = varyEnd && labels.length ? labelText(endRng.pick(labels)) : 'Submit';
      const placement = ctx.finish ? null : (varyEnd ? endRng.pick(['header', 'link']) : 'footer');
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(labels.map(labelText))].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) collision = collideRng.pick(options);
      }
      const body = u.el('div', 'win-body', shell);
      const idx = u.el('nav', 'side-index', body);
      for (let i = 1; i <= 20; i++) u.el('div', 'idx' + (i === 1 ? ' active' : ''), idx, String(i));
      const page = u.el('div', 'page', body);
      page.classList.toggle('has-panel', ctx.display === 'panel');
      const note = u.el('header', 'task-note', page);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const close = u.el('button', 'note-close', note, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Dismiss task note');
        close.onclick = () => { note.style.visibility = 'hidden'; };
      }
      let submit = null;
      const makeSubmit = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button'; b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel); b.title = endLabel;
        b.onclick = () => ctx.submit();
        return b;
      };
      const decoy = (parent) => {
        if (!collision) return;
        const b = u.el('button', 'menu-item pq-xtra', parent, collision);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: collision, collide: true });
      };
      if (placement === 'header') submit = makeSubmit(menu, 'header-submit', endLabel);
      if (collision) decoy(menu);
      const stage = u.el('main', 'stage', page);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', page);
      if (ctx.finish || placement === 'header') {
        u.el('span', 'sheet-status', footer, 'Card Sorter');
      }
      if (!ctx.finish && placement !== 'header') {
        if (placement === 'link') {
          submit = u.el('a', 'submit-link', footer, endLabel + ' ›');
          submit.href = '#'; submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', endLabel); submit.title = endLabel;
          submit.onclick = (e) => { e.preventDefault(); ctx.submit(); };
        } else submit = makeSubmit(footer, 'submit', endLabel);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = { cookie: 'Privacy notice', toast: 'Changes saved', chat: 'Help', promo: 'Notebook news', banner: 'Notice' };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el('p', '', box, ctx.kind === 'cookie' ? 'Allow optional cookies for this page?' : 'You can close this note to return to the activity.');
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    }
  });
})();
