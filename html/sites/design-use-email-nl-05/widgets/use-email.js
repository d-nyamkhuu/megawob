// Design of this site on the use-email/mail template (templates/use-email/mail.js): irix desktop with a window
// menu bar whose File entry is the folder switch, desktop icons, and a message panel with scroll buttons.
// Desktop icon art.
(function () {
  'use strict';
  const art = {
    new: '<path d="M5 2h10l5 5v15H5z" fill="white"/><path d="M15 2v5h5"/><path d="M8 11h9M8 14h9M8 17h9M8 20h7" stroke="#9696c7"/>',
    reply: '<path d="M10 4 2 12l8 8v-6h12v-4H10z" fill="#7622cb"/><path d="M12 11h9v2h-9" stroke="white"/>',
    replyall: '<path d="m8 4-7 8 7 8v-5h13v-6H8z" fill="#7e24bb"/><path d="m15 4-7 8 7 8v-6h8v-4h-8z" fill="#a63cce"/>',
    forward: '<path d="m14 4 8 8-8 8v-6H2v-4h12z" fill="#173bce"/><path d="M3 11h11" stroke="white"/>',
    delete: '<path d="m4 3 8 8 8-8 2 2-8 8 8 8-2 2-8-8-8 8-2-2 8-8-8-8z" fill="#eb1616"/>',
    print: '<path d="M6 2h13v7H6z" fill="white"/><path d="m8 4-2 6h12l3-5" fill="#ddd"/><path d="M3 10h18v10H3z" fill="#aaa"/><path d="M5 12h14v3H5z" fill="white"/><path d="M7 16h11v7H7z" fill="white"/><path d="M9 18h7M9 20h7M9 22h7"/><path d="M10 4h6l-1 3H9z" fill="#3154b2"/>',
    computer: '<path d="M4 1h17v17H4z" fill="#ddd"/><path d="M6 3h13v11H6z" fill="#000080"/><path d="M9 7h6v4H9z" fill="white"/><path d="M1 19h22v4H1zM6 16h12v3H6z" fill="#ddd"/><path d="M3 20h17M5 22h14"/>',
    folder: '<path d="M2 6V3h8l3 3h9v17H2z" fill="#ffff8a"/><path d="M3 9h17v13H3z" fill="#fff597"/><path d="M3 7h17" stroke="white"/>',
    notepad: '<path d="M6 2h16l-3 21H2z" fill="#fff"/><path d="M7 1v4M10 1v4M13 1v4M16 1v4M19 1v4"/><path d="M6 7h13M5 10h13M5 13h12M4 16h12M4 19h11" stroke="#6faaa5"/>',
    bin: '<path d="m3 5 10-4 9 5-3 16-7 2-7-4z" fill="#ddd"/><path d="m3 5 9 5 10-4M12 10v14"/><path d="m8 11-2 3 2 3m0-3 4 1m3-4 3 3-2 3m2-3-4 1" stroke="#00864e"/>'
  };
  env.widget({
    task: 'use-email',
    site: 'design-use-email-nl-05',
    name: 'design',
    split: 'train',
    scenarios: ['nl'],
    template: 'use-email/mail',
    design: {
      rowHeight: 31,
      decor: null,
      keyboard: true,
      newLabel: 'New',
      toolbarBefore: [['Print', 'print']],
      columns: ['From', 'Subject', 'Received', ''],
      replyPlaceholder: '',
      forwardPlaceholder: '',
      importantIcon: 'important',
      scrollToRowIcon: false,
      rowBasis: 'stage',
      parts: {
        icon: (base, S) => (k) =>
          '<svg viewBox="0 0 24 24" aria-hidden="true">' + (art[k] || '<path d="' + (S.paths[k] || S.paths.mail) + '"/>') + '</svg>',
        rootDecor: (base, S) => (ctx) => {
          S.els.root.dataset.task = S.spec.task;
          base(ctx);
        },
        docMade: (base, S) => () => {
          const rail = S.el('div', 'document-scroll', S.els.doc);
          for (const [label, dy] of [
            ['▲', -80],
            ['▼', 80],
          ]) {
            const b = S.el('button', '', rail, label);
            b.type = 'button';
            b.setAttribute('aria-label', dy < 0 ? 'Scroll message up' : 'Scroll message down');
            b.addEventListener('click', () => {
              const c = S.els.doc.querySelector('.message-content');
              if (c) c.scrollTop += dy;
            });
          }
        },
        snapped: (base, S) => () => {
          const { el, button } = S;
          const { root, folders } = S.els;
          for (const [label, ic] of [
            ['Console', 'file'],
            ['Files', 'move'],
            ['Mail', 'mail'],
            ['Web', 'unread'],
            ['Help', 'important'],
          ])
            button(folders, label, null, null, ic, 'toolchest-icon');
          const mark = (S.els.mark = el('div', 'irix-watermark', root));
          mark.innerHTML =
            '<div class="wt">Mail - Inbox<span class="wb"><i>_</i><i>□</i><i>✕</i></span></div><div class="wm"><span>File</span><span>Edit</span><span>View</span><span>Tools</span><span>Message</span><span>Help</span></div>';
          mark.querySelector('.wm span').style.pointerEvents = 'auto';
          mark.querySelector('.wm span').addEventListener('click', () => S.navToggle());
          mark.querySelector('.wm span:nth-child(3)').style.pointerEvents = 'auto';
          mark.querySelector('.wm span:nth-child(3)').addEventListener('click', () => root.classList.toggle('details'));
          const mountain = el('div', 'irix-mountain', root);
          mountain.innerHTML = [
            ['computer', 'Program<br>Manager'],
            ['folder', 'File Manager'],
            ['notepad', 'Notepad'],
            ['bin', 'Recycle Bin'],
          ]
            .map(
              ([ic, label], i) =>
                '<div class="di" style="top:' + [18, 153, 277, 406][i] + 'px"><i>' + S.P.icon(ic) + '</i>' + label + '</div>',
            )
            .join('');
        },
        navReady: (base, S) => () => {
          const { mark, navTrigger } = S.els;
          mark.querySelector('.wm span:first-child').replaceWith(navTrigger);
          navTrigger.textContent = 'File';
          navTrigger.classList.add('menu-folder-trigger');
          navTrigger.setAttribute('role', 'button');
        },
        occupiedSize: () => (v) => {
          const cs = getComputedStyle(v);
          return v.getBoundingClientRect().height + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0);
        },
        rowHeightPx: (base, S) => (avail) =>
          Math.min(
            Math.floor(Math.max(20, (S.D.rowHeight * S.ctx.stage.clientWidth) / 1672)),
            Math.max(14, Math.floor(avail / S.spec.rows)),
          ),
        listSize: (base, S) => (avail, rowH, order) => {
          const listHeight = Math.min(rowH * S.spec.rows, Math.floor(avail / rowH) * rowH);
          S.els.listWrap.style.flex = 'none';
          S.els.listWrap.style.height = listHeight + 'px';
          S.els.listWrap.classList.toggle('no-scroll', order.length * rowH <= listHeight);
        },
        docMeta: (base, S) => (meta, e) => {
          const { el, cc } = S;
          for (const [l, v] of [
            ['From:', e.name],
            ['Subject:', e.subject],
            ['Date:', e.time],
          ]) {
            const d = el('div', '', meta);
            el('b', '', d, l);
            d.append(v);
          }
          el('div', 'message-details', meta, '<' + e.addr + '> · To: ' + S.spec.me.name + cc(e));
        },
      },
    },
  });
})();
