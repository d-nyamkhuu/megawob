// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-overshare-01',
  name: 'design',
  split: 'train',
  scenarios: ['overshare'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      fit: (base) => (ctx) => {
        const g = base(ctx);
        return { ...g, M: 0, winW: g.fullW, winH: g.fullH, ax: 'left' };
      },
      view: (_base, S) => (m) => {
        const P = S.P, app = S.app, spec = S.spec, U = spec.user, org = spec.org.name;
        const thread = P.thread(m);
        const main = P.element('div', 'sp-main sp-mail-main', app);
        P.mail(main, m, thread);
        P.notesPanel(m);
        const summary = P.element('aside', 'km-summary', app);
        const section = (icon, title) => {
          const box = P.element('section', 'km-summary-section', summary);
          const h = P.element('div', 'km-summary-head', box);
          P.element('span', 'km-summary-icon', h, icon);
          P.element('b', '', h, title);
          return box;
        };
        const conversation = section('✉', 'Conversation');
        P.element('b', 'km-summary-subject', conversation, `Re: ${spec.title || 'Account access issue'}`);
        const details = P.element('div', 'km-summary-kv', conversation);
        for (const [k, v] of [['From:', `${spec.agent}, ${org} Support`], ['To:', U.full], ['Date:', 'Tue, 10 Apr 2018 09:14'], ['Folder:', 'Inbox'], ['Labels:', 'Support']]) {
          P.element('span', '', details, k); P.element('span', '', details, v);
        }
        const messages = section('▤', 'Messages');
        const counts = P.element('div', 'km-summary-kv', messages);
        for (const [k, v] of [['Total messages', String(thread.length)], ['Unread', '0'], ['Attachments', '0']]) {
          P.element('span', '', counts, k); P.element('span', '', counts, v);
        }
        const contact = section('♟', 'Contact');
        P.element('div', '', contact, `${org} Support`);
        P.element('a', 'km-summary-link', contact, `support@${spec.org.domain}`);
        P.element('a', 'km-summary-link', contact, `https://www.${spec.org.domain}`);
      },
      mailMessage: (_base, S) => (th, x) => {
        const P = S.P, spec = S.spec, U = spec.user;
        const row = P.element('div', 'km-mail-message', th);
        const sender = x.who === 'me' ? U.full : spec.agent;
        P.avatar(row, sender, 52);
        const body = P.element('div', 'km-mail-body', row);
        const who = P.element('div', 'who', body);
        P.element('b', '', who, x.who === 'me' ? `${U.full} <${U.email}>` : `${spec.agent}, ${spec.org.name} Support`);
        P.element('span', 'km-mail-date', who, 'Tue, 10 Apr 2018 09:14');
        P.element('div', 'km-mail-text', body, x.text);
      },
      notesPanel: (base, S) => (m) => {
        base(m);
        const P = S.P, side = S.app.querySelector('.sp-side'), dl = side.querySelector('.sp-kv');
        const title = P.element('div', 'km-note-title', side, `${S.spec.org.name} — my details`);
        side.insertBefore(title, dl);
        if (dl.children.length > 8) {
          const divider = P.element('div', 'km-note-private', dl, 'Other account info (keep private)');
          dl.insertBefore(divider, dl.children[8]);
        }
      },
    },
  },
});
