/* recall-info/_classic-crossref: classic's crossref parts and view builder; part names stay in classic. */
(function () {
  'use strict';

  function parts(S, shared) {
    const { el, titleLine } = shared;
    const BASE = {};
    // crossref: source tabs and a saved-values form.
    BASE.tabs = (ctx, work, apply) => {
      const { spec } = ctx;
      const tabs = el('div', 'ur-tabs', work);
      tabs.setAttribute('role', 'tablist');
      const tb = spec.tabs.map((t, i) => {
        const b = el('button', 'ur-tab', tabs, t.name);
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.dataset.role = 'tab';
        b.addEventListener('click', () => apply({ tab: i }));
        return b;
      });
      return tb;
    };

    BASE.source = (ctx, p, t) => {
      const table = el('table', 'ur-kv', p);
      for (const [k, v] of t.rows) {
        S.P.sourceRow(ctx, table, k, v);
      }
    };

    BASE.sourceRow = (ctx, table, k, v) => {
      const tr = el('tr', '', table);
      el('td', '', tr, k);
      el('td', '', tr, v);
      S.P.decorated(ctx, tr, { key: k, value: v });
    };

    const crossrefField = (ctx, grid, f, apply) => {
      const w = el('div', 'ur-field', grid);
      const lab = el('label', 'ur-label', w, f.label);
      const input = el('input', 'ur-input', w);
      input.type = 'text';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.id = `ur-x-${f.id}`;
      input.dataset.role = 'field';
      lab.htmlFor = input.id;
      const tf = env.ui.textField(input, { value: ctx.model.entered[f.id] || '', label: f.id, onInput: (v) => apply({ type: [f.id, v] }) });
      return tf;
    };

    BASE.form = (ctx, p, t, tfs, apply) => {
      const { spec } = ctx;
      el('h3', '', p, t.name);
      const grid = el('div', 'ur-fields', p);
      grid.style.setProperty('--ur-fc', spec.fields.length > 3 ? '2' : '1');
      for (const f of spec.fields) {
        tfs[f.id] = S.P.field(ctx, grid, f, apply);
      }
    };

    const crossrefControls = (ctx, p, apply) => {
      const { spec } = ctx;
      const row = el('div', '', p);
      row.style.cssText = 'display:flex;align-items:center;gap:12px;margin-top:12px';
      const saveBtn = el('button', 'ur-btn primary', row, spec.labels.save);
      saveBtn.type = 'button';
      saveBtn.addEventListener('click', () => apply({ commit: true }));
      const savedEl = el('div', 'ur-saved', p);
      savedEl.style.marginTop = '8px';
      return { saveBtn, savedEl };
    };

    BASE.saved = (ctx, savedEl, m) => {
      const { spec } = ctx;
      savedEl.innerHTML = '';
      if (m.committed && m.saved) {
        el('b', '', savedEl, `${spec.labels.saved}: `);
        savedEl.append(spec.fields.map((f) => `${f.label} ${m.saved[f.id]}`).join(' · '));
      } else savedEl.append('Not saved yet');
    };

    return { parts: BASE, crossrefField, crossrefControls };
  }

  function build(S, shared) {
    const { el, center, actions, fitPanels } = shared;
    return (ctx, work, app) => {
      const { spec } = ctx;
      const apply = actions(ctx, paint);
      const tb = S.P.tabs(ctx, work, apply);
      const body = el('div', 'ur-body', work);
      const panels = [];
      const tfs = {};
      let saveBtn = null;
      let savedEl = null;
      spec.tabs.forEach((t, i) => {
        const p = el('section', 'ur-panel', body);
        panels[i] = p;
        if (t.kind === 'src') {
          S.P.source(ctx, p, t);
          return;
        }
        S.P.form(ctx, p, t, tfs, apply);
        ({ saveBtn, savedEl } = S.P.controls(ctx, p, apply));
      });
      function paint(m) {
        panels.forEach((p, i) => { p.hidden = i !== m.tab; });
        tb.forEach((b, i) => { b.classList.toggle('on', i === m.tab); b.setAttribute('aria-selected', i === m.tab ? 'true' : 'false'); });
        for (const f of spec.fields) if (tfs[f.id].get() !== (m.entered[f.id] || '')) tfs[f.id].set(m.entered[f.id] || '');
        S.P.saved(ctx, savedEl, m);
      }
      fitPanels(body, panels);
      paint(ctx.model);
      return {
        paint,
        locate(t) {
          if (t.tab !== undefined) return center(tb[t.tab]);
          if (t.field) return tfs[t.field].locate();
          if (t.commit) return center(saveBtn);
          throw new Error(`recall-info/classic cannot locate ${JSON.stringify(t)}`);
        },
      };
    };
  }

  env.template('recall-info/_classic-crossref', () => ({ parts, build }));
})();
