/* fill-form/_document-form: document template parts, installed in order with the live template scope. */
(function () {
  'use strict';
  function installFields(BASE, scope) {
    BASE.setField = (id, value, open = null) => {
      scope.st.ctx.update({ ...scope.st.ctx.model, fields: { ...scope.st.ctx.model.fields, [id]: value }, open });
    };

    BASE.setOpen = (id) => {
      if ((scope.st.ctx.model.open || null) !== (id || null)) scope.st.ctx.update({ ...scope.st.ctx.model, open: id || null });
    };

    // The lower bound of a dropdown list opened from a button of client rect r: the window bottom, or the end
    // control's top when it sits over the button.
    BASE.listLimit = (r) => {
      if (!scope.D.listAvoidSubmit) return window.innerHeight - 6;
      const end = env.submitEl ? env.submitEl.getBoundingClientRect() : null;
      return end && r.left < end.right && r.right > end.left ? Math.min(window.innerHeight - 6, end.top - 8) : window.innerHeight - 6;
    };

    // The widget's layout hook for env.ui.dropdown: show the list, and open it upward when it would leave
    // the viewport below the button.
    BASE.showList = (dd, btn, list, open) => {
      dd.classList.toggle('open', open);
      if (!open) return;
      dd.classList.remove('up');
      const r = btn.getBoundingClientRect();
      const h = list.offsetHeight;
      const limit = scope.P.listLimit(r);
      if (r.bottom + 4 + h > limit && r.top - 4 - h > 6) dd.classList.add('up');
    };

    // ------------------------------------------------------------ form

    BASE.placeholder = (f) => f.placeholder || '';
    BASE.inputBox = () => {};
    // The calendar icon of a date field (token dateIcon), put in the input box or the field wrapper.
    BASE.dateIcon = (f, box, wrap, input) => {
      const o = scope.D.dateIcon;
      if (!o || f.kind !== 'date') return;
      if (o.boxCls) box.classList.add(o.boxCls);
      const el = scope.st.ctx.util.el(o.tag || 'span', o.cls || 'ff-calendar', o.host === 'wrap' ? wrap : box, o.text);
      if (o.tag === 'button') el.type = 'button';
      if (o.title) el.title = o.title;
      if (o.aria) el.setAttribute('aria-hidden', 'true');
      el.innerHTML = o.svg;
      if (o.focus) el.addEventListener('click', () => input.focus());
    };
    BASE.textField = (util, wrap, f, value) => {
      const box = util.el('div', 'ff-inwrap', wrap);
      const input = util.el('input', 'ff-input', box);
      input.type = 'text';
      input.id = `ff-${f.id}`;
      input.name = f.id;
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.placeholder = scope.P.placeholder(f);
      input.value = value || '';
      input.dataset.role = 'field';
      scope.P.inputBox(f, box, input);
      if (scope.D.dateIcon && scope.D.dateIcon.early) scope.P.dateIcon(f, box, wrap, input);
      const clear = util.el('div', 'ff-clear', box, '×');
      clear.dataset.role = 'clear';
      clear.title = 'Clear';
      const sync = () => box.classList.toggle('filled', input.value.length > 0);
      sync();
      input.addEventListener('input', () => {
        sync();
        scope.P.setField(f.id, input.value, null);
      });
      clear.addEventListener('click', () => {
        input.value = '';
        sync();
        scope.P.setField(f.id, '', null);
      });
      return { input, clear, sync };
    };

    BASE.dropdownField = (util, wrap, f, value) => {
      const dd = util.el('div', 'ff-dd', wrap);
      const btn = util.el('div', 'ff-ddbtn', dd);
      btn.dataset.role = 'dropdown';
      btn.setAttribute('role', 'combobox');
      const val = util.el('span', 'ff-ddval', btn);
      util.el('span', 'ff-chev', btn);
      const list = util.el('div', 'ff-list', dd);
      list.setAttribute('role', 'listbox');
      const opts = {};
      const show = (v) => {
        val.textContent = v || 'Select…';
        val.classList.toggle('empty', !v);
        for (const [label, o] of Object.entries(opts)) o.classList.toggle('sel', label === v);
      };
      const options = f.options.map((label) => {
        const o = util.el('div', 'ff-opt', list, label);
        o.dataset.role = 'option';
        o.setAttribute('role', 'option');
        opts[label] = o;
        return [label, o];
      });
      show(value);
      const w = env.ui.dropdown(btn, list, {
        label: `dropdown ${f.id}`,
        keyboard: true,
        value: value || null,
        open: scope.st.ctx.model.open === f.id,
        options,
        show: (_, open) => scope.P.showList(dd, btn, list, open),
        onChange(label) {
          show(label);
          scope.P.setField(f.id, label, null);
        },
        onOpenChange: (open) => scope.P.setOpen(open ? f.id : scope.st.ctx.model.open === f.id ? null : scope.st.ctx.model.open),
      });
      return { dd, btn, list, opts, w, show };
    };

    BASE.radioField = (util, wrap, f, value) => {
      const row = util.el('div', 'ff-radios', wrap);
      const radios = [];
      for (const label of f.options) {
        const lab = util.el('label', 'ff-choice', row);
        const r = util.el('input', '', lab);
        r.type = 'radio';
        r.name = `ff-${f.id}`;
        r.value = label;
        r.dataset.role = 'radio';
        util.el('span', '', lab, label);
        radios.push([label, r]);
      }
      const w = env.ui.choices(radios, { label: `radio ${f.id}`, value: value || null, onChange: (label) => scope.P.setField(f.id, label, null) });
      return { w, radios };
    };


  }

  function installForm(BASE, scope) {
    BASE.heading = (util, pane, form, text) => { util.el('h2', '', form, text); };
    BASE.formStart = () => {};
    BASE.grid = () => {};
    BASE.fieldWrap = () => {};
    BASE.labelText = (f) => f.label;
    BASE.label = () => {};
    BASE.entry = () => {};
    BASE.fieldDone = () => {};
    BASE.formEnd = () => {};

    BASE.renderForm = (util, pane, spec, model, rng) => {
      const form = util.el('div', 'ff-form', pane);
      form.dataset.role = 'form';
      scope.P.heading(util, pane, form, scope.D.formTitle || spec.formTitle);
      scope.P.formStart(form, pane, spec);
      util.el('p', 'ff-sub', form, rng.pick([
        'Leave a field empty if the information is not available.',
        'Only fill in what the document states.',
        'All fields are optional.',
      ]));
      const grid = util.el('div', 'ff-grid' + (spec.layout.cols === 2 ? ' two' : ''), form);
      scope.P.grid(grid, form, pane, spec);
      for (const f of spec.fields) {
        const v = model.fields[f.id];
        const wide = f.kind === 'radio' || f.kind === 'checkbox';
        const wrap = util.el('div', 'ff-field' + (wide ? ' ff-wide' : ''), grid);
        wrap.dataset.field = f.id;
        scope.P.fieldWrap(f, wrap);
        if (f.kind === 'checkbox') {
          const lab = util.el('label', 'ff-choice ff-check', wrap);
          const cb = util.el('input', '', lab);
          cb.type = 'checkbox';
          cb.dataset.role = 'checkbox';
          util.el('span', '', lab, f.label);
          const w = env.ui.choices([[f.id, cb]], { label: `checkbox ${f.id}`, multi: true, values: v ? [f.id] : [],
            onChange: (values) => scope.P.setField(f.id, values.length > 0, null) });
          scope.st.el[f.id] = { w, cb };
          scope.P.entry(f, scope.st.el[f.id]);
          continue;
        }
        const lab = util.el(f.kind === 'text' || f.kind === 'date' ? 'label' : 'div', 'ff-label', wrap, scope.P.labelText(f));
        scope.P.label(f, lab, wrap);
        if (f.kind === 'text' || f.kind === 'date') {
          lab.htmlFor = `ff-${f.id}`;
          scope.st.el[f.id] = scope.P.textField(util, wrap, f, v);
          if (scope.D.dateIcon && !scope.D.dateIcon.early) scope.P.dateIcon(f, scope.st.el[f.id].input.parentElement, wrap, scope.st.el[f.id].input);
        } else if (f.kind === 'dropdown') scope.st.el[f.id] = scope.P.dropdownField(util, wrap, f, v);
        else scope.st.el[f.id] = scope.P.radioField(util, wrap, f, v);
        scope.P.entry(f, scope.st.el[f.id]);
        scope.P.fieldDone(f, scope.st.el[f.id], wrap);
      }
      scope.P.formEnd(form, grid, pane, spec);
      return form;
    };

    // ------------------------------------------------------------ documents


  }

  env.template('fill-form/_document-form', () => ({ installFields, installForm }));
})();
