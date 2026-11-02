// This design uses a fixed customer form title, compact mail metadata, and page-level submit placement.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-email-11',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'fill-form/document',
  design: {
    formTitle: 'Customer Information',
    fitReserve: 0,
    parts: {
      renderEmail: (base, S) => (util, pane, d, rng) => {
        function header(box) {
          const table = util.el('div', 'ff-mailmeta', box);
          for (const [label, value] of [
            ['From:', `${d.from.name} <${d.from.addr}>`],
            ['To:', d.to],
            ['Subject:', d.subject],
            ['Date:', d.date],
          ]) {
            util.el('span', 'ff-metalabel', table, label);
            util.el('span', '', table, value);
          }
        }
        if (d.style === 'plain') {
          const box = util.el('div', 'ff-plainmail ff-paper', pane);
          header(box);
          const body = util.el('div', 'ff-mailbody', box);
          util.el('p', '', body, d.greeting);
          for (const p of d.paragraphs) util.el('p', '', body, p);
          util.el('p', 'sig', body, d.signature.join('\n'));
          return box;
        }
        const box = util.el('div', 'ff-mail', pane);
        const bar = util.el('div', 'ff-mailbar', box);
        for (const b of S.P.mailTools(rng)) util.el('span', '', bar, b);
        header(box);
        const body = util.el('div', 'ff-mailbody', box);
        util.el('p', '', body, d.greeting);
        for (const p of d.paragraphs) util.el('p', '', body, p);
        util.el('p', 'sig', body, d.signature.join('\n'));
        return box;
      },
      rootReady: (base, S) => (ctx, R) => {
        R.root.style.setProperty('--field-count', ctx.spec.fields.length);
        R.root.classList.toggle('ff-many', ctx.spec.fields.length > 5);
      },
      arranged: (base, S) => (ctx, R) => {
        const submit = document.querySelector('.ds-submit');
        if (submit) {
          if (ctx.spec.layout.tabs) submit.classList.add('ds-submit-tabbed');
          else R.formPane.appendChild(submit);
        }
      },
    },
  },
});
