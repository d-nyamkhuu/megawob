/* choose-option/_widgets-select: widget template parts, installed in their original order.
 * All BASE keys remain design-overridable through the parent template.
 */
(function () {
  'use strict';
  function installSelectParts(scopeRef) {
    scopeRef.BASE.selectLayout = (ctx, controls) => {
      const { rows, trigger, pop, rowMax } = controls;
      const { util } = ctx;
      if (!rows.size) return;
      const sr = ctx.stage.getBoundingClientRect();
      const tr = trigger.getBoundingClientRect();
      const avail = sr.bottom - tr.bottom - 4 - 10 - 12;
      const n = rows.size;
      let cols = 1;
      while (cols < 3 && Math.ceil(n / cols) * 24 > avail) cols++;
      const per = Math.ceil(n / cols);
      const h = util.clamp(Math.floor(avail / per), 22, rowMax + scopeRef.D.rowMaxExtra);
      pop.classList.toggle('cols', cols > 1);
      pop.style.gridTemplateRows = cols > 1 ? `repeat(${per}, ${h}px)` : '';
      pop.style.gridTemplateColumns = cols > 1 ? `repeat(${cols}, minmax(0, 1fr))` : '';
      const w = Math.max(tr.width, cols > 1 ? cols * 190 : tr.width);
      const left = Math.min(0, sr.right - 8 - (tr.left + w));
      pop.style.left = left + 'px';
      pop.style.right = 'auto';
      pop.style.width = w + 'px';
      for (const r of rows.values()) {
        r.style.height = h + 'px';
        r.style.fontSize = h < 28 ? '14px' : '';
      }
    };

    scopeRef.BASE.select = (parent, ctx, o) => {
      const { util } = ctx;
      const box = util.el('div', 'fp-dd', parent);
      box.style.position = 'relative';
      const trigger = util.el('div', 'fp-ctl fp-trigger', box);
      trigger.dataset.role = 'trigger';
      trigger.tabIndex = 0;
      const val = util.el('span', 'fp-val', trigger);
      trigger.insertAdjacentHTML('beforeend', scopeRef.D.chevron);
      const pop = util.el('div', 'fp-pop', box);
      pop.style.top = 'calc(100% + 4px)';
      pop.dataset.role = 'listbox';
      let rows = new Map();
      const rowMax = ctx.rng.int(32, 36);
      const dd = env.ui.dropdown(trigger, pop, {
        label: o.key,
        keyboard: true,
        open: o.isOpen(),
        value: o.value() || null,
        options: [],
        onActive: () => show(),
        onChange(x) {
          o.onPick(x);
          show();
        },
        onOpenChange(open) {
          if (o.isOpen() !== open) o.setOpen(open);
          show();
        },
      });
      function setOptions(list) {
        dd.clear();
        pop.replaceChildren();
        rows = new Map();
        controls.rows = rows;
        for (const x of list) {
          const r = util.el('div', 'fp-opt', pop);
          r.dataset.role = 'option';
          r.innerHTML = scopeRef.TICK;
          scopeRef.P.option(ctx, r, x, rows.size);
          rows.set(x, r);
        }
        dd.options([...rows]);
        scopeRef.P.selectLayout(ctx, controls);
      }
      const controls = { rows, trigger, pop, rowMax, dd };
      function show() {
        const open = o.isOpen();
        const v = o.value();
        dd.set({ open, value: v || null });
        val.textContent = v || o.placeholder;
        val.classList.toggle('empty', !v);
        trigger.classList.toggle('open', open);
        trigger.classList.toggle('disabled', !!(o.disabled && o.disabled()));
        for (const [x, r] of rows) {
          r.classList.toggle('sel', x === v);
          r.classList.toggle('active', x === dd.active());
        }
        if (open && scopeRef.D.revealOptions) scopeRef.P.reveal(ctx, controls, dd.active());
      }
      return {
        setOptions,
        layout: () => scopeRef.P.selectLayout(ctx, controls),
        show,
        trigger,
        locateTrigger: () => dd.locateTrigger(),
        locateOption: (x) => {
          if (scopeRef.D.revealOptions) scopeRef.P.reveal(ctx, controls, x);
          return dd.locateOption(x);
        },
      };
    };
  }

  function install(scopeRef) {
    installSelectParts(scopeRef);
    scopeRef.BASE.option = (ctx, row, value) => ctx.util.el('span', '', row, value);

    scopeRef.BASE.reveal = (ctx, controls, value) => {
      const row = controls.rows.get(value);
      if (!row) return;
      const top = row.offsetTop,
        pop = controls.pop;
      if (top < pop.scrollTop) pop.scrollTop = top;
      else if (top + row.offsetHeight > pop.scrollTop + pop.clientHeight)
        pop.scrollTop = top + row.offsetHeight - pop.clientHeight;
    };

    scopeRef.BASE.details = (ctx) => {
      if (!scopeRef.D.details) return;
      const details = ctx.util.el('aside', 'ds-task-description', ctx.stage);
      ctx.util.el('label', '', details, 'Description:');
      ctx.util.el(
        'div',
        'ds-staticarea',
        details,
        'Revise the Getting Started and Installation sections based on QA feedback.',
      );
      ctx.util.el('label', '', details, 'Attachments:');
      ctx.util.el('div', 'ds-staticarea', details, 'user_guide_draft.txt\nqa_notes.txt');
    };

    scopeRef.BASE.motifTitle = (ctx, card) => {
      const title = ctx.util.el('label', 'ds-motif-field', card, scopeRef.D.motifTitle);
      const input = ctx.util.el('input', '', title);
      input.type = 'text';
      input.value = scopeRef.D.motifValue;
    };

    scopeRef.BASE.motifFields = (ctx, card) => {
      if (!scopeRef.D.motif) return;
      const decoys = ctx.util.el('div', 'ds-motif-xtras', card);
      scopeRef.D.motifFields.forEach(([key, value]) => {
        const label = ctx.util.el('label', 'ds-motif-field', decoys, key);
        const input = ctx.util.el('input', '', label);
        input.type = 'text';
        input.value = value;
      });
    };

    const buildDropdown = (field, ctx) => {
      const { spec } = ctx;
      const sel = scopeRef.P.select(field, ctx, {
        key: 'dropdown',
        placeholder: spec.placeholder,
        value: () => scopeRef.st.ctx.model.value,
        isOpen: () => !!scopeRef.st.ctx.model.open,
        setOpen: (open) => scopeRef.set({ open }),
        onPick: (x) => scopeRef.set({ value: x, open: false }),
      });
      scopeRef.st.layout = () => sel.setOptions(spec.options);
      scopeRef.st.show = sel.show;
      scopeRef.st.loc = (t) =>
        t.open !== undefined ? sel.locateTrigger() : t.option !== undefined ? sel.locateOption(t.option) : null;
    };
    scopeRef.buildDropdown = buildDropdown;
  }
  env.template('choose-option/_widgets-select', () => ({ install }));
})();
