// Design on templates/fill-form/base.js: the base site's fill-form widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-fix-05',
  name: 'design',
  split: 'train',
  scenarios: ['fix'],
  traits: { noTabs: true },
  template: 'fill-form/base',
  design: { parts: {
    renderForm: (base) => (util, pane, spec, model, rng) => {
      const result = base(util, pane, spec, model, rng);
      pane.classList.add('breeze-form');
      for (const field of pane.querySelectorAll('.ff-field')) {
        const label = field.querySelector('.ff-label');
        const wrap = field.querySelector('.ff-inwrap');
        if (wrap && label && /date|birth/i.test(label.textContent)) {
          const icon = util.el('span', 'breeze-calendar', wrap);
          icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 5h18v17H3z M3 10h18 M7 2v6 M17 2v6 M7 14h3 M14 14h3 M7 18h3 M14 18h3"/></svg>';
        }
      }
      return result;
    },
    renderDoc: (base) => (util, pane, d, rng) => {
      const result = base(util, pane, d, rng);
      pane.classList.add('breeze-document');
      const sourceText = pane.innerText;
      const from = sourceText.match(/(?:^|\n)From:\s*([^\n]+)/);
      const subjectLine = sourceText.match(/(?:^|\n)Subject:\s*([^\n]+)/);
      const sent = sourceText.match(/(?:^|\n)Date:\s*([^\n]+)/);
      const to = sourceText.match(/(?:^|\n)To:\s*([^\n]+)/);
      if (from || !pane.querySelector('.ff-email')) {
        const content = [...pane.children];
        const nameNode = pane.querySelector('.ff-cname, .ff-ptable tr:first-child td:nth-child(2), .ff-receipt b, .ff-receipt strong, .ff-receipt > :first-child');
        const name = from ? from[1] : nameNode ? nameNode.textContent : 'Customer';
        util.el('div', 'breeze-subject', pane, subjectLine ? subjectLine[1] : 'Customer enquiry');
        const sender = util.el('div', 'breeze-sender', pane);
        util.el('div', 'breeze-avatar', sender, name.trim().split(/[\s,]+/).slice(0,2).map(s => s[0]).join(''));
        const details = util.el('div', 'breeze-sender-details', sender);
        util.el('div', '', details, name);
        if (sent) util.el('div', 'breeze-meta', details, sent[1]);
        util.el('div', 'breeze-meta', details, to ? 'To: ' + to[1] : 'To: Customer Booking');
        const body = util.el('div', 'breeze-message-body', pane);
        if (from) {
          content.forEach(n => n.remove());
          util.el('div', 'breeze-email-text', body, sourceText.replace(/^(?:From|To|Date|Subject):[^\n]*\n?/gm, '').trim());
        } else content.forEach(n => body.appendChild(n));
        pane.classList.add('breeze-source-message');
      }
      return result;
    },
  } },
});
