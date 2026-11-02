// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-retention-01',
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
      },
      view: (base, S) => (m) => {
        const P = S.P;
        const app = S.app;
        const acct = P.element('div', 'sp-acct', app);
        P.navigation(acct);
        const main = P.element('div', 'sp-acct-main', acct);
        const title = P.element('div', 'sp-page-title', main);
        P.element('h1', '', title, 'Data & Privacy');
        P.element('p', '', title, 'Manage your data, download a copy, or delete specific categories.');

        const grid = P.element('div', 'sp-ret-grid', main);
        const left = P.element('section', 'sp-ret-categories', grid);
        left.style.cssText = 'display:flex;flex-direction:column;min-height:0';
        P.element('h2', '', left, 'Select data categories');
        P.element('p', 'sp-ret-sub', left, 'Choose the types of data to include in your download.');
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
        if (S.spec.mode === 'delete') {
          const deleteCard = del.firstElementChild;
          right.appendChild(deleteCard.firstElementChild);
          right.appendChild(deleteCard.querySelector('.sp-muted'));
          right.appendChild(deleteCard.querySelector('[data-k="del-ask"]'));
        }
        const recipient = downloadCard && downloadCard.querySelector('.sp-rel');
        const downloadButton = downloadCard && downloadCard.querySelector('[data-k="dl-go"]');
        if (recipient) right.appendChild(recipient);
        if (downloadButton) right.appendChild(downloadButton);
        if (!right.querySelector('.sp-req')) {
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
