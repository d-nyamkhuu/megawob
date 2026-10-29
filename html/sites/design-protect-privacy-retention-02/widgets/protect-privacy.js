// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-retention-02',
  name: 'design',
  split: 'train',
  scenarios: ['retention'],
  template: 'protect-privacy/classic',
  design: {
    font: '15px/1.4 "Segoe UI", system-ui, sans-serif',
    parts: {
      styles: (base) => () => base() + `
        .sp-tabs, .sp-bar { display: none; }
        .ref-retention-main { padding: 18px 22px; gap: 12px; min-height: 0; }
        .ref-retention-title, .ref-retention-tabs, .ref-request-strip { flex: none; }
        .ref-retention-cols { flex: 1; display: flex; min-height: 0; }
        .ref-retention-cols > .sp-card { padding: 16px 18px; }
        .ref-download-card { display: flex; flex-direction: column; min-height: 0; }
        .ref-download-heading { flex: none; margin: 0 0 4px; }
        .ref-category-list { flex: 1; min-height: 0; display: grid; grid-auto-rows: minmax(28px, 1fr); }
        .ref-category-row { display: grid; grid-template-columns: 30px 42px minmax(0,1fr) minmax(70px,auto) 20px; gap: 12px; padding: 4px 12px; min-height: 0; margin-top: -1px; }
        .ref-delivery { flex: none; }
        .ref-delivery .sp-sec { margin: 0; }
        .ref-delivery-to .sp-rolebtn { min-height: 38px; }
        .ref-retention-compact { padding: 10px 16px; gap: 8px; }
        .ref-retention-compact .ref-retention-tabs { height: 32px; }
        .ref-retention-compact .ref-download-heading { margin-bottom: 8px; }
        .ref-retention-compact .ref-category-row { padding: 2px 10px; gap: 7px; }
        .ref-retention-compact .ref-delivery { margin-top: 10px; padding-top: 8px; gap: 6px; }
        .ref-retention-compact .ref-delivery-to { width: 100%; }
        .ref-retention-compact .ref-delivery-to .sp-rolebtn { min-height: 30px; padding: 4px 10px; }
      `,
      fit: (base) => (ctx) => {
        const g = base(ctx);
        const fullW = Math.max(0, ctx.size.width - 2 * g.M);
        const fullH = Math.max(0, ctx.size.height - 2 * g.M);
        return { ...g, fullW, fullH, winW: fullW, winH: fullH, ax: 'left' };
      },
      view: (_base, S) => (m) => {
        const P = S.P, spec = S.spec, app = S.app, user = spec.user;
        const acct = P.element('div', 'sp-acct', app);
        const compact = S.geo.winH < 700;
        const main = P.element('div', `sp-acct-main ref-retention-main${compact ? ' ref-retention-compact' : ''}`, acct);
        P.element('div', 'sp-h2 ref-retention-title', main, 'Your data and privacy');
        const tabs = P.element('div', 'ref-retention-tabs', main);
        for (const [name, active] of [['Data request', true], ['Personal information', false], ['Ad preferences', false], ['Visibility', false], ['Security', false]]) {
          P.element('span', active ? 'active' : '', tabs, name);
        }
        const label = (id) => spec.cats.find((c) => c.id === id).label.toLowerCase();
        P.request(main, m, label);
        const cols = P.element('div', 'sp-cols ref-retention-cols', main);
        if (spec.mode === 'delete') P.deletion(cols, m, label);
        else P.download(cols, m, label);
        P.confirmation(m);
      },
      request: (_base, S) => (main, m, label) => {
        const spec = S.spec, P = S.P, U = spec.user;
        if (spec.via !== 'request') return;
        const box = P.element('div', 'ref-request-strip', main);
        const title = P.element('div', 'ref-request-title', box);
        P.element('b', '', title, `Request ${spec.reqId}`);
        P.element('span', 'sp-muted', title, `${spec.requester.name} · ${spec.requester.email}`);
        const cats = spec.want.map(label).join(', ');
        P.element('div', 'ref-request-copy', box, `Please ${spec.mode === 'download' ? `send a copy of ${spec.requester.self ? 'my' : `${U.first}’s`} ${cats}` : `delete ${spec.requester.self ? 'my' : `${U.first}’s`} ${cats}`} as requested.`);
        if (m.req === 'pending') {
          const row = P.element('div', 'row', box);
          P.key(P.element('button', 'sp-btn sm pri', row, 'Approve'), 'req-approve');
          P.key(P.element('button', 'sp-btn sm', row, 'Decline'), 'req-decline');
        } else P.element('span', 'sp-muted', box, m.req === 'approved' ? 'Approved' : 'Declined');
      },
      download: (_base, S) => (cols, m, label) => {
        const P = S.P, spec = S.spec, U = spec.user;
        const dl = P.element('div', 'sp-card ref-download-card', cols);
        P.element('div', 'sp-sec ref-download-heading', dl, 'Request a copy of your data');
        if (S.geo.winH >= 700) P.element('div', 'sp-muted ref-download-intro', dl, 'You can download a copy of the information Driftwood Social has about you. Select the categories that you want to include.');
        const list = P.element('div', 'ref-category-list', dl);
        for (const c of spec.cats) P.downloadRow(list, c, m);
        const delivery = P.element('div', 'ref-delivery', dl);
        if (S.geo.winH >= 700) {
          P.element('div', 'sp-sec', delivery, 'Delivery details');
          P.element('div', 'sp-muted ref-delivery-copy', delivery, 'We’ll prepare a .zip file with your data and send a link to the email address you choose.');
        }
        const to = P.element('div', 'sp-rel ref-delivery-to', delivery);
        P.element('div', 'sp-muted', to, 'Send to');
        P.key(P.element('span', 'sp-rolebtn', to, `${m.to}　⌄`), 'to-btn');
        if (m.toMenu) {
          const mn = P.menu(to, [{ k: `to:${U.email}`, label: U.email, sub: 'Primary · verified', v: U.email },
            { k: `to:${spec.alt}`, label: spec.alt, sub: 'Added 3 days ago · not verified', v: spec.alt }], m.to);
          mn.style.left = '0'; mn.style.top = '100%';
        }
        P.key(P.element('button', 'sp-btn sm pri', delivery, 'Request download'), 'dl-go');
        if (m.requested) P.element('div', 'sp-ok', delivery, `Export of ${m.requested.map(label).join(', ')} requested. We’ll email the link to ${m.to}.`);
      },
      downloadRow: (_base, S) => (dl, c, m) => {
        const P = S.P;
        const row = P.key(P.element('div', 'sp-cb ref-category-row', dl), `dl:${c.id}`);
        P.element('span', `sp-box${m.dl[c.id] ? ' on' : ''}`, row, m.dl[c.id] ? '✓' : '');
        const key = `${c.id} ${c.label}`.toLowerCase();
        const paths = /profile|account/.test(key) ? '<circle cx="12" cy="7" r="3.2"/><path d="M5.5 21c.3-4 2.5-6.3 6.5-6.3s6.2 2.3 6.5 6.3"/>'
          : /contact/.test(key) ? '<circle cx="9" cy="8" r="3"/><path d="M3 21c.3-3.6 2.3-5.7 6-5.7s5.7 2.1 6 5.7M16 5.3a3 3 0 0 1 0 5.7M17 15.2c2.5.5 3.8 2.4 4 5.8"/>'
          : /payment|billing/.test(key) ? '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>'
          : /location/.test(key) ? '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>'
          : /activ|history|post/.test(key) ? '<circle cx="9" cy="8" r="3"/><path d="M3 21c.3-3.6 2.3-5.7 6-5.7s5.7 2.1 6 5.7M16 5.3a3 3 0 0 1 0 5.7M17 15.2c2.5.5 3.8 2.4 4 5.8"/>'
          : /message|mail/.test(key) ? '<path d="M3 5.5h18v12H9l-6 4z"/><path d="M7 10h10M7 14h7"/>'
          : /photo|video|media/.test(key) ? '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m4 18 5-5 3 3 3-4 5 6"/>'
          : /app|integrat/.test(key) ? '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
          : '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>';
        const icon = P.element('span', 'ref-category-icon', row);
        icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
        const text = P.element('span', 'ref-category-text', row);
        P.element('b', '', text, c.label);
        const detail = /profile|account/.test(key) ? 'Name, username, bio, date of birth, and profile photos' : /activ|post/.test(key) ? 'Posts, comments, likes, and other activity' : /message|mail/.test(key) ? 'Your direct messages' : /photo|video|media/.test(key) ? 'Photos and videos you’ve uploaded' : /payment|billing/.test(key) ? 'Purchases, transactions, and payment history' : /location/.test(key) ? 'Places you’ve visited and location history' : /contact/.test(key) ? 'Contacts you’ve synced with Driftwood Social' : /history/.test(key) ? 'Your recent activity and saved history' : /app|integrat/.test(key) ? 'Information from apps you’ve connected' : `Your ${c.label.toLowerCase()} and related preferences`;
        if (S.geo.winH >= 700) P.element('small', '', text, detail);
        const sizes = ['~ 12 MB', '~ 248 MB', '~ 320 MB', '~ 1.1 GB', '~ 4 MB', '~ 6 MB'];
        P.element('span', 'ref-category-size', row, c.size || sizes[S.spec.cats.indexOf(c) % sizes.length]);
        P.element('span', 'ref-category-chevron', row, '⌄');
      },
    },
  },
});
