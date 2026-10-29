// Design of this site on the use-email/mail template (templates/use-email/mail.js): a mobile-style mailbox with
// All / Unread / Starred / Archive tabs, an overflow button for the message actions and a folder menu icon from the
// site frame.
// The tab strip shows unread mail only with the Unread tab (state of the page).
(function () {
  'use strict';
  let unreadOnly = false;
  let tabs;
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-reply-05',
    name: 'design',
    split: 'train',
    scenarios: ['star-reply'],
    template: 'use-email/mail',
    design: {
      rowHeight: 105,
      searchPlaceholder: 'Search emails',
      rowBasis: 'size',
      replyPlaceholder: 'Write a reply...',
      parts: {
        begin: (base, S) => () => {
          unreadOnly = false;
          tabs = new Map();
          document.body.style.setProperty('--u', S.ctx.size.width / 1672 + 'px');
          document.body.style.setProperty('--v', S.ctx.size.height / 941 + 'px');
        },
        listOrder: (base, S) => (m) => S.fam.helpers.listOrder(m, S.spec).filter((i) => !unreadOnly || m.flags[i].unread),
        listKeyOf: (base, S) => (m, order) => JSON.stringify([order, m.view, m.query, unreadOnly]),
        navReady: (base, S) => () => {
          const { navTrigger } = S.els;
          navTrigger.replaceChildren();
          for (const [label, view] of [
            ['All', 'inbox'],
            ['Unread', 'unread'],
            ['Starred', 'starred'],
            ['Archive', 'archive'],
          ]) {
            const b = S.el('button', 'mail-tab', navTrigger, label);
            b.type = 'button';
            b.addEventListener('click', (ev) => {
              ev.stopPropagation();
              unreadOnly = view === 'unread';
              S.up({ view: unreadOnly ? 'inbox' : view });
            });
            tabs.set(view, b);
          }
        },
        paintFolders: (base, S) => (m) => {
          base(m);
          for (const [v, b] of tabs) {
            const on = v === (unreadOnly ? 'unread' : m.view || 'inbox');
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', String(on));
          }
        },
        folderAction: (base, S) => (v) => {
          unreadOnly = false;
          return base(v);
        },
        foldersMade: (base, S) => () => {
          const folderMenu = document.querySelector('.filter-ico');
          if (folderMenu) {
            folderMenu.setAttribute('role', 'button');
            folderMenu.setAttribute('aria-label', 'Mailbox options');
            folderMenu.tabIndex = 0;
            folderMenu.addEventListener('click', () => S.navToggle());
            folderMenu.addEventListener('keydown', (ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                folderMenu.click();
              }
            });
            S.els.reg.set('folder-menu', folderMenu);
          }
        },
        docStart: (base, S) => () => {
          const { doc, docInside, reg } = S.els;
          doc.classList.remove('actions-expanded');
          const more = S.el('button', 'more-actions', docInside);
          more.type = 'button';
          more.setAttribute('aria-label', 'More message actions');
          more.innerHTML =
            '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>';
          more.addEventListener('click', () => doc.classList.toggle('actions-expanded'));
          reg.set('doc:more', more);
        },
        docMeta: (base, S) => (meta, e) => {
          const { el, cc } = S;
          el('h2', '', meta, e.subject);
          const who = el('div', 'who', meta);
          el('div', 'avatar', who, e.name.charAt(0));
          const wb = el('div', 'who-body', who);
          el('div', 'from-name', wb, e.name);
          el('div', 'address', wb, 'to me' + cc(e) + ' ⌄');
          el('div', 'sent-time', who, e.time);
        },
        editorTitle: (base, S) => (shown) => {
          const title = S.el('div', 'window-title', S.els.editor);
          const replyIcons = S.el('span', 'reply-icons', title);
          replyIcons.innerHTML =
            '<svg viewBox="0 0 24 24"><path d="m10 5-7 7 7 6M3 12h10a8 8 0 0 1 8 8"/></svg><svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg>';
          S.el('span', 'reply-label', title, S.P.editorTitleText(shown));
          return title;
        },
        actionsStart: (base, S) => (acts) => {
          const ti = S.el('span', 'tool-icons', acts);
          ti.innerHTML =
            '<svg viewBox="0 0 24 24"><path d="M20 11 12 19a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7"/></svg><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="9" cy="10" r="1.5"/><path d="m3 18 5-5 4 4 3-3 6 5"/></svg><svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.5 0l3-3a4 4 0 0 0-5.5-5.5l-1 1M14 10a4 4 0 0 0-5.5 0l-3 3a4 4 0 0 0 5.5 5.5l1-1"/></svg><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 14a5 5 0 0 0 8 0M9 9.5v1M15 9.5v1"/></svg>';
        },
        locateEarly: (base, S) => (t) => {
          const { reg } = S.els;
          const { visible, center } = S;
          if (t.back && !visible(reg.get('back'))) return center(reg.get('doc:more'));
          if (
            t.action &&
            !['reply', 'replyall', 'forward', 'star'].includes(t.action) &&
            !visible(reg.get('action:' + t.action)) &&
            reg.get('action:' + t.action)
          )
            return center(reg.get('doc:more'));
          const folderMenu = reg.get('folder-menu');
          if (t.folder !== undefined && !visible(reg.get('folder:' + t.folder)) && folderMenu) return center(folderMenu);
        },
      },
    },
  });
})();
