// This design adds community badges and an address distractor beneath each contact name.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-phone-book-03',
  name: 'design',
  split: 'train',
  scenarios: ['phone-book'],
  template: 'find-fact/phone-book',
  design: {
    headers: ['', 'Name', 'Email', 'Phone'],
    widths: ['6.7%', '31.2%', '37.7%', '24.4%'],
    parts: {
      row: (base, S) => (ctx, B, tr, c, i, picked, els) => {
        const { util } = ctx;
        const icon = util.el('td', 'rl-badge', tr);
        icon.innerHTML = env.communityBadge(
          ['sunflower', 'cat', 'tree', 'bike', 'openbook', 'music', 'paw', 'house'][i % 8],
        );
        const name = util.el('td', 'name', tr, c.name);
        for (const prop of ['email', 'phone']) {
          els.push(S.P.link(ctx, util.el('td', '', tr), c, i, prop, picked.has(`${i}:${prop}`)));
        }
        const address = util.el('div', 'rl-address', name);
        els.push(S.P.link(ctx, address, c, i, 'address', picked.has(`${i}:address`)));
      },
    },
  },
});
