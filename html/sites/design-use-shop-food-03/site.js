(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-food-03', brand: 'Campus Café – Food Ordering', mode: 'side-left',
    tokens: { bg: '#cbd0d6', panel: '#e9ecf0', fg: '#101923', accent: '#88a9cd', font: 'Arial,sans-serif', line: '#c8cdd5', muted: '#5f6a78' },
    nav: 'File    Edit    View    Options    Help', obstruction: null, footer: ''
  };
  env.site({
    name: D.site, styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'side-left instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const mast = u.el('div', 'rf-mast', header);
      const bt = u.el('div', 'design-brand', mast);
      u.el('b', '', bt, 'Riverside Foods'); u.el('i', '', bt, '|'); u.el('span', '', bt, 'Extranet');
      u.el('div', 'rf-util', mast, 'Help   |   My Account   |   Log out');
      u.el('div', 'rf-date', mast, 'Wed 10 Nov 1999');
      const nav = u.el('nav', 'design-nav', header);
      for (const t of ['Home', 'Cafeteria Orders', 'Facilities', 'Suppliers', 'Reports', 'Admin'])
        u.el('span', 'rf-tab' + (t === 'Cafeteria Orders' ? ' on' : ''), nav, t);

      // These streams are independent so adding frame settings never shifts existing seeded content.
      const er = ctx.rng.fork('chrome/end');
      const endWords = (ctx.content && ctx.content.END_LABELS) || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const wordOf = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
      const altLabels = endWords.filter(x => wordOf(x).trim().toLowerCase() !== 'submit');
      let placement, endLabel;
      if (er.bool(.5) || !altLabels.length) { placement = 'footer'; endLabel = 'Submit'; }
      else { placement = er.pick(['header', 'link']); endLabel = wordOf(er.pick(altLabels)); }
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(.3)) {
        const options = [...new Set(endWords.map(wordOf).filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))];
        if (options.length) collide = cr.pick(options);
      }

      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      u.el('h2', '', note, 'Task Briefing');
      const instruction = ctx.display !== 'hidden' ? u.el('p', 'food-task', note, ctx.instruction) : null;
      if (instruction) instruction.dataset.role = 'instruction';
      u.el('h3', 'rf-h', note, 'Your task');
      const help = u.el('p', 'brief-help', note, 'Use the cafe ordering system on the right to add the required items and quantities to the basket, then place the order.');
      if (ctx.display === 'header') help.textContent = 'Use the cafe ordering system on the right to add the items and quantities listed above to the basket, then place the order.';
      if (ctx.display === 'panel') {
        const card = u.el('section', 'rf-requirements', note);
        u.el('h4', '', card, 'Order requirements');
        card.append(instruction);
      }
      if (ctx.display === 'toast') {
        const message = u.el('section', 'rf-task-message', note);
        u.el('h4', '', message, 'Ordering notification');
        message.append(instruction);
      }
      u.el('h3', 'rf-h', note, 'Details');
      const ul = u.el('ul', 'rf-ul', note);
      for (const t of ['Select each item and size, set the required quantity, and add to the basket.', 'Ensure all items are in the basket with the correct quantities.', 'Click Place order.']) u.el('li', '', ul, t);
      u.el('h3', 'rf-h', note, 'Notes');
      const ul2 = u.el('ul', 'rf-ul', note);
      for (const t of ['You can use the mouse, keyboard or scroll wheel.', 'All required items and controls are visible.', 'The order is not yet submitted.']) u.el('li', '', ul2, t);
      ul.lastElementChild.textContent = '';
      ul.lastElementChild.append('Click ');
      u.el('strong', '', ul.lastElementChild, 'Place order');
      ul.lastElementChild.append('.');
      const ns = u.el('p', 'brief-status', note);
      u.el('span', 'basket-state', ns, 'The basket is not complete yet.');
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      for (const [label, cls] of [['↶  Clear basket', 'clear-basket'], ['▣  Print order', 'print-order'], ['▤  Save order…', 'save-order']]) {
        const b = u.el('button', cls, footer, label); b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      u.el('div', 'order-slot', footer);
      let submit = null;
      const makeEnd = (parent, cls, tag = 'button') => {
        const e = u.el(tag, cls, parent, endLabel);
        if (tag === 'button') e.type = 'button'; else e.href = '#';
        e.dataset.role = 'submit'; e.setAttribute('aria-label', endLabel); e.title = endLabel;
        e.addEventListener('click', ev => { ev.preventDefault(); ctx.submit(); });
        return e;
      };
      const decoy = (parent, label) => {
        const d = u.el('button', 'rf-pq', parent, label); d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(footer, 'end-control');
        else if (placement === 'header') submit = makeEnd(nav, 'rf-end-nav');
        else submit = makeEnd(shell, 'rf-end-link', 'a');
      }
      if (collide) decoy(nav, collide);
      if (!ctx.finish && placement === 'header') nav.classList.add('has-end');
      if (collide) nav.classList.add('has-xtra');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util, named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'], chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement']
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', title);
      u.el('h2', '', el, title); u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') { const accept = u.el('button', '', actions, 'Accept all'); accept.addEventListener('click', () => ctx.dismiss()); }
      if (/Tip/.test(title)) { const c = u.el('label', '', el); c.style.cssText = 'display:block;padding:0 22px 14px'; const ch = u.el('input', '', c); ch.type = 'checkbox'; c.append(' Do not show again'); }
      const dismiss = u.el('button', 'primary', actions, label); dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    }
  });
})();
