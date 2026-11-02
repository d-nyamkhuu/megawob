(function () {
  'use strict';
  const D = { obstruction: null };
  const palette = { bg: '#cbd0d6', panel: '#e9ecf0', fg: '#101923', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated briefing rail even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const top = u.el('header', 'design-header', shell);
      const mast = u.el('div', 'rf-mast', top);
      const bt = u.el('div', 'design-brand', mast);
      u.el('b', '', bt, 'Riverside Foods'); u.el('i', '', bt, '|'); u.el('span', '', bt, 'Extranet');
      u.el('div', 'rf-util', mast, 'Help   |   My Account   |   Log out');
      u.el('div', 'rf-date', mast, 'Wed 10 Nov 1999');
      const toolbar = u.el('nav', 'design-nav', top);
      for (const t of ['Home', 'Cafeteria Orders', 'Facilities', 'Suppliers', 'Reports', 'Admin'])
        u.el('span', 'rf-tab' + (t === 'Cafeteria Orders' ? ' on' : ''), toolbar, t);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      u.el('h2', '', note, 'Task Briefing');
      Object.assign(_c, { shell, toolbar, body, note, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('food-task');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.toolbar.classList.toggle('has-end', !!_c.submit);
      _c.toolbar.classList.toggle('has-xtra', !!_c.headerTools.querySelector('.ref-xtra'));
    },
    'frame.body': () => (_c) => {
      const { util: u, note } = _c;
      u.el('h3', 'rf-h', note, 'Your task');
      u.el('p', 'brief-help', note, _c.display === 'header'
        ? 'Use the cafe ordering system on the right to add the items and quantities listed above to the basket, then place the order.'
        : 'Use the cafe ordering system on the right to add the required items and quantities to the basket, then place the order.');
      // The panel note belongs between the introduction and the Details heading.
      const panelSlot = u.el('div', 'rf-panel-slot', note);
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
      _c.panelSlot = panelSlot;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.panelSlot;
      base(_c);
      _c.body = body;
      const panel = _c.panelSlot.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('rf-requirements');
        panel.querySelector('.ref-panel-title').textContent = 'Order requirements';
        panel.querySelector('.ref-panel-text').classList.add('food-task');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('rf-task-message');
        const heading = _c.util.el('h4', '', null, 'Ordering notification');
        note.prepend(heading);
        note.querySelector('.ref-note-text').classList.add('food-task');
        _c.note.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const order = _c.util.el('div', 'order-slot');
      foot.prepend(order);
      // The unchanged widget binds its clear action to this hidden frame hook.
      const clear = _c.util.el('span', 'clear-basket', foot);
      clear.hidden = true;
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock') || document.body.querySelector('.ref-float');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-use-shop-food-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-food-03': palette }, LOW_THEME: palette,
      ACCENTS: ['#88a9cd'], LOW_ACCENTS: ['#88a9cd'], parts
    }
  });
})();
