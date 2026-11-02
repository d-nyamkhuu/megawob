// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-hiddencost-05',
  name: 'design',
  split: 'train',
  scenarios: ['hiddencost'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '16px/1.35 Arial, "Trebuchet MS", sans-serif',
    colors: { '--panel':'#fbf8f3', '--fg':'#171717', '--bg':'#f3eee6', '--line':'#d8cfc4', '--muted':'#57524d', '--b':'#e9650b', '--bs':'#ffd0ac', '--bfg':'#fff' },
    parts: {
      fit: (base, S) => ctx => {
        const g = base(ctx);
        return { ...g, M:0, fullW:ctx.size.width, fullH:ctx.size.height, winW:ctx.size.width, winH:ctx.size.height, ax:'left' };
      },
      frame: (base, S) => ctx => {
        const win = base(ctx);
        win.classList.add('human-task');
        win.style.left = '0px'; win.style.top = '0px';
        return win;
      },
      tabs: (base, S) => ctx => {
        base(ctx);
        S.tabTitle.closest('.sd-tabs').remove();
      },
      addressBar: (base, S) => ctx => {
        const bar = S.el('div', 'human-hero', S.win);
        S.bar = bar;
        const sun = S.el('div', 'human-sun', bar);
        sun.innerHTML = '<svg viewBox="0 0 120 120" aria-hidden="true"><g fill="#f8b51d" stroke="#eea114" stroke-width="2"><path d="M60 5l9 23H51zM60 115l9-23H51zM5 60l23-9v18zM115 60l-23-9v18zM21 21l24 9-15 15zM99 21l-9 24-15-15zM21 99l9-24 15 15zM99 99l-24-9 15-15z"/><circle cx="60" cy="60" r="28" fill="#ed7b13" stroke="#f8b51d" stroke-width="5"/></g></svg>';
        const tx = S.el('div', 'human-hero-copy', bar);
        S.el('div', 'human-hero-title', tx, S.app.name);
        S.el('div', 'human-hero-meta', tx, 'Mexican　·　1.2 miles　·　25–40 min');
        const rating = S.el('div', 'human-hero-rating', tx);
        S.el('span', '', rating, '★★★★'); S.el('i', '', rating, '★'); S.el('small', '', rating, ' (412)');
        const metadata = S.el('div', 'human-metadata', bar);
        S.hostEl = S.el('span', '', metadata);
        S.pathEl = S.el('span', '', metadata);
      },
      header: (base, S) => (parent, m) => {
        const sc = S.spec.screens[m.screen];
        S.bar.querySelector('.human-hero-title').textContent = S.P.fill(m, sc.title || S.app.name);
        const tabs = S.el('div', 'human-tabs', parent);
        for (const name of ['Menu','About','Reviews','Location']) S.el('div', '', tabs, name);
        return tabs;
      },
      pageFor: (base, S) => (sid, parent, m) => {
        const sc = S.spec.screens[sid];
        S.P.header(parent, m);
        const layout = S.el('div', 'human-content', parent);
        const cats = S.el('aside', 'human-categories', layout);
        for (const name of ['Popular','Tacos','Burritos','Quesadillas','Bowls','Sides','Drinks','Desserts']) S.el('div', name === 'Drinks' ? 'on' : '', cats, name);
        S.P.screenBody(sc, layout, m);
      },
      listingCard: (base, S) => (id, box, m) => {
        const c = S.spec.ctls[id];
        box.classList.add('human-listings');
        const row = S.el('section', 'human-listing', box);
        S.el('div', 'human-food-photo', row);
        const info = S.el('div', 'human-listing-info', row);
        S.el('h3', '', info, c.label);
        if (c.sub) S.el('div', 'human-listing-price', info, c.sub);
        const btn = S.el('button', 'sd-b primary', info, c.btn || S.D.selectLabel);
        S.P.bind(id, btn);
      },
    },
  },
});
