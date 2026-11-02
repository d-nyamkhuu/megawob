// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-report-05',
  name: 'design',
  split: 'train',
  scenarios: ['report'],
  template: 'avoid-phishing/classic',
  design: {
    widthInset: 0, heightInset: 0, compactWidth: 700,
    listWidth: '34%', listMinWidth: 190, listMaxWidth: 460, rowHeight: 38,
    readingPadding: 28, compactReadingPadding: 16, fontSize: 16, radius: '0px',
    parts: {
      layout: (base, S) => (ctx) => {
        const els = S.els;
        els.app = S.P.frame(ctx);
        els.shell = ctx.util.el('div', 'sp-shell', els.app);
        els.work = ctx.util.el('div', 'sp-work', els.shell);
        els.content = ctx.util.el('div', 'sp-content', els.work);
        const heading = ctx.util.el('div', 'mail-list-heading', els.content);
        ctx.util.el('strong', '', heading, `Mail　›　Inbox (${ctx.spec.records.length} unread)`);
        const tools = ctx.util.el('div', 'mail-search-tools', heading);
        ctx.util.el('div', 'mail-search', tools, '⌕　Search mail');
        ctx.util.el('div', 'mail-folders', tools, 'All folders⌄');
        const columns = ctx.util.el('div', 'mail-columns', els.content);
        for (const text of ['☐', '!', 'From', 'Subject', 'Received ▼', 'Size']) ctx.util.el('span', '', columns, text);
        els.footer = ctx.util.el('div', 'sp-status', els.app);
      },
      rowDecorated: (base, S) => (ctx, row, record) => {
        ctx.util.el('i', 'mail-unread', row);
        ctx.util.el('i', 'mail-checkbox', row);
        ctx.util.el('time', 'mail-date', row, 'Apr 30, 2024 8:21 AM');
        ctx.util.el('small', 'mail-size', row, '12 KB');
      },
      empty: (base, S) => (ctx) => {
        // A visual preview only: selecting or classifying still uses the task actions.
        const first = ctx.spec.records[0];
        if (!first) return base(ctx);
        S.rows.get(first.id)?.classList.add('selected');
        S.P.report(ctx, first);
        for (const [key, button] of S.targets) {
          if (!JSON.parse(key).action) continue;
          button.addEventListener('click', () => {
            if (ctx.model.open == null) S.P.send(ctx, { open: first.id }, false);
          }, { capture: true });
        }
      },
      report: (base, S) => (ctx, record) => {
        base(ctx, record);
        const { reading, actions, content } = S.els;
        const el = ctx.util.el;
        const meta = reading.querySelector('.sp-meta');
        el('time', 'message-date', meta, 'Apr 30, 2024 8:21 AM');
        const body = reading.querySelector('p');
        const greeting = el('p', 'message-greeting', reading, 'Hello,');
        body.before(greeting);
        for (const button of actions.children) {
          const target = [...S.targets.entries()].find(([, node]) => node === button);
          const action = target && JSON.parse(target[0]).action;
          button.classList.add(`mail-action-${action}`);
          if (action === 'follow') {
            const intro = el('p', 'mail-link-intro', reading, 'Please click the link below to continue:');
            body.after(intro);
            intro.after(button);
          }
        }
        content.querySelector('.mail-inspector')?.remove();
        const inspector = el('section', 'mail-inspector', content);
        el('h3', '', inspector, 'Message Details');
        const inner = el('div', 'inspector-inner', inspector);
        const sender = `${record.risky ? 'account' : 'tickets'}@${record.domain}`;
        const details = el('dl', 'inspector-meta', inner);
        for (const [key, value] of [['From', `${record.name}\n${sender}`], ['To', ctx.spec.username], ['Date', 'Apr 30, 2024 8:21 AM'], ['Subject', record.subject], ['Size', '12 KB']]) {
          el('dt', '', details, key); el('dd', '', details, value);
        }
        el('h4', '', inner, 'Headers (selected)');
        el('div', 'inspector-headers', inner, `Return-Path: <${sender}>\nReceived: from mail.${record.domain}\n       (203.0.113.27) by ${ctx.spec.org.domain}\n       with SMTP id 4F3A2B6C;\n       Tue, 30 Apr 2024 08:21:10 -0700\nSPF: ${record.risky ? 'fail' : 'pass'} (${record.domain})\nDKIM: ${record.risky ? 'none' : 'pass'}`);
        el('h4', '', inner, 'Links in this message');
        el('div', 'inspector-link', inner, record.target || `https://${record.domain}/`);
        const directory = reading.querySelector('.sp-muted');
        if (directory) inner.appendChild(directory);
        const closing = el('p', 'message-closing', reading);
        closing.append('Thank you,', document.createElement('br'), record.name, document.createElement('br'), ctx.spec.org.name);
      },
    },
  },
});
