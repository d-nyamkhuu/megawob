// Notebook mail: taller rows, paper-sized list, Settings navigation and bold address labels.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-nl-10',
    name: 'design',
    split: 'train',
    scenarios: ['nl'],
    template: 'use-email/mail',
    design: {
      folderList: ['inbox', 'starred'],
      rowHeight: 52,
      parts: {
        searchMade: (base, S) => () => {
          base();
          S.button(S.els.toolbar, 'Save Draft', null, null, null, 'save-draft');
        },
        listSized: (base, S) => (m, order, rowH, avail) => {
          base(m, order, rowH, avail);
          // Extra paper below the task's viewport must not expose extra messages.
          S.els.list.style.bottom = 'auto';
          S.els.list.style.height = rowH * S.spec.rows + 'px';
        },
        foldersMade: (base, S) => () => {
          base();
          const settings = (S.els.settings = S.button(
            S.els.folders, 'Settings', null, null, 'important', 'folder notebook-settings',
          ));
          settings.innerHTML =
            '<svg viewBox="0 0 24 24"><path d="M9 2h6l1 4 4 1 2 5-3 3-1 5-5 2-3-3-5-1-2-5 3-3z"/><circle cx="12" cy="12" r="4" fill="#d6d6d6"/></svg><span>Settings</span>';
          settings.addEventListener('click', () => S.navToggle());
          for (const [label, ic] of [['Sent', 'send'], ['Drafts', 'file'], ['Contacts', 'file']]) {
            const b = S.button(S.els.folders, label, null, null, ic, 'folder notebook-xtra');
            b.dataset.notebook = label;
          }
        },
        docMeta: (base, S) => (meta, e) => {
          const { el } = S;
          el('h2', '', meta, e.subject);
          const fromL = el('div', '', meta);
          el('b', '', fromL, 'From: ');
          fromL.append(e.name);
          el('div', 'address', meta, '<' + e.addr + '>');
          const toL = el('div', '', meta);
          el('b', '', toL, 'To: ');
          toL.append(S.spec.me.name + S.cc(e));
          el('div', 'address', meta, e.time);
        },
        paintClasses: (base, S) => (m) => {
          S.els.root.dataset.task = S.spec.task;
          base(m);
        },
        locateFolder: (base, S) => (t) => {
          if (t.folder !== undefined && !S.visible(S.els.reg.get('folder:' + t.folder))) {
            if (!S.visible(S.els.navTrigger)) S.els.navTrigger.style.display = 'flex';
            return S.center(S.els.settings);
          }
        },
      },
    },
  });
})();
