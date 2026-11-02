// This design adds the site’s contact icon, reordered columns, rail search, and hidden idle status.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-phone-book-02',
  name: 'design',
  split: 'train',
  scenarios: ['phone-book'],
  template: 'find-fact/phone-book',
  design: {
    headers: ['', 'Name', 'Email', 'Phone', 'Address'],
    widths: ['5.5%', '19%', '36.5%', '21.5%', '17.5%'],
    props: ['email', 'phone', 'address'],
    footClass: 'rl-book-foot',
    hideIdle: true,
    parts: {
      book: (base, S) => (ctx, B) => {
        base(ctx, B);
        const totalLabel = document.querySelector('.ds-contact-total');
        if (totalLabel) totalLabel.textContent = `${ctx.spec.contacts.length} contacts`;
      },
      searchInput: (base, S) => (ctx, B, box, inp) => {
        const sideBox = document.querySelector('.ds-sbox');
        if (sideBox && !document.querySelector('.ds-brief')) {
          inp.classList.add('ds-sbox');
          inp.placeholder = '';
          sideBox.replaceWith(inp);
          box.style.display = 'none';
        }
      },
      row: (base, S) => (ctx, B, tr, c, i, picked, els) => {
        const { util } = ctx;
        const icon = util.el('td', 'rl-person', tr);
        icon.innerHTML = '<svg viewBox="0 0 28 32" fill="white" stroke="black" stroke-width="2.5"><path d="M9 17 3 21v9h23v-9l-7-4M14 3c-9 0-9 17 0 17S23 3 14 3Z"/></svg>';
        util.el('td', 'name', tr, c.name);
        for (const prop of S.D.props) {
          els.push(S.P.link(ctx, util.el('td', '', tr), c, i, prop, picked.has(`${i}:${prop}`)));
        }
      },
    },
  },
});
