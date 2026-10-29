/* handle-text/_editor-parts: editor-specific part builders; each group preserves its original order.
 * S keeps state, tokens and resolved parts live across resets and design overrides. */
(function () {
  'use strict';
  function clipboardParts(S) {
    const BASE = {};
    BASE.ensureStyle = function () {
      if (document.getElementById('ut-style')) return;
      const s = document.createElement('style');
      s.id = 'ut-style';
      s.textContent = S.CSS;
      document.head.prepend(s);
    };
    BASE.fam = () => env.taskDef;
    BASE.live = () => S.st && S.st.card && S.st.card.isConnected;
    BASE.isTextInput = (el) => !!(el && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search'))) && !el.disabled && !el.readOnly);
    BASE.up = (patch) => S.st.ctx.update({ ...S.st.ctx.model, ...patch });
    BASE.liveSel = function () {
      return env.templateLib('handle-text/_clipboard').liveSel(S);
    };
    BASE.sameSel = (a, b) => (!a && !b) || (a && b && a.box === b.box && a.field === b.field && a.start === b.start && a.end === b.end);
    BASE.modelSel = (s) => (s && S.st.editBox ? { box: true, start: s.start, end: s.end } : s);
    BASE.copied = function (text) {
      return env.templateLib('handle-text/_clipboard').copied(S, text);
    };
    BASE.onCopy = function (e) {
      return env.templateLib('handle-text/_clipboard').onCopy(S, e);
    };
    BASE.onPaste = function (e) {
      return env.templateLib('handle-text/_clipboard').onPaste(S, e);
    };
    BASE.install = function () {
      return env.templateLib('handle-text/_clipboard').install(S);
    };
    return BASE;
  }

  function geometryParts(S) {
    const BASE = {};
    BASE.usable = function (ctx) {
      const box = S.P.stageBox(ctx);
      if (!S.D.avoidSubmit) return box;
      const sr = ctx.stage.getBoundingClientRect();
      const sub = env.submitEl && env.submitEl.getBoundingClientRect();
      if (sub && sub.width && sub.left < sr.right && sub.right > sr.left && sub.top < sr.bottom && sub.bottom > sr.top) {
        const cutH = sr.bottom - sub.top + 10;
        const cutW = sr.right - sub.left + 10;
        if (cutH * box.w <= cutW * box.h) box.h -= cutH;
        else box.w -= cutW;
      }
      return box;
    };
    BASE.caretPoint = function (input, k) {
      if (!S.measurer || !S.measurer.isConnected) {
        S.measurer = document.createElement('span');
        S.measurer.style.cssText = 'position:absolute;left:-9999px;top:-9999px;visibility:hidden;white-space:pre;';
        document.body.append(S.measurer);
      }
      const cs = getComputedStyle(input);
      // The computed `font` shorthand is empty when a longhand it cannot express is set (the checker's pinned
      // font-variant-ligatures), and an empty font would measure in the default face: copy the longhands.
      S.measurer.style.font = cs.font;
      if (!S.measurer.style.font) {
        S.measurer.style.fontFamily = cs.fontFamily;
        S.measurer.style.fontSize = cs.fontSize;
        S.measurer.style.fontWeight = cs.fontWeight;
        S.measurer.style.fontStyle = cs.fontStyle;
        S.measurer.style.fontStretch = cs.fontStretch;
      }
      S.measurer.style.letterSpacing = cs.letterSpacing;
      S.measurer.textContent = input.value.slice(0, k);
      const w = S.measurer.getBoundingClientRect().width;
      const r = input.getBoundingClientRect();
      const x = r.left + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft) + w - input.scrollLeft;
      return [Math.min(r.right - 3, x), r.top + r.height / 2];
    };
    BASE.frame = function (ctx, look, file, tag) {
      return env.templateLib('handle-text/_frame').frame(S, ctx, look, file, tag);
    };
    BASE.statusBar = function (card, util, items) {
      return env.templateLib('handle-text/_frame').statusBar(S, card, util, items);
    };
    BASE.fieldRow = function (ctx, parent, f, inline, id, onInput, value) {
      const { util } = ctx;
      const row = util.el('div', 'ut-fieldrow' + (inline ? ' inline' : ''), parent);
      const label = util.el('label', 'ut-label', row, f.label);
      const input = S.P.fieldInput(ctx, row, id);
      input.id = `ut-${id}`;
      label.htmlFor = input.id;
      input.name = id;
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('autocorrect', 'off');
      input.dataset.role = 'field';
      if (f.placeholder || S.D.emptyPlaceholder !== null) input.placeholder = f.placeholder || S.D.emptyPlaceholder;
      const api = env.ui.textField(input, { value, label: id, onInput });
      const field = { row, input, api };
      S.P.fieldCreated(ctx, field, f, id);
      return field;
    };
    BASE.resultLine = function (ctx, parent, onUndo) {
      return env.templateLib('handle-text/_frame').resultLine(S, ctx, parent, onUndo);
    };
    return BASE;
  }

  function sourcesParts(S) {
    const BASE = {};
    BASE.lineBox = function (ctx, parent, lines, opts) {
      const { util } = ctx;
      const box = util.el('div', 'ut-scroll', parent);
      box.dataset.role = 'textbox';
      const list = util.el('div', 'ut-list' + (opts.numbered ? '' : ' plain') + (opts.native ? ' native' : ''), box);
      list.dataset.role = 'scrolltext';
      S.P.lineLayout(ctx, box, list, opts);
      const els = lines.map((l, i) => {
        const row = util.el('div', 'ut-ln' + (opts.head && opts.head(l) ? ' head' : ''), list);
        S.P.lineRow(ctx, row, opts, i);
        if (opts.numbered) util.el('span', 'ut-num', row, String(i + 1));
        util.el('span', '', row, l || ' ');
        return [i, row];
      });
      S.P.linesCreated(ctx, box, list, els, opts);
      const scrollbar = opts.native ? null : S.P.scrollbar(ctx, box, list, opts);
      return S.P.lineApi(ctx, box, list, els, opts, scrollbar);
    };
    BASE.scrollLoc = function (t, lbx, spec, list) {
      return env.templateLib('handle-text/_frame').scrollLoc(S, t, lbx, spec, list);
    };
    BASE.sourceBox = function (ctx, parent, b, i, onFocus, onSel) {
      const { util } = ctx;
      const text = util.el('div', 'ut-text' + (b.lines ? ' lines' + (b.numbered ? '' : ' plain') : ''), parent);
      text.tabIndex = 0;
      text.dataset.role = 'source';
      text.dataset.box = String(i);
      let segments;
      if (b.lines) {
        S.P.sourceLines(ctx, text, b, i);
        segments = [];
        let at = 0;
        b.lines.forEach((l, k) => {
          const row = util.el('div', 'ut-ln', text);
          if (b.numbered) util.el('span', 'ut-num', row, String(k + 1));
          const span = util.el('span', '', row, l);
          segments.push({ node: span, start: at });
          at += l.length + 1;
        });
      } else {
        text.textContent = b.text;
        segments = [{ node: text.firstChild, start: 0 }];
      }
      const sel = env.ui.textSelection(text, {
        segments,
        skip: '.ut-num',
        length: b.text.length,
        value: { start: 0, end: 0 },
        label: `box${i}`,
        onChange: () => onSel(),
      });
      text.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'a' || e.key === 'A')) {
          e.preventDefault();
          sel.set({ start: 0, end: b.text.length });
          env.log('select', { what: `box${i}`, start: 0, end: b.text.length, all: true });
          onSel({ start: 0, end: b.text.length });
        }
      });
      text.addEventListener('focus', () => onFocus(true));
      text.addEventListener('blur', () => onFocus(false));
      const source = { text, sel };
      S.P.sourceCreated(ctx, parent, b, i, source);
      return source;
    };
    return BASE;
  }

  function copyParts(S) {
    const BASE = {};
    BASE.buildCopy = function (ctx, look) {
      const { spec, util } = ctx;
      const typed = !S.P.fam().helpers.isCopy(spec);
      const file = typed ? look.pick(['entry.txt', 'input.txt', 'untitled']) : look.pick(['clipboard.txt', 'notes.txt', 'scratch.md', 'untitled.txt']);
      const { card, body } = S.P.frame(ctx, look, file, typed ? 'UTF-8' : look.tag);
      S.st.copyModel = !typed;
      const fieldFirst = !typed && look.fieldFirst;
      function setFocus(f) {
        const m = S.st.ctx.model;
        if (m.focus !== f) S.st.ctx.update({ ...m, focus: f });
      }
      const field = () => {
        const fr = S.P.fieldRow(ctx, body, spec.field, look.inline, 'answer', (v) => {
          const m = S.st.ctx.model;
          if (m.field !== v) S.st.ctx.update({ ...m, field: v });
        }, ctx.model.field);
        S.P.copyField(ctx, fr, typed);
        S.st.field = fr;
        fr.input.addEventListener('focus', () => setFocus('field'));
        fr.input.addEventListener('blur', () => setFocus(null));
      };
      if (typed) {
        S.P.typedSample(ctx, body, look);
        field();
        S.P.statusBar(card, util, ['UTF-8', 'Ln 1, Col 1', look.pick(['Plain text', 'Text'])]);
        return { card, loc: (t) => (t.field ? S.st.field.api.locate() : null), sync: (m) => S.st.field.api.set(m.field) };
      }
      if (fieldFirst) field();
      const wrapEl = util.el('div', 'ut-boxes ' + look.boxDir + (spec.boxes.length > S.D.denseSources ? ' dense-sources' : ''), body);
      S.st.sels = [];
      spec.boxes.forEach((b, i) => {
        const src = util.el('div', 'ut-src', wrapEl);
        S.P.sourceContainer(ctx, src, b, i);
        util.el('div', 'ut-src-title', src, spec.refBy === 'ordinal' ? `${b.title} · ${i + 1}` : b.title);
        const { sel } = S.P.sourceBox(ctx, src, b, i, (on) => setFocus(on ? `box:${i}` : null), (v) => {
          const s = v ? { box: i, ...v } : S.P.liveSel();
          const mm = S.st.ctx.model;
          if (!S.P.sameSel(s, mm.sel)) S.st.ctx.update({ ...mm, sel: s });
        });
        const m = ctx.model;
        if (m.sel && m.sel.box === i) sel.set(m.sel);
        S.st.sels.push(sel);
      });
      if (!fieldFirst) field();
      S.P.copyBuilt(ctx, card, wrapEl);
      S.P.statusBar(card, util, [`${spec.boxes.length} ${spec.boxes.length === 1 ? 'source' : 'sources'}`, 'Ctrl+C copy · Ctrl+V paste', 'UTF-8']);
      return {
        card,
        loc(t) {
          if (t.field) return S.st.field.api.locate();
          if (t.box !== undefined && t.char !== undefined) return S.st.sels[t.box].locateChar(t.char, t.edge);
          if (t.box !== undefined) return util.center(S.st.sels[t.box].container);
          return null;
        },
        sync(m) { S.st.field.api.set(m.field); },
      };
    };
    BASE.buildButtons = function (ctx, look) {
      return env.templateLib('handle-text/_views').buildButtons(S, ctx, look);
    };
    return BASE;
  }

  function scrollParts(S) {
    const BASE = {};
    BASE.buildScroll = function (ctx, look) {
      const { spec, util } = ctx;
      const { card, body } = S.P.frame(ctx, look, look.pick(['readme.txt', 'chapter.txt', 'notes.txt', 'log.txt', 'draft.md']), look.tag);
      const holder = util.el('div', 'ut-body ' + (spec.mode === 'edge' ? 'col' : look.inline ? 'row' : 'col'), body);
      holder.style.padding = '0';
      const range = S.P.documentRange(ctx, holder, look);
      const sb = S.P.lineBox(ctx, holder, spec.lines, {
        rows: spec.rows,
        lh: look.lh,
        printLh: range.printLh,
        numbered: spec.numbered,
        native: spec.route === 'wheel' && look.native,
        onScroll(i) {
          const s = range.read(i);
          range.show(s);
          const m = S.st.ctx.model;
          const next = S.P.fam().helpers.scrolled(m, spec, s);
          if (s !== m.scroll || (S.D.recordSeen && next.seen !== m.seen)) S.st.ctx.update(next);
        },
      });
      range.bind(sb);
      S.P.documentBound(ctx, sb, range);
      sb.lbx.set({ scroll: ctx.model.scroll });
      if (spec.mode !== 'edge') {
        const col = util.el('div', 'ut-body col', holder);
        col.style.padding = '0';
        S.st.field = S.P.fieldRow(ctx, col, spec.field, false, 'answer', (v) => {
          const m = S.st.ctx.model;
          if (m.field !== v) S.st.ctx.update({ ...m, field: v });
        }, ctx.model.field);
        S.P.documentField(ctx, S.st.field);
      }
      S.P.statusBar(card, util, [`${spec.lines.length} lines`, look.pick(['Read only', 'UTF-8', 'Plain text'])]);
      return {
        card,
        after: () => S.P.documentAfter(ctx, sb, range, look),
        loc(t) {
          if (t.field) return S.st.field.api.locate();
          return S.P.scrollLoc(t, sb.lbx, spec, sb.list);
        },
        sync(m) {
          if (Math.abs(sb.lbx.scrollIndex() - m.scroll) > 0.01) sb.lbx.set({ scroll: m.scroll });
          range.show(m.scroll);
          if (S.st.field) S.st.field.api.set(m.field);
        },
      };
    };
    return BASE;
  }

  function agreementParts(S) {
    const BASE = {};
    BASE.buildSign = function (ctx, look) {
      const { spec, util } = ctx;
      const { card, body } = S.P.frame(ctx, look, look.pick(['agreement.pdf', 'terms.html', 'license.txt']), null);
      S.P.signLook(ctx, look, card);
      util.el('h2', 'ut-h', body, spec.heading);
      const parent = S.P.signParent(ctx, body);
      const scroll = S.P.signScroll(ctx, card, body, look);
      const sb = S.P.lineBox(ctx, parent, spec.lines, {
        ...scroll.options,
        rows: spec.rows,
        lh: look.lh,
        numbered: false,
        native: spec.route === 'wheel' && look.native,
        head: (l) => /^\d+\. /.test(l),
        onScroll(i) {
          scroll.read(i, paint);
        },
      });
      scroll.initial(sb);
      S.P.signAcknowledgment(ctx, parent);
      const fr = S.P.fieldRow(ctx, parent, spec.field, look.inline, 'name', (v) => {
        const m = S.st.ctx.model;
        if (m.name !== v && !m.pressed) S.st.ctx.update({ ...m, name: v });
      }, ctx.model.name);
      S.P.signField(ctx, fr);
      S.st.field = fr;
      S.P.signCaption(ctx, body);
      const actions = util.el('div', 'ut-actions', body);
      const hint = util.el('span', 'ut-hint', actions, 'Scroll to the end of the agreement to continue.');
      const mk = (key, label, primary) => {
        const b = util.el('button', 'ut-btn' + (primary ? ' primary' : ''), actions, label);
        b.type = 'button';
        b.dataset.role = 'button';
        b.addEventListener('click', () => {
          const m = S.st.ctx.model;
          if (!S.P.signEnabled(ctx, m, key) || m.pressed) return;
          env.log('click', { what: key });
          const n = { ...m, pressed: key, signed: m.name };
          if (!S.P.fam().helpers.signCorrect(n, spec)) n.wrongs = (m.wrongs || 0) + 1;
          S.st.ctx.update(n);
          paint(S.st.ctx.model);
        });
        return b;
      };
      const order = look.agreeFirst ? [['agree', 'Agree', true], ['cancel', 'Cancel', false]] : [['cancel', 'Cancel', false], ['agree', 'Agree', true]];
      const btns = {};
      for (const [k, l, p] of order) btns[k] = mk(k, l, p);
      const res = S.P.resultLine(ctx, body, () => {
        const m = S.st.ctx.model;
        if (!S.P.fam().helpers.wrongPending(m, spec)) return;
        S.st.ctx.update({ ...m, pressed: null, signed: null });
        paint(S.st.ctx.model);
      });
      function paint(m) {
        const on = m.unlocked && !m.pressed;
        fr.input.disabled = !on;
        btns.agree.disabled = !on;
        btns.cancel.disabled = !(S.P.signEnabled(ctx, m, 'cancel') && !m.pressed);
        hint.classList.toggle('ok', !!m.unlocked);
        hint.textContent = m.unlocked ? 'You have reached the end.' : 'Scroll to the end of the agreement to continue.';
        for (const k of ['agree', 'cancel']) btns[k].classList.toggle('pressed', m.pressed === k);
        if (!m.pressed) res.set('', 'Not signed yet.', false);
        else {
          const bad = S.P.fam().helpers.wrongPending(m, spec);
          const what = m.pressed === 'agree' ? `Signed by ${m.signed || '(no name)'}.` : 'You declined the agreement.';
          res.set(bad ? 'bad' : 'ok', what, bad && spec.recoverable);
        }
        S.P.signPaint(ctx, body, m);
      }
      paint(ctx.model);
      S.P.statusBar(card, util, [`${spec.lines.length} lines`, look.pick(['Version 3.2', 'Effective immediately', 'Last updated: see section 1'])]);
      scroll.built();
      return {
        card,
        after: () => scroll.after(sb, fr),
        dispose: () => scroll.dispose(),
        loc(t) {
          if (t.field) return fr.api.locate();
          if (t.button) return util.center(btns[t.button]);
          if (t.undo) return res.locate();
          return S.P.scrollLoc(t, sb.lbx, spec, sb.list);
        },
        sync(m) {
          scroll.sync(sb, m);
          fr.api.set(m.name);
          paint(m);
        },
      };
    };
    return BASE;
  }

  function spinnerParts(S) {
    const BASE = {};
    BASE.buildSpinner = function (ctx, look) {
      const { spec, util } = ctx;
      const F = S.P.fam();
      const { card, body } = S.P.frame(ctx, look, look.pick(['settings', 'preferences.ini', 'options']), null);
      util.el('p', 'ut-sub', body, spec.editable ? look.pick(['Type a value or use the arrows.', 'Enter a number or step with the buttons.'])
        : look.pick(['Adjust the value with the arrows.', 'Hold a button to change the value faster.', 'Values change one step per click.']));
      const row = util.el('div', 'ut-fieldrow' + (look.inline ? ' inline' : ''), body);
      const label = util.el('label', 'ut-label', row, spec.label);
      const wrapEl = util.el('div', 'ut-spin ' + look.spin, row);
      const input = util.el('input', 'ut-input');
      input.type = 'text';
      input.readOnly = !spec.editable;
      input.id = 'ut-spin';
      input.autocomplete = 'off';
      input.spellcheck = false;
      label.htmlFor = input.id;
      input.dataset.role = 'field';
      if (spec.editable) input.style.cursor = 'text';
      const mkBtn = (cls, html) => {
        const b = util.el('button', 'ut-sb ' + cls);
        b.type = 'button';
        b.dataset.role = 'button';
        b.innerHTML = html;
        return b;
      };
      let upB;
      let downB;
      if (look.spin === 'stacked') {
        wrapEl.append(input);
        const arrows = util.el('div', 'ut-arrows', wrapEl);
        upB = mkBtn('up', S.D.upSvg);
        downB = mkBtn('dn', S.D.downSvg);
        arrows.append(upB, downB);
      } else {
        downB = mkBtn('dn', '−');
        upB = mkBtn('up', '+');
        wrapEl.append(downB, input, upB);
      }
      if (spec.unit) util.el('span', 'ut-unit', wrapEl, spec.unit);
      const clampV = (v) => Math.max(spec.min ?? -Infinity, Math.min(spec.max ?? Infinity, v));
      const show = (v) => { input.value = F.helpers.fmtSpin(spec, v); };
      S.st.spinHold = true;
      // Press: one step at once, then auto-repeat on the kit clock (task tick) until released.
      for (const [b, dir] of [[upB, 1], [downB, -1]]) {
        b.addEventListener('pointerdown', (e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          const m = S.st.ctx.model;
          const v = clampV(m.value + dir);
          env.log('step', { what: 'spinner', dir, value: v });
          S.st.ctx.update({ ...m, value: v, hold: { dir, since: S.st.ctx.clock(), n: 0 } });
          show(S.st.ctx.model.value);
        });
      }
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        e.preventDefault();
        const m = S.st.ctx.model;
        const v = clampV(m.value + (e.key === 'ArrowUp' ? 1 : -1));
        env.log('step', { what: 'spinner', key: e.key, value: v });
        if (v !== m.value) S.st.ctx.update({ ...m, value: v });
        show(S.st.ctx.model.value);
      });
      input.addEventListener('focus', () => { if (!S.st.ctx.model.focus) S.P.up({ focus: true }); });
      S.P.spinnerInput(ctx, input, clampV, show);
      input.addEventListener('blur', () => {
        show(S.st.ctx.model.value);
        if (S.st.ctx.model.focus) S.P.up({ focus: false });
      });
      if (spec.editable) {
        input.addEventListener('input', () => {
          const t = F.helpers.parseSpin(spec, input.value);
          const m = S.st.ctx.model;
          if (t !== null && t !== m.value) S.st.ctx.update({ ...m, value: t });
        });
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); show(S.st.ctx.model.value); } });
      }
      show(ctx.model.value);
      S.P.spinnerBuilt(ctx, body);
      const range = spec.min !== null || spec.max !== null
        ? `Range ${spec.min !== null ? F.helpers.fmtSpin(spec, spec.min) : '−∞'} – ${spec.max !== null ? F.helpers.fmtSpin(spec, spec.max) : '∞'}`
        : 'No limits';
      S.P.statusBar(card, util, [`Step ${F.helpers.fmtSpin(spec, 1)}${spec.unit ? ' ' + spec.unit : ''}`, range]);
      return {
        card,
        loc: (t) => (t.spin === 'up' ? util.center(upB) : t.spin === 'down' ? util.center(downB) : t.spin === 'value' ? util.center(input) : null),
        sync(m) {
          if (document.activeElement === input && spec.editable && F.helpers.parseSpin(spec, input.value) === m.value) return;
          show(m.value);
        },
      };
    };
    return BASE;
  }

  function editingParts(S) {
    const BASE = {};
    BASE.buildEdit = function (ctx, look) {
      return env.templateLib('handle-text/_views').buildEdit(S, ctx, look);
    };
    BASE.buildFind = function (ctx, look) {
      return env.templateLib('handle-text/_views').buildFind(S, ctx, look);
    };
    BASE.makeLook = (rng, spec, box, squeeze) => {
      const lh = S.P.lineHeight(spec, box);
      const look = {
        pick: (xs) => xs[0], dots: false, tag: null, fieldFirst: false, inline: false,
        primary: false, agreeFirst: true, native: false, spin: 'stacked', boxDir: 'row',
        lh, paneW: box.w - 60, paneH: box.h - 160, align: ['start', 'start'], jitter: [0, 0],
        vars: {
          '--ut-r': '3px', '--ut-pad': '18px', '--ut-gap': '18px', '--ut-fs': '18px',
          '--ut-lh': lh + 'px', '--ut-font': 'Arial, sans-serif',
          '--ut-bw': Math.max(250, (box.w - 90) / (spec.boxes?.length || 1) / 2) + 'px',
          '--ut-fw': Math.max(200, box.w * .4) + 'px', '--ut-ih': '44px', '--ut-sw': '110px',
        },
      };
      return look;
    };
    return BASE;
  }

  function fieldsParts(S) {
    const BASE = {};
    BASE.stageBox = (ctx) => ({ x: 0, y: 0, w: ctx.size.width, h: ctx.size.height });
    BASE.fieldInput = (ctx, row) => {
      const input = ctx.util.el('input', 'ut-input', row);
      input.type = 'text';
      return input;
    };
    BASE.fieldCreated = () => {};
    BASE.sourceLines = () => {};
    BASE.sourceCreated = () => {};
    BASE.sourceContainer = () => {};
    BASE.copyBuilt = () => {};
    BASE.copyField = (ctx, fr, typed) => {
      if (!typed && S.D.copyPlaceholder) fr.input.placeholder = `Paste the text from ${ctx.spec.boxes.length === 1 ? 'the ' + ctx.spec.boxes[0].title : 'the requested box'} here...`;
    };
    BASE.typedSample = (ctx, body, look) => {
      if (S.D.unicodeSample) {
        const samples = ctx.util.el('div', 'ut-boxes unicode-sample', body);
        const src = ctx.util.el('div', 'ut-src', samples);
        ctx.util.el('div', 'ut-text', src, ctx.spec.answer);
      } else ctx.util.el('p', 'ut-sub', body, look.pick(['Unicode text is supported.', 'Any characters are allowed.', 'Type the text exactly.']));
    };
    BASE.lineHeight = (spec, box) => spec.rows ? (S.D.document ? Math.max(20, (box.h - 40) / spec.rows) : Math.max(20, Math.min(80, Math.floor((box.h - 155) / spec.rows)))) : 28;
    BASE.lookMade = (ctx, look, box) => {
      if (S.D.copyLineHeight) {
        look.lh = Math.max(24, Math.min(68, (box.h - 85) / (ctx.spec.boxes?.[0].lines?.length || 8)));
        look.vars['--ut-lh'] = look.lh + 'px';
      }
      if (S.D.agreementLook) {
        if (ctx.spec.rows) {
          const reserve = parseFloat(getComputedStyle(ctx.stage).getPropertyValue('--agreement-reserve')) || 164;
          look.lh = Math.max(20, (box.h - reserve - 2) / ctx.spec.rows);
        }
        look.vars['--ut-lh'] = look.lh + 'px';
      }
    };
    return BASE;
  }

  function linesParts(S) {
    const BASE = {};
    BASE.lineLayout = (ctx, box, list, opts) => {
      if (S.D.lineImportant) {
        list.style.setProperty('height', opts.rows * opts.lh + 'px', 'important');
        box.style.flex = 'none';
      } else list.style.height = opts.rows * opts.lh + 'px';
      if (opts.printLh) {
        list.classList.add('printed-document');
        list.style.paddingBottom = Math.max(0, opts.rows * (opts.lh - opts.printLh)) + 'px';
        list.style.setProperty('--ut-print-lh', opts.printLh + 'px');
      }
    };
    BASE.lineRow = (ctx, row, opts) => {
      if (opts.printLh) {
        row.style.height = opts.printLh + 'px';
        row.style.minHeight = opts.printLh + 'px';
      }
    };
    BASE.linesCreated = () => {};
    BASE.scrollbar = (ctx, box, list, opts) => {
      const { util } = ctx;
      let rail = box;
      if (S.D.scrollArrows) {
        rail = util.el('div', 'ut-scroll-rail', box);
        const upArrow = util.el('button', 'ut-scroll-arrow', rail, '⌃');
        upArrow.type = 'button';
        upArrow.setAttribute('aria-label', 'Scroll up');
        upArrow.addEventListener('click', () => { list.scrollTop -= opts.lh; });
      }
      const track = util.el('div', 'ut-track', rail);
      track.dataset.role = 'scrollbar';
      const thumb = util.el('div', 'ut-thumb', track);
      thumb.dataset.role = 'thumb';
      const scrollbar = { track, thumb, pad: opts.printLh ? track.clientWidth : 2, minThumb: 24, onDrag: (on) => thumb.classList.toggle('dragging', on) };
      if (S.D.scrollArrows) {
        const downArrow = util.el('button', 'ut-scroll-arrow', rail, '⌄');
        downArrow.type = 'button';
        downArrow.setAttribute('aria-label', 'Scroll down');
        downArrow.addEventListener('click', () => { list.scrollTop += opts.lh; });
      }
      return scrollbar;
    };
    BASE.lineApi = (ctx, box, list, els, opts, scrollbar) => {
      const lbx = env.ui.listbox(list, { label: 'text', options: els, onScroll: opts.onScroll, scrollbar });
      return { box, list, lbx };
    };
    BASE.printLineHeight = (ctx) => Math.max(S.D.printMin, Math.min(S.D.printMax, ctx.size.width / S.D.printDivisor));
    BASE.documentRange = (ctx, holder, look) => {
      if (!S.D.document) return { printLh: null, read: (i) => Math.round(i * 1000) / 1000, show() {}, bind() {} };
      const dh = ctx.util.el('div', 'ut-dochead', holder);
      ctx.util.el('strong', '', dh, S.D.documentTitle);
      const count = ctx.util.el('span', 'cnt', dh);
      const printLh = S.P.printLineHeight(ctx, look);
      const range = {
        printLh, visibleRows: (ctx.spec.rows * look.lh) / printLh, sb: null,
        read: (i) => Math.round(i * 1000) / 1000,
        show(scroll) {
          const first = Math.floor(scroll) + 1;
          count.textContent = `Lines: ${first}–${Math.min(ctx.spec.lines.length, Math.ceil(scroll + range.visibleRows))} of ${ctx.spec.lines.length}`;
        },
        bind(sb) { range.sb = sb; },
      };
      range.show(ctx.model.scroll);
      return range;
    };
    BASE.documentBound = () => {};
    BASE.documentAfter = () => {};
    BASE.documentField = (ctx, fr) => {
      if (!S.D.document) return;
      fr.input.removeAttribute('placeholder');
      const label = fr.row.querySelector('label');
      label.textContent = S.D.documentFieldLabel ?? ctx.spec.field.label.replace(/:$/, '') + ':';
    };
    return BASE;
  }

  function signingParts(S) {
    const BASE = {};
    BASE.signLook = () => {};
    BASE.signParent = (ctx, body) => body;
    BASE.signAcknowledgment = () => {};
    BASE.signCaption = () => {};
    BASE.signField = (ctx, fr) => {
      if (S.D.signFieldLabel !== null) fr.row.querySelector('.ut-label').textContent = S.D.signFieldLabel;
      if (S.D.signPlaceholder === null) fr.input.removeAttribute('placeholder');
      else if (S.D.signPlaceholder !== false) fr.input.placeholder = S.D.signPlaceholder;
    };
    BASE.signEnabled = (ctx, m, key) => m.unlocked || (S.D.directDecline && key === 'cancel' && ctx.spec.mode === 'decline');
    BASE.signPaint = (ctx, body, m) => {
      if (S.D.pendingResult) body.querySelector('.ut-result').classList.toggle('pending', !m.pressed);
    };
    BASE.signScroll = (ctx, card) => {
      let sb, positioning = true, positionedTop = null, touched = false;
      const mode = S.D.signScrollMode;
      const restore = (m) => {
        positioning = true;
        sb.lbx.set({ scroll: m.scroll });
        positionedTop = sb.list.scrollTop;
        positioning = false;
      };
      return {
        options: {},
        read(i, paint) {
          if (mode !== 'plain' && (!S.st || S.st.ctx !== ctx || !card.isConnected)) return;
          if (mode === 'position' && (positioning || (positionedTop !== null && Math.abs(sb.list.scrollTop - positionedTop) < .01))) return;
          if (mode === 'touched' && !touched) return;
          if (mode === 'position') positionedTop = null;
          const s = Math.round(i * 1000) / 1000;
          const m = S.st.ctx.model;
          if (s !== m.scroll || (S.D.unlockAtEnd && !m.unlocked && s >= S.P.fam().helpers.maxScroll(ctx.spec))) {
            const n = S.P.fam().helpers.scrolled(m, ctx.spec, s);
            S.st.ctx.update(n);
            if (n.unlocked !== m.unlocked) paint(n);
          }
        },
        initial(value) {
          sb = value;
          if (mode === 'touched') for (const kind of ['pointerdown', 'wheel', 'keydown']) sb.box.addEventListener(kind, () => { touched = true; }, { capture: true });
          if (!S.D.deferSignRestore) sb.lbx.set({ scroll: ctx.model.scroll });
        },
        built() { positionedTop = sb.list.scrollTop; positioning = false; },
        after() { if (S.D.deferSignRestore) sb.lbx.set({ scroll: ctx.model.scroll }); },
        sync(value, m) { if (Math.abs(sb.lbx.scrollIndex() - m.scroll) > .01) { if (mode === 'position') restore(m); else sb.lbx.set({ scroll: m.scroll }); } },
        dispose() {},
      };
    };
    return BASE;
  }

  function previewParts(S) {
    const BASE = {};
    BASE.spinnerInput = (ctx, input, clampV, show) => {
      if (S.D.spinnerWheel) input.addEventListener('wheel', (e) => {
        if (document.activeElement !== input || !e.deltaY) return;
        e.preventDefault();
        const m = S.st.ctx.model;
        const v = clampV(m.value + (e.deltaY < 0 ? 1 : -1));
        if (v !== m.value) S.st.ctx.update({ ...m, value: v });
        show(S.st.ctx.model.value);
      }, { passive: false });
    };
    BASE.spinnerBuilt = () => {};
    BASE.spinnerPreview = (ctx, view) => {
      if (!S.D.spinnerPreview) return;
      const body = view.card.querySelector('.ut-body');
      const p = ctx.util.el('div', 'preview', body);
      ctx.util.el('strong', '', p, S.D.previewTitle);
      ctx.util.el('span', 'pv-sub', p, S.D.previewSubtitle);
      ctx.util.el('p', '', p, S.D.previewText);
      const sub = body.querySelector('.ut-sub');
      const lab = body.querySelector('.ut-label');
      const row = body.querySelector('.ut-fieldrow');
      if (sub && lab && row) {
        sub.textContent = S.D.spinnerDescription;
        const lc = ctx.util.el('div', 'ut-lab');
        row.insertBefore(lc, row.firstChild);
        lc.append(lab, sub);
      }
    };
    return BASE;
  }

  function renderingParts(S) {
    const BASE = {};
    BASE.beforeRender = () => {};
    BASE.viewBuilt = (ctx, view, look) => {
      if (S.D.sourceGrid) {
        const sources = view.card.querySelector('.ut-boxes');
        if (sources && ctx.spec.boxes?.length > 3) sources.style.gridTemplateColumns = '1fr 1fr';
      }
      if (S.D.forcePane) {
        const pane = view.card.querySelector('.ut-list');
        if (pane && ctx.spec.rows) {
          pane.style.setProperty('height', ctx.spec.rows * look.lh + 'px', 'important');
          pane.parentElement.style.flex = 'none';
        }
      }
    };
    BASE.cardLayout = (ctx, view, box) => Object.assign(view.card.style, {
      position: 'absolute', left: '0', top: '0', width: box.w + 'px', height: box.h + 'px', maxWidth: '100%',
    });
    BASE.rendered = (ctx, view) => {
      if (ctx.spec.scenario === 'spinner') S.P.spinnerPreview(ctx, view);
      if (S.D.dockAnswer) {
        const end = document.querySelector(S.D.endSelector);
        const answer = view.card.querySelector('.ut-fieldrow');
        if (end && answer) answer.append(end);
        const taskNote = document.querySelector('.instruction');
        if (answer && taskNote && !taskNote.hidden) {
          answer.classList.add('has-instruction');
          answer.insertBefore(taskNote, answer.firstChild);
        }
      }
      if (S.D.unicodeActions) {
        const actions = ctx.util.el('div', 'unicode-actions', view.card.querySelector('.ut-fieldrow') || view.card.querySelector('.ut-body'));
        for (const control of document.querySelectorAll(S.D.unicodeControls)) if (S.P.unicodeControl(ctx, control)) actions.append(control);
      }
    };
    BASE.unicodeControl = () => true;
    BASE.afterRender = () => {};
    // unicode 'button': a flow taller than the card (9 items under ood) goes to 2, then 3 columns, so no item sits
    // below the card, under the site's footer
    BASE.fitFlow = (ctx, view) => {
      const flow = view.card.querySelector('.ut-flow');
      if (!flow) return;
      const limit = () => view.card.getBoundingClientRect().bottom - 4;
      for (let n = 2; n <= 3 && flow.getBoundingClientRect().bottom > limit(); n++) {
        Object.assign(flow.style, { width: 'auto', columnCount: String(n), columnGap: '28px' });
        for (const c of flow.children) c.style.breakInside = 'avoid';
      }
    };
    BASE.renderResult = (ctx, view) => ({ anchors: [view.card], sync: (m) => view.sync(m) });
    BASE.build = (ctx, look) => {
      const build = {
        'copy-paste': S.P.buildCopy, 'copy-paste-2': S.P.buildCopy,
        unicode: ctx.spec.mode === 'button' ? S.P.buildButtons : S.P.buildCopy,
        'scroll-text': S.P.buildScroll, 'sign-agreement': S.P.buildSign, spinner: S.P.buildSpinner,
        edit: S.P.buildEdit, find: S.P.buildFind,
      };
      return build[ctx.spec.scenario](ctx, look);
    };
    return BASE;
  }
  env.template('handle-text/_editor-parts', () => ({ clipboardParts, geometryParts, sourcesParts, copyParts, scrollParts, agreementParts, spinnerParts, editingParts, fieldsParts, linesParts, signingParts, previewParts, renderingParts }));
})();
