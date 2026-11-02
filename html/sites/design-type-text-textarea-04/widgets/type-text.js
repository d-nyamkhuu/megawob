// Keep the reference form's bindings and validation; size the Motif layout from its stage.
env.widget({
  task: 'type-text',
  site: 'design-type-text-textarea-04',
  name: 'design',
  split: 'train',
  scenarios: ['textarea'],
  template: 'type-text/base',
  design: {
    parts: {
      ensureStyle: (base) => () => {
        base();
        if (document.getElementById('motif-form-style')) return;
        const style = document.createElement('style');
        style.id = 'motif-form-style';
        style.textContent = `
        .motif-form.ft-card {
          margin: 8px; padding: var(--motif-pad); border: 0; border-radius: 0;
          background: transparent; box-shadow: none; color: #111; transform: none;
        }
        .motif-form.ft-card h2, .motif-form .ft-sub { display: none; }
        .motif-form .ft-grid.inline {
          display: flex; flex-direction: column; align-items: stretch; gap: 14px;
        }
        .motif-form .ft-grid.inline .ft-field {
          display: grid; grid-template-columns: var(--motif-label) minmax(0, 1fr);
          column-gap: 12px; row-gap: 4px; align-items: start; order: 0;
        }
        .motif-form .ft-field.ft-wide { order: 1; margin-bottom: 22px; }
        .motif-form .ft-label {
          grid-column: 1; padding-top: 8px; font-size: 16px; font-weight: normal;
          text-align: left; text-transform: none; letter-spacing: normal; color: #111;
        }
        .motif-form .ft-inwrap, .motif-form .ft-err { grid-column: 2; }
        .motif-form .ft-input {
          height: 36px; padding: 4px 7px; border: 2px inset #eee; border-radius: 0;
          background: white; color: #111; font-size: 16px; box-shadow: none;
        }
        .motif-form textarea.ft-input { height: var(--motif-textarea); padding: 8px; }
        .motif-form .ft-inwrap.ta .ft-count {
          top: calc(100% + 8px); bottom: auto; left: 0; right: auto;
          font-size: 15px; color: #111;
        }
        .motif-form .ft-grid.inline .ft-err { margin-top: 0; }
        .motif-form .ft-save, .motif-form .ft-save.ghost {
          background: #c7c5c0; color: #111; border: 3px outset #eee; border-radius: 0;
        }
        `;
        document.head.appendChild(style);
      },
      build: (base) => (ctx, look) => {
        const pad = ctx.size.width < 650 ? 12 : 20;
        const label = ctx.size.width < 650 ? 105 : 130;
        // Reserve room for labels, validation slots, counter, and the in-app Save row.
        const reserved = pad * 2 + 16 + 22 + (ctx.spec.save ? 74 : 0)
          + (ctx.spec.fields.length - 1) * 74;
        const height = Math.max(64, Math.min(240, ctx.size.height - reserved));
        const card = base(ctx, { ...look, layout: 'inline', underline: false,
          vars: { ...look.vars,
            '--motif-pad': `${pad}px`, '--motif-label': `${label}px`,
            '--motif-textarea': `${height}px`, '--ft-w': '100%',
          },
        });
        card.classList.add('motif-form');
        card.style.width = `${Math.max(0, ctx.size.width - 16)}px`;
        return card;
      },
    },
  },
});
