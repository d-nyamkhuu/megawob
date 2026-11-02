// This design adds the site’s illustrated contact rows, display-only search bar, and briefing note.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-phone-book-04',
  name: 'design',
  split: 'train',
  scenarios: ['phone-book'],
  template: 'find-fact/phone-book',
  design: {
    searchIcon: '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="#3d4c5b" stroke-width="2"><path d="M20 21l9 9" stroke-width="5" stroke-linecap="round"/><circle cx="13" cy="13" r="10" fill="#86a7c0"/><circle cx="13" cy="13" r="6.8" fill="#eff7fc" stroke="#c6dce9"/><path d="M8 12c0-3 2-5 5-5" stroke="#fff" stroke-linecap="round"/></svg>',
    headers: ['Name', 'Email', 'Phone', 'Address'],
    widths: ['27%', '29%', '21%', '23%'],
    props: ['email', 'phone', 'address'],
    idleClass: ' idle',
    parts: {
      framed: (base, S) => (ctx) => {
        const briefing = document.querySelector('.ds-brief');
        if (briefing && ctx.spec.scenario === 'phone-book') {
          const c = ctx.spec.contacts[ctx.spec.target];
          ctx.util.el('p', 'ds-note', briefing,
            `Find the correct contact in the list on the ${briefing.closest('.ds-mode-right') ? 'left' : 'right'}. Click the ${env.taskDef.helpers.PROPS[ctx.spec.prop]} for ${c.name}.`);
        }
      },
      book: (base, S) => (ctx, B) => {
        if (B.search) return;
        const box = ctx.util.el('div', 'rl-search rl-search-display', B.body);
        box.innerHTML = S.D.searchIcon;
        ctx.util.el('span', '', box, 'Search contacts…');
        box.title = 'Browse contacts with the page controls below.';
      },
      header: (base, S) => (ctx, th, index) => {
        if (!index) ctx.util.el('span', 'rl-sort', th, '▴');
      },
      name: (base, S) => (ctx, B, tr, c, i) => {
        const name = ctx.util.el('td', 'name', tr);
        const av = ctx.util.el('span', 'rl-person', name);
        const colors = ['#6cadd0', '#aa87ae', '#7aaa82', '#e8ae42', '#729dcc'];
        av.innerHTML = '<svg viewBox="0 0 32 38" fill="none" stroke="#3d4655" stroke-width="2.2"><path d="M8 15C3 1 28-2 25 15l-4 6H12z" fill="#555d6c"/><path d="M9 14c0-12 17-12 16 0-1 5-4 8-8 8s-7-3-8-8z" fill="#f3d4aa"/><path d="M17 22C8 22 3 27 3 34h26c0-8-4-12-12-12z" fill="' + colors[i % colors.length] + '"/><path d="M6 32h20" stroke="#ffffff" opacity=".35"/></svg>';
        ctx.util.el('span', '', name, c.name);
      },
    },
  },
});
