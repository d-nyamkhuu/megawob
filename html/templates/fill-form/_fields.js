/* fill-form/_fields: reference builders. scope is the live unit scope; reference.js retains all design hooks. */
(function () {
  'use strict';
function setField(scope, id, value, open = null) {
        scope.st.ctx.update({ ...scope.st.ctx.model, fields: { ...scope.st.ctx.model.fields, [id]: value }, open });
        if (scope.st.scanCount) scope.st.scanCount();
      }

function setOpen(scope, id) {
        if ((scope.st.ctx.model.open || null) !== (id || null)) scope.st.ctx.update({ ...scope.st.ctx.model, open: id || null });
      }

function showList(scope, dd, btn, list, open) {
        dd.classList.toggle('open', open);
        if (!open) return;
        dd.classList.remove('up');
        const r = btn.getBoundingClientRect();
        const h = list.offsetHeight;
        if (dd.closest('.ff-scan')) {
          list.style.cssText = `position:fixed;left:${r.left}px;right:auto;width:${r.width}px;bottom:auto;z-index:100;max-height:160px;overflow:auto`;
          list.style.top = `${r.bottom + 4 + h > window.innerHeight - 6 ? Math.max(6,r.top-h-4) : r.bottom+4}px`;
        } else if (r.bottom + 4 + h > window.innerHeight - 6 && r.top - 4 - h > 6) dd.classList.add('up');
      }

function textField(scope, util, wrap, f, value) {
        const box = util.el('div', 'ff-inwrap', wrap);
        const input = util.el('input', 'ff-input', box);
        input.type = 'text';
        input.id = `ff-${f.id}`;
        input.name = f.id;
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.placeholder = f.placeholder || '';
        input.value = value || '';
        input.dataset.role = 'field';
        const clear = util.el('div', 'ff-clear', box);
        scope.icon(util,clear,'close');
        clear.dataset.role = 'clear';
        clear.title = 'Clear';
        const sync = () => box.classList.toggle('filled', input.value.length > 0);
        sync();
        input.addEventListener('input', () => {
          sync();
          scope.setField(f.id, input.value, null);
        });
        clear.addEventListener('click', () => {
          input.value = '';
          sync();
          scope.setField(f.id, '', null);
        });
        return { input, clear };
      }

function dropdownField(scope, util, wrap, f, value) {
        const dd = util.el('div', 'ff-dd', wrap);
        const btn = util.el('div', 'ff-ddbtn', dd);
        btn.dataset.role = 'dropdown';
        btn.setAttribute('role', 'combobox');
        const val = util.el('span', 'ff-ddval', btn);
        scope.icon(util,btn,'down').classList.add('ff-chev');
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
        const w = scope.env.ui.dropdown(btn, list, {
          label: `dropdown ${f.id}`,
          keyboard: true,
          value: value || null,
          open: scope.st.ctx.model.open === f.id,
          options,
          show: (_, open) => scope.showList(dd, btn, list, open),
          onChange(label) {
            show(label);
            scope.setField(f.id, label, null);
          },
          onOpenChange: (open) => scope.setOpen(open ? f.id : scope.st.ctx.model.open === f.id ? null : scope.st.ctx.model.open),
        });
        return { dd, btn, list, opts, w };
      }

function radioField(scope, util, wrap, f, value) {
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
        const w = scope.env.ui.choices(radios, { label: `radio ${f.id}`, value: value || null, onChange: (label) => scope.setField(f.id, label, null) });
        return { w };
      }

function addField(scope, util, grid, f, v, withErr) {
        const wide = f.kind === 'radio' || f.kind === 'checkbox';
        const wrap = util.el('div', 'ff-field' + (wide ? ' ff-wide' : ''), grid);
        wrap.dataset.field = f.id;
        if (f.kind === 'checkbox') {
          const lab = util.el('label', 'ff-choice ff-check', wrap);
          const cb = util.el('input', '', lab);
          cb.type = 'checkbox';
          cb.dataset.role = 'checkbox';
          util.el('span', '', lab, f.label);
          const w = scope.env.ui.choices([[f.id, cb]], { label: `checkbox ${f.id}`, multi: true, values: v ? [f.id] : [],
            onChange: (values) => scope.setField(f.id, values.length > 0, null) });
          scope.st.el[f.id] = { w, wrap };
        } else {
          const lab = util.el(f.kind === 'text' || f.kind === 'date' ? 'label' : 'div', 'ff-label', wrap, f.label);
          if (f.kind === 'text' || f.kind === 'date') {
            lab.htmlFor = `ff-${f.id}`;
            scope.st.el[f.id] = scope.textField(util, wrap, f, v);
          } else if (f.kind === 'dropdown') scope.st.el[f.id] = scope.dropdownField(util, wrap, f, v);
          else scope.st.el[f.id] = scope.radioField(util, wrap, f, v);
          scope.st.el[f.id].wrap = wrap;
        }
        if (withErr) scope.st.el[f.id].err = util.el('div', 'ff-err', wrap);
        return wrap;
      }

function renderForm(scope, util, pane, spec, model, rng) {
        const form = util.el('div', 'ff-form', pane);
        form.dataset.role = 'form';
        scope.recordBar(util,form);
        util.el('h2', '', form, spec.formTitle);
        util.el('p', 'ff-sub', form, rng.pick([
          'Leave a field empty if the information is not available.',
          'Only fill in what the document states.',
          'All fields are optional.',
        ]));
        const grid = util.el('div', 'ff-grid' + (spec.layout.cols === 2 ? ' two' : ''), form);
        for (const f of spec.fields) scope.addField(util, grid, f, model.fields[f.id]);
        return form;
      }

function mirrorFocus(scope, root) {
        const set = (id) => { if ((scope.st.ctx.model.focus === undefined ? null : scope.st.ctx.model.focus) !== id) scope.st.ctx.update({ ...scope.st.ctx.model, focus: id }); };
        root.addEventListener('focusin', (e) => {
          const w = e.target.closest && e.target.closest('[data-field]');
          set(w ? w.dataset.field : null);
        });
        root.addEventListener('focusout', (e) => {
          if (!e.relatedTarget || !root.contains(e.relatedTarget)) set(null);
        });
      }


  env.template('fill-form/_fields', () => ({ setField, setOpen, showList, textField, dropdownField, radioField, addField, renderForm, mirrorFocus }));
})();
