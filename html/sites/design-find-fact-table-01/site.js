(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-01',
    'brand': 'Employee Records',
    'title': 'Reference Table',
    'instruction': 'top',
    'rail': 'People|Projects|Reports|Resources|Settings',
    'menu': 'Workplace Directory',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const stamp = u.el('div', 'ds-directory-stamp', top);
      u.el('div', '', stamp, 'Workplace Directory');
      u.el('div', '', stamp, 'Mon, Apr 14, 2003');
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const raw = ctx.content && ctx.content.END_LABELS;
      const words = (
        Array.isArray(raw) && raw.length
          ? raw
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const placement = endRng.pick(['footer', 'footer', 'footer', 'footer', 'footer', 'footer', 'header', 'notes']);
      const labelRng = ctx.rng.fork('chrome/end-label');
      const alternatives = words.filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = labelRng.pick(alternatives.concat(Array.from({ length: alternatives.length * 2 }, () => 'Submit')));
      const pool = words.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collision = collideRng.bool(0.3) && pool.length ? collideRng.pick(pool) : null;
      const addSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const addDecoy = (parent) => {
        if (!collision) return;
        const b = u.el('button', 'ds-xtra', parent, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      };
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = addSubmit(top, 'ds-submit ds-top-submit');
      const rings = u.el('div', 'ds-binding', document.body);
      for (let i = 0; i < 20; i++) u.el('i', '', rings);
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const notes = u.el('section', 'ds-directory-notes', content);
      const notesHead = u.el('h3', '', notes, 'Notes');
      if (!ctx.finish && placement === 'notes') submit = addSubmit(notesHead, 'ds-submit ds-notes-submit');
      const list = u.el('ul', '', notes);
      ['Each field must match the information in the table.', 'All requested fields are required.'].forEach((t) =>
        u.el('li', '', list, t),
      );
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      addDecoy(foot);
      if (!ctx.finish && placement === 'footer') submit = addSubmit(foot, 'ds-submit');
      if (ctx.finish) submit = null;
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
