/* use-desktop-tools/_base-editor: rich-text document and toolbar.
 * build(ctx, main, frame?, scope) owns one render's state; scope supplies the base template's
 * overridable units. Named setup, painting and input helpers keep their original statement order.
 */
(function () {
  'use strict';
  function paint(state, m) {
    const st = state.fam.expand(m.runs, state.spec.doc.length);
    for (let i = 0; i < state.spec.doc.length; i++) {
      const el = state.chars[i];
      if (!el) continue;
      const s = st[i];
      const cls = [s.b ? 'b' : '', s.i ? 'i' : '', s.u ? 'u' : '', s.s ? `s-${s.s}` : ''].filter(Boolean).join(' ');
      if (el.className !== cls) el.className = cls;
      const col = s.c ? state.fam.SWATCHES[s.c] : '';
      if (el.style.color !== col) el.style.color = col;
    }
    let num = 0;
    m.pf.forEach((f, p) => {
      const pe = state.paraEls[p];
      pe.style.textAlign = f.a === 'left' ? '' : f.a;
      if (f.l === 'none') {
        delete pe.dataset.list;
        num = 0;
        if (state.marks[p].textContent) state.marks[p].textContent = '';
      } else {
        pe.dataset.list = f.l;
        num = f.l === 'number' ? num + 1 : 0;
        const t = f.l === 'number' ? `${num}.` : '•';
        if (state.marks[p].textContent !== t) state.marks[p].textContent = t;
      }
    });
    const { start, end } = m.sel;
    for (const [k, a] of [['bold', 'b'], ['italic', 'i'], ['underline', 'u']]) {
      let on = end > start;
      for (let i = start; i < end && on; i++) if (!/\s/.test(state.spec.doc[i]) && !st[i][a]) on = false;
      if (on) state.tools[k].dataset.on = '';
      else delete state.tools[k].dataset.on;
    }
    const cp = m.pf[Math.min(m.pf.length - 1, state.spec.bounds.findIndex(([, e]) => start <= e))] || m.pf[0];
    for (const a of ['left', 'center', 'right', 'justify']) {
      if (cp.a === a) state.tools[`align-${a}`].dataset.on = '';
      else delete state.tools[`align-${a}`].dataset.on;
    }
    for (const l of ['bullet', 'number']) {
      if (cp.l === l) state.tools[l].dataset.on = '';
      else delete state.tools[l].dataset.on;
    }
    const cs = end > start ? st[start] : null;
    state.tools.size.querySelector('.cur').textContent = state.fam.SIZE_LABEL[(cs && cs.s) || 'normal'];
    for (const [k, o] of Object.entries(state.sizeEls)) {
      if (((cs && cs.s) || 'normal') === k) o.dataset.on = '';
      else delete o.dataset.on;
    }
    if (m.past.length) delete state.tools.undo.dataset.off;
    else state.tools.undo.dataset.off = '';
    if (m.future.length) delete state.tools.redo.dataset.off;
    else state.tools.redo.dataset.off = '';
    state.bar.style.background = state.lastColor ? state.fam.SWATCHES[state.lastColor] : 'var(--fg)';
    state.saved.textContent = m.past.length ? 'Edited' : 'Saved';
    for (const [k, p] of Object.entries(state.pops)) {
      const open = m.pop === k;
      p.hidden = !open;
      if (open) {
        const tr = state.tb.getBoundingClientRect();
        const br = state.tools[k].getBoundingClientRect();
        p.style.left = `${Math.round(state.clamp(br.left - tr.left, 4, tr.width - p.offsetWidth - 4))}px`;
        p.style.top = `${Math.round(br.bottom - tr.top + 4)}px`;
      }
    }
    const cur = state.sel.get();
    if (cur.start !== m.sel.start || cur.end !== m.sel.end) state.sel.set(m.sel);
  }

  function buildDocument(state) {
    ({ util: state.util, spec: state.spec, rng: state.rng } = state.ctx);
    state.fam = state.env.taskDef.helpers;
    state.ed = state.util.el('div', 'at-ed', state.main);
    state.tb = state.util.el('div', 'at-tb', state.ed);
    state.wide = state.main.getBoundingClientRect().width > 700;
    state.tool = (key, html, title, cls = '') => {
      const b = state.util.el('button', `at-tool ${cls}`, state.tb);
      b.type = 'button';
      b.innerHTML = html;
      b.title = title;
      if (key) b.dataset.tool = key;
      return b;
    };
    state.sep = () => state.util.el('span', 'sep', state.tb);
    if (state.wide) state.tool('', `<span>${state.rng.pick(['Sans Serif', 'Serif', 'Georgia', 'Inter'])}</span>${state.CARET}`, 'Font', 'deco wide');
    state.tools = {};
    state.tools.size = state.tool('size', `<span class="cur">Normal</span>${state.CARET}`, 'Text size', 'wide');
    state.sep();
    state.tools.bold = state.tool('bold', '<b style="font-size:16px">B</b>', 'Bold (Ctrl+B)');
    state.tools.italic = state.tool('italic', '<i style="font:italic 16px Georgia,serif">I</i>', 'Italic (Ctrl+I)');
    state.tools.underline = state.tool('underline', '<u style="font-size:16px">U</u>', 'Underline (Ctrl+U)');
    state.tools.color = state.tool('color', '<span class="A">A<i></i></span>' + state.CARET, 'Text color');
    state.bar = state.tools.color.querySelector('.A i');
    state.sep();
    state.tools['align-left'] = state.tool('align-left', state.svg('<path d="M3 4h10M3 7h7M3 10h10M3 13h7"/>', 16), 'Align left');
    state.tools['align-center'] = state.tool('align-center', state.svg('<path d="M3 4h10M4.5 7h7M3 10h10M4.5 13h7"/>', 16), 'Center');
    state.tools['align-right'] = state.tool('align-right', state.svg('<path d="M3 4h10M6 7h7M3 10h10M6 13h7"/>', 16), 'Align right');
    state.tools['align-justify'] = state.tool('align-justify', state.svg('<path d="M3 4h10M3 7h10M3 10h10M3 13h10"/>', 16), 'Justify');
    state.sep();
    state.tools.bullet = state.tool('bullet', state.svg('<circle cx="3.5" cy="5" r=".9"/><circle cx="3.5" cy="11" r=".9"/><path d="M7 5h6M7 11h6"/>', 16), 'Bulleted list');
    state.tools.number = state.tool('number', state.svg('<path d="M2.5 3.5h1v3M2.5 9.5h2l-2 3h2M7 5h6M7 11h6"/>', 16), 'Numbered list');
    state.sep();
    state.tools.undo = state.tool('undo', state.svg('<path d="M5 6H10a3 3 0 0 1 0 6H7M5 6l2.5-2.5M5 6l2.5 2.5"/>', 16), 'Undo (Ctrl+Z)');
    state.tools.redo = state.tool('redo', state.svg('<path d="M11 6H6a3 3 0 0 0 0 6h3M11 6L8.5 3.5M11 6L8.5 8.5"/>', 16), 'Redo (Ctrl+Y)');
    state.colorPop = state.util.el('div', 'at-pop', state.tb);
    state.grid = state.util.el('div', 'grid', state.colorPop);
    state.swatchEls = {};
    for (const k of [0, 1]) {
      for (const hue of state.fam.HUES) {
        const key = `${hue}.${k}`;
        const s = state.util.el('div', 'at-sw', state.grid);
        s.style.background = state.fam.SWATCHES[key];
        s.title = `${hue}${k ? ' (dark)' : ''}`;
        s.dataset.swatch = key;
        state.swatchEls[key] = s;
      }
    }
    state.swatchEls.default = state.util.el('div', 'at-sw def', state.grid, 'Default');
    state.swatchEls.default.dataset.swatch = 'default';
    state.sizePop = state.util.el('div', 'at-pop', state.tb);
    state.sizeEls = {};
    for (const v of state.fam.SIZES) {
      const o = state.util.el('div', 'at-szo', state.sizePop, state.fam.SIZE_LABEL[v]);
      o.style.fontSize = { small: '12px', normal: '14px', large: '18px', huge: '23px' }[v];
      o.dataset.size = v;
      state.sizeEls[v] = o;
    }
    state.pops = { color: state.colorPop, size: state.sizePop };
    state.area = state.util.el('div', 'at-pagearea', state.ed);
    state.sheet = state.util.el('div', 'at-sheet', state.area);
    state.util.el('h2', '', state.sheet, state.rng.pick(['Untitled document', 'Meeting notes', 'Draft', 'Ideas', 'Weekly update', 'Notes for the team', 'Customer reply']));
    state.util.el('hr', '', state.sheet);
    state.docEl = state.util.el('div', 'at-doc', state.sheet);
    state.paraEls = [];
    state.marks = [];
    state.chars = [];
    state.spec.bounds.forEach(([s, e], p) => {
      const pe = state.util.el('div', 'at-p', state.docEl);
      pe.dataset.p = p;
      const mk = state.util.el('span', 'mk', pe);
      state.marks.push(mk);
      for (let i = s; i < e; i++) state.chars[i] = state.util.el('span', '', pe, state.spec.doc[i]);
      state.paraEls.push(pe);
    });
    state.status = state.util.el('div', 'at-status', state.ed);
    state.util.el('span', '', state.status, `${state.spec.doc.split(/\s+/).length} words`);
    state.util.el('span', '', state.status, `${state.spec.doc.length} characters`);
    state.saved = state.util.el('span', '', state.status, 'Saved');
    state.head = state.spec.task === 'size' ? (state.spec.size === 'huge' ? 1.45 : 1.25) : state.spec.task === 'list' ? 1.15 : 1.12;
    state.avail = state.area.getBoundingClientRect().height - 36;
    state.fs = 20;
    for (; state.fs > 13; state.fs--) {
      state.docEl.style.fontSize = `${state.fs}px`;
      if (state.sheet.getBoundingClientRect().height * state.head <= state.avail) break;
    }
  }

  function bindEditor(state) {
    state.docEl.style.fontSize = `${state.fs}px`;
    state.sel = state.env.ui.textSelection(state.docEl, {
      segments: state.paraEls.map((pe, p) => ({ node: pe, start: state.spec.bounds[p][0] })),
      skip: '.mk',
      length: state.spec.doc.length,
      value: state.ctx.model.sel,
      label: 'editor',
      onChange: (v) => {
        const s = state.ctx.model.sel;
        if (s.start === v.start && s.end === v.end) return;
        state.commit({ ...state.ctx.model, sel: v });
      },
    });
    state.commit = (m) => {
      const prev = state.ctx.model;
      state.ctx.update(m);
      state.guard(state.ctx, prev, m);
      state.paint(state.ctx.model);
    };
    for (const [k, b] of Object.entries(state.tools)) {
      b.addEventListener('click', () => {
        const m = state.ctx.model;
        if (k === 'color' || k === 'size') state.commit({ ...m, pop: m.pop === k ? null : k });
        else if (k === 'undo') state.commit(state.fam.edUndo(m));
        else if (k === 'redo') state.commit(state.fam.edRedo(m));
        else state.commit(state.fam.edApply(m, state.spec, k));
      });
    }
    for (const [k, s] of Object.entries(state.swatchEls)) {
      s.addEventListener('click', () => {
        state.lastColor = k === 'default' ? null : k;
        state.commit(state.fam.edApply(state.ctx.model, state.spec, 'color', k));
      });
    }
    for (const [k, o] of Object.entries(state.sizeEls)) o.addEventListener('click', () => state.commit(state.fam.edApply(state.ctx.model, state.spec, 'size', k)));
    state.lastColor = null;
    state.paint(state.ctx.model);
  }

  function handlers(state) {
    return {
      sync: state.paint,
      onKey(e) {
        if (!(e.ctrlKey || e.metaKey) || state.isField(e.target)) return;
        const k = e.key.toLowerCase();
        const m = state.ctx.model;
        if (k === 'b' || k === 'i' || k === 'u') {
          e.preventDefault();
          state.commit(state.fam.edApply(m, state.spec, { b: 'bold', i: 'italic', u: 'underline' }[k]));
        } else if (k === 'z' && !e.shiftKey) {
          e.preventDefault();
          state.commit(state.fam.edUndo(m));
        } else if (k === 'y' || (k === 'z' && e.shiftKey)) {
          e.preventDefault();
          state.commit(state.fam.edRedo(m));
        }
      },
      onDown(e) {
        const m = state.ctx.model;
        if (!m.pop) return;
        const p = state.pops[m.pop];
        if (p.contains(e.target) || state.tools[m.pop].contains(e.target)) return;
        state.commit({ ...m, pop: null });
      },
      locate(t) {
        if (t.char !== undefined) return state.sel.locate(t);
        if (t.tool) return state.hitPoint(state.tools[t.tool]);
        if (t.swatch !== undefined) return state.colorPop.hidden ? null : state.hitPoint(state.swatchEls[t.swatch]);
        if (t.size !== undefined) return state.sizePop.hidden ? null : state.hitPoint(state.sizeEls[t.size]);
        return null;
      },
    };
  }

  function build(ctx, main, scope) {
    const state = {
      ctx, main, env: scope.env, CARET: scope.CARET, svg: scope.svg, guard: scope.guard,
      clamp: scope.clamp, isField: scope.isField, hitPoint: scope.hitPoint,
    };
    state.paint = (m) => paint(state, m);
    buildDocument(state);
    bindEditor(state);
    return handlers(state);
  }
  env.template('use-desktop-tools/_base-editor', () => ({ build }));
})();
