(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-checkout-02',
    brand: 'TrailShop',
    tokens: {
      bg: '#fff',
      panel: '#fff',
      fg: '#26313d',
      accent: '#39a987',
      font: 'Arial,sans-serif',
      line: '#dfe4e8',
      muted: '#778391',
    },
    nav: 'Shop       Cart       Orders       Account',
    obstruction: null,
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'side-left instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'sun-symbol', header, '');
      u.el('div', 'design-brand', header, D.brand);
      u.el('div', 'window-controls', header, '');
      const nav = u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      u.el('h2', '', note, 'Order Briefing');
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      u.el('p', 'brief-help', note, '');
      u.el('p', 'brief-status', note, '');
      const stage = u.el('main', 'stage', body);
      const records = u.el('aside', 'saved-records', body);
      const cartHeading = u.el('h2', 'rail-cart-title', records);
      cartHeading.innerHTML = '🛒  Your Cart';
      u.el('div', 'rail-cart-empty', records, 'Your cart is empty');
      u.el('h2', 'records-title', records, 'Saved Addresses');
      const edit = u.el('button', 'records-edit', records, 'Edit');
      edit.type = 'button';
      edit.addEventListener('click', () => env.log('decoy', { what: 'Edit addresses' }));
      const addressRows = [];
      for (const [name, street, city, code] of [
        ['Home (Marseille)', '12 Rue Saint-Ferréol', 'Marseille', '13001'],
        ['Work (Paris)', '8 Avenue des Ternes', 'Paris', '75017'],
        ['Parents (Lyon)', '42 Rue du Plat', 'Lyon', '69002'],
      ]) {
        const row = u.el('button', 'address-record', records);
        row.type = 'button';
        row.setAttribute('aria-pressed', name.startsWith('Home') ? 'true' : 'false');
        u.el('strong', '', row, name);
        u.el('span', '', row, street);
        u.el('span', '', row, code + ' ' + city);
        u.el('span', '', row, 'France');
        addressRows.push(row);
      }
      addressRows.forEach((row) =>
        row.addEventListener('click', () => {
          addressRows.forEach((x) => {
            x.classList.remove('selected');
            x.setAttribute('aria-pressed', 'false');
          });
          row.classList.add('selected');
          row.setAttribute('aria-pressed', 'true');
        }),
      );
      const footer = u.el('footer', 'design-footer', shell);
      const tools = [];
      for (const [label, cls] of [
        ['↶  Clear basket', 'clear-basket'],
        ['▣  Print order', 'print-order'],
        ['▤  Save order…', 'save-order'],
      ]) {
        const b = u.el('button', cls, footer, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: label }));
        tools.push(b);
      }
      const orderSlot = u.el('div', 'order-slot', footer);
      const endRng = ctx.rng.fork('chrome/end');
      const baseEnd = endRng.bool(0.5);
      const placement = baseEnd ? 'order' : endRng.pick(['print', 'save']);
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = baseEnd ? 'Submit' : textOf(endRng.pick(labels));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (collideRng.bool(0.3)) {
        const options = [...new Set(labels.map(textOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collision = collideRng.pick(options);
      }
      if (collision) {
        const b = u.el('button', 'menu-pq', footer, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      }
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control', footer, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        if (placement === 'print') {
          tools[0].style.gridColumn = '1';
          submit.style.gridColumn = '2';
          tools[2].style.gridColumn = '3';
          orderSlot.style.gridColumn = '4';
          tools[1].style.gridColumn = '5';
          for (const x of [...tools, orderSlot, submit]) x.style.gridRow = '1';
        } else if (placement === 'save') {
          tools[0].style.gridColumn = '1';
          tools[1].style.gridColumn = '2';
          submit.style.gridColumn = '3';
          orderSlot.style.gridColumn = '4';
          tools[2].style.gridColumn = '5';
          for (const x of [...tools, orderSlot, submit]) x.style.gridRow = '1';
        }
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
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
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
