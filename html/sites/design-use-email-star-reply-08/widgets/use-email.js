// Plain WebMail design with the original metadata, reply heading, and footer status.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-reply-08',
    name: 'design',
    split: 'train',
    scenarios: ['star-reply'],
    template: 'use-email/mail',
    design: {
      rowHeight: 40,
      fieldColon: true,
      parts: {
        docMeta: (base, S) => (meta, e) => {
          const { el } = S;
          el('h2', '', meta, e.subject);
          const mrow = (label, value) => {
            const row = el('div', 'mrow', meta);
            el('span', 'ml', row, label);
            el('span', 'mv', row, value);
          };
          mrow('From:', e.name + ' <' + e.addr + '>');
          mrow('To:', S.spec.me.name + S.cc(e));
          mrow('Date:', e.time);
        },
        editorTitleText: () => () => 'To:',
        editorTitleMade: (base, S) => (title, shown, c) => {
          if (!c)
            title.setAttribute(
              'aria-label',
              shown.mode === 'forward' ? 'Forward this email' : 'Reply to ' + S.spec.emails[shown.of ?? 0].name,
            );
        },
        painted: (base, S) => (m) => {
          const count = document.querySelector('.foot-l');
          if (count) count.textContent = S.els.listStatus.textContent;
          const footerStatus = document.querySelector('.foot-r');
          if (footerStatus) footerStatus.style.visibility = m.open !== null || m.compose ? 'hidden' : 'visible';
        },
      },
    },
  });
})();
