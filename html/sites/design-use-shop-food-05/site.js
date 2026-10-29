(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-food-05',
    'brand': 'RIVERDALE\nKITCHEN',
    'tag': 'GOOD FOOD\nBRIGHT DAYS\nEST. 2016',
    'tokens': {
      'bg': '#ffffff',
      'panel': '#ffffff',
      'fg': '#111111',
      'accent': '#e2392b',
      'font': "'Helvetica Neue',Helvetica,Arial,'Liberation Sans',sans-serif",
      'line': '#d9d9d9',
      'muted': '#555555',
    },
    'obstruction': null,
  };
  function sect(u, parent, cls, num, label) {
    const s = u.el('div', 'sect ' + cls, parent);
    u.el('span', 'mk', s, num);
    u.el('i', 'dash', s);
    u.el('span', 'lab', s, label);
    return s;
  }
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'side-left instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      u.el('div', 'vline', shell);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('div', 'design-nav', header, D.tag);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      sect(u, note, 's1', '01', 'YOUR TASK');
      if (ctx.display !== 'hidden') {
        const instruction = u.el(
          'p',
          'food-task' + (ctx.instruction.length > 65 ? ' long-task' : ''),
          note,
          ctx.instruction,
        );
        if (ctx.instruction.length > 120) instruction.style.fontSize = 'min(2.7vh,1.52vw)';
      }
      u.el(
        'p',
        'brief-help',
        note,
        'Use the menu to select items and quantities. Add items to your basket. When you are ready, click Place order.',
      );
      const ns = u.el('p', 'brief-status', note);
      u.el('strong', '', ns, 'Note:');
      u.el('span', 'basket-state', ns, 'The basket is not complete yet.');
      const stage = u.el('main', 'stage', body);
      sect(u, shell, 's3', '03', 'YOUR ORDER');
      u.el('div', 'rule r3', shell);
      sect(u, shell, 's4', '04', 'COMPLETE TASK');
      u.el('div', 'rule r4', shell);
      const footer = u.el('footer', 'design-footer', shell);
      for (const [label, cls] of [
        ['Clear basket', 'clear-basket'],
        ['Print order', 'print-order'],
        ['Save order…', 'save-order'],
      ]) {
        const b = u.el('button', cls, footer, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      const er = ctx.rng.fork('chrome/end');
      const placements = ['bottom', 'bottom', 'masthead', 'inspector'];
      const placement = ctx.finish ? null : er.pick(placements);
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const labelValue = ctx.finish ? null : er.bool(0.5) ? 'Submit' : er.pick(endLabels);
      let label =
        labelValue == null
          ? null
          : placement === 'bottom'
            ? 'Submit'
            : typeof labelValue === 'string'
              ? labelValue
              : labelValue.label || labelValue.text || labelValue.name || String(labelValue);
      if (label === 'Submit' && placement !== 'bottom') {
        const alternatives = endLabels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
          .filter((x) => x.trim().toLowerCase() !== 'submit');
        if (alternatives.length) label = ctx.rng.fork('chrome/end/alternate').pick(alternatives);
      }
      shell.classList.add(ctx.finish ? 'finish-mode' : 'completion-' + placement);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const same = (x) =>
          String(typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || x)
            .trim()
            .toLowerCase() === String(label).trim().toLowerCase();
        const choices = endLabels
          .filter((x) => !same(x))
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        if (choices.length) collide = cr.pick(choices);
      }
      const orderSlot = u.el('div', 'order-slot', footer);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control end-' + placement, footer, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (collide) {
        const b = u.el('button', 'pq-xtra', shell, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
