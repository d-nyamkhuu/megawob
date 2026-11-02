/*
 * base / change-settings / preferences: a settings screen in one card.
 *   tabs layout  (spec.layout 'tabs', fixed size, no page scroll) section tabs on the left (on top when the
 *                card is narrow), one section at a time, a footer with status text, Discard and Save. A
 *                search in the header replaces the section with up to RESULT_CAP matching rows (each tagged
 *                with its section) and a "showing k of n" line.
 *   long layout  (spec.layout 'long', the page scrolls) every section stacked under its heading, a sticky
 *                section index on the left when there is room; Save sits in the card header
 *                (spec.saveStyle 'button') or in a sticky bottom bar that appears with unsaved changes ('bar').
 *   rows         label + description, control on the right: a switch or a checkbox (spec.control) for
 *                toggles, a button that opens an option list (one or two columns, above or below) for selects,
 *                -/value/+ with a unit for numbers. Dependent rows sit indented under their parent and appear
 *                only while it is on.
 *   saving       Save is disabled until something changed; it stores the values and shows "Settings saved"
 *                (a pill that ignores the pointer). Discard restores the last saved values.
 * The card header (title, search) is the anchor. locate() is occlusion-aware on the long layout (sticky
 * header above, the save bar or the instruction note below): a covered control is reported off-screen on
 * that side so the kit scrolls.
 */
(function () {
  'use strict';

  const CSS = `
  .sp-wrap { align-self: flex-start; margin: 18px 22px; color: var(--fg); }
  .sp-card { position: relative; display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
    box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 10px 30px rgba(0,0,0,.06); }
  .sp-head { flex: none; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding: 14px 18px; border-bottom: 1px solid var(--line); }
  .sp-head .t { flex: 1; min-width: 200px; }
  .sp-head h1 { margin: 0; font-size: 20px; }
  .sp-head .sub { font-size: 13px; color: var(--muted); }
  .sp-search { display: flex; align-items: center; gap: 8px; height: 36px; width: 260px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px;
    background: var(--bg); color: var(--muted); }
  .sp-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--fg); font: inherit; font-size: 14px; }
  .sp-body { flex: 1; min-height: 0; display: flex; }
  .sp-body.top { flex-direction: column; }
  .sp-tabs { flex: none; display: flex; flex-direction: column; gap: 2px; width: 184px; padding: 12px 8px; border-right: 1px solid var(--line); }
  .sp-body.top .sp-tabs { flex-direction: row; flex-wrap: nowrap; overflow: hidden; width: auto; padding: 6px 10px 0; border-right: 0; border-bottom: 1px solid var(--line); }
  .sp-tab { display: block; padding: 8px 10px; border: 0; border-radius: 7px; background: none; color: var(--muted); font: inherit; font-size: 14px; text-align: left; cursor: pointer; white-space: nowrap; }
  .sp-tab:hover { color: var(--fg); background: color-mix(in srgb, var(--fg) 5%, transparent); }
  .sp-tab.on { color: var(--fg); font-weight: 650; background: color-mix(in srgb, var(--accent) 13%, transparent); }
  .sp-body.top .sp-tab { border-radius: 7px 7px 0 0; }
  .sp-panel { position: relative; flex: 1; min-width: 0; padding: 4px 18px 8px; }
  .sp-sec { margin: 12px 0 4px; font-size: 13px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); }
  .sp-long .sp-sec { margin: 22px 0 6px; font-size: 16px; letter-spacing: 0; text-transform: none; color: var(--fg); }
  .sp-row { position: relative; display: flex; align-items: center; gap: 16px; box-sizing: border-box; padding: 6px 2px; border-bottom: 1px solid var(--line); }
  .sp-row .lab { flex: 1; min-width: 0; }
  .sp-row .lab b { display: block; font-size: 14.5px; font-weight: 600; }
  .sp-row .lab small { display: block; margin-top: 2px; font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sp-row .tag { margin-left: 6px; padding: 1px 6px; border-radius: 9px; font-size: 11px; font-weight: 600; color: var(--muted); background: color-mix(in srgb, var(--fg) 7%, transparent); }
  .sp-row.child { margin-left: 22px; padding-left: 12px; border-left: 2px solid color-mix(in srgb, var(--accent) 40%, var(--line)); }
  .sp-row.child2 { margin-left: 44px; }
  .sp-switch { position: relative; flex: none; width: 44px; height: 24px; border: 0; border-radius: 12px; background: color-mix(in srgb, var(--fg) 22%, var(--panel)); cursor: pointer; padding: 0; }
  .sp-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.3); }
  .sp-switch.on { background: var(--accent); }
  .sp-switch.on::after { left: 23px; }
  .sp-onoff { flex: none; width: 24px; font-size: 12px; color: var(--muted); text-align: right; }
  .sp-check { flex: none; width: 22px; height: 22px; border: 2px solid color-mix(in srgb, var(--fg) 35%, var(--panel)); border-radius: 5px; background: var(--panel);
    color: #fff; font-size: 15px; line-height: 18px; text-align: center; cursor: pointer; padding: 0; }
  .sp-check.on { background: var(--accent); border-color: var(--accent); }
  .sp-select { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 150px; height: 34px; padding: 0 10px;
    border: 1px solid var(--line); border-radius: 7px; background: var(--bg); color: var(--fg); font: inherit; font-size: 14px; cursor: pointer; }
  .sp-select i { font-style: normal; color: var(--muted); }
  .sp-pop { position: absolute; right: 2px; z-index: 20; display: grid; gap: 2px; padding: 5px; border: 1px solid var(--line); border-radius: 9px;
    background: var(--panel); box-shadow: 0 10px 28px rgba(0,0,0,.18); }
  .sp-pop button { height: 30px; padding: 0 12px; border: 0; border-radius: 6px; background: none; color: var(--fg); font: inherit; font-size: 14px; text-align: left; white-space: nowrap; cursor: pointer; }
  .sp-pop button:hover { background: color-mix(in srgb, var(--accent) 12%, transparent); }
  .sp-pop button.cur { font-weight: 650; color: var(--accent); }
  .sp-num { flex: none; display: flex; align-items: center; gap: 4px; }
  .sp-num button { width: 30px; height: 32px; border: 1px solid var(--line); border-radius: 7px; background: var(--bg); color: var(--fg); font: inherit; font-size: 16px; cursor: pointer; }
  .sp-num input { width: 64px; height: 32px; padding: 0 8px; border: 1px solid var(--line); border-radius: 7px; background: var(--bg); color: var(--fg); font: inherit; font-size: 14px; text-align: right; }
  .sp-num span { min-width: 34px; font-size: 13px; color: var(--muted); }
  .sp-more { margin: 8px 2px; font-size: 12.5px; color: var(--muted); }
  .sp-foot { flex: none; display: flex; align-items: center; gap: 10px; padding: 10px 18px; border-top: 1px solid var(--line); }
  .sp-status { flex: 1; font-size: 13px; color: var(--muted); }
  .sp-status.dirty { color: #c2410c; font-weight: 600; }
  .sp-btn { height: 34px; padding: 0 16px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; cursor: pointer; }
  .sp-btn.primary { border-color: var(--accent); background: var(--accent); color: #fff; font-weight: 650; }
  .sp-btn:disabled { opacity: .45; cursor: default; }
  .sp-toast { position: absolute; left: 50%; top: 10px; transform: translateX(-50%); z-index: 5; padding: 7px 14px; border-radius: 999px; background: #1f7a3a; color: #fff;
    font-size: 13px; font-weight: 600; pointer-events: none; visibility: hidden; box-shadow: 0 4px 14px rgba(0,0,0,.2); }
  .sp-toast.on { visibility: visible; }
  .sp-long .sp-body { align-items: flex-start; }
  .sp-index { position: sticky; flex: none; width: 170px; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
  .sp-index a { padding: 6px 10px; border-radius: 6px; color: var(--muted); font-size: 13.5px; text-decoration: none; cursor: pointer; }
  .sp-index a:hover { color: var(--fg); background: color-mix(in srgb, var(--fg) 5%, transparent); }
  .sp-bar { position: sticky; bottom: 0; z-index: 6; display: flex; align-items: center; gap: 10px; padding: 10px 18px; border-top: 1px solid var(--line);
    border-radius: 0 0 12px 12px; background: color-mix(in srgb, var(--accent) 8%, var(--panel)); visibility: hidden; }
  .sp-bar.on { visibility: visible; }
  `;

  function ensureStyle() {
    if (document.getElementById('sp-style')) return;
    const s = document.createElement('style');
    s.id = 'sp-style';
    s.textContent = CSS;
    document.head.append(s);
  }

  let view = null;

  const hits = (el, x, y) => {
    const e = document.elementFromPoint(x, y);
    return !!e && (e === el || el.contains(e));
  };
  function pointOf(el) {
    const r = el.getBoundingClientRect();
    const H = window.innerHeight;
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    if (y < 0 || y > H) return [x, y];
    for (const px of [x, r.left + Math.min(8, r.width / 3), r.right - Math.min(8, r.width / 3)]) if (hits(el, px, y)) return [px, y];
    return y < H / 2 ? [x, 40] : [x, H + 40];
  }

  function build(ctx) {
    const { util, spec } = ctx;
    const fam = env.taskDef.helpers;
    const rng = ctx.rng;
    const el = util.el;
    const long = spec.layout === 'long';
    if (ctx.episode && ctx.episode.scrollable) ctx.stage.style.flex = '1 1 0%'; // see scroll-page: site.css collapses the stage
    const W = ctx.stage.getBoundingClientRect().width || ctx.size.width;
    const H = ctx.size.height;

    const wrap = el('div', `sp-wrap${long ? ' sp-long' : ''}`, ctx.stage);
    const cardW = Math.max(480, Math.min(W - 44, rng.int(long ? 760 : 700, 980)));
    const card = el('section', 'sp-card', wrap);
    card.style.width = cardW + 'px';

    // ---- header (anchor)
    const head = el('header', 'sp-head', card);
    const t = el('div', 't', head);
    el('h1', '', t, spec.title);
    el('div', 'sub', t, rng.pick(['Changes apply to this account only.', 'Manage how the app works for you.',
      'Some changes may take a minute to apply.', 'Review your preferences below.']));
    const search = el('label', 'sp-search', head);
    search.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
    const sInput = el('input', '', search);
    sInput.type = 'text';
    sInput.placeholder = rng.pick(['Search settings', 'Find a setting', 'Search']);
    sInput.autocomplete = 'off';
    sInput.spellcheck = false;
    sInput.addEventListener('input', () => {
      ctx.update(fam.setQuery(ctx.model, sInput.value));
      paint(ctx.model);
    });
    let headSave = null;
    if (long && spec.saveStyle === 'button') {
      headSave = el('button', 'sp-btn primary', head, 'Save');
      headSave.type = 'button';
    }
    const toast = el('div', 'sp-toast', card, rng.pick(['Settings saved', 'Your changes were saved', 'Preferences updated', 'Saved']));

    // ---- geometry (tabs layout fits the stage without scrolling)
    const sideTabs = cardW >= 700;
    let rowH = 58;
    if (!long) {
      const headH = cardW >= 640 ? 66 : 108;
      const fixed = headH + (sideTabs ? 0 : 42) + 40 + 58 + 20 + 36; // header, top tabs, section title, footer, padding, wrap margins
      rowH = Math.max(44, Math.min(58, Math.floor((H - fixed) / fam.RESULT_CAP)));
    }
    const showDesc = rowH >= 52;
    const showOnOff = rng.bool(0.35);

    const body = el('div', `sp-body${!long && !sideTabs ? ' top' : ''}`, card);
    const tabEls = {};
    const navEls = {};
    if (!long) {
      const tabs = el('nav', 'sp-tabs', body);
      for (const s of spec.sections) {
        const b = el('button', 'sp-tab', tabs, s.title);
        b.type = 'button';
        b.dataset.role = 'tab';
        b.addEventListener('click', () => {
          ctx.update(fam.setTab(ctx.model, s.id));
          paint(ctx.model);
        });
        tabEls[s.id] = b;
      }
    } else if (cardW >= 760) {
      const idx = el('nav', 'sp-index', body);
      const top = document.querySelector('body > header');
      idx.style.top = Math.round((top ? top.getBoundingClientRect().height : 64) + 12) + 'px';
      for (const s of spec.sections) {
        const a = el('a', '', idx, s.title);
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const h = secEls[s.id];
          const off = top ? top.getBoundingClientRect().bottom : 64;
          window.scrollTo({ top: Math.max(0, h.getBoundingClientRect().top + window.scrollY - off - 10), behavior: 'instant' });
        });
        navEls[s.id] = a;
      }
    }
    const panel = el('div', 'sp-panel', body);
    if (!long) panel.style.height = Math.round(40 + rowH * fam.RESULT_CAP + 24) + 'px';

    // ---- rows
    const secEls = {};
    const rows = {};
    const resultsHead = el('div', 'sp-sec', panel, 'Search results');
    for (const sec of spec.sections) {
      secEls[sec.id] = el('div', 'sp-sec', panel, sec.title);
      for (const id of sec.ids) {
        const s = spec.settings[id];
        let depth = 0;
        for (let p = s.parent; p; p = spec.settings[p].parent) depth++;
        const row = el('div', `sp-row${depth ? ' child' : ''}${depth > 1 ? ' child2' : ''}`, panel);
        row.style.minHeight = rowH + 'px';
        const lab = el('div', 'lab', row);
        const b = el('b', '', lab, s.label);
        const tag = el('span', 'tag', b, sec.title);
        if (showDesc && s.description) el('small', '', lab, s.description);
        const rec = { row, tag, kind: s.kind };
        if (s.kind === 'toggle') {
          if (spec.control === 'switch') {
            const onoff = showOnOff ? el('span', 'sp-onoff', row) : null;
            const sw = el('button', 'sp-switch', row);
            sw.type = 'button';
            sw.setAttribute('role', 'switch');
            sw.setAttribute('aria-label', s.label);
            rec.ctl = sw;
            rec.onoff = onoff;
          } else {
            const cb = el('button', 'sp-check', row);
            cb.type = 'button';
            cb.setAttribute('role', 'checkbox');
            cb.setAttribute('aria-label', s.label);
            rec.ctl = cb;
          }
          rec.ctl.addEventListener('click', () => {
            ctx.update(fam.setValue(ctx.model, spec, id, !ctx.model.values[id]));
            paint(ctx.model);
          });
        } else if (s.kind === 'select') {
          const btn = el('button', 'sp-select', row);
          btn.type = 'button';
          btn.setAttribute('aria-haspopup', 'listbox');
          rec.val = el('span', '', btn);
          el('i', '', btn, '▾');
          rec.ctl = btn;
          btn.addEventListener('click', () => {
            ctx.update(fam.openSelect(ctx.model, id));
            paint(ctx.model);
          });
          const pop = el('div', 'sp-pop', row);
          pop.setAttribute('role', 'listbox');
          const cols = s.options.length > 6 ? 2 : 1;
          pop.style.gridTemplateColumns = `repeat(${cols}, auto)`;
          rec.opts = {};
          for (const o of s.options) {
            const ob = el('button', '', pop, o);
            ob.type = 'button';
            ob.setAttribute('role', 'option');
            ob.addEventListener('click', () => {
              ctx.update(fam.setValue(ctx.model, spec, id, o));
              paint(ctx.model);
            });
            rec.opts[o] = ob;
          }
          rec.pop = pop;
          rec.popRows = Math.ceil(s.options.length / cols);
        } else {
          const box = el('div', 'sp-num', row);
          const minus = el('button', '', box, '−');
          const inp = el('input', '', box);
          const plus = el('button', '', box, '+');
          el('span', '', box, s.unit || '');
          minus.type = 'button';
          plus.type = 'button';
          minus.setAttribute('aria-label', `Decrease ${s.label}`);
          plus.setAttribute('aria-label', `Increase ${s.label}`);
          inp.type = 'text';
          inp.inputMode = 'numeric';
          inp.setAttribute('aria-label', s.label);
          const st = fam.stepOf(s);
          const bump = (d) => {
            const cur = Number(ctx.model.values[id]);
            const base = Number.isFinite(cur) && ctx.model.values[id] !== '' ? cur : s.min;
            const v = Math.max(s.min, Math.min(s.max, base + d * st));
            ctx.update(fam.setValue(ctx.model, spec, id, v));
            paint(ctx.model);
          };
          minus.addEventListener('click', () => bump(-1));
          plus.addEventListener('click', () => bump(1));
          inp.addEventListener('input', () => {
            const raw = inp.value.trim();
            const v = raw === '' ? '' : /^-?\d+(\.\d+)?$/.test(raw) ? Number(raw) : raw;
            ctx.update(fam.setValue(ctx.model, spec, id, v));
            paint(ctx.model);
          });
          rec.ctl = inp;
          rec.minus = minus;
          rec.plus = plus;
        }
        rows[id] = rec;
      }
    }
    const more = el('div', 'sp-more', panel);
    const empty = el('div', 'sp-more', panel, 'No settings match your search.');

    // ---- footer / save bar
    const foot = el('div', long ? 'sp-bar' : 'sp-foot', card);
    const status = el('div', 'sp-status', foot);
    const discardBtn = el('button', 'sp-btn', foot, rng.pick(['Discard', 'Discard changes', 'Cancel', 'Reset']));
    discardBtn.type = 'button';
    let saveBtn = headSave;
    if (!saveBtn) {
      saveBtn = el('button', 'sp-btn primary', foot, rng.pick(['Save', 'Save changes', 'Save settings', 'Apply changes']));
      saveBtn.type = 'button';
    }
    if (long && spec.saveStyle === 'button') foot.className = 'sp-foot';
    saveBtn.addEventListener('click', () => {
      if (!fam.isDirty(ctx.model, spec)) return;
      if (spec.judge && spec.judge.mode === 'confirm') ctx.flag('irreversible'); // the save is the step to ask about
      ctx.update(fam.save(ctx.model));
      paint(ctx.model);
    });
    discardBtn.addEventListener('click', () => {
      if (!fam.isDirty(ctx.model, spec)) return;
      ctx.update(fam.discard(ctx.model));
      paint(ctx.model);
    });
    if (long) el('div', '', card).style.height = '160px'; // room to scroll the last rows above the bar and notes

    // Clicking anywhere else closes an open option list.
    card.addEventListener('pointerdown', (e) => {
      const m = ctx.model;
      if (!m.open) return;
      const r = rows[m.open];
      if (r && (r.pop.contains(e.target) || r.ctl.contains(e.target))) return;
      ctx.update(fam.openSelect(m, m.open));
      paint(ctx.model);
    });

    // ---- placement inside the stage (tabs layout: never taller than the stage)
    if (!long) {
      const ch = card.getBoundingClientRect().height;
      const room = Math.max(0, H - ch - 36);
      wrap.style.marginTop = Math.round(Math.min(room, rng.int(0, 60)) + 18 * (room > 0 ? 1 : 0)) + 'px';
    }

    function paint(m) {
      const vis = new Set(fam.visibleIds(m, spec));
      const q = String(m.query || '').trim();
      if (sInput.value !== m.query && document.activeElement !== sInput) sInput.value = m.query;
      resultsHead.style.display = q ? '' : 'none';
      for (const sec of spec.sections) {
        const any = sec.ids.some((id) => vis.has(id));
        secEls[sec.id].style.display = !q && any && (long || sec.id === m.tab) ? '' : 'none';
        if (tabEls[sec.id]) tabEls[sec.id].classList.toggle('on', !q && sec.id === m.tab);
      }
      for (const [id, r] of Object.entries(rows)) {
        r.row.style.display = vis.has(id) ? '' : 'none';
        r.tag.style.display = q ? '' : 'none';
        const v = m.values[id];
        if (r.kind === 'toggle') {
          r.ctl.classList.toggle('on', v === true);
          r.ctl.setAttribute(r.ctl.getAttribute('role') === 'switch' ? 'aria-checked' : 'aria-checked', String(v === true));
          if (r.ctl.classList.contains('sp-check')) r.ctl.textContent = v === true ? '✓' : '';
          if (r.onoff) r.onoff.textContent = v === true ? 'On' : 'Off';
        } else if (r.kind === 'select') {
          r.val.textContent = v;
          const open = m.open === id && vis.has(id);
          r.pop.style.display = open ? 'grid' : 'none';
          for (const [o, b] of Object.entries(r.opts)) b.classList.toggle('cur', o === v);
          if (open) {
            const popH = r.popRows * 32 + 12;
            const rr = r.row.getBoundingClientRect();
            const below = long || rr.bottom + popH <= Math.min(window.innerHeight, card.getBoundingClientRect().bottom + 40) - 4;
            r.pop.style.top = below ? 'calc(100% - 4px)' : '';
            r.pop.style.bottom = below ? '' : 'calc(100% - 4px)';
          }
        } else if (document.activeElement !== r.ctl || (r.ctl.value.trim() !== String(v) && Number(r.ctl.value) !== v)) {
          if (r.ctl.value !== String(v)) r.ctl.value = String(v);
        }
      }
      const all = q ? spec.sections.flatMap((s) => s.ids).filter((id) => fam.matches(spec, id, q) && fam.isShown(m, spec, id)) : [];
      more.style.display = q && all.length > vis.size ? '' : 'none';
      more.textContent = `Showing ${vis.size} of ${all.length} results. Refine your search to see more.`;
      empty.style.display = q && !vis.size ? '' : 'none';
      const dirty = fam.isDirty(m, spec);
      saveBtn.disabled = !dirty;
      discardBtn.disabled = !dirty;
      status.classList.toggle('dirty', dirty);
      status.textContent = dirty ? 'You have unsaved changes' : m.saves ? 'All changes saved' : 'No changes yet';
      toast.classList.toggle('on', !!m.toast && !dirty);
      if (long && spec.saveStyle === 'bar') foot.classList.toggle('on', dirty);
    }

    const v = {
      ctx,
      head,
      paint,
      locate(tg) {
        if (tg.search) return pointOf(sInput);
        if (tg.save) return pointOf(saveBtn);
        if (tg.discard) return pointOf(discardBtn);
        if (tg.tab !== undefined) return tabEls[tg.tab] && pointOf(tabEls[tg.tab]);
        if (tg.control !== undefined) return rows[tg.control] && pointOf(rows[tg.control].ctl);
        if (tg.option) {
          const r = rows[tg.option[0]];
          return r && r.opts[tg.option[1]] && pointOf(r.opts[tg.option[1]]);
        }
        if (tg.step) {
          const r = rows[tg.step[0]];
          return r && pointOf(tg.step[1] > 0 ? r.plus : r.minus);
        }
        return null;
      },
    };
    view = v;
    paint(ctx.model);
    return v;
  }

  env.widget({
    task: 'change-settings',
    site: 'base',
    name: 'preferences',
    split: 'train',
    scrollable: (spec) => !!spec.scroll,
    scenarios: ['toggle', 'dependent', 'mixed', 'search'],

    render(ctx) {
      ensureStyle();
      const v = build(ctx);
      return { anchors: [v.head], sync: (m) => v.paint(m) };
    },

    locate(t) {
      const p = view && view.locate(t);
      if (!p) throw new Error(`change-settings/preferences cannot locate ${JSON.stringify(t)}`);
      return p;
    },
  });
})();
