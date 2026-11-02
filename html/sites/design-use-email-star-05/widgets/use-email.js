// QuickMail's flash design: gem icons, extra toolbar controls and a row-count-sized list.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-05',
    name: 'design',
    split: 'train',
    scenarios: ['star'],
    template: 'use-email/mail',
    design: {
      scrollToRowIcon: true,
      paths: {
        reply: 'M10 4 3 12l7 8v-5h11V9H10z',
        new: 'M6 2h9l4 4v16H6z M15 2v4h4',
        replyall: 'M8 5 1 12l7 7v-5l7 5V5l-7 5z M15 10l7-5v14l-7-5z',
        unread: 'M2 10 6 3h12l4 7v11H2z M2 10l10 8 10-8 M2 21l7-6 M22 21l-7-6',
        search: 'M10 2h5l4 4v6l-4 4h-5l-4-4V6z M17 15l6 6',
        tag: 'M3 13 13 3h6v5l3-3v7L12 22z M16 7h1',
        delete: 'M4 5h16v3H4z M8 5V2h8v3 M6 8v14h12V8 M10 10v9 M14 10v9',
        move: 'M2 7V4h8l2 3h10v13H2z',
      },
      toolbarBefore: [['Mark Read', 'mail'], ['Mark Unread', 'unread']],
      toolbarAfter: [['Unstar', 'star'], ['Move', 'move'], ['Labels', 'tag'], ['Search', 'search']],
      parts: {
        columnsMade: (base, S) => () => {
          base();
          S.els.col.lastChild.innerHTML = S.P.icon('star');
        },
        rowsBuilt: (base, S) => (...args) => {
          base(...args);
          S.els.root.style.setProperty('--visible-rows', S.spec.rows);
        },
        locateRowIcon: (base, S) => (t) => {
          if (!t.rowIcon) return;
          const { reg, lbx } = S.els;
          const b = reg.get('rowIcon:' + t.rowIcon[0] + ':' + t.rowIcon[1]);
          const p = S.center(b), hit = document.elementFromPoint(...p);
          if (hit && (hit === b || b.contains(hit))) return p;
          if (S.ctx.model.open === t.rowIcon[0]) {
            const tool = reg.get('toolbar:' + t.rowIcon[1]);
            if (S.visible(tool)) return S.center(tool);
          }
          return lbx.locateOption(t.rowIcon[0]);
        },
      },
    },
  });
})();
