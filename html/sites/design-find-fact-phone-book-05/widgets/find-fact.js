// City directory design adds a contact-book heading and a separate preview panel.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-phone-book-05',
  name: 'design',
  split: 'train',
  scenarios: ['phone-book'],
  template: 'find-fact/phone-book',
  design: {
    headers: ['Name', 'Department / Role', 'Email', 'Phone'],
    widths: ['23.5%', '25.8%', '32%', '18.7%'],
    props: ['address', 'email', 'phone'],
    parts: {
      book: (base, S) => (ctx, B) => {
        base(ctx, B);
        const { util } = ctx;
        const { bc, body, search } = B;
        const heading = util.el('div', 'rl-ledger-heading', bc);
        bc.insertBefore(heading, body);
        util.el('h2', '', heading, 'Contact Book');
        util.el('p', '', heading, 'Find residents, staff and department contacts.');
        if (!search) {
          const shelf = util.el('div', 'rl-search-shelf', heading);
          shelf.innerHTML = S.D.searchIcon;
          util.el('span', '', shelf, 'Search contacts…');
        }
      },
      status: (base, S) => (ctx, B) => {
        base(ctx, B);
        const preview = document.querySelector('.ds-preview');
        if (preview) preview.append(B.status);
      },
      header: (base, S) => (ctx, th, index) => {
        base(ctx, th, index);
        if (index === 0) ctx.util.el('span', 'rl-sort-indicator', th, '▲');
      },
      picked: (base, S) => (ctx, B, model, lastPick, wrong) => {
        base(ctx, B, model, lastPick, wrong);
        const { util } = ctx;
        const detail = document.querySelector('.ds-preview-detail');
        if (detail) {
          detail.replaceChildren();
          if (lastPick) {
            util.el('strong', '', detail, ctx.spec.contacts[lastPick.contact].name);
            util.el('div', '', detail, ctx.spec.contacts[lastPick.contact][lastPick.prop]);
          } else detail.textContent = 'No contact selected.';
        }
        B.status.style.visibility = lastPick ? 'visible' : 'hidden';
      },
    },
  },
});
