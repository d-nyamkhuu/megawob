// Design on the shared use-bank/classic workspace; defaults reproduce this scaffold.
env.widget({
  task: 'use-bank',
  site: 'design-use-bank-paybill-05',
  name: 'design',
  split: 'train',
  scenarios: ['paybill'],
  template: 'use-bank/classic',
  design: {
    inset: 0, minHeight: 0, font: '18px/1.3 Arial,Helvetica,sans-serif', radius: '0px', controlHeight: '46px', background: '#ffffff', panel: '#ffffff', foreground: '#17202b', muted: '#6e7a87', line: '#d3dce5', accent: '#075ca6',
    parts: {
      frame: (base, S) => E => {
        const root = E.u.el('div', 'bk pay-widget', E.ctx.stage);
        root.style.width = '100%'; root.style.height = '100%';
        return root;
      },
      shell: (base, S) => E => {
        E.u.el('div', 'pay-title', E.root, 'Make a Payment');
        const meta = E.u.el('div', 'pay-meta', E.root);
        E.crumb = E.u.el('div', '', meta); E.title = E.u.el('h2', '', meta); E.stateBadge = E.u.el('span', '', meta);
        E.pane = E.u.el('div', 'bk-scroll pay-pane', E.root);
        E.footer = E.u.el('div', 'bk-footer pay-actions', E.root);
        E.pane.addEventListener('scroll', () => S.P.mirror(E));
      },
      form: (base, S) => E => {
        S.P.fields(E);
        const frequency = E.u.el('section', 'pay-frequency', E.pane);
        E.u.el('strong', '', frequency, 'Payment Frequency');
        const selected = E.ctx.model.bankUI?.paymentFrequency || 'once';
        for (const [id, text] of [['once', 'One time payment'], ['recurring', 'Make this a recurring payment'], ['end', 'End recurring payments after']]) {
          const row = E.u.el('label', 'pay-frequency-row', frequency);
          const input = E.u.el('input', '', row); input.type = 'radio'; input.name = 'payment-frequency'; input.checked = selected === id;
          input.addEventListener('change', () => S.P.ui(E, {paymentFrequency:id}));
          E.u.el('span', '', row, text);
          if (id === 'end') { const count = E.u.el('input', 'pay-count', row); count.type = 'text'; count.inputMode = 'numeric'; count.setAttribute('aria-label', 'Number of payments'); count.disabled = selected !== 'end'; E.u.el('span', '', row, 'payments'); }
        }
      },
      fields: (base, S) => E => {
        const grid = E.u.el('div', 'bk-grid pay-fields', E.pane);
        for (const id of ['from', 'payee', 'amount', 'date']) { const f = E.s.fields.find(f => f.id === id); if (f) S.P.field(E, f, grid); }
        E.s.fields.filter(f => !['from','payee','amount','date'].includes(f.id) && f.kind !== 'transaction').forEach(f => S.P.field(E, f, grid));
      },
      field: (base, S) => (E, f, grid) => {
        base(E, f, grid);
        const box = grid.lastElementChild; box.dataset.field = f.id;
        const labels = {from:'From Account', payee:'Pay To', amount:'Payment Amount', date:'Payment Date'};
        if (labels[f.id]) box.querySelector('.bk-label').textContent = labels[f.id];
      },
      choiceControl: (base, S) => (E, f, box) => {
        base(E, f, box);
        const arrow = box.querySelector('svg path'); if (arrow) { arrow.setAttribute('d','M7 9h10l-5 6z'); arrow.setAttribute('fill','currentColor'); arrow.setAttribute('stroke','none'); }
        if (!E.ctx.model.values[f.id]) { const b = E.refs[S.P.key(E, {field:f.id})]; b.querySelector('span').textContent = f.id === 'from' ? 'Select an account' : f.id === 'payee' ? 'Select a biller' : 'Select an option'; }
      },
      textControl: (base, S) => (E, f, box) => {
        base(E, f, box);
        if (f.kind === 'date') E.inputs[f.id].placeholder = 'mm/dd/yyyy';
      },
      rendered: (base, S) => E => {
        base(E);
        const accounts = document.querySelector('.accounts-card');
        if (accounts) { accounts.querySelectorAll('.summary-row').forEach(row => row.remove()); E.s.accounts.forEach(a => { const row = E.u.el('div', 'summary-row', accounts); E.u.el('span', '', row, a.label); E.u.el('span', '', row, E.F.helpers.money(a.balance).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); }); }
        const activityHeading = document.querySelector('.activity-heading strong');
        if (activityHeading && E.s.accounts.length) activityHeading.textContent = 'Recent Activity — ' + E.s.accounts[0].label;
        const records = document.querySelector('.rm-records');
        if (records) { records.replaceChildren(); E.s.payees.forEach(p => { const row = E.u.el('button', 'rm-record', records, p.label); row.type = 'button'; row.addEventListener('click', () => S.P.change(E, {set:['payee',p.label]})); }); }
      },
    },
  },
});
