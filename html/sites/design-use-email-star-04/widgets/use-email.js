// QuickMail with taller rows, search filter pills and a scroll range matching the logical row count.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-04',
    name: 'design',
    split: 'train',
    scenarios: ['star'],
    template: 'use-email/mail',
    design: {
      rowHeight: 58,
      searchPlaceholder: 'Search mail',
      paths: {
        clip: 'M16 7v9a4 4 0 0 1-8 0V6a2.5 2.5 0 0 1 5 0v9a1 1 0 0 1-2 0V8',
      },
      parts: {
        searchMade: (base, S) => () => {
          base();
          for (const [t, on] of [['All', 1], ['Unread', 0], ['Starred', 0], ['Attachments', 0]]) {
            const p = S.el('button', 'pill' + (on ? ' on' : ''), S.els.searchline);
            p.type = 'button';
            if (t === 'Attachments') p.innerHTML = S.P.icon('clip');
            S.el('span', '', p, t);
            p.addEventListener('click', () => env.log('decoy', { label: t }));
          }
        },
        rowsBuilt: (base, S) => (m, order, rowH, avail) => {
          base(m, order, rowH, avail);
          const { list } = S.els;
          list.style.paddingBottom = Math.max(0, list.clientHeight - S.spec.rows * rowH) + 'px';
        },
        applyScroll: (base, S) => (m, order, rowH) => {
          base(m, order, rowH);
          const { list, track } = S.els;
          track.style.visibility = list.scrollHeight > list.clientHeight ? 'visible' : 'hidden';
        },
      },
    },
  });
})();
