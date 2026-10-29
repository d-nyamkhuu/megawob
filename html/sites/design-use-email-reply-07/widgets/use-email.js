// Design of this site on the use-email/mail template (templates/use-email/mail.js): toolbar and search line on the
// surface, a two-group toolbar with separators, avatars in the list and the message header.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-reply-07',
    name: 'design',
    split: 'train',
    scenarios: ['reply'],
    template: 'use-email/mail',
    design: {
      rowHeight: 99,
      toolbarIn: 'root',
      searchIn: 'root',
      listStatusIn: 'root',
      newLabel: 'New Email',
      newIcon: 'mail',
      toolbarOps: [['Reply', 'reply'], ['Reply All', 'replyall'], ['Forward', 'forward']],
      searchPlaceholder: 'Search emails...',
      formatKeys: ['B', 'I', 'U'],
      paths: {
        tag: 'M3 3h8l10 10-8 8L3 11z M7.5 7.5h.01',
        flag: 'M5 22V4 M5 4h14l-3 5 3 5H5',
        list: 'M9 6h11 M9 12h11 M9 18h11 M4.5 6h.01 M4.5 12h.01 M4.5 18h.01',
        link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
        smile: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 14s1.5 2 4 2 4-2 4-2 M9 9.5h.01 M15 9.5h.01',
        attach: 'M21 11l-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8',
        reply: 'm10 5-7 6 7 6 M3 11h9c6 0 9 3 9 9',
        replyall: 'm8 5-7 6 7 6 M14 5l-7 6 7 6 M7 11h6c6 0 9 3 9 9',
        forward: 'm14 5 7 6-7 6 M21 11H10c-6 0-8 3-8 7',
        send: 'm2 9 20-7-7 20-4-9-9-4z M11 13 22 2',
        move: 'M2 8V5h7l3 3 M2 8h20v13H2z',
        numbered: 'M9 6h12 M9 12h12 M9 18h12 M3 4h1v4 M2 11q3-2 3 0l-3 3h3 M2 17h3l-2 2h2v2H2',
      },
      parts: {
        toolbarStar: (base, S) => () => {
          const { el, button, action, ctx } = S;
          const { toolbar } = S.els;
          el('span', 'sep', toolbar);
          for (const [label, op, ic] of [
            ['Delete', 'delete', 'delete'],
            ['Archive', 'archive', 'archive'],
            ['Mark Unread', 'unread', 'unread'],
            ['Flag', 'star', 'flag'],
          ])
            button(toolbar, label, 'toolbar:' + op, () => action(op, ctx.model.open ?? 0), ic);
          el('span', 'sep', toolbar);
          button(toolbar, 'Move', 'toolbar:move', () => action('move', ctx.model.open ?? 0), 'move', 'chev');
          button(toolbar, 'Tags', null, null, 'tag', 'chev');
          el('span', 'sep search-sep', toolbar);
          base();
        },
        rowHeightPx: (base, S) => () => Math.max(22, Math.round((S.D.rowHeight * S.ctx.size.width) / 1672)),
        listSize: (base, S) => (avail) => {
          S.els.listWrap.style.flex = 'none';
          S.els.listWrap.style.height = avail + 'px';
        },
        rowHead: (base, S) => (r, e) =>
          S.el('span', 'avatar', r, e.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()),
        // The task's scroll offset counts rows in a spec.rows viewport. Extra room in this design must not clamp
        // scrolling before that logical last page.
        rowsBuilt: (base, S) => (m, order, rowH, avail) => {
          S.els.list.style.paddingBottom = Math.max(0, avail - S.spec.rows * rowH) + 'px';
        },
        foldersMade: (base, S) => () => {
          const { folders, folderButtons } = S.els;
          // These two reference tabs are frame; scored mailboxes retain their own names.
          for (const label of ['Sent', 'Drafts']) {
            const tab = S.button(folders, label, null, null, null, 'folder reference-tab');
            folders.insertBefore(tab, folderButtons.get('archive'));
            tab.addEventListener('click', () => env.log('decoy', { label }));
          }
        },
        docMeta: (base, S) => (meta, e) => {
          const { el, cc } = S;
          el('h2', '', meta, e.subject);
          el('span', 'avatar', meta, e.name[0].toUpperCase());
          const fr = el('div', 'from', meta);
          el('b', '', fr, e.name);
          fr.append(' <' + e.addr + '>');
          el('div', 'to', meta, 'To: ' + S.spec.me.name + cc(e));
          el('div', 'stamp', meta, e.time);
        },
        editorFormat: (base, S) => () => {
          const { el, P } = S;
          const fmt = el('div', 'formatbar', S.els.editor);
          for (const s of ['B', 'I', 'U']) el('span', '', fmt, s);
          for (const k of ['list', 'numbered', 'link', 'smile']) el('span', '', fmt).innerHTML = P.icon(k);
          el('span', 'attach', fmt).innerHTML = P.icon('attach');
        },
        editorMade: (base, S) => (m, shown) => {
          const { reg } = S.els;
          const toInput = reg.get('field:to');
          if (toInput) {
            const row = toInput.parentElement;
            let addr = row.querySelector('.recipient-address');
            if (!addr) addr = S.el('span', 'recipient-address', row);
            const to = shown.to;
            const recipient = S.spec.emails.find((e) => e.name === to);
            addr.textContent = recipient ? ' <' + recipient.addr + '>' : '';
            const measure = S.el('span', 'recipient-measure', row, shown.to || '');
            toInput.style.width = Math.max(30, measure.getBoundingClientRect().width + 3) + 'px';
            measure.remove();
            addr.hidden = !recipient;
          }
        },
      },
    },
  });
})();
