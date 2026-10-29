/* handle-text/_views: shared views units; S supplies live state and resolved parts. */
(function () {
  'use strict';
  function buildButtons(S, ctx, look) {
    const { spec, util } = ctx;
    const { card, body } = S.frame(ctx, look, look.pick(['i18n-test.html', 'locale.html', 'buttons.html']), 'UTF-8');
    const flow = util.el('div', 'ut-flow', body);
    const btns = {};
    spec.items.forEach((it, i) => {
      if (it.type === 'text') util.el('div', '', flow, it.text);
      else if (it.type === 'input') {
        if (it.label) util.el('span', 'lbl', flow, it.label);
        const inp = util.el('input', 'ut-input', flow);
        inp.type = 'text';
        inp.style.width = it.width + 'px';
        inp.autocomplete = 'off';
        inp.spellcheck = false;
        util.el('br', '', flow);
      } else {
        const b = util.el('button', 'ut-btn' + (look.primary ? ' primary' : ''), flow, it.label);
        b.type = 'button';
        b.dataset.role = 'button';
        b.addEventListener('click', () => {
          const m = S.st.ctx.model;
          if (m.clicked !== null) return;
          S.env.log('click', { what: 'button', label: it.label });
          const n = { ...m, clicked: i };
          if (!S.fam().helpers.buttonCorrect(n, spec)) n.wrongs = (m.wrongs || 0) + 1;
          S.st.ctx.update(n);
          paint(S.st.ctx.model);
        });
        btns[i] = b;
        if (it.br) util.el('br', '', flow);
      }
    });
    const res = S.resultLine(ctx, body, () => {
      const m = S.st.ctx.model;
      if (!S.fam().helpers.wrongPending(m, spec)) return;
      S.st.ctx.update({ ...m, clicked: null });
      paint(S.st.ctx.model);
    });
    function paint(m) {
      for (const [i, b] of Object.entries(btns)) b.classList.toggle('pressed', m.clicked === Number(i));
      if (m.clicked === null || m.clicked === undefined) res.set('', look.pick(['Nothing clicked yet.', 'Waiting for a click.']), false);
      else {
        const label = spec.items[m.clicked].label;
        const bad = S.fam().helpers.wrongPending(m, spec);
        res.set(bad ? 'bad' : 'ok', `You clicked “${label}”.`, bad && spec.recoverable);
      }
    }
    paint(ctx.model);
    S.statusBar(card, util, ['UTF-8', look.pick(['Locale: auto', 'Locale: mixed', 'Encoding test'])]);
    return {
      card,
      loc(t) {
        if (t.undo) return res.locate();
        return t.choice !== undefined && btns[t.choice] ? util.center(btns[t.choice]) : null;
      },
      sync: paint,
    };
  }

  function buildEdit(S, ctx, look) {
    const { spec, util } = ctx;
    const { card, body } = S.frame(ctx, look, look.pick(['compose', 'editor', 'draft.txt', 'message']), look.pick([null, 'Edit', 'Draft']));
    card.classList.add('ut-edit');
    S.st.copyModel = true;
    const mode = spec.mode;
    util.el('p', 'ut-sub', body, { insert: 'Click where the text should go, then type.', cut: 'Ctrl+X cuts, Ctrl+V pastes.',
      undo: 'Ctrl+Z undoes the last change.', 'paste-at': 'Ctrl+C copies, Ctrl+V pastes at the caret.' }[mode]);
    if (mode === 'paste-at') {
      const note = util.el('div', 'ut-note', body);
      util.el('div', 'ut-src-title', note, `${spec.snippet.title} · ${spec.snippet.label}`);
      S.st.editBox = true;
      S.st.sels = [];
      const { text, sel } = S.sourceBox(ctx, note, { text: spec.snippet.text }, 0, (on) => focusTo(on ? 'box' : null), (v) => {
        const s = S.modelSel(v ? { box: 0, ...v } : S.liveSel());
        const mm = S.st.ctx.model;
        if (!S.sameSel(s, mm.sel)) S.st.ctx.update({ ...mm, sel: s });
      });
      text.style.width = 'auto';
      S.st.sels.push(sel);
      S.st.snippet = text;
    }
    const longest = Math.max(...spec.fields.map((f) => Math.max(f.value.length, f.target.length)));
    const inputs = spec.fields.map((f, i) => {
      const fr = S.fieldRow(ctx, body, { label: f.label, placeholder: i === 1 ? look.pick(['Paste here', '', 'Empty']) : '' }, false, `edit${i}`, (v) => onInput(i, v), ctx.model.values[i]);
      fr.input.style.width = `${Math.min(S.st.maxW - 40, Math.max(300, longest * 8.6 + 60))}px`;
      fr.input.addEventListener('focus', () => focusTo(`f${i}`));
      fr.input.addEventListener('blur', () => focusTo(null));
      for (const ev of ['mouseup', 'keyup', 'select', 'click']) fr.input.addEventListener(ev, () => mirrorSel(i));
      return fr;
    });
    S.st.inputs = inputs;
    // Undo history of field 0 (the page's own; the browser's is not used).
    if (mode === 'undo') {
      inputs[0].input.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
          e.preventDefault();
          const m = S.st.ctx.model;
          if (!m.history.length) return;
          const history = m.history.slice();
          const prev = history.pop();
          S.env.log('undo', { what: 'edit0' });
          inputs[0].api.set(prev);
          S.st.ctx.update({ ...m, values: [prev], history, caret: prev.length });
        }
      });
    }
    function onInput(i, v) {
      const m = S.st.ctx.model;
      if (m.values[i] === v) return;
      const values = m.values.slice();
      values[i] = v;
      const patch = { values, caret: inputs[i].input.selectionStart, sel: null };
      if (mode === 'undo' && i === 0) patch.history = m.history.concat([m.values[0]]).slice(-30);
      S.st.ctx.update({ ...m, ...patch });
    }
    function focusTo(f) {
      const m = S.st.ctx.model;
      if (m.focus !== f) S.st.ctx.update({ ...m, focus: f, ...(f && f[0] === 'f' ? { caret: inputs[Number(f.slice(1))].input.selectionStart } : {}) });
    }
    function mirrorSel(i) {
      const el = inputs[i].input;
      if (document.activeElement !== el) return;
      const m = S.st.ctx.model;
      const a = el.selectionStart;
      const b = el.selectionEnd;
      const sel = b > a ? { field: i, start: a, end: b } : null;
      if (m.caret !== a || !S.sameSel(sel, m.sel) || m.focus !== `f${i}`) S.st.ctx.update({ ...m, caret: a, sel, focus: `f${i}` });
    }
    S.st.onSelection = () => {
      const ae = document.activeElement;
      const i = inputs.findIndex((x) => x.input === ae);
      if (i >= 0) mirrorSel(i);
    };
    S.statusBar(card, util, [`${spec.fields.length} field${spec.fields.length > 1 ? 's' : ''}`, look.pick(['Plain text', 'UTF-8', 'Autosave off'])]);
    return {
      card,
      loc(t) {
        if (t.efield !== undefined) return inputs[t.efield].api.locate();
        if (t.caret) return S.caretPoint(inputs[t.caret[0]].input, t.caret[1]);
        if (t.snippet) return util.center(S.st.snippet);
        return null;
      },
      sync(m) { inputs.forEach((x, i) => { if (x.input.value !== m.values[i]) x.api.set(m.values[i]); }); },
    };
  }

  function buildFind(S, ctx, look) {
    const { spec, util } = ctx;
    const page = spec.mode === 'page';
    const { card, body } = S.frame(ctx, look, look.pick([`${spec.title.toLowerCase().replace(/\s+/g, '-')}.html`, 'document.md', 'reader']), look.pick([null, 'Read only']));
    util.el('h2', 'ut-h', body, spec.title);
    let pane = null;
    let doc;
    let lbx = null;
    if (page) {
      card.classList.add('flow');
      card.style.width = `${S.st.pageW}px`;
      doc = util.el('div', 'ut-page', body);
    } else {
      const box = util.el('div', 'ut-scroll', body);
      box.dataset.role = 'textbox';
      pane = util.el('div', 'ut-doc' + (spec.route === 'wheel' && look.native ? ' native' : ''), box);
      pane.dataset.role = 'scrolltext';
      pane.style.height = `${look.paneH}px`;
      pane.style.width = `${look.paneW}px`;
      doc = pane;
    }
    const segments = [];
    let at = 0;
    const paras = spec.paragraphs.map((p) => {
      const el = util.el('p', '', doc, p);
      segments.push({ node: el.firstChild, start: at });
      at += p.length + 2;
      return el;
    });
    const sel = S.env.ui.textSelection(doc, {
      segments,
      length: spec.doc.length,
      value: ctx.model.sel || { start: 0, end: 0 },
      label: 'doc',
      onChange(v) {
        const m = S.st.ctx.model;
        const s = v && v.end > v.start ? { start: v.start, end: v.end } : null;
        if (JSON.stringify(s) !== JSON.stringify(m.sel)) S.st.ctx.update({ ...m, sel: s });
      },
    });
    S.st.docSel = sel;
    if (!page) {
      const track = util.el('div', 'ut-track', pane.parentElement);
      track.dataset.role = 'scrollbar';
      const thumb = util.el('div', 'ut-thumb', track);
      thumb.dataset.role = 'thumb';
      const native = pane.classList.contains('native');
      if (native) track.remove();
      lbx = S.env.ui.listbox(pane, {
        label: 'doc',
        options: paras.map((el, i) => [i, el]),
        onScroll: S.ofEpisode(ctx, () => mirror()),
        scrollbar: native ? null : { track, thumb, pad: 2, minThumb: 24, onDrag: (on) => thumb.classList.toggle('dragging', on) },
      });
    }
    // Where the phrase is relative to the pane: -1 above, 0 fully in view, 1 below (mirrored for the plan).
    function phraseRect() {
      const r = document.createRange();
      const w = spec.want;
      const p = paras[spec.para];
      const off = w.start - segments[spec.para].start;
      r.setStart(p.firstChild, off);
      r.setEnd(p.firstChild, off + (w.end - w.start));
      return r.getBoundingClientRect();
    }
    function mirror() {
      let where = 0;
      if (!page) {
        const pr = pane.getBoundingClientRect();
        const r = phraseRect();
        where = r.top < pr.top + 2 ? -1 : r.bottom > pr.bottom - 2 ? 1 : 0;
      }
      const m = S.st.ctx.model;
      if (m.where !== where) S.st.ctx.update({ ...m, where });
    }
    // Thumb release point that brings the phrase to the middle of the pane.
    function thumbForPhrase() {
      const pr = pane.getBoundingClientRect();
      const target = pane.scrollTop + (phraseRect().top - pr.top) - pane.clientHeight / 2;
      const offs = paras.map((el) => el.offsetTop - paras[0].offsetTop);
      let i = 0;
      while (i < offs.length - 1 && offs[i + 1] <= target) i++;
      const span = i < offs.length - 1 ? offs[i + 1] - offs[i] : paras[i].offsetHeight || 1;
      return lbx.locateThumbFor(i + Math.max(0, target - offs[i]) / span);
    }
    S.statusBar(card, util, [`${spec.paragraphs.length} paragraphs`, `${spec.doc.split(/\s+/).length} words`]);
    return {
      card,
      page,
      after: mirror,
      loc(t) {
        if (t.doc) return sel.locateChar(t.char, t.edge);
        if (t.pane) {
          const r = pane.getBoundingClientRect();
          return [r.left + r.width * 0.45, r.top + r.height / 2];
        }
        if (t.thumb !== undefined) return lbx.locateThumb();
        if (t.scrollTo) return thumbForPhrase();
        return null;
      },
      sync(m) { sel.set(m.sel || { start: 0, end: 0 }); },
    };
  }
  env.template('handle-text/_views', () => ({ buildButtons, buildEdit, buildFind }));
})();
