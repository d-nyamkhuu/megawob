// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-giftcard-02',
  name: 'design',
  split: 'train',
  scenarios: ['giftcard'],
  template: 'avoid-phishing/classic',
  design: {
    widthInset: 0, heightInset: 0, compactWidth: 950,
    line: '#b8ad9d', panel: '#f8f5ed', foreground: '#171923',
    background: '#eee9dd', muted: '#756d63', accent: '#68182b',
    font: '17px Georgia, "Times New Roman", serif', fontSize: 17,
    radius: '0px', listWidth: '100%', listMinWidth: 0, listMaxWidth: 1000,
    rowHeight: 62, readingPadding: 20, compactReadingPadding: 12,
    browserHeight: 0, navWidth: 0, compactNavWidth: 0,
    parts: {
      layout: (base, S) => (ctx) => {
        const { util, spec } = ctx;
        const app = S.els.app = util.el('section', 'sp-app library-app', ctx.stage);
        app.style.width = '100%'; app.style.height = '100%';
        app.setAttribute('aria-label', `${spec.org.name} mail workspace`);
        const shell = S.els.shell = util.el('div', 'sp-shell library-shell', app);
        const folders = util.el('aside', 'library-folders', shell);
        const group = (title, items) => {
          util.el('h3', '', folders, title);
          for (const [icon, label, count] of items) {
            const row = util.el('div', 'library-folder', folders);
            util.el('span', 'folder-icon', row, icon);
            util.el('span', 'folder-label', row, label);
            if (count) util.el('span', 'folder-count', row, count);
          }
        };
        group('Mail', [['✉','Inbox','3'],['★','Starred','1'],['➤','Sent',''],['▤','Drafts','2'],['▥','Deleted Items','']]);
        group('Accounts Payable', [['▧','Purchase Requests','4'],['▣','Pending Approvals','1'],['▦','Payment Records',''],['♙','Vendors',''],['▤','Chart of Accounts','']]);
        const summary = util.el('section', 'library-summary', folders);
        util.el('h3', '', summary, 'Quick Summary');
        for (const [label,value] of [['Unread Mail','3'],['Open Purchase Requests','4'],['Pending Approvals','1'],['Invoices This Month','6'],['Total Pending','$2,340.00']]) {
          const row = util.el('div', 'summary-row', summary);
          util.el('span', '', row, label); util.el('span', '', row, value);
        }
        const list = util.el('section', 'library-inbox', shell);
        util.el('h2', 'inbox-heading', list, 'Inbox (3 unread)');
        const columns = util.el('div', 'inbox-columns', list);
        util.el('b', '', columns, 'From'); util.el('b', '', columns, 'Subject'); util.el('b', '', columns, 'Date');
        const rows = [
          [spec.person.full, spec.fraud.subject, 'Apr 16', true],
          ['Pat Nguyen', 'Re: Summer reading event', 'Apr 15'],
          ['Library System', 'Monthly circulation report', 'Apr 15'],
          ['Tina Morales', 'Program supplies', 'Apr 14'],
          ['Daniel Carter', 'Re: Budget question', 'Apr 14'],
          ['Jay Patel', 'New vendor information', 'Apr 12'],
        ];
        rows.forEach(([from, subject, date, selected]) => {
          const row = util.el('div', `inbox-row${selected ? ' selected' : ''}`, list);
          util.el('span', '', row, from); util.el('span', '', row, subject); util.el('span', '', row, date);
        });
        S.els.content = util.el('div', 'sp-content library-task', shell);
        S.els.work = shell;
        S.els.footer = util.el('div', 'sp-status', app);
      },
    },
  },
});
