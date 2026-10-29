// Thunderbird design with folder counts, importance status, tabular message metadata and attachment sizes.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-important-04',
    name: 'design',
    split: 'train',
    scenarios: ['important'],
    template: 'use-email/mail',
    design: {
      rowHeight: 59,
      folderList: ['inbox', 'sent', 'drafts', 'archive', 'trash'],
      importantLabel: 'Mark Important',
      toolbarAfter: [['Print', 'print'], ['Search', 'search']],
      paths: {
        sent: 'm21 3-19 8 7 3 3 7z M9 14 21 3',
        drafts: 'M5 2h9l5 5v15H5z M14 2v6h5',
        search: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14z m5 12 6 6',
        new: 'M4 2h10l4 4v5 M4 2v20h13v-6 M14 2v5h4 M10 16l9-11 2 2-9 11-4 2z M17 7l2 2',
        reply: 'M3 6h7l2 3h10l-2 13H2z M3 6v16 M3 9h19',
        inbox: 'M5 4h14l3 9v7H2v-7z M2 12h6l2 3h4l2-3h6',
        archive: 'M3 3h18l1 5H2z M3 8v13h18V8 M9 8v4h6V8',
        trash: 'M3 5h18v2H3z M9 5V2h6v3 M5 7l1 15h12l1-15 M9 10v9 M12 10v9 M15 10v9',
        delete: 'M3 5h18v2H3z M9 5V2h6v3 M5 7l1 15h12l1-15 M9 10v9 M12 10v9 M15 10v9',
        print: 'M6 9V2h12v7 M6 18H2V9h20v9h-4 M6 14h12v8H6z M8 17h8 M17 5h.1',
        clip: 'M8 16l9-10c3-3 6 0 3 3L10 20c-5 5-10-1-6-5L15 3c4-4 10 1 6 5L10 20 M8 16l9-10',
      },
      parts: {
        paintFolders: (base, S) => (m) => {
          base(m);
          for (const [v, b] of S.els.folderButtons) {
            let c = b.querySelector('.count');
            if (!c) c = S.el('span', 'count', b);
            c.textContent = S.spec.emails.reduce((n, _, i) => n + (m.box[i] === v ? 1 : 0), 0);
          }
        },
        toolsStart: (base, S) => (d) => {
          base(d);
          const impState = S.el('div', 'imp-state', d.tools);
          impState.innerHTML = S.P.icon('star');
          S.el('span', '', impState, '');
        },
        docMeta: (base, S) => (meta, e) => {
          for (const [k, v] of [
            ['From:', e.name],
            ['To:', S.spec.me.name + S.cc(e)],
            ['Subject:', e.subject],
            ['Date:', e.time],
          ]) {
            const r = S.el('div', 'meta-row', meta);
            S.el('b', '', r, k);
            const vv = S.el('span', '', r, v);
            if (k === 'From:') vv.title = '<' + e.addr + '>';
          }
        },
        attachment: (base, S) => (content, a) => {
          const b = S.el('div', 'attachment', content);
          b.innerHTML = S.P.icon('clip');
          S.el('span', '', b, a.file);
          S.el('span', 'attachment-size', b, a.size);
        },
        docFlags: (base, S) => (m, i) => {
          base(m, i);
          const ist = S.els.docInside.querySelector('.imp-state');
          if (ist) {
            const on = !!m.flags[i].important;
            ist.classList.toggle('on', on);
            ist.lastChild.textContent = on ? 'Important' : 'Not important';
          }
        },
      },
    },
  });
})();
