// Design on templates/type-text/base.js: the base site's type-text widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'type-text',
  site: 'design-type-text-sections-05',
  name: 'design',
  split: 'train',
  scenarios: ['sections'],
  template: 'type-text/base',
  design: {
    parts: {
      buildSections: (base) => function (ctx, look, card) {
        return base({ ...ctx, spec:{ ...ctx.spec, panes:'accordion' } }, look, card);
      },
      build: (base, S) => function (ctx, look) {
        const { util } = ctx;
        const stage = S.st.host;
        const left = util.el('aside', 'qt-dock qt-dock-users', stage);
        util.el('h3', 'qt-dock-title', left, 'Users');
        const head = util.el('div', 'qt-dock-head', left);
        util.el('span', '', head, 'User name'); util.el('span', '', head, 'Full name');
        const rows = [
          ['adavis','Alice Davis'],['agarcia','Ana Garcia'],['bchen','Ben Chen'],['cwilson','Chris Wilson'],
          ['edwards','Emma Edwards'],['ekhan','Fatima Khan'],['jlee','Jason Lee'],['mlopez','Maria Lopez'],
          ['nguyen','Minh Nguyen'],['opath','Olivia Path'],['rkim','Ryan Kim'],['ssato','Sakura Sato'],['tbrooks','Tyler Brooks'],
        ];
        const table = util.el('div', 'qt-dock-table', left);
        rows.forEach(([user, full], i) => {
          const row = util.el('div', i === 0 ? 'qt-dock-row selected' : 'qt-dock-row', table);
          util.el('span', 'qt-user-icon', row); util.el('span', '', row, user); util.el('span', '', row, full);
        });
        util.el('div', 'qt-dock-footer', left, '13 users');

        const right = util.el('aside', 'qt-dock qt-dock-info', stage);
        const note = document.querySelector('.ds-brief');
        if (note) note.querySelector('h2').textContent = 'Task note';
        if (note && ctx.size.width > 1100) right.style.top = `${note.getBoundingClientRect().height + 22}px`;
        const toast = document.querySelector('.ds-toast');
        if (toast) right.style.bottom = `${toast.getBoundingClientRect().height + 35}px`;
        const info = util.el('section', 'qt-dock-panel', right);
        util.el('h3', 'qt-dock-title', info, 'User information');
        [['User name:','adavis'],['Full name:','Alice Davis'],['Department:','Sales'],['Role:','Standard User'],['Status:','Active']].forEach(([k,v]) => {
          const r = util.el('div', 'qt-summary-row', info); util.el('span','',r,k); util.el('span','',r,v);
        });
        const counts = util.el('section', 'qt-dock-panel qt-dock-counts', right);
        util.el('h3', 'qt-dock-title', counts, 'User counts');
        [['Total users:','13'],['Active users:','12'],['Disabled users:','1'],['Administrators:','2'],['Standard users:','10']].forEach(([k,v]) => {
          const r = util.el('div', 'qt-summary-row', counts); util.el('span','',r,k); util.el('span','',r,v);
        });
        const card = base(ctx, { ...look, layout:'inline', caps:false, counts:false, underline:false, subtitle:'' });
        const title = card.querySelector('h2');
        title.textContent = 'Edit User Account';
        const first = card.querySelector('.ft-acc-b, .ft-pane');
        if (first) {
          const metadata = (label, value, before) => {
            const row = util.el('div', 'qt-record-row');
            util.el('span', '', row, label);
            util.el('span', 'qt-record-value', row, value);
            if (before) first.prepend(row); else first.appendChild(row);
          };
          metadata('User name:', 'adavis', true);
          metadata('Department:', 'Sales');
          metadata('User role:', 'Standard User');
        }
        const acc = card.querySelector('.ft-acc');
        if (acc) {
          const titles = ctx.spec.sections.map(s => s.title);
          ['Address', 'Account settings', 'Preferences', 'Notes'].forEach(t => {
            if (!titles.includes(t) && acc.children.length < 5) {
              const row = util.el('div', 'qt-record-section', acc);
              util.el('span', '', row, '▸'); util.el('span', '', row, t);
            }
          });
        }
        return card;
      },
    },
  },
});
