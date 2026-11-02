/* click-control/_controls-fields: fields parts of click-control/controls.
 * install(BASE, scopeRef) keeps each part replaceable through the parent's design.parts.
 */
(function () {
  'use strict';

  function widgetCols(scopeRef, ctx, r) { return ctx.spec.widgets.length * 50 > r.height - 30 ? 2 : 1; }

  function widgetGrid(scopeRef, ctx, card, cols) {
    card.style.gridTemplateColumns = `repeat(${cols}, max-content)`;
    card.style.minWidth = cols === 1 ? '300px' : '';
  }

  function widgetsStart(scopeRef) {}

  function widgetHeading(scopeRef, ctx, row, wd) {
    const h = scopeRef.D.headings;
    const heading = ctx.util.el('strong', 'widget-heading', row, wd.type in h ? h[wd.type] : h.other);
    row.prepend(heading);
    return heading;
  }

  function widgetPlace(scopeRef) {}

  function widgetsBuilt(scopeRef) {}

  function buildWidget(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    const card = util.el('div', 'uc-card uc-wlist', scopeRef.P.box(ctx, content));
    const r = content.getBoundingClientRect();
    const cols = scopeRef.P.widgetCols(ctx, r);
    scopeRef.P.widgetGrid(ctx, card, cols, r);
    scopeRef.P.widgetsStart(ctx, card);
    const rows = spec.widgets.map((wd, i) => {
      let row;
      if (wd.type === 'radio' || wd.type === 'checkbox') {
        row = util.el('label', 'uc-widget', card);
        const inp = util.el('input', '', row);
        inp.type = wd.type;
        if (wd.type === 'radio') inp.name = 'uc-radio';
        util.el('span', '', row, wd.text);
      } else if (wd.type === 'text') {
        row = util.el('div', 'uc-widget', card);
        const inp = util.el('input', 'uc-input', row);
        inp.type = 'text';
        inp.value = wd.text;
        inp.style.width = '160px';
      } else if (wd.type === 'textarea') {
        row = util.el('div', 'uc-widget', card);
        util.el('textarea', '', row).value = wd.text;
      } else {
        row = util.el('div', 'uc-widget', card);
        const b = util.el('button', 'uc-btn', row, wd.text);
        b.type = 'button';
      }
      row.classList.add('widget-' + wd.type);
      const heading = scopeRef.P.widgetHeading(ctx, row, wd, i);
      scopeRef.P.widgetPlace(ctx, card, row, wd, i, heading);
      row.dataset.role = 'widget';
      row.dataset.key = String(i);
      return row;
    });
    scopeRef.P.widgetsBuilt(ctx, card, rows, r);
    const ws = env.ui.buttons(rows, { keys: rows.map((_, i) => i), label: 'widget', history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
    return {
      sync: (m) => ws.set(m.clicks),
      locate(t) {
        if (t.widget === undefined) return null;
        const row = rows[t.widget];
        const ctl = row && row.querySelector('input, textarea, button');
        return ctl ? env.util.center(ctl) : ws.locate(t.widget);
      },
      recover: 'toast',
    };
  }

  function focusStart(scopeRef) {}

  function focusForm(scopeRef) {}

  function fieldLabel(scopeRef, ctx, fld, f, i, id) {
    const lab = ctx.util.el('label', '', fld, i + 1 + '.  ' + f.label + ':');
    lab.htmlFor = id;
    return lab;
  }

  function fieldAria(scopeRef) { return null; }

  function decoyLabel(scopeRef, ctx, row, i, text) { return ctx.util.el('label', '', row, i + 1 + '.  ' + text + ':'); }

  function extraRows(scopeRef) { return 4; }

  function focusExtras(scopeRef, ctx, form) {
    const { spec, util } = ctx;
    for (let i = spec.fields.length; i < scopeRef.P.extraRows(spec); i++) {
      const row = util.el('div', 'uc-field xtra-field', form);
      scopeRef.P.decoyLabel(ctx, row, i, scopeRef.D.extras[i]);
      const input = util.el('input', 'uc-input', row);
      input.type = 'text';
      input.readOnly = true;
      input.tabIndex = -1;
    }
  }

  function focusMore(scopeRef, ctx, form) {
    const { spec, util } = ctx;
    let ordinal = Math.max(4, spec.fields.length) + 1;
    const dateRow = util.el('div', 'uc-field xtra-field date-field', form);
    util.el('label', '', dateRow, ordinal++ + '.  Event Date:');
    const date = util.el('button', 'uc-input date-xtra', dateRow, 'Select a date...');
    date.type = 'button';
    date.tabIndex = -1;
    const attendees = util.el('div', 'uc-field xtra-field attendees-field', form);
    util.el('label', '', attendees, ordinal++ + '.  Number of Attendees:');
    const count = util.el('input', 'uc-input', attendees);
    count.type = 'text';
    count.readOnly = true;
    count.tabIndex = -1;
    const comments = util.el('div', 'uc-field xtra-field comments-field', form);
    util.el('label', '', comments, ordinal + '.  Comments:');
    const comment = util.el('textarea', 'uc-input', comments);
    comment.readOnly = true;
    comment.tabIndex = -1;
  }

  function buildFocus(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    scopeRef.P.focusStart(ctx, content);
    if (scopeRef.D.intro != null) util.el('p', 'form-intro', content, scopeRef.D.intro);
    const form = util.el('div', 'uc-card uc-form', scopeRef.P.box(ctx, content));
    scopeRef.P.focusForm(ctx, form);
    const r = content.getBoundingClientRect();
    const n = spec.fields.length;
    const slack = Math.max(0, Math.floor((r.height - 40 - n * 58) / n));
    const inputs = spec.fields.map((f, i) => {
      const fld = util.el('div', 'uc-field', form);
      fld.style.marginLeft = '0px';
      fld.style.marginTop = (i === 0 ? rng.int(0, Math.min(30, slack)) : rng.int(Math.min(8, slack), Math.min(30, slack))) + 'px';
      const id = `uc-f${i}`;
      scopeRef.P.fieldLabel(ctx, fld, f, i, id);
      const inp = util.el('input', 'uc-input', fld);
      inp.type = 'text';
      inp.id = id;
      const aria = scopeRef.P.fieldAria(f, i);
      if (aria != null) inp.setAttribute('aria-label', aria);
      inp.autocomplete = 'off';
      return inp;
    });
    scopeRef.P.focusExtras(ctx, form);
    scopeRef.P.focusMore(ctx, form);
    form.dataset.fields = String(spec.fields.length);
    const fs = env.ui.buttons(inputs, { keys: inputs.map((_, i) => i), on: 'focus', label: 'field', history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
    return {
      sync(m) {
        fs.set(m.clicks);
        // After Undo the wrongly focused field gives the focus back.
        if (!m.clicks.length && document.activeElement && inputs.includes(document.activeElement)) document.activeElement.blur();
      },
      locate: (t) => (t.field !== undefined ? fs.locate(t.field) : null),
      recover: 'toast',
    };
  }

  function hoverSize(scopeRef, r, content) { return {
    W: Math.max(200, r.width - 20),
    H: Math.max(80, r.height - (parseFloat(getComputedStyle(content).getPropertyValue('--hover-reserve')) || 34)),
  }; }

  function hoverRect(scopeRef, s, W, H) { return {
    x: 15 + s.x * (W - 30),
    y: 15 + s.y * (H - 30),
    width: Math.max(24, s.size * (Math.min(W, H) - 30)),
    height: Math.max(24, s.size * (Math.min(W, H) - 30)),
    rx: scopeRef.D.rx,
    class: 'uc-sq',
  }; }

  function hoverBefore(scopeRef) {}

  function hoverMeter(scopeRef, ctx, b) {
    const { spec, util } = ctx;
    const meter = util.el('div', 'uc-meter', b);
    util.el('span', '', meter, 'Time over square:');
    const txt = util.el('span', 'dwell-value', meter);
    return (m) => {
      txt.innerHTML = `<strong>${(Math.min(m.got, spec.need) / 1000).toFixed(1)} / ${(spec.need / 1000).toFixed(1)}</strong> seconds`;
    };
  }

  function hoverAfter(scopeRef) {}

  function buildHover(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    const r = content.getBoundingClientRect();
    const { W, H } = scopeRef.P.hoverSize(r, content);
    const b = scopeRef.P.box(ctx, content);
    const svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'uc-board' }, b);
    const rects = spec.shapes.map((s) => util.svg('rect', scopeRef.P.hoverRect(s, W, H), svg));
    scopeRef.P.hoverBefore(ctx, b, rects, W, H);
    const setMeter = scopeRef.P.hoverMeter(ctx, b, W, H);
    scopeRef.P.hoverAfter(ctx, b, rects, W, H);
    const sq = env.ui.buttons(rects, { hover: true, label: 'shape', onHover: (k) => up({ over: k }) });
  function sync(m) {
      rects.forEach((e, i) => {
        e.style.fill = scopeRef.D.hoverFill[spec.color];
        e.style.visibility = i === m.hl ? 'visible' : 'hidden';
      });
      setMeter(m, rects);
    }
    sync(ctx.model);
    return { sync, locate: (t) => (t.shape !== undefined ? sq.locate(t.shape) : null), recover: null };
  }

  function install(BASE, scopeRef) {
    BASE.widgetCols = (...args) => widgetCols(scopeRef, ...args);
    BASE.widgetGrid = (...args) => widgetGrid(scopeRef, ...args);
    BASE.widgetsStart = (...args) => widgetsStart(scopeRef, ...args);
    BASE.widgetHeading = (...args) => widgetHeading(scopeRef, ...args);
    BASE.widgetPlace = (...args) => widgetPlace(scopeRef, ...args);
    BASE.widgetsBuilt = (...args) => widgetsBuilt(scopeRef, ...args);
    BASE.buildWidget = (...args) => buildWidget(scopeRef, ...args);
    BASE.focusStart = (...args) => focusStart(scopeRef, ...args);
    BASE.focusForm = (...args) => focusForm(scopeRef, ...args);
    BASE.fieldLabel = (...args) => fieldLabel(scopeRef, ...args);
    BASE.fieldAria = (...args) => fieldAria(scopeRef, ...args);
    BASE.decoyLabel = (...args) => decoyLabel(scopeRef, ...args);
    BASE.extraRows = (...args) => extraRows(scopeRef, ...args);
    BASE.focusExtras = (...args) => focusExtras(scopeRef, ...args);
    BASE.focusMore = (...args) => focusMore(scopeRef, ...args);
    BASE.buildFocus = (...args) => buildFocus(scopeRef, ...args);
    BASE.hoverSize = (...args) => hoverSize(scopeRef, ...args);
    BASE.hoverRect = (...args) => hoverRect(scopeRef, ...args);
    BASE.hoverBefore = (...args) => hoverBefore(scopeRef, ...args);
    BASE.hoverMeter = (...args) => hoverMeter(scopeRef, ...args);
    BASE.hoverAfter = (...args) => hoverAfter(scopeRef, ...args);
    BASE.buildHover = (...args) => buildHover(scopeRef, ...args);
  }

  env.template('click-control/_controls-fields', () => ({ install }));
})();
