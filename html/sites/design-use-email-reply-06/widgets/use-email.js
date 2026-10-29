// CityMail keeps the shared reply template while restoring its toolbar, message header, editor, and compact list.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-reply-06',
    name: 'design',
    split: 'train',
    scenarios: ['reply'],
    template: 'use-email/mail',
    design: {
      rowHeight: 99,
      folderList: ['inbox', 'starred', 'important', 'archive', 'trash'],
      searchPlaceholder: 'Search',
      fieldColon: true,
      paths: {
        new: 'M18 12v9H3V6h9 M10 15l1-5L20 1l3 3-9 9z M18 3l3 3',
        forward: 'M14 5l7 6-7 6v-4c-6 0-9 1-11 6 1-8 5-11 11-11z',
      },
      toolbarBefore: [['Flag', 'important', 'native-flag']],
      parts: {
        toolbarMade: (base, S) => () => {
          base();
          S.el('span', 'flag-chevron', S.els.toolbar.querySelector('.native-flag'), '⌄');
        },
        occupiedKeep: (base, S) => (v) => v !== S.els.listWrap && getComputedStyle(v).position !== 'absolute',
        availHeight: (base, S) => (occupied) =>
          Math.max(40, S.els.ledger.clientHeight - parseFloat(getComputedStyle(S.els.ledger).paddingTop) - occupied),
        rowHeightPx: (base, S) => (avail, order) => {
          const scale = S.ctx.stage.clientWidth / 1672;
          return Math.floor(
            order.length > S.spec.rows
              ? avail / S.spec.rows
              : Math.min(avail / S.spec.rows, Math.max(22, (S.D.rowHeight + 6) * scale)),
          );
        },
        listSize: (base, S) => (avail, rowH) => {
          S.els.listWrap.style.flex = 'none';
          S.els.listWrap.style.height = Math.min(avail, rowH * S.spec.rows) + 'px';
        },
        docMeta: (base, S) => (meta, e) => {
          for (const [label, value] of [
            ['From', e.name],
            ['To', S.spec.me.name + S.cc(e)],
            ['Subject', e.subject],
          ]) {
            const row = S.el('div', 'message-header-row', meta);
            S.el('span', 'message-header-label', row, label + ':');
            const val = S.el('span', 'message-header-value', row, value);
            if (label === 'From') {
              val.classList.add('address-pill');
              val.title = e.addr;
              S.el('span', 'message-date', row, e.time);
            }
          }
        },
        docPainted: (base, S) => (m, i) => {
          base(m, i);
          S.els.doc.querySelector('.window-title').firstChild.textContent = S.spec.emails[i].subject;
        },
        editorTitleText: (base) => (shown) => shown.subject,
        editorFormat: (base, S) => () => {
          const fmt = S.el('div', 'formatbar', S.els.editor);
          for (const [cls, label] of [
            ['font-control', 'Helvetica'],
            ['size-control', '12'],
            ['bold-control', 'B'],
            ['italic-control', 'I'],
            ['underline-control', 'U'],
            ['color-control', '■'],
            ['align-control', 'left'],
            ['align-control', 'center'],
            ['align-control', 'right'],
            ['list-control', 'list'],
            ['more-control', '›'],
          ]) {
            const b = S.el('button', cls, fmt, label);
            b.type = 'button';
            b.setAttribute('aria-label', label);
            if (['left', 'center', 'right', 'list'].includes(label))
              b.innerHTML =
                '<svg viewBox="0 0 24 24"><path d="' +
                {
                  left: 'M3 5h18 M3 10h12 M3 15h18 M3 20h12',
                  center: 'M3 5h18 M6 10h12 M3 15h18 M6 20h12',
                  right: 'M3 5h18 M9 10h12 M3 15h18 M9 20h12',
                  list: 'M8 5h13 M8 12h13 M8 19h13 M2 5h1 M2 12h1 M2 19h1',
                }[label] +
                '"/></svg>';
          }
        },
      },
    },
  });
})();
