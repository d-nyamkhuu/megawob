// Book-themed mail design with a sidebar Compose button, illustrated empty state and a bounded message viewport.
(function () {
  'use strict';
  const BOOKS='<svg viewBox="0 0 120 100" aria-hidden="true"><defs><pattern id="engrave" width="4" height="6" patternUnits="userSpaceOnUse"><path d="m0 1 2 2m1 2 2 2" fill="none" stroke="#756459" stroke-width=".45"/></pattern></defs><ellipse cx="60" cy="94" rx="57" ry="3" fill="#a39583" opacity=".22"/><g stroke="#695044" stroke-width="1.5" fill="#faf7ef"><g transform="rotate(12 20 92)"><path d="M12 22q8-3 14 0v69q-7 3-14 0z"/><path d="M14 28h10v10H14zm0 16h10v32H14zm0 39h10v5H14z" fill="url(#engrave)"/><path d="m16 32 6 2m-6 15 5 1m-5 7 5 1m-5 7 5 1" stroke-width=".8"/></g><g><path d="M32 7q8-3 17 0v86q-8 3-17 0z"/><path d="M35 12h11v8H35zm0 20h11v43H35zm0 47h11v10H35z" fill="url(#engrave)"/><path d="M32 23h17m-17 5h17m-17 49h17m-17 13h17M39 36v34m3-34v34" stroke-width=".8"/><path d="M33 7q8 4 15 0"/></g><g><path d="M50 8q8-2 15 0v85q-8 4-15 0z"/><path d="M53 14h9v12h-9zm0 24h9v43h-9z" fill="url(#engrave)"/><path d="M50 30h15m-15 5h15m-15 48h15m-15 5h15M55 17h5m-5 5h5" stroke-width=".8"/></g><g><path d="M66 5q8-2 17 0v88q-8 4-17 0z"/><path d="M69 12h11v12H69zm0 30h11v33H69zm0 46h11v-7H69z" fill="url(#engrave)"/><path d="M66 28h17m-17 5h17m-17 45h17m-17 15h17M73 44v28m3-28v28" stroke-width=".8"/></g><g transform="rotate(-8 93 93)"><path d="M85 12q6-2 12 0v81q-6 3-12 0z"/><path d="M88 19h6v12h-6zm0 22h6v39h-6z" fill="url(#engrave)"/><path d="M85 35h12m-12 3h12m-12 44h12m-12 5h12" stroke-width=".8"/></g><g transform="rotate(-15 108 92)"><path d="M100 32h9v60h-9z"/><path d="M102 40h5v36h-5z" fill="url(#engrave)"/><path d="M100 36h9m-9 45h9m-9 6h9" stroke-width=".8"/></g></g></svg>';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-nl-06',
    name: 'design',
    split: 'train',
    scenarios: ['nl'],
    template: 'use-email/mail',
    design: {
      rowHeight: 41.5,
      foldersTitle: 'Mailboxes',
      ledgerTitle: 'Mail',
      newIn: 'folders',
      newClass: 'compose',
      searchPlaceholder: 'Search mail...',
      columns: ['From', 'Subject', 'Received ▾', ''],
      parts: {
        rootDecor: (base, S) => (ctx) => {
          base(ctx);
          S.el('div', 'frame', S.els.root);
        },
        newButton: (base) => () => {
          const b = base();
          b.querySelector('span').textContent = 'Compose';
          return b;
        },
        searchMade: (base, S) => () => {
          const b = S.el('button', 'search-go', S.els.searchline);
          b.type = 'button';
          b.setAttribute('aria-label', 'Search');
          b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M15 15l6 6"/></svg>';
        },
        snapped: (base, S) => () => {
          const { el } = S;
          const { root, folders, doc } = S.els;
          for (const p of ['Sent', 'Drafts']) {
            const b = el('button', 'folder decor folder-' + p.toLowerCase(), folders);
            b.type = 'button';
            el('span', '', b, p);
            b.addEventListener('click', () => env.log('decoy', { label: p }));
          }
          el('div', 'side-rule', folders);
          el('div', 'side-books', folders).innerHTML = BOOKS;
          el('div', 'side-quote', folders, 'Good books build great communities.”');
          el('div', 'side-rule short', folders);
          const empty = el('div', 'empty-state', doc);
          el('div', 'es-books', empty).innerHTML = BOOKS;
          el('div', 'es-text', empty, 'Select a message to read.');
          el('div', 'es-rule', empty);
          el('div', 'es-quote', empty, '“A quieter world is a wiser world.”');
          el('div', 'es-anon', empty, '— Anonymous');
          root.classList.toggle('task-reply', ['reply', 'forward'].includes(S.spec.task));
          const mark = el('div', 'irix-watermark', root);
          mark.innerHTML = 'I R I X<small>◇ silicon graphics</small>';
          const mountain = el('div', 'irix-mountain', root);
          mountain.innerHTML =
            '<svg viewBox="0 0 600 300" style="width:100%;height:100%;fill:#26344c;stroke:none" preserveAspectRatio="none"><path d="M0 300V210L80 120l30 22 70-130 105 128 35-18 100 110 45-22 135 90Z"/>' +
            '<path d="M0 300V250l100-55 90 60 88-60 44 53 99-35 80 55 99-10v42" fill="#18253b"/></svg>';
        },
        listSized: (base, S) => (m, order, rowH) => {
          const { list, listWrap, track } = S.els;
          list.style.bottom = 'auto';
          list.style.height = Math.min(rowH * S.spec.rows, listWrap.clientHeight) + 'px';
          track.style.bottom = 'auto';
          track.style.height = list.style.height;
        },
        rowsBuilt: (base, S) => (m, order, rowH) => {
          S.els.listWrap.classList.toggle('overflowing', rowH * order.length > S.els.list.clientHeight);
        },
      },
    },
  });
})();
