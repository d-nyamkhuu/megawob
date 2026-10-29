// Mac mail with avatar initials, custom icons, taller rows and overflow message tools.
(function () {
  'use strict';
  function ini(name) {
    return name.split(/\s+/).map(w => w[0] || '').slice(0, 2).join('').toUpperCase();
  }
  function hue(name) {
    let h = 0;
    for (const c of name) h += c.charCodeAt(0);
    return h % 6;
  }
  env.widget({
    task: 'use-email',
    site: 'design-use-email-delete-05',
    name: 'design',
    split: 'train',
    scenarios: ['delete'],
    template: 'use-email/mail',
    design: {
      rowHeight: 105,
      folderList: ['inbox', 'starred', 'sent', 'drafts', 'archive', 'trash'],
      searchPlaceholder: 'Search emails',
      paths: {
        more: 'M5 12h.01M12 12h.01M19 12h.01',
        reply: 'M9 5 3 11l6 6M3 11h9c5 0 8 3 8 7',
        replyall: 'M8 5 2 11l6 6M14 5l-6 6 6 6M8 11h5c5 0 8 3 8 7',
        forward: 'm15 5 6 6-6 6M21 11h-9c-5 0-8 3-8 7',
        send: 'm3 10 19-7-7 19-3-9zM12 13 22 3',
        file: 'M5 2h9l5 5v15H5zM14 2v6h5',
      },
      parts: {
        rowInit: (base, S) => (r, e, i) => {
          base(r, e, i);
          r.dataset.ini = ini(e.name);
          r.dataset.hue = hue(e.name);
        },
        folderIcon: (base) => (v) =>
          ({ inbox: 'mail', starred: 'star', sent: 'send', drafts: 'file', trash: 'delete' }[v] || base(v)),
        toolsStart: (base, S) => (d) => {
          base(d);
          d.overflow = S.el('div', 'overflow-tools', d.tools);
        },
        docOp: (base, S) => (tools, label, op, i) =>
          base(['delete', 'inbox'].includes(op) ? tools : S.els.d.overflow, label, op, i),
        toolsDone: (base, S) => (d, m, i) => {
          base(d, m, i);
          const more = S.button(d.tools, 'More options', null, null, 'more', 'more-btn');
          more.setAttribute('aria-expanded', 'false');
          more.addEventListener('click', () => {
            const shown = d.tools.classList.toggle('expanded');
            more.setAttribute('aria-expanded', String(shown));
          });
        },
        docMeta: (base, S) => (meta, e) => {
          meta.dataset.ini = ini(e.name);
          meta.dataset.hue = hue(e.name);
          S.el('h2', '', meta, e.subject);
          S.el('div', 'from-name', meta, e.name);
          S.el('div', 'address', meta, e.addr);
          S.el('div', '', meta, 'To: ' + S.spec.me.name + S.cc(e));
          S.el('div', 'address', meta, e.time);
        },
        docDone: (base, S) => (d, e, i, m) => {
          base(d, e, i, m);
          d.tools.prepend(...d.acts.children);
        },
      },
    },
  });
})();
