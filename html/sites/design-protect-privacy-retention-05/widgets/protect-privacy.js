// Design on the protect-privacy/classic template.
function nimbusCategory(P, row, c) {
  const box = row.querySelector('.sp-box');
  if (!box) return;
  row.replaceChildren(box);
  row.classList.add('sp-ret-category');
  const copy = P.element('span', 'sp-ret-copy', row);
  P.element('strong', '', copy, c.label);
  const name = c.label.toLowerCase();
  const description = /photo|video/.test(name) ? 'Photos and videos in your Photo library.'
    : /contact/.test(name) ? 'People you’ve saved in Nimbus Drive.'
    : /message/.test(name) ? 'Messages you’ve sent and received through Nimbus Drive.'
    : /comment/.test(name) ? 'Comments you’ve posted on files and photos.'
    : /review/.test(name) ? 'Reviews you’ve written for apps, devices and other products.'
    : /poll|vote/.test(name) ? 'Your votes in Nimbus Drive polls.'
    : /shared|sharing/.test(name) ? 'Items you’ve shared with other people.'
    : /group/.test(name) ? 'Groups you’ve created or joined.'
    : /\bfiles?\b|folder/.test(name) ? 'Documents, photos and other files you’ve stored in Nimbus Drive.'
    : /profile/.test(name) ? 'Your profile information and account preferences.'
    : /calendar|event/.test(name) ? 'Events and appointments in your calendar.'
    : /payment|billing/.test(name) ? 'Your payment history and billing records.'
    : /playlist/.test(name) ? 'Music playlists you’ve created and saved.'
    : /watch/.test(name) ? 'Videos you’ve watched in Nimbus Drive.'
    : /search/.test(name) ? 'Your searches in Nimbus Drive.'
    : /activity|login/.test(name) ? 'Sign-in history and other account activity logs.'
    : 'Information you’ve saved in Nimbus Drive.';
  P.element('small', '', copy, description);
}
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-retention-05',
  name: 'design',
  split: 'train',
  scenarios: ['retention'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      frame: (base, S) => (ctx) => {
        const win = base(ctx);
        Object.assign(win.style, {
          left: '0px', top: '0px',
          width: `${ctx.size.width}px`, height: `${ctx.size.height}px`,
        });
        return win;
      },
      tabs: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove();
      },
      address: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove();
      },
      downloadRow: (base, S) => (dl, c, m) => {
        const P = S.P;
        const i = S.spec.cats.indexOf(c);
        const row = P.key(P.element('div', 'sp-cb sp-ret-category', dl), `dl:${c.id}`);
        P.element('span', `sp-box${m.dl[c.id] ? ' on' : ''}`, row, m.dl[c.id] ? '✓' : '');
        const name = String(c.label).toLowerCase();
        const icon = /photo|video|image/.test(name) ? '▧' : /contact|people/.test(name) ? '♧'
          : /message|comment/.test(name) ? '◯' : /calendar|event/.test(name) ? '▦'
          : /setting|profile|account/.test(name) ? '⚙' : /file|folder/.test(name) ? '▤' : '▣';
        P.element('span', 'sp-ret-icon', row, icon);
        const copy = P.element('span', 'sp-ret-copy', row);
        P.element('strong', '', copy, c.label);
        const description = /photo|video|image/.test(name) ? 'Photos, videos and album data'
          : /contact|people/.test(name) ? 'People you’ve saved or imported'
          : /message|comment/.test(name) ? 'Messages and comments'
          : /calendar|event/.test(name) ? 'Events and meeting details'
          : /setting|profile|account/.test(name) ? 'Profile, preferences and other settings'
          : /file|folder/.test(name) ? 'All files you’ve stored in Umbra Storage'
          : /payment|billing/.test(name) ? 'Payment and billing details'
          : /location|place/.test(name) ? 'Places and location history'
          : /search/.test(name) ? 'Your recent searches' : /watch/.test(name) ? 'Your viewing activity' : 'Personal account data';
        if (S.ctx.size.height >= 500) P.element('small', '', copy, description);
        const size = /photo|video|image/.test(name) ? '3.4 GB' : /contact|people/.test(name) ? '1.2 MB'
          : /message|comment/.test(name) ? '152 MB' : /calendar|event/.test(name) ? '421 KB'
          : /setting|profile|account/.test(name) ? '356 KB' : /file|folder/.test(name) ? '1.8 GB'
          : /payment|billing/.test(name) ? '28 MB' : /location|place/.test(name) ? '84 MB'
          : /search/.test(name) ? '16 MB' : /watch/.test(name) ? '920 MB' : '12 MB';
        P.element('span', 'sp-ret-size', row, size);
        nimbusCategory(P, row, c);
      },
      deletionRow: (base, S) => (del, c, m) => {
        base(del, c, m);
        nimbusCategory(S.P, del.lastElementChild, c);
      },
      view: (base, S) => (m) => {
        const P = S.P;
        const app = S.app;
        const acct = P.element('div', 'sp-acct', app);
        P.navigation(acct);
        const main = P.element('div', 'sp-acct-main', acct);
        const title = P.element('div', 'sp-page-title', main);
        P.element('h1', '', title, 'Data & privacy');
        P.element('p', '', title, 'Manage the data associated with your Nimbus Drive account. You can download a copy or delete specific types of data.');
        const insp = P.element('aside', 'ret-insp', acct);
        P.element('h3', '', insp, 'Account details');
        for (const [k, v] of [['Name', 'Taylor Brooks'], ['Email', 'taylor.brooks@nimbusdrive.com'], ['Member since', 'Mar 14, 2007'], ['Account type', 'Basic (5 GB)']]) {
          const f = P.element('div', 'ret-f', insp);
          P.element('div', '', f, k);
          P.element('div', '', f, v);
        }
        P.element('h4', '', insp, 'Storage usage');
        P.element('div', 'ret-bar', insp).appendChild(document.createElement('i'));
        P.element('div', 'ret-used', insp, '1.2 GB of 5 GB used.');
        P.element('h4', '', insp, 'Related settings');
        for (const t of ['Edit personal information', 'Change password', 'Manage connected applications', 'View account activity']) P.element('a', 'ret-lnk', insp, t);

        const grid = P.element('div', 'sp-ret-grid', main);
        const left = P.element('section', 'sp-ret-categories', grid);
        left.style.cssText = 'display:flex;flex-direction:column;min-height:0';
        P.element('h2', '', left, S.spec.mode === 'delete' ? 'Select data to delete' : 'Select data to download');
        const cols = P.element('div', 'sp-ret-list', left);
        cols.style.cssText = 'flex:1;min-height:120px;overflow:auto';
        P.download(cols, m, (id) => S.spec.cats.find((c) => c.id === id).label.toLowerCase());
        const downloadCard = cols.firstElementChild;
        // The column heading already supplies the download title and description.
        downloadCard.firstElementChild.remove();
        downloadCard.firstElementChild.remove();
        const del = P.element('div', 'sp-ret-delete', cols);
        P.deletion(del, m, (id) => S.spec.cats.find((c) => c.id === id).label.toLowerCase());
        if (S.spec.mode === 'delete') cols.prepend(del);

        const right = P.element('section', 'sp-ret-delivery', grid);
        right.style.overflow = 'auto';
        P.element('h2', '', right, 'Delivery details');
        P.element('p', 'sp-ret-sub', right, 'Choose where to send your data and the format.');
        P.request(right, m, (id) => S.spec.cats.find((c) => c.id === id).label.toLowerCase());
        const pendingRequest = right.querySelector('.sp-req');
        if (pendingRequest && S.ctx.size.height <= 740) {
          insp.classList.add('ret-request-host');
          insp.insertBefore(pendingRequest, insp.querySelector('h4'));
        }
        const deleteCard = del.firstElementChild;
        deleteCard.firstElementChild.classList.add('ret-selection-tools');
        const warning = deleteCard.querySelector('.sp-muted');
        if (warning) warning.classList.add('ret-delete-warning');
        const deleteButton = deleteCard.querySelector('[data-k="del-ask"]');
        if (deleteButton) deleteButton.textContent = 'Delete selected data';
        if (S.spec.mode !== 'delete') {
          const extra = P.element('details', 'ret-other-data', right);
          P.element('summary', '', extra, 'Delete account data');
          extra.appendChild(del);
        }
        const recipient = downloadCard && downloadCard.querySelector('.sp-rel');
        const downloadButton = downloadCard && downloadCard.querySelector('[data-k="dl-go"]');
        if (recipient) right.appendChild(recipient);
        if (downloadButton) right.appendChild(downloadButton);
        const rowGroups = new Map();
        for (const cb of cols.querySelectorAll('.sp-cb')) {
          const parent = cb.parentElement;
          if (!rowGroups.has(parent)) {
            const group = P.element('div', 'ret-cols', parent);
            parent.insertBefore(group, cb);
            rowGroups.set(parent, group);
          }
          rowGroups.get(parent).appendChild(cb);
        }
        for (const d of acct.querySelectorAll('.sp-crm-nav > div')) {
          for (const ch of Array.from(d.children)) if (!/[A-Za-z]/.test(ch.textContent)) ch.style.display = 'none';
          for (const n of Array.from(d.childNodes)) if (n.nodeType === 3) n.nodeValue = n.nodeValue.replace(/^[^A-Za-z]+/, '');
        }
        {
          const nav = acct.querySelector('.sp-crm-nav');
          const byText = (t) => Array.from(nav.children).find((d) => d.textContent.trim() === t);
          const first = byText('Account');
          const sec = byText('Security');
          const notif = byText('Notifications');
          const data = byText('Data & privacy');
          const mk = (t) => { const d = document.createElement('div'); d.textContent = t; return d; };
          if (first && first.lastChild && first.lastChild.nodeType === 3) first.lastChild.nodeValue = 'Account overview';
          if (sec) nav.insertBefore(mk('Personal information'), sec);
          if (notif && data) nav.insertBefore(notif, data);
          if (data) nav.insertBefore(mk('Connected applications'), data.nextSibling);
        }
        const promo = P.element('div', 'ret-promo', acct.querySelector('.sp-crm-nav') || acct);
        const art = P.element('span', 'ret-promo-art', promo);
        art.innerHTML = '<svg viewBox="0 0 100 112" aria-hidden="true"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#69bcec"/><stop offset="1" stop-color="#edf6f7"/></linearGradient></defs><path d="M10 14L87 5l7 91-77 10z" fill="#fff" stroke="#aaa"/><path d="M4 25l78-8 9 90-78 5z" fill="#fff" stroke="#aaa"/><path d="M10 31l66-7 8 76-65 7z" fill="url(#sky)"/><path d="M14 79l22-35 16 17 11-14 17 27 4 26-65 7z" fill="#83979a"/><path d="M28 55l8-11 10 10-7-3-4 3-2-5z" fill="#fff"/><path d="M19 91l22-25 23 16 17-7 3 25-65 7z" fill="#667e3f"/><path d="M45 101V63m-14 27 14-28 15 25m-32 9 17-28 18 25" fill="#2f592f" stroke="#244c28" stroke-width="3"/></svg>';
        P.element('b', '', promo, 'Take your files anywhere');
        P.element('span', '', promo, 'Get the Nimbus Drive mobile app for iPhone and other phones.');
        P.element('a', '', promo, 'Learn more ›');
        if (S.spec.mode === 'delete' && downloadCard) downloadCard.style.display = 'none';
        if (!right.querySelector('.sp-req') && !insp.querySelector('.sp-req')) {
          const format = P.element('div', 'sp-ret-format', right);
          P.element('strong', '', format, 'File format');
          P.element('div', 'sp-ret-format-select', format, 'ZIP (most common)  ▾');
          P.element('div', 'sp-ret-info', right, 'ⓘ　We’ll email you a link to download your data. The file will be available for 7 days.');
        }
        P.element('div', 'sp-ret-recent-title', right, 'Recent requests');
        P.element('p', 'sp-ret-sub', right, 'Track the status of your past data requests.');
        const recent = P.element('div', 'sp-ret-recent', right);
        const table = P.element('table', '', recent);
        const thead = P.element('thead', '', table);
        const hr = P.element('tr', '', thead);
        for (const h of ['Date', 'Requested data', 'Expires', 'Status']) P.element('th', '', hr, h);
        const tbody = P.element('tbody', '', table);
        for (const row of [['Apr 12, 2017', 'Photos and videos', 'Apr 19, 2017', 'Available'], ['Mar 3, 2017', 'All account data', 'Mar 10, 2017', 'Expired']]) {
          const tr = P.element('tr', '', tbody);
          row.forEach((v) => P.element('td', '', tr, v));
        }

        const strip = P.element('div', 'sp-ret-records', main);
        strip.style.display = 'none';
        P.element('div', 'sp-ret-record-copy', strip, 'Related records');
        const records = P.element('table', '', strip);
        const head = P.element('thead', '', records);
        const hrow = P.element('tr', '', head);
        for (const h of ['Date', 'Type', 'Details', 'Status']) P.element('th', '', hrow, h);
        const body = P.element('tbody', '', records);
        for (const row of [['Apr 12, 2017', 'Data download', 'Photos and videos (ZIP)', 'Available'], ['Mar 3, 2017', 'Data download', 'All account data (ZIP)', 'Expired'], ['Jan 18, 2017', 'Account deletion', 'Requested account deletion', 'Cancelled']]) {
          const tr = P.element('tr', '', body);
          row.forEach((v) => P.element('td', '', tr, v));
        }
        P.confirmation(m);
      },
    },
  },
});
