// Design of this site on fill-form/document: fixed-size contact cards and a contact form title.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-card-04',
  name: 'design',
  split: 'train',
  scenarios: ['card'],
  template: 'fill-form/document',
  design: {
    formTitle: 'Contact Information',
    tabsGrid: null,
    parts: {
      grid: () => (grid, form, pane, spec) => {
        grid.style.setProperty('--rows', spec.fields.length);
      },
      cardFill: () => (util, card, d) => {
        const box = util.el('div', 'ff-contact', card);
        box.style.setProperty('--docrows', d.rows.length + d.extras.length);
        if (d.rows.length + d.extras.length > 6) box.classList.add('ff-dense');
        const head = util.el('div', 'ff-chead', box);
        util.el('div', 'ff-avatar', head, d.initials);
        const who = util.el('div', '', head);
        util.el('div', 'ff-doclabel', who, d.issuer);
        util.el('div', 'ff-cname', who, d.heading || d.rows.find((r) => /name/i.test(r.label))?.value || d.issuer);
        if (d.subtitle || d.org) util.el('div', 'ff-csub', who, d.subtitle || d.org);
        const table = util.el('div', 'ff-ctable', box);
        for (const r of [...d.rows, ...d.extras]) {
          util.el('div', 'ff-doclabel', table, r.label);
          util.el('div', 'ff-v', table, r.value).style.whiteSpace = 'pre-line';
        }
      },
      fit: () => () => {},
    },
  },
});
