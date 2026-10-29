// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-roach-05',
  name: 'design',
  split: 'train',
  scenarios: ['roach'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '18px/1.25 Tahoma, Arial, sans-serif',
    windowRadius: '10px',
    windowShadow: '0 2px 5px rgba(15, 28, 44, .12), 0 12px 28px rgba(15, 28, 44, .2)',
    colors: { '--b': '#075bd7', '--bs': '#e4f0fc', '--bfg': '#fff', '--ad': '#17a34a', '--bg': '#fffdf8', '--panel': '#fffdf8', '--fg': '#34415a', '--muted': '#52617a', '--line': '#bdd5eb' },
    parts: {
      frame: (base, S) => (ctx) => {
        const win = base(ctx);
        win.classList.add('meal-frame');
        win.classList.toggle('meal-compact', ctx.size.height < 700);
        return win;
      },
      tabs: (base, S) => (ctx) => {
        base(ctx);
        S.win.querySelector('.sd-tabs').style.display = 'none';
      },
      addressBar: (base, S) => (ctx) => {
        const el = ctx.util.el;
        S.bar = el('aside', 'sd-bar meal-tip', S.win);
        el('span', 'meal-help-icon', S.bar, '?');
        el('span', 'meal-tip-copy', S.bar, 'Tip: You can skip a delivery or change your plan at any time. If you decide to cancel, we’ll ask for a quick reason to help us improve.');
        el('span', 'meal-help-link', S.bar, 'Need help? Visit our Help Center');
        S.hostEl = el('span', 'meal-hidden', S.bar);
        S.pathEl = el('span', 'meal-hidden', S.bar);
      },
      header: (base, S) => (parent, model) => {
        const el = S.ctx.util.el;
        const header = el('header', 'meal-header', parent);
        const mast = el('div', 'meal-mast', header);
        const brand = el('div', 'meal-brand', mast);
        el('div', 'meal-logo', brand, 'Hearthbox');
        el('div', 'meal-leaves', brand).innerHTML = '<svg viewBox="0 0 40 34"><path d="M22 26C4 28 3 10 4 10c15 0 20 8 18 16Z" fill="#75972a"/><path d="M23 25C17 7 29 2 34 1c3 16-2 24-11 24Z" fill="#4f721e"/></svg>';
        el('div', 'meal-wordmark', brand, 'M E A L S');
        el('div', 'meal-slogan', mast, 'Good Food. A Brighter Week.');
        const links = el('div', 'meal-account-links', mast);
        el('span', '', links, 'Hi, Taylor');
        for (const label of ['My Account', 'Help', 'Sign Out']) {
          el('span', 'meal-separator', links, '|');
          const link = el('a', '', links, label); link.href = '#';
          link.addEventListener('click', e => { e.preventDefault(); env.log('decoy', {label}); });
        }
        const tabs = el('nav', 'meal-nav', header);
        for (const label of ['Home', 'Our Menu', 'How It Works', 'Gift Plans', 'My Account']) {
          const tab = el('button', label === 'My Account' ? 'meal-tab active' : 'meal-tab', tabs, label);
          tab.addEventListener('click', () => env.log('decoy', {label}));
        }
        el('h1', 'meal-heading', header, 'My Account');
        return header;
      },
      pageFor: (base, S) => (sid, parent, model) => {
        S.P.header(parent, model);
        S.P.screenBody(S.spec.screens[sid], parent, model);
      },
      main: (base, S) => (sc, parent, model) => {
        const el = S.ctx.util.el;
        if (!sc.blocks.some(b => b.t === 'kv')) {
          const root = base(sc, parent, model);
          root.classList.add('meal-flow');
          return root;
        }
        const root = el('section', 'sd-main meal-task', parent);
        const sub = el('section', 'meal-panel meal-subscription', root);
        el('h2', 'meal-panel-title', sub, 'Your Subscription');
        const product = el('div', 'meal-product', sub);
        const image = el('img', 'meal-photo', product);
        image.src = 'sites/design-avoid-dark-patterns-roach-05/assets/hearthbox-meal-box.png';
        image.alt = 'Hearthbox Meals box with fresh vegetables';
        const facts = el('div', 'meal-facts', product);
        el('h2', 'meal-product-name', facts, S.app.name);
        el('div', 'meal-plan-name', facts, 'Weekly Plan');
        for (const b of sc.blocks) if (b.t === 'kv') S.P.block(b, facts, model);
        const benefits = el('ul', 'meal-benefits', product);
        for (const text of ['Fresh, seasonal ingredients', 'Flexible weekly menu', 'Skip a week anytime', 'Free delivery']) el('li', '', benefits, text);
        const actions = el('section', 'meal-panel meal-actions', root);
        el('h2', 'meal-panel-title', actions, 'Account Actions');
        const rows = el('div', 'meal-action-rows', actions);
        const symbols = [
          '<rect x="5" y="7" width="27" height="29" rx="2" fill="#eef6ff" stroke="#174b87" stroke-width="2"/><path d="M5 15h27M12 3v8m13-8v8" stroke="#174b87" stroke-width="2"/><path d="M10 21h17m-17 5h17m-17 5h17M15 19v15m7-15v15" stroke="#b6cce3"/>',
          '<rect x="7" y="6" width="8" height="29" rx="1" fill="#5d6369" stroke="#343b42"/><rect x="24" y="6" width="8" height="29" rx="1" fill="#5d6369" stroke="#343b42"/>',
          '<path d="m4 12 15-6 16 6v20l-16 7L4 32Z" fill="#dbb27c" stroke="#ad7e45"/><path d="m4 12 15 7 16-7M19 19v20M11 9l16 7v9l-6-2v-9" fill="none" stroke="#b2824a"/>',
          '<defs><linearGradient id="red" x2="0" y2="1"><stop stop-color="#ff4a3e"/><stop offset="1" stop-color="#cf0000"/></linearGradient></defs><circle cx="20" cy="21" r="18" fill="url(#red)" stroke="#a90000"/><path d="m12 13 16 16m0-16L12 29" stroke="white" stroke-width="5"/>'
        ];
        const row = (label, description, index, id) => {
          const r = el('div', 'meal-action-row', rows);
          el('div', 'meal-action-icon', r).innerHTML = '<svg viewBox="0 0 40 42" aria-hidden="true">' + symbols[index % 4] + '</svg>';
          const text = el('div', 'meal-action-copy', r);
          const link = el('a', 'meal-action-title', text, label); link.href = '#';
          el('div', 'meal-action-description', text, description);
          if (id) {
            link.addEventListener('click', e => e.preventDefault()); S.P.bind(id, link);
            S.P.ctlBtn(id, r, 'meal-action-button');
          } else {
            link.addEventListener('click', e => { e.preventDefault(); env.log('decoy', {label}); });
            const b = el('button', 'sd-b meal-action-button', r, label === 'Skip Upcoming Delivery' ? 'Skip Delivery' : label === 'Update Delivery Address' ? 'Update Address' : label);
            b.addEventListener('click', () => env.log('decoy', {label}));
          }
        };
        row('Change Plan', 'Switch to a different meal plan or number of servings.', 0);
        row('Skip Upcoming Delivery', 'Skip your next delivery (or more).', 1);
        row('Update Delivery Address', 'Change where we deliver your meals.', 2);
        for (const b of sc.blocks) {
          if (b.t === 'kv') continue;
          if (b.t === 'h') { if (b.back) S.P.ctlBtn(b.back, rows); continue; }
          if (b.t === 'btns') for (const id of b.ctls) row(S.spec.ctls[id].label, `Manage your ${S.app.name} subscription.`, 3, id);
          else S.P.block(b, rows, model);
        }
        return root;
      },
      decorated: (base, S) => (ctx) => {},
    }
  },
});
