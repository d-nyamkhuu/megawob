// This design adds the contact avatars, a relocated search field, and the initially hidden status strip.
(function () {
  'use strict';

  const AVATAR_COLORS = [
    '#a092ed', '#9dca90', '#5397fb', '#ee8583', '#cdb180',
    '#80d0be', '#9b77f0', '#62c1e1', '#ea91bf', '#b4d497',
  ];

  env.widget({
    task: 'find-fact',
    site: 'design-find-fact-phone-book-10',
    name: 'design',
    split: 'train',
    scenarios: ['phone-book'],
    template: 'find-fact/phone-book',
    design: {
      headers: ['Name', 'Email', 'Phone'],
      widths: ['43%', '35.5%', '21.5%'],
      props: ['email', 'phone'],
      parts: {
        searchParent: (base, S) => (ctx, B) => document.querySelector('.ds-sq'),
        searchInput: (base, S) => (ctx, B, box, inp) => {
          box.parentElement.classList.add('has-search');
          inp.placeholder = 'Search Contacts';
        },
        name: (base, S) => (ctx, B, tr, c, i, picked, els) => {
          const { util } = ctx;
          const name = util.el('td', 'name', tr);
          const avatar = util.el('span', 'rl-letter', name, c.first[0]);
          avatar.style.background = AVATAR_COLORS[i % AVATAR_COLORS.length];
          const person = util.el('span', 'rl-person', name);
          util.el('span', 'rl-fullname', person, c.name);
          const address = util.el('span', 'rl-address', person);
          els.push(S.P.link(ctx, address, c, i, 'address', picked.has(`${i}:address`)));
        },
        picked: (base, S) => (ctx, B, model, lastPick, wrong) => {
          B.status.style.display = lastPick ? 'flex' : 'none';
        },
      },
    },
  });
})();
