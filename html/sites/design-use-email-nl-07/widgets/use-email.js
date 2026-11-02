// IRIX design with folder artwork and counts, compact list sizing, and tabular message metadata.
(function () {
  'use strict';
  const FOLDER_ART = {
    mail: '<path fill="#fff8da" d="M2 5h20v15H2z"/><path fill="#ebcf8b" d="m2 20 8-8h4l8 8"/><path fill="#fff9e8" d="m2 5 10 8L22 5"/>',
    sent: '<path fill="#d9efff" d="M2 5h20v15H2z"/><path fill="#86b5cc" d="m2 20 8-8h4l8 8"/><path fill="#eaf8ff" d="m2 5 10 8L22 5"/>',
    starred: '<path fill="#ffd351" d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
    drafts: '<path fill="#edf5f4" d="M4 2h10l5 5v15H4z"/><path fill="#aac3cc" d="M14 2v6h5"/><path fill="#dec581" d="m8 18 2-5 10-8 2 3-10 8z"/>',
    archive: '<path fill="#ca9541" d="M2 8h20v13H2z"/><path fill="#e4b657" d="M1 6h22v6H1zM7 2h10v4H7z"/><path fill="#f0d78e" d="M9 13h6l-3 3z"/>',
    junk: '<path fill="#d6a44f" d="m9 2 4 2-1 5 5-1 4 4-4 4 1 5-5 1-3-5-5 2-3-4 5-4-2-4z"/>',
    trash: '<path fill="#c5c7c0" d="M5 6h14l-1 16H6z"/><path fill="#e1e0d7" d="M3 4h18v3H3zM8 2h8v2H8z"/><path d="M9 10v9m3-9v9m3-9v9"/>',
  };

  env.widget({
    task: 'use-email',
    site: 'design-use-email-nl-07',
    name: 'design',
    split: 'train',
    scenarios: ['nl'],
    template: 'use-email/mail',
    design: {
      folderList: ['inbox', 'starred', 'sent', 'drafts', 'archive', 'junk', 'trash'],
      rowHeight: 41,
      foldersTitle: 'Mail Folders',
      scrollToRowIcon: false,
      locateScrollKinds: ['folder', 'moveTo'],
      parts: {
        rootDecor: (base, S) => (ctx) => {
          base(ctx);
          S.els.root.dataset.task = S.spec.task;
        },
        icon: (base, S) => (k) =>
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          (FOLDER_ART[k] || '<path d="' + (S.paths[k] || S.paths.mail) + '"/>') +
          '</svg>',
        rowHeightPx: (base, S) => (avail) =>
          Math.floor(Math.max(16, Math.min((S.D.rowHeight * S.els.root.clientWidth) / 1150, avail / S.spec.rows))),
        listSize: (base, S) => (avail, rowH) => {
          S.els.listWrap.style.flex = 'none';
          S.els.listWrap.style.height = Math.min(avail, rowH * S.spec.rows) + 'px';
        },
        rowsBuilt: (base, S) => (m, order, rowH, avail) => {
          base(m, order, rowH, avail);
          S.els.listWrap.classList.toggle('scroll-needed', order.length * rowH > avail);
        },
        listboxOptions: (base) => (...args) => {
          const options = base(...args);
          const onChange = options.onChange;
          options.onChange = (v, i) => onChange(v, Number(i));
          return options;
        },
        folderIcon: (base, S) => (v) => {
          const icons = { inbox: 'mail', sent: 'sent', drafts: 'drafts', starred: 'starred', trash: 'trash', junk: 'junk' };
          return icons[v] || (S.paths[v] ? v : 'move');
        },
        paintFolders: (base, S) => (m) => {
          base(m);
          for (const [v, b] of S.els.folderButtons) {
            const count = v === 'inbox' ? m.box.filter((x) => x === 'inbox').length : v === 'drafts' && m.compose ? 1 : null;
            b.querySelector('span').textContent = (S.D.folderLabels[v] || S.fam.helpers.viewLabel(v)) +
              (count !== null ? ' (' + count + ')' : '');
          }
        },
        docMeta: (base, S) => (meta, e) => {
          for (const [k, v] of [
            ['From: ', e.name + ' <' + e.addr + '>'],
            ['Subject: ', e.subject],
            ['Date: ', e.time],
          ]) {
            const line = S.el('div', '', meta);
            S.el('b', '', line, k);
            line.append(v);
          }
          if (e.cc.length) S.el('div', '', meta, 'Cc: ' + e.cc.map((x) => x.name).join(', '));
        },
        paintClasses: (base, S) => (m) => {
          base(m);
          S.els.root.classList.toggle('search-task', S.spec.task === 'search' || !!S.spec.search);
        },
        painted: (base, S) => (m) => {
          base(m);
          for (const op of ['reply', 'replyall', 'forward'])
            S.els.reg.set('action:' + op, S.els.reg.get('toolbar:' + op));
        },
        locateSearch: (base, S) => (t) => {
          if (t.search) {
            S.els.root.classList.add('search-task');
            return S.center(S.els.search);
          }
        },
      },
    },
  });
})();
