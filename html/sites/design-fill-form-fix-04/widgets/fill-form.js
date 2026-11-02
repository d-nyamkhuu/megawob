// Keep the table treatment while fitting every seeded form into its pane.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-fix-04',
  name: 'design',
  split: 'train',
  scenarios: ['fix'],
  template: 'fill-form/base',
  design: {
    parts: {
      ensureStyle: (_base, S) => () => {
        S.env.util.css('ff-style', S.CSS);
        S.env.util.css('ff-site-entry-layout', `
        .ds-stage .ff-field:not(.ff-wide) {
          min-height:var(--entry-row,67px); display:grid;
          grid-template-columns:38% minmax(0,1fr); align-items:center;
          gap:12px; padding:var(--entry-pad,7px) 15px;
        }
        @media(max-width:1100px) {
          .ds-stage .ff-field:not(.ff-wide) {
            grid-template-columns:34% minmax(0,1fr); gap:6px;
            padding:var(--entry-pad,5px) 8px;
          }
        }
        @media(max-height:700px) {
          .ds-stage .ff-field:not(.ff-wide) { min-height:var(--entry-row,50px); }
        }
        `);
      },
      renderForm: (base) => (util, pane, spec, model, rng) => {
        const form = base(util, pane, spec, model, rng);
        const rows = [...form.querySelectorAll('.ff-field:not(.ff-wide)')];
        const available = pane.clientHeight;
        // Measure during render, before anchors are frozen. Shorter forms retain
        // their original row spacing; longer ones give every control room.
        const excess = form.scrollHeight - available;
        if (excess > 0 && rows.length) {
          const rowHeight = rows[0].getBoundingClientRect().height;
          form.style.setProperty('--entry-row', `${Math.max(36, rowHeight - (excess + 2) / rows.length)}px`);
          form.style.setProperty('--entry-pad', '1px');
        }
        return form;
      },
      showList: (base) => (dd, button, list, open) => {
        base(dd, button, list, open);
        if (!open || dd.closest('.ff-scan')) return;
        const pane = dd.closest('.ff-formpane');
        if (!pane) return;
        const bounds = pane.getBoundingClientRect();
        const trigger = button.getBoundingClientRect();
        const below = Math.min(bounds.bottom, window.innerHeight - 6) - trigger.bottom - 4;
        const above = trigger.top - Math.max(bounds.top, 6) - 4;
        const up = list.offsetHeight > below && above > below;
        dd.classList.toggle('up', up);
        list.style.maxHeight = `${Math.max(40, up ? above : below)}px`;
        list.style.overflow = 'auto';
      },
    },
  },
});
