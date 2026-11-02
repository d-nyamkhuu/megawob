// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  env.site({
    name: 'design-change-settings-toggle-02',
    template: 'site/base',
    design: {
      parts: {
        'frame.stage': (base) => (c) => {
          const body = c.body;
          const app = c.util.el('div', 'ref-app', body);
          const contacts = c.util.el('div', 'ref-contact-list', app);
          contacts.setAttribute('aria-hidden', 'true');
          for (let i = 0; i < 9; i++) {
            const photo = c.util.el('span', 'ref-contact-photo', contacts);
            photo.style.backgroundPosition = `${-(i % 3) * 46}px ${-Math.floor(i / 3) * 48}px`;
            photo.style.top = `${55 + i * 72}px`;
          }
          const profile = c.util.el('section', 'ref-profile-band', app);
          profile.setAttribute('aria-hidden', 'true');
          c.util.el('div', 'ref-profile-photo', profile);
          const identity = c.util.el('div', 'ref-profile-identity', profile);
          c.util.el('div', 'ref-profile-name', identity, 'Alex Carter');
          const status = c.util.el('div', 'ref-profile-status', identity);
          c.util.el('i', '', status);
          c.util.el('span', '', status, 'Online');
          c.util.el('span', 'ref-profile-chevron', status, '⌄');
          c.util.el('div', 'ref-profile-email', identity, 'alex.carter@chatsphere.com');
          const details = c.util.el('div', 'ref-profile-details', profile);
          for (const [label, value] of [['Status Message', 'Working from home today'], ['Time Zone', 'Pacific Time (US & Canada)'], ['Member Since', 'Mar 12, 2009']]) {
            c.util.el('span', 'ref-profile-label', details, label);
            c.util.el('span', 'ref-profile-value', details, value);
          }
          c.body = app;
          base(c);
          c.body = body;
        },
      },
    },
  });
})();
