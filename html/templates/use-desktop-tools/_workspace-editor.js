/* use-desktop-tools/_workspace-editor: rich-text document and toolbar.
 * install(S, BASE) installs the existing design parts and returns the builder; S keeps the live
 * tokens and resolved parts. Each build owns its rendering, painting and input state.
 */
(function () {
  'use strict';
  function install(S, BASE) {
    // ================================================================ editor

    // Parts of the editor, called with E = { ctx, util, spec, rng, fam, main, ed, tb, toolParent, tool(key, html, title, cls),
    // sep(), wide, tools, bar, popups..., area, sheet, docEl, paraEls, marks, chars, status, saved, sel, sizeEls, swatchEls,
    // pops, colorPop, sizePop, lastColor, commit(m), paint(m) } (set in this order, as far as the part runs):
    BASE.edHead = () => {}; // after the editor box (E.ed), before the toolbar
    BASE.edToolbarStart = (E) => { if (S.D.toolbarTask) E.tb.dataset.task = E.spec.task; }; // toolbar made, before its tools
    BASE.fontTool = (E) => {
      if (!E.wide) return;
      const font = E.tool('', `<span>${E.rng.pick(['Sans Serif', 'Serif', 'Georgia', 'Inter'])}</span>${S.CARET}`, 'Font', 'deco wide');
      if (S.D.fontName !== null) font.querySelector('span').textContent = S.D.fontName;
    };
    // One entry of the token `toolbar`: '|' is a separator, the others build the tool E.tools[key] (font: no entry).
    BASE.toolItem = (E, key) => {
      if (key === '|') E.sep();
      else if (key === 'font') S.P.fontTool(E);
      else {
        const def = key === 'size' ? `<span class="cur">${S.D.sizeInitial}</span>${S.CARET}`
          : key === 'color' ? '<span class="A">A<i></i></span>' + S.CARET
          : S.TOOL_HTML[key] !== undefined ? S.TOOL_HTML[key]
          : S.svg(S.D.toolIcons[key] !== undefined ? S.D.toolIcons[key] : S.TOOL_ICON[key], 16);
        const o = S.D.toolHtml[key];
        const html = o === undefined ? def : typeof o === 'function' ? o(def, S) : o;
        E.tools[key] = E.tool(key, html, S.TOOL_TITLE[key], S.D.toolClass[key] || '');
      }
    };
    BASE.toolbarBuilt = () => {}; // after the toolbar's tools
    BASE.sizeOption = (E, v) => E.util.el('div', 'at-szo', E.sizePop, S.D.sizeOption ? S.D.sizeOption(v, E.fam.SIZE_LABEL[v], S) : E.fam.SIZE_LABEL[v]);
    BASE.edPopups = (E) => {
      const { util, fam, tb } = E;
      const colorPop = E.colorPop = util.el('div', 'at-pop', tb);
      const grid = util.el('div', 'grid', colorPop);
      const swatchEls = E.swatchEls = {};
      for (const k of [0, 1]) {
        for (const hue of fam.HUES) {
          const key = `${hue}.${k}`;
          const s = util.el('div', 'at-sw', grid);
          s.style.background = fam.SWATCHES[key];
          s.title = `${hue}${k ? ' (dark)' : ''}`;
          s.dataset.swatch = key;
          swatchEls[key] = s;
        }
      }
      swatchEls.default = util.el('div', 'at-sw def', grid, 'Default');
      swatchEls.default.dataset.swatch = 'default';
      const sizePop = E.sizePop = util.el('div', 'at-pop', tb);
      const sizeEls = E.sizeEls = {};
      for (const v of fam.SIZES) {
        const o = S.P.sizeOption(E, v);
        o.style.fontSize = { small: '12px', normal: '14px', large: '18px', huge: '23px' }[v];
        o.dataset.size = v;
        sizeEls[v] = o;
      }
      E.pops = { color: colorPop, size: sizePop };
    };
    BASE.edArea = (E) => E.util.el('div', 'at-pagearea', E.ed);
    BASE.edAreaBuilt = () => {}; // after the page area (E.area), before the sheet
    BASE.edDocTitle = (E) => {
      const title = S.D.docTitle !== null ? S.D.docTitle
        : E.rng.pick(['Untitled document', 'Meeting notes', 'Draft', 'Ideas', 'Weekly update', 'Notes for the team', 'Customer reply']);
      E.util.el('h2', '', E.sheet, title);
      E.util.el('hr', '', E.sheet);
    };
    BASE.edDocBuilt = () => {}; // after the document element (E.docEl)
    BASE.edParasBuilt = () => {}; // after the paragraphs and characters
    BASE.edStatus = (E) => {
      const { util, spec } = E;
      E.status = util.el('div', 'at-status', E.ed);
      util.el('span', '', E.status, S.D.wordsLabel(spec.doc.split(/\s+/).length));
      util.el('span', '', E.status, `${spec.doc.length} characters`);
      E.saved = util.el('span', '', E.status, S.D.savedText[0]);
    };
    // Font size: the largest that fits the page with room for the goal formatting; the size tried first.
    BASE.docFontStart = () => 20;
    BASE.charClass = (E, s) => [s.b ? 'b' : '', s.i ? 'i' : '', s.u ? 'u' : '', s.s ? `s-${s.s}` : ''].filter(Boolean).join(' ');
    // The text of the size tool and (token footerReadout) the footer's line / column readout; cs: the style at the selection.
    BASE.edReadout = (E, m, start, end, cs) => {
      const key = (cs && cs.s) || 'normal';
      E.tools.size.querySelector('.cur').textContent = S.D.sizeCur === 'label' ? E.fam.SIZE_LABEL[key]
        : S.D.sizeCur ? S.D.sizeCur(key, S) : { small: '10', normal: '12', large: '18', huge: '24' }[key];
      const footerLabel = S.D.footerReadout && document.querySelector('.footer-label');
      if (footerLabel) {
        const prefix = E.spec.doc.slice(0, start);
        footerLabel.textContent = `Line ${prefix.split('\n').length}, Column ${prefix.length - prefix.lastIndexOf('\n')}`;
      }
    };
    BASE.barBackground = (E) => (E.lastColor ? E.fam.SWATCHES[E.lastColor] : S.D.barColor);
    BASE.edPainted = () => {}; // end of paint(m)
    BASE.edOnDown = () => {}; // start of the pointerdown handler (e)
    BASE.edLocate = () => undefined; // before the editor's own locate; a point, null or undefined (not handled)

    function buildEditor(ctx, main) {
      return build(ctx, main, S);
    }
    return buildEditor;
  }
  function paint(state, m) {
    const st = state.fam.expand(m.runs, state.spec.doc.length);
    for (let i = 0; i < state.spec.doc.length; i++) {
      const el = state.chars[i];
      if (!el) continue;
      const s = st[i];
      const cls = state.P.charClass(state.E, s, i, m);
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
    state.P.edReadout(state.E, m, start, end, cs);
    for (const [k, o] of Object.entries(state.sizeEls)) {
      if (((cs && cs.s) || 'normal') === k) o.dataset.on = '';
      else delete o.dataset.on;
    }
    if (m.past.length) delete state.tools.undo.dataset.off;
    else state.tools.undo.dataset.off = '';
    if (m.future.length) delete state.tools.redo.dataset.off;
    else state.tools.redo.dataset.off = '';
    state.bar.style.background = state.P.barBackground(state.E);
    state.E.saved.textContent = m.past.length ? state.D.savedText[1] : state.D.savedText[0];
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
    state.P.edPainted(state.E, m);
  }

  function buildDocument(state) {
    ({ util: state.util, spec: state.spec, rng: state.rng } = state.ctx);
    state.fam = env.taskDef.helpers;
    state.E = { ctx: state.ctx, util: state.util, spec: state.spec, rng: state.rng, fam: state.fam, main: state.main, tools: {}, lastColor: state.D.lastColorInit };
    state.ed = state.E.ed = state.util.el('div', 'at-ed', state.main);
    state.P.edHead(state.E);
    state.tb = state.E.tb = state.util.el('div', 'at-tb', state.ed);
    state.E.toolParent = state.tb;
    state.P.edToolbarStart(state.E);
    state.E.wide = state.main.getBoundingClientRect().width > 700;
    state.E.tool = (key, html, title, cls = '') => {
      const b = state.util.el('button', `at-tool ${cls}`, state.E.toolParent);
      b.type = 'button';
      b.innerHTML = html;
      b.title = title;
      if (key) b.dataset.tool = key;
      return b;
    };
    state.E.sep = () => state.util.el('span', 'sep', state.E.toolParent);
    ({ tools: state.tools } = state.E);
    for (const key of state.D.toolbar) state.P.toolItem(state.E, key);
    state.bar = state.E.bar = state.tools.color.querySelector('.A i');
    state.P.toolbarBuilt(state.E);
    state.P.edPopups(state.E);
    ({ swatchEls: state.swatchEls, sizeEls: state.sizeEls, pops: state.pops, colorPop: state.colorPop, sizePop: state.sizePop } = state.E);
    state.area = state.E.area = state.P.edArea(state.E);
    state.P.edAreaBuilt(state.E);
    state.sheet = state.E.sheet = state.util.el('div', 'at-sheet', state.area);
    state.P.edDocTitle(state.E);
    state.docEl = state.E.docEl = state.util.el('div', 'at-doc', state.sheet);
    state.P.edDocBuilt(state.E);
    state.paraEls = state.E.paraEls = [];
    state.marks = state.E.marks = [];
    state.chars = state.E.chars = [];
    state.spec.bounds.forEach(([s, e], p) => {
      const pe = state.util.el('div', 'at-p', state.docEl);
      pe.dataset.p = p;
      const mk = state.util.el('span', 'mk', pe);
      state.marks.push(mk);
      for (let i = s; i < e; i++) state.chars[i] = state.util.el('span', '', pe, state.spec.doc[i]);
      state.paraEls.push(pe);
    });
    state.P.edParasBuilt(state.E);
    state.P.edStatus(state.E);
    state.head = state.spec.task === 'size' ? (state.spec.size === 'huge' ? 1.45 : 1.25) : state.spec.task === 'list' ? 1.15 : 1.12;
    state.avail = state.area.getBoundingClientRect().height - 36;
    state.fs = state.P.docFontStart(state.E);
    for (; state.fs > 13; state.fs--) {
      state.docEl.style.fontSize = `${state.fs}px`;
      if (state.sheet.getBoundingClientRect().height * state.head <= state.avail) break;
    }
    state.docEl.style.fontSize = `${state.fs}px`;
    state.sel = state.E.sel = env.ui.textSelection(state.docEl, {
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
    state.commit = state.E.commit = (m) => {
      state.ctx.update(m);
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
        state.E.lastColor = k === 'default' ? null : k;
        state.commit(state.fam.edApply(state.ctx.model, state.spec, 'color', k));
      });
    }
    for (const [k, o] of Object.entries(state.sizeEls)) o.addEventListener('click', () => state.commit(state.fam.edApply(state.ctx.model, state.spec, 'size', k)));
    state.E.paint = state.paint;
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
        state.P.edOnDown(state.E, e);
        const m = state.ctx.model;
        if (!m.pop) return;
        const p = state.pops[m.pop];
        if (p.contains(e.target) || state.tools[m.pop].contains(e.target)) return;
        state.commit({ ...m, pop: null });
      },
      locate(t) {
        const own = state.P.edLocate(state.E, t);
        if (own !== undefined) return own;
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
      ctx, main, D: scope.D, P: scope.P, clamp: scope.clamp, isField: scope.isField,
      hitPoint: scope.hitPoint,
    };
    state.paint = (m) => paint(state, m);
    buildDocument(state);
    return handlers(state);
  }
  env.template('use-desktop-tools/_workspace-editor', () => ({ install }));
})();
