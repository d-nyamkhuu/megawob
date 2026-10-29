// Swiss editorial contact form: form left, saved-contacts index right (the profile card is the open record).
(function () {
  'use strict';
  const CONTACTS = [
    ['MK', 'Marcus Kim', 'BrightPath Solutions'],
    ['JL', 'Jennifer Lee', 'Oakridge Media'],
    ['RW', 'Robert White', 'Summit Engineering'],
    ['SP', 'Sophie Patel', 'Clearview Health'],
    ['DK', 'Daniel Kowalski', 'Northside Realty'],
    ['CL', 'Chloe Li', 'Metro Finance'],
    ['SB', 'Sam Bennett', 'Harbor Creative'],
  ];
  env.site({
    name: 'design-type-text-complete-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: { site: 'design-type-text-complete-05', brand: '', title: '', instruction: 'top', rail: '', menu: '', briefTitle: 'Note' },
      parts: {
        'frame.7': () => () => {},
        'frame.21': () => () => {},
        'frame.24': (base) => (_c) => { _c.label = 'Save'; },
        'frame.19': (base) => (_c) => {
          base(_c);
          const { main, u } = _c;
          const side = u.el('aside', 'sw-side', main);
          u.el('h2', 'sw-side-h', side, 'Saved Contacts');
          const s = u.el('div', 'sw-search', side);
          s.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#444" stroke-width="2"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/></svg>';
          u.el('span', '', s, 'Search contacts...');
          u.el('div', 'sw-slot', side);
          const list = u.el('div', 'sw-list', side);
          for (const [i, n, o] of CONTACTS) {
            const r = u.el('div', 'sw-row', list);
            u.el('span', 'sw-av', r, i);
            const t = u.el('span', 'sw-t', r);
            u.el('b', '', t, n);
            u.el('i', '', t, o);
            u.el('span', 'sw-chev', r, '›');
          }
        },
        'frame.26': (base) => (_c) => {
          const r = base(_c);
          const sm = _c.submit;
          if (sm && sm.parentElement === _c.foot && !sm.classList.contains('ds-submit-link')) {
            _c.top.appendChild(sm);
            sm.classList.add('ds-submit-header');
          }
          return r;
        },
      },
    },
  });
})();
