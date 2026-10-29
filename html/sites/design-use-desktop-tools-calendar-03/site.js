(function () {
  'use strict';
  env.site({
    name: 'design-use-desktop-tools-calendar-03', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'lisa instruction-' + ctx.display;
      const endRng = ctx.rng.fork('chrome/end');
      const labelList = ctx.content && ctx.content.END_LABELS;
      const endLabels = Array.isArray(labelList) && labelList.length ? labelList : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'title', 'menu']);
      const alternateLabels = endLabels.filter(x => String(x).trim().toLowerCase() !== 'submit');
      const label = ctx.finish ? null : (endRng.bool(0.5) || !alternateLabels.length ? 'Submit' : endRng.pick(alternateLabels));
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter(x => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
      const collide = !ctx.finish && collideLabels.length && collideRng.bool(0.3) ? collideRng.pick(collideLabels) : null;
      const shell = u.el('div', 'site-shell', document.body);
      const menu = u.el('header', 'design-header', shell);
      if (placement === 'menu') menu.classList.add('has-end-menu');
      const apple = u.el('span', 'apple', menu);
      apple.innerHTML = '<svg viewBox="0 0 28 32" aria-hidden="true"><path d="M17 7c1-4 4-6 7-6 0 4-3 7-7 7M14 11C8 6 2 12 3 19c1 7 5 13 8 12l4-1 4 1c3 1 7-5 8-8-6-2-7-9-1-12-4-4-8-3-12 0" fill="currentColor"/></svg>';
      const nav = u.el('nav', 'design-nav', menu);
      for (const title of ['File', 'Edit', 'View', 'Tools', 'Calendar', 'Window', 'Help']) u.el('span', '', nav, title);
      u.el('span', 'menu-clock', menu, 'Mon Apr 16, 1984   10:24 AM');
      const win = u.el('section', 'document-window', shell);
      const title = u.el('div', 'document-title', win);
      u.el('i', 'window-box', title);
      u.el('span', 'title-rule', title);
      u.el('b', '', title, 'Calendar');
      u.el('span', 'title-rule', title);
      let submit = null;
      const makeEnd = (parent, cls, text) => {
        const button = u.el('button', cls, parent, text);
        button.type = 'button';
        button.dataset.role = 'submit';
        button.setAttribute('aria-label', label);
        button.title = label;
        button.addEventListener('click', () => ctx.submit());
        return button;
      };
      const makeDecoy = parent => {
        if (!collide) return;
        const button = u.el('button', 'chrome-xtra', parent, collide);
        button.type = 'button';
        button.dataset.role = 'xtra';
        button.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      };
      if (!ctx.finish && placement === 'title') submit = makeEnd(title, 'end-control chrome-end-title', label);
      if (!ctx.finish && placement === 'menu') submit = makeEnd(menu, 'end-control chrome-end-menu', label);
      u.el('i', 'window-box', title);
      const body = u.el('div', 'design-body', win);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', '', note, ctx.instruction);
      else note.hidden = true;
      if (ctx.display === 'panel') note.dataset.mode = 'panel';
      if (ctx.display === 'toast') note.dataset.mode = 'toast';
      const stage = u.el('main', 'stage', body);
      if (!ctx.finish && placement === 'footer') submit = makeEnd(body, 'end-control chrome-end-footer', label);
      if (collide && placement !== 'menu') makeDecoy(menu);
      else if (collide) makeDecoy(title);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['Calendar notice', 'Allow optional cookies for this workstation?', 'Reject optional'],
        toast: ['Calendar', 'Your calendar is up to date.', 'Dismiss'],
        chat: ['Help', 'Drag over the calendar to set a time, or use the New Event fields.', 'Close'],
        promo: ['Calendar notice', 'Keep your appointments in one place.', 'Close'],
        banner: ['Calendar notice', 'Remember to create your event before submitting.', 'Dismiss']
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('p', '', el, copy);
      const dismiss = u.el('button', '', el, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    }
  });
})();
