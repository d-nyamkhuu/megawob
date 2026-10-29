// Design of this site on the use-email/mail template (templates/use-email/mail.js): a sidebar with mail counts, a
// search line on the surface and a compact message header.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-reply-07',
    name: 'design',
    split: 'train',
    scenarios: ['star-reply'],
    template: 'use-email/mail',
    design: {
      rowHeight: 46,
      folderList: ['inbox', 'sent', 'drafts', 'archive', 'junk', 'trash'],
      foldersTitle: 'Mail',
      searchIn: 'root',
      searchPlaceholder: 'Search...',
      replyPlaceholder: '',
      paths: {
        inbox: 'M3 5h18v14H3z M3 5l9 7 9-7',
        sent: 'M22 2 11 13 M22 2l-7 20-4-9-9-4z',
        drafts: 'M5 2h9l5 5v15H5z M14 2v6h5 M8 12h8 M8 16h8',
        junk: 'M12 3 2 21h20z M12 10v5 M12 18v1',
        trash: 'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
      },
      parts: {
        folderMade: (base, S) => (v, b) => {
          if (['inbox', 'sent', 'drafts'].includes(v)) S.el('span', 'count', b);
        },
        paintFolders: (base, S) => (m) => {
          for (const [v, b] of S.els.folderButtons) {
            b.classList.toggle('active', (m.view || 'inbox') === v);
            const count = b.querySelector('.count');
            if (count)
              count.textContent =
                v === 'inbox' ? m.box.filter((x) => x === 'inbox').length : v === 'sent' ? m.sent.length : m.compose ? 1 : 0;
          }
        },
        docMeta: (base, S) => (meta, e) => {
          const { el } = S;
          el('h2', '', meta, e.subject);
          const mh = el('div', 'mhead', meta);
          el('span', 'avatar', mh, e.name.slice(0, 1).toUpperCase());
          const who = el('div', 'who', mh);
          el('strong', '', who, e.name);
          el('div', 'recipient-line', who, 'to me' + (e.cc.length ? ', ' + e.cc.map((x) => x.name).join(', ') : ''));
          el('div', 'when', mh, e.time);
        },
        editorTitleMade: (base, S) => (title, shown) => {
          if (shown.mode === 'reply') {
            const nm = S.spec.emails[shown.of ?? 0].name;
            title.textContent = '';
            title.append('Reply to ');
            S.el('strong', '', title, nm);
          }
        },
        editorFormat: (base, S) => () => {
          const { el } = S;
          const fmt = el('div', 'formatbar', S.els.editor);
          for (const s of ['B', 'I', 'U']) el('span', '', fmt, s);
          for (const d of [
            'M3 6h1 M3 12h1 M3 18h1 M8 6h13 M8 12h13 M8 18h13',
            'M2 5h2v5 M2 10h4 M2 14h4l-4 6h4 M9 6h12 M9 12h12 M9 18h12',
            'M10 13a4 4 0 0 0 6 0l4-4a4 4 0 0 0-6-6l-2 2 M14 11a4 4 0 0 0-6 0l-4 4a4 4 0 0 0 6 6l2-2',
          ]) {
            const a = el('span', 'format-icon', fmt);
            a.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>';
          }
        },
        cancelButton: (base, S) => (acts) => S.button(acts, 'Cancel', 'compose:discard', { discard: true }, 'close', 'discard'),
        cancelMade: (base, S) => (acts) => {
          const clip = S.el('span', 'paperclip', acts);
          clip.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 7v11a4 4 0 0 0 8 0V5a3 3 0 0 0-6 0v12a1 1 0 0 0 2 0V7"/></svg>';
        },
      },
    },
  });
})();
