(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-kanban-09', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const bank = (ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length)
        ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const common = endRng.bool(0.5);
      const label = common ? 'Submit' : labelOf(endRng.pick(bank));
      const placement = common ? 'footer' : endRng.pick(['footer', 'header', 'link']);
      let collide = null;
      if (collideRng.bool(0.3)) {
        const choices = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) collide = labelOf(collideRng.pick(choices));
      }
      document.body.className = 'design';
      const bar = u.el('div', 'topbar', document.body);
      u.el('div', 'brand', bar, 'Learning Hub');
      const nav = u.el('nav', 'topnav', bar);
      for (const name of ['Home', 'Activities', 'Help']) {
        const a = u.el('button', 'navlink' + (name === 'Activities' ? ' active' : ''), nav, name);
        a.type = 'button';
        a.onclick = () => env.log('nav', { name });
      }
      const shell = u.el('div', 'shell', document.body);
      const page = u.el('div', 'page', shell);
      if (!ctx.finish && placement === 'header') page.classList.add('has-header-end');
      const note = u.el('header', 'task-note', page);
      if (ctx.display !== 'hidden') u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const close = u.el('button', 'note-close', note, '×');
        close.type = 'button';
        close.onclick = () => { note.style.visibility = 'hidden'; };
      }
      const stage = u.el('main', 'stage', page);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', page);
      const reset = u.el('button', 'reset', footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => stage.dispatchEvent(new Event('activity-reset'));
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', collides ? { label: text, collide: true } : { label: text });
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.onclick = (e) => { e.preventDefault(); ctx.submit(); };
        return b;
      };
      const headerTools = u.el('div', 'header-tools', page);
      if (collide && placement === 'header') decoyBtn(headerTools, collide, true);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') submit = endBtn(headerTools, 'submit', label);
        else if (placement === 'link') submit = endBtn(footer, 'end-link', `${label} ›`);
        else submit = endBtn(footer, 'submit', label);
        if (collide && placement !== 'header') decoyBtn(headerTools, collide, true);
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
