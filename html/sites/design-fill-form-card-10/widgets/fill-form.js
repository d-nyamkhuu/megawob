// Card page design: place the instruction note in the card and size its form and source document to the stage.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-card-10',
  name: 'design',
  split: 'train',
  scenarios: ['card'],
  template: 'fill-form/document',
  design: {
    parts: {
      arranged: (base) => (ctx, R) => {
        const { root, docPane, formPane } = R;
        const { spec } = ctx;
        const note = document.querySelector('.ds-header-note');
        if (note) {
          if (spec.layout.tabs) {
            root.insertBefore(note, root.firstChild);
            root.classList.add('has-note');
          } else formPane.insertBefore(note, formPane.firstChild);
        }
        root.style.setProperty('--field-count', spec.fields.length);
        const d = spec.doc;
        docPane.style.setProperty(
          '--doc-font',
          Math.min(24, Math.max(11, (docPane.clientHeight - 150) / ((d.rows.length + d.extras.length) * 1.5 + 4))) + 'px',
        );
        base(ctx, R);
      },
      fit: () => (ctx, R) => {
        const { root, docPane, formPane } = R;
        const note = document.querySelector('.ds-header-note');
        const fs = Math.min(
          26,
          Math.max(
            11,
            (formPane.clientHeight - (note && formPane.contains(note) ? note.offsetHeight + 24 : 0) - 100) /
              (ctx.spec.fields.length * 2.5),
          ),
        );
        root.style.fontSize = fs + 'px';
        const paper = docPane.querySelector('.ff-card');
        if (paper) {
          let df = parseFloat(docPane.style.getPropertyValue('--doc-font'));
          while (df > 10 && paper.scrollHeight > paper.clientHeight + 1) {
            df -= 0.5;
            docPane.style.setProperty('--doc-font', df + 'px');
          }
        }
      },
    },
  },
});
