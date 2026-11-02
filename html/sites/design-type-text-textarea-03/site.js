// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-textarea-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-type-text-textarea-03',
        'brand': 'People',
        'title': '',
        'instruction': 'top',
        'rail': 'All contacts|Favorites|Groups|Labels|Help & tips',
        'menu': 'Contacts|Groups|Recent|Settings',
        'briefTitle': 'Help & tips',
      },
      parts: {
        'frame.11': (base, S) =>
          function (_c) {
            const { body, u } = _c;
            const contacts = u.el('aside', 'ds-contacts', body);
            u.el('div', 'ds-contact-search', contacts, '\u2315  Search contacts');
            const list = u.el('div', 'ds-contact-list', contacts);
            [
              ['AH', 'Amy Harris', 'amy.harris@example.com'],
              ['BT', 'Ben Taylor', 'ben.taylor@example.com'],
              ['CD', 'Chloe Diaz', 'chloe.diaz@example.com'],
              ['DK', 'Daniel Kim', 'daniel.kim@example.com'],
              ['EL', 'Eva Lopez', 'eva.lopez@example.com'],
              ['FL', 'Felix Lange', 'felix.lange@example.com'],
              ['GS', 'Grace Silva', 'grace.silva@example.com'],
              ['IH', 'Isabel Huang', 'isabel.huang@example.com'],
              ['JT', 'Jack Turner', 'jack.turner@example.com'],
              ['KL', 'Kelly Lawson', 'kelly.lawson@example.com'],
              ['MC', 'Mason Carter', 'mason.carter@example.com'],
              ['NR', 'Nora Reed', 'nora.reed@example.com'],
            ].forEach((x, i) => {
              const row = u.el('div', 'ds-contact-row' + (i === 0 ? ' selected' : ''), list);
              u.el('span', 'ds-avatar', row, x[0]);
              const text = u.el('div', 'ds-contact-text', row);
              u.el('div', 'ds-contact-name', text, x[1]);
              u.el('div', 'ds-contact-email', text, x[2]);
            });
            const content = u.el('div', 'ds-content', body);
            Object.assign(_c, { contacts, content, list });
          },
      },
    },
  });
})();
