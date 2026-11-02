// Adds the directory toolbar count/search and shows each address beneath its contact name.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-phone-book-06',
  name: 'design',
  split: 'train',
  scenarios: ['phone-book'],
  template: 'find-fact/phone-book',
  design: {
    headers: ['Name', 'Email', 'Phone'],
    widths: ['30%', '41%', '29%'],
    props: ['email', 'phone'],
    parts: {
      book: (base, S) => (ctx, B) => {
        const count = document.querySelector('.ek-contact-count');
        if (count) count.textContent = `${ctx.spec.contacts.length} contacts`;
      },
      searchInput: (base, S) => (ctx, B, box) => {
        const toolbarSearch = document.querySelector('.ek-search');
        if (toolbarSearch) {
          toolbarSearch.replaceChildren(box);
          toolbarSearch.classList.add('functional');
        }
      },
      name: (base, S) => (ctx, B, tr, c, i, picked, els) => {
        const { util } = ctx;
        const nameCell = util.el('td', 'name', tr);
        util.el('div', '', nameCell, c.name);
        const address = util.el('div', 'rl-address', nameCell);
        els.push(S.P.link(ctx, address, c, i, 'address', picked.has(`${i}:address`)));
      },
    },
  },
});
