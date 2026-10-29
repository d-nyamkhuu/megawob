// Site design on find-fact/phone-book; shared widget code lives in templates/find-fact/phone-book.js.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-phone-book-09',
  name: 'design',
  split: 'train',
  scenarios: ['phone-book'],
  template: 'find-fact/phone-book',
  design: {
    widths: ['28%', '24%', '30%', '18%'],
    parts: {
      searchInput: (base, S) => (ctx, B, box, inp) => {
        B.searchBox = box;
        B.searchElement = inp;
      },
      searchBound: (base, S) => (ctx, B) => {
        if (!B.search) return;
        const inp = B.searchElement;
        const box = B.searchBox;
        const headerSearch = document.querySelector('.ds-contact-search');
        if (headerSearch) { headerSearch.replaceWith(inp); inp.className = 'ds-contact-search'; box.remove(); }
      },
      status: (base, S) => (ctx, B) => {
        const host = document.querySelector('.ds-side-b');
        if (host) host.append(B.status);
      },
      name: (base, S) => (ctx, B, tr, c, i, picked, els) => {
        const { util } = ctx;
        const nameCell = util.el('td', 'name', tr);
        util.el('span', 'rl-person', nameCell);
        util.el('span', '', nameCell, c.name);
      },
      picked: (base, S) => (ctx, B, m, last, bad) => {
        const { spec } = ctx;
        const { status } = B;
        status.classList.toggle('idle', !last);
        const detailTitle = document.querySelector('.ds-side-t');
        const detailSub = document.querySelector('.ds-side-s');
        if (detailTitle) detailTitle.textContent = last ? spec.contacts[last.contact].name : 'No contact selected';
        if (detailSub) detailSub.textContent = last ? spec.contacts[last.contact][last.prop] : 'Choose a contact from the list to view their details here.';
      },
      ready: (base, S) => (ctx, B) => {
        const { spec } = ctx;
        const { fam, up, paint, search, searchField } = B;
        const clear = document.querySelector('.ds-clear');
        if (clear) clear.addEventListener('click', () => {
          if (fam.helpers.wrongPick(ctx.model, spec) && !spec.recoverable) return;
          up({ picks: [] });
          paint();
        });
        const headerInput = document.querySelector('.ds-contact-search');
        const searchButton = document.querySelector('.ds-search-go');
        const findContact = () => {
          if (!headerInput) return;
          const q = headerInput.value.trim().toLowerCase();
          if (search) { up({ query: headerInput.value, page: 0 }); if (searchField) searchField.set(headerInput.value); }
          else if (q) {
            const index = spec.contacts.findIndex(c => c.name.toLowerCase().includes(q));
            if (index >= 0) up({ page: Math.floor(index / spec.perPage) });
          }
          paint();
        };
        if (headerInput) headerInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); findContact(); } });
        if (searchButton) searchButton.addEventListener('click', findContact);
      },
    },
  },
});
