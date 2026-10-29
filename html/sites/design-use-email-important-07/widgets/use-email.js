// Thunderbird design with custom mail icons, a sender avatar, header star and inbox count.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-important-07',
    name: 'design',
    split: 'train',
    scenarios: ['important'],
    template: 'use-email/mail',
    design: {
      rowHeight: 49,
      folderList: ['inbox', 'starred', 'sent', 'drafts', 'archive', 'trash'],
      newLabel: 'New',
      toolbarOps: [['Reply', 'reply'], ['Reply all', 'replyall'], ['Forward', 'forward'], ['Delete', 'delete']],
      paths: {
        starred: 'm12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',
        sent: 'M2 9 22 2l-7 20-4-9-9-4z M11 13 22 2',
        drafts: 'M5 2h9l5 5v15H5z M14 2v6h5 M8 12h8 M8 16h8',
        inbox: 'M3 5h18v14H3z M3 5l9 7 9-7',
        trash: 'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
        new: 'M3 7h18v14H3z M5 7V3h14v4',
        forward: 'M14 4l7 7-7 5v-4c-5 0-8 2-11 6 1-6 4-10 11-10z',
        reply: 'M9 3h6l4 4v7 M14 3v5h5 M10 9l-7 6 7 6v-4c5 0 8 1 11 5-1-7-5-10-11-10z',
        replyall: 'M9 3h6l4 4v7 M14 3v5h5 M7 9l-6 6 6 6 M12 9l-6 6 6 6v-4c4 0 6 1 9 5-1-7-4-10-9-10z',
        important: 'm12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',
      },
      parts: {
        button: (base) => (parent, label, key, act, ic, cls = '') => {
          const b = base(parent, label, key, act, ic, cls);
          if (ic === 'reply' && parent.classList.contains('doc-actions'))
            b.querySelector('svg').outerHTML =
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5 3 11l7 6v-4c6 0 9 1 11 6-1-8-5-11-11-11z"/></svg>';
          return b;
        },
        toolbarMade: (base, S) => () => {
          base();
          const more = S.button(S.els.toolbar, 'More', null, null, null, 'toolbar-more');
          more.insertAdjacentHTML(
            'afterbegin',
            '<svg viewBox="0 0 24 24"><circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/></svg>',
          );
          more.addEventListener('click', () => env.log('decoy', { label: 'More' }));
        },
        docMeta: (base, S) => (meta, e, i, m) => {
          const { el, button, action, ctx } = S;
          el('h2', '', meta, e.subject);
          el('div', 'avatar', meta, (e.name || '?').charAt(0));
          el('div', 'from-name', meta, e.name);
          el('div', 'address', meta, e.addr);
          el('div', 'to-line', meta, 'To: me' + S.cc(e));
          el('div', 'address', meta, e.time);
          const headerStar = button(meta, '', null, () => action('star', ctx.model.open ?? i), 'star', 'header-star');
          headerStar.title = 'Star';
          headerStar.setAttribute('aria-label', 'Star');
          headerStar.classList.toggle('on', m.flags[i].starred);
        },
        docFlags: (base, S) => (m, i) => {
          base(m, i);
          for (const [op, flag] of [['star', 'starred'], ['important', 'important']]) {
            const toolbarButton = S.els.reg.get('toolbar:' + op);
            if (toolbarButton) toolbarButton.classList.toggle('on', m.flags[i][flag]);
          }
          const headerStar = S.els.doc.querySelector('.header-star');
          if (headerStar) headerStar.classList.toggle('on', m.flags[i].starred);
        },
        painted: (base, S) => (m) => {
          base(m);
          const inbox = S.els.folderButtons.get('inbox');
          let count = inbox.querySelector('.count');
          if (!count) count = S.el('span', 'count', inbox);
          count.textContent = S.spec.emails.filter((e, i) => m.box[i] === 'inbox').length;
        },
      },
    },
  });
})();
