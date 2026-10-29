// Email palette frame, compact dense-form fitting, and safe field targets for this design.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-email-06',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'fill-form/document',
  design: {
    parts: {
      renderEmail: (base, S) => (util, pane, d, rng) => {
        const title = util.el('div', 'ff-palette-title', pane);
        title.innerHTML =
          '<svg viewBox="0 0 28 24"><rect x="1" y="2" width="26" height="20" rx="3" fill="white"/><path d="m4 6 10 7 10-7" fill="none" stroke="#214869" stroke-width="3"/></svg><span>New Message</span><svg class="ff-window-icons" viewBox="0 0 110 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 12h14M47 7v13h13M53 4h10v10M54 13l9-9M92 5l13 13M105 5 92 18"/></svg>';
        const head = util.el('div', 'ff-palette-head', pane);
        S.P.row(util, head, 'From:', `${d.from.name} <${d.from.addr}>`);
        S.P.row(util, head, 'To:', d.to);
        S.P.row(util, head, 'Subject:', d.subject);
        return base(util, pane, d, rng);
      },
      rootReady: (base, S) => (ctx, R) => {
        R.root.classList.add('dense');
        R.root.style.setProperty('--ff-count', ctx.spec.fields.length);
      },
      arranged: (base, S) => (ctx, R) => {
        const { util, spec } = ctx;
        const { formPane } = R;
        ctx.stage.addEventListener('ff-clear-form', () => {
          const fields = Object.fromEntries(spec.fields.map((f) => [f.id, f.kind === 'checkbox' ? false : '']));
          ctx.update({ ...ctx.model, fields, open: null });
          for (const f of spec.fields) {
            fields[f.id] = f.kind === 'checkbox' ? false : '';
            const wrap = Array.from(formPane.querySelectorAll('.ff-field')).find((e) => e.dataset.field === f.id);
            if (f.kind === 'checkbox') {
              wrap.replaceChildren();
              const lab = util.el('label', 'ff-choice ff-check', wrap);
              const cb = util.el('input', '', lab);
              cb.type = 'checkbox';
              cb.dataset.role = 'checkbox';
              util.el('span', '', lab, f.label);
              S.el[f.id] = {
                w: env.ui.choices([[f.id, cb]], {
                  label: `checkbox ${f.id}`,
                  multi: true,
                  values: [],
                  onChange: (values) => S.P.setField(f.id, values.length > 0, null),
                }),
              };
            } else {
              for (const child of Array.from(wrap.children)) if (!child.classList.contains('ff-label')) child.remove();
              S.el[f.id] = f.kind === 'text' || f.kind === 'date'
                ? S.P.textField(util, wrap, f, '')
                : f.kind === 'dropdown'
                  ? S.P.dropdownField(util, wrap, f, '')
                  : S.P.radioField(util, wrap, f, '');
            }
          }
        });
        const firstInput = formPane.querySelector('.ff-input');
        if (firstInput) firstInput.focus({ preventScroll: true });
      },
      finished: (base, S) => (ctx, R) => {
        const grid = R.formPane.querySelector('.ff-grid');
        const form = R.formPane.querySelector('.ff-form');
        if (grid && form) {
          const over = form.getBoundingClientRect().bottom - (ctx.stage.getBoundingClientRect().bottom - 6);
          if (over > 0) grid.style.height = Math.max(0, grid.getBoundingClientRect().height - over) + 'px';
        }
      },
      fieldPoint: (base) => (r) => [r.left + Math.min(r.width * 0.35, 110), r.top + Math.min(r.height / 2, 8)],
    },
  },
});
