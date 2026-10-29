/*
 * mock-settings / change-settings / workspace: a SaaS settings page (frozen eval-only replica; heldout).
 *   tabs layout  (spec.layout 'tabs', fits the stage, no page scroll) one settings card: title + subtitle,
 *                a row of section tabs (underline or pill tabs that wrap onto a second line when they do not
 *                fit) with a "Filter settings" box beside them (or in the card header), the current section's
 *                heading and description, its rows, and either a footer (status text, Discard, Save; disabled
 *                while nothing changed) or a dark floating "unsaved changes" bar that appears only once
 *                something changed. Filtering replaces the section with up to RESULT_CAP matches, each tagged
 *                with its section, plus a "k of n" line.
 *   long layout  (spec.layout 'long', the page scrolls) a page header (title, filter box; with
 *                spec.saveStyle 'button' also the status, Discard and Save), one card per section (heading,
 *                description, rows), an inert "Danger zone" card, and with saveStyle 'bar' a sticky bottom
 *                "unsaved changes" bar (Discard / Save) that shows only while something changed.
 *   rows         label + help text; switches (spec.control 'switch') sit at the right, native checkboxes
 *                ('checkbox') at the left or right; selects are a button that opens a menu built from DOM
 *                (check mark on the current option, one or two columns, below or flipped above);
 *                numbers are a text field with a unit suffix and small stacked up/down stepper buttons.
 *                Dependent rows are indented under their parent and appear only while it is on.
 * The card header (tabs) or page header (long) is the anchor. locate() is occlusion-aware: a target under the
 * sticky top bar, the save bar or the instruction note is reported off-screen on that side so the kit scrolls.
 */
(function () {
  'use strict';

  const SEC_DESC = {
    Notifications: 'Choose what we tell you about, and how.',
    Privacy: 'Control who can see your activity and data.',
    Security: 'Sign-in, sessions and account protection.',
    Appearance: 'Customize how the app looks on this device.',
    'Language & region': 'Language, time zone and number formats.',
    Account: 'Basic details and defaults for your account.',
    Editor: 'How documents behave while you write.',
    Media: 'Playback, uploads and quality.',
    Shopping: 'Checkout, deals and order updates.',
    Workspace: 'Settings that apply to everyone in this workspace.',
    Accessibility: 'Make the app easier to see, hear and use.',
    'Sync & storage': 'Backups, offline access and storage.',
    'Location & devices': 'Devices, printers and location sharing.',
  };
  const SUBTITLES = ['Manage how this workspace works for you.', 'Changes apply after you save.',
    'These settings apply to your account only.', 'Update your preferences below.', 'Configure defaults for your account.'];
  const SAVE = ['Save changes', 'Save', 'Save settings', 'Update settings'];
  const DISCARD = ['Discard', 'Cancel', 'Reset', 'Discard changes', 'Undo changes'];
  const SAVED = ['Changes saved', 'Settings updated', 'Saved', 'All set, your settings were saved'];
  const UNSAVED = ['You have unsaved changes', 'Careful, you have unsaved changes', 'Unsaved changes', 'Some changes are not saved yet'];
  const FILTER = ['Filter settings', 'Search settings', 'Find a setting', 'Search'];
  const DANGER = [
    ['Transfer ownership', 'Move this workspace to another admin.', 'Transfer'],
    ['Export all data', 'Download a copy of everything in this workspace.', 'Request export'],
    ['Delete workspace', 'Permanently remove this workspace and its data.', 'Delete workspace'],
    ['Leave workspace', 'You will lose access to all projects.', 'Leave'],
  ];
  const CHEV = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 10 5 5 5-5"/></svg>';
  const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  const SEARCH = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>';
  const UP = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/></svg>';
  const DOWN = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

  let view = null;
  let listening = false;

  const hits = (el, x, y) => {
    const e = document.elementFromPoint(x, y);
    return !!e && (e === el || el.contains(e));
  };
  // Viewport point of el; when something covers it (sticky top bar above, save bar or note below), report it
  // off-screen on that side so the kit scrolls the page.
  function pointOf(el) {
    const r = el.getBoundingClientRect();
    const H = window.innerHeight;
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    if (y < 0 || y > H) return [x, y];
    for (const px of [x, r.left + Math.min(6, r.width / 3), r.right - Math.min(6, r.width / 3)]) if (hits(el, px, y)) return [px, y];
    return y < H / 2 ? [x, 30] : [x, H + 40];
  }

  function build(ctx) {
    const { util, spec, rng } = ctx;
    const fam = env.taskDef.helpers;
    const el = util.el;
    const long = spec.layout === 'long';
    const W = ctx.size.width;
    const H = ctx.size.height;
    const btn = (parent, cls, text) => {
      const b = el('button', cls, parent, text);
      b.type = 'button';
      return b;
    };

    const look = {
      tabs: rng.pick(['underline', 'pill']),
      foot: long ? (spec.saveStyle === 'bar' ? 'bar' : 'head') : rng.pick(['foot', 'foot', 'float']),
      cbSide: rng.bool(0.55) ? 'left' : 'right',
      desc: rng.bool(0.85),
      onoff: rng.bool(0.3),
    };
    const saveLabel = rng.pick(SAVE);
    const discardLabel = rng.pick(DISCARD);

    const mx = rng.int(14, 28);
    const wrap = el('div', `rsp-wrap${long ? ' long' : ''}`, ctx.stage);
    const cw = Math.max(Math.min(500, W - 2 * mx), Math.min(W - 2 * mx, rng.int(long ? 700 : 640, long ? 880 : 900)));
    wrap.style.width = cw + 'px';
    wrap.style.margin = `${long ? rng.int(16, 26) : 10}px ${mx}px`;
    if (long) wrap.style.alignSelf = 'flex-start';

    // ------------------------------------------------------------- header + search
    let card;
    let head;
    let sub;
    let searchHost;
    if (long) {
      card = wrap;
      head = el('header', 'rsp-lhead', wrap);
    } else {
      card = el('section', 'rsp-card', wrap);
      head = el('header', 'rsp-head', card);
    }
    const ht = el('div', 'rsp-ht', head);
    el(long ? 'h2' : 'h3', 'rsp-title', ht, spec.title);
    sub = el('div', 'rsp-sub', ht, rng.pick(SUBTITLES));
    const toast = el('div', 'rsp-toast', null);
    toast.innerHTML = CHECK;
    el('span', '', toast, rng.pick(SAVED));

    const search = el('label', 'rsp-search');
    search.innerHTML = SEARCH;
    const sInput = el('input', '', search);
    sInput.type = 'text';
    sInput.placeholder = rng.pick(FILTER);
    sInput.autocomplete = 'off';
    sInput.spellcheck = false;
    sInput.setAttribute('aria-label', sInput.placeholder);
    const sClear = btn(search, 'rsp-clear', '×');
    sClear.tabIndex = -1;
    sClear.setAttribute('aria-label', 'Clear filter');
    sInput.addEventListener('input', () => {
      ctx.update(fam.setQuery(ctx.model, sInput.value));
      paint(ctx.model);
    });
    sClear.addEventListener('click', (e) => {
      e.preventDefault();
      ctx.update(fam.setQuery(ctx.model, ''));
      sInput.value = '';
      paint(ctx.model);
    });

    let saveBtn = null;
    let discardBtn = null;
    let status = null;
    if (long) {
      head.append(search);
      head.append(toast);
      if (look.foot === 'head') {
        const tools = el('div', 'rsp-ltools', head);
        status = el('span', 'rsp-status', tools);
        discardBtn = btn(tools, 'rs-btn', discardLabel);
        saveBtn = btn(tools, 'rs-btn rs-primary', saveLabel);
      }
    } else {
      head.append(toast);
    }

    // ------------------------------------------------------------- tabs (tabs layout)
    const tabEls = {};
    let panel = null;
    let secHead = null;
    let secTitle = null;
    let secDesc = null;
    if (!long) {
      const bar = el('div', `rsp-tabbar ${look.tabs}`, card);
      const tabs = el('nav', 'rsp-tabs', bar);
      tabs.setAttribute('role', 'tablist');
      for (const s of spec.sections) {
        const b = btn(tabs, 'rsp-tab', s.title);
        b.setAttribute('role', 'tab');
        b.dataset.role = 'tab';
        b.addEventListener('click', () => {
          ctx.update(fam.setTab(ctx.model, s.id));
          paint(ctx.model);
        });
        tabEls[s.id] = b;
      }
      if (cw >= 700 && rng.bool(0.6)) bar.append(search);
      else head.append(search);
      panel = el('div', 'rsp-panel', card);
      secHead = el('div', 'rsp-sechead', panel);
      secTitle = el('b', '', secHead);
      secDesc = el('small', '', secHead);
    }

    // ------------------------------------------------------------- rows
    const rows = {};
    const secEls = {};
    const descEls = [];
    const host = (sec) => {
      if (!long) return panel;
      if (!secEls[sec.id]) {
        const box = el('section', 'rsp-sec', wrap);
        const h = el('div', 'rsp-sec-h', box);
        el('b', '', h, sec.title);
        el('small', '', h, SEC_DESC[sec.title] || `Manage your ${sec.title.toLowerCase()} settings.`);
        secEls[sec.id] = { box, rows: el('div', 'rsp-sec-rows', box) };
      }
      return secEls[sec.id].rows;
    };
    for (const sec of spec.sections) {
      const parent = host(sec);
      for (const id of sec.ids) {
        const s = spec.settings[id];
        let depth = 0;
        for (let p = s.parent; p; p = spec.settings[p].parent) depth++;
        const row = el('div', `rsp-row${depth ? ` child d${Math.min(depth, 2)}` : ''}`, parent);
        const rec = { row, kind: s.kind, sec };
        const leftBox = s.kind === 'toggle' && spec.control === 'checkbox' && look.cbSide === 'left';
        let cb = null;
        if (leftBox) cb = el('input', 'rsp-cb', row);
        const lab = el('div', 'rsp-lab', row);
        const name = el('div', 'rsp-name', lab);
        el('span', '', name, s.label);
        rec.tag = el('span', 'rsp-tag', name, sec.title);
        if (s.description) descEls.push(el('div', 'rsp-desc', lab, s.description));
        if (s.kind === 'toggle') {
          if (spec.control === 'switch') {
            if (look.onoff) rec.onoff = el('span', 'rsp-onoff', row);
            const sw = btn(row, 'rsp-sw');
            el('i', '', sw);
            sw.setAttribute('role', 'switch');
            sw.setAttribute('aria-label', s.label);
            rec.ctl = sw;
            sw.addEventListener('click', () => {
              ctx.update(fam.setValue(ctx.model, spec, id, ctx.model.values[id] !== true));
              paint(ctx.model);
            });
          } else {
            if (!cb) cb = el('input', 'rsp-cb', row);
            cb.type = 'checkbox';
            cb.setAttribute('aria-label', s.label);
            rec.ctl = cb;
            cb.addEventListener('click', () => {
              ctx.update(fam.setValue(ctx.model, spec, id, ctx.model.values[id] !== true));
              paint(ctx.model);
            });
          }
        } else if (s.kind === 'select') {
          const sw = el('div', 'rsp-selwrap', row);
          const b = btn(sw, 'rsp-sel');
          b.setAttribute('aria-haspopup', 'listbox');
          b.setAttribute('aria-label', s.label);
          rec.val = el('span', '', b);
          b.insertAdjacentHTML('beforeend', CHEV);
          b.addEventListener('click', () => {
            ctx.update(fam.openSelect(ctx.model, id));
            paint(ctx.model);
          });
          const menu = el('div', 'rsp-menu', sw);
          menu.setAttribute('role', 'listbox');
          const cols = s.options.length > 6 ? 2 : 1;
          menu.style.gridTemplateColumns = `repeat(${cols}, minmax(120px, auto))`;
          rec.opts = {};
          for (const o of s.options) {
            const ob = btn(menu, 'rsp-opt');
            ob.setAttribute('role', 'option');
            ob.innerHTML = CHECK;
            el('span', '', ob, o);
            ob.addEventListener('click', () => {
              ctx.update(fam.setValue(ctx.model, spec, id, o));
              paint(ctx.model);
            });
            rec.opts[o] = ob;
          }
          rec.ctl = b;
          rec.menu = menu;
          rec.menuH = Math.ceil(s.options.length / cols) * 32 + 10;
        } else {
          const box = el('div', 'rsp-numbox', row);
          const inp = el('input', 'rsp-num', box);
          inp.type = 'text';
          inp.inputMode = 'numeric';
          inp.setAttribute('aria-label', s.label);
          if (s.unit) el('span', 'rsp-unit', box, s.unit);
          const spin = el('div', 'rsp-spin', box);
          const up = btn(spin, 'rsp-up');
          const down = btn(spin, 'rsp-down');
          up.innerHTML = UP;
          down.innerHTML = DOWN;
          up.tabIndex = -1;
          down.tabIndex = -1;
          up.setAttribute('aria-label', `Increase ${s.label}`);
          down.setAttribute('aria-label', `Decrease ${s.label}`);
          const st = fam.stepOf(s);
          const bump = (d) => {
            const cur = Number(ctx.model.values[id]);
            const base = Number.isFinite(cur) && ctx.model.values[id] !== '' ? cur : s.min;
            ctx.update(fam.setValue(ctx.model, spec, id, Math.max(s.min, Math.min(s.max, base + d * st))));
            paint(ctx.model);
          };
          up.addEventListener('click', () => bump(1));
          down.addEventListener('click', () => bump(-1));
          inp.addEventListener('input', () => {
            const raw = inp.value.trim();
            const v = raw === '' ? '' : /^-?\d+(\.\d+)?$/.test(raw) ? Number(raw) : raw;
            ctx.update(fam.setValue(ctx.model, spec, id, v));
            paint(ctx.model);
          });
          rec.ctl = inp;
          rec.up = up;
          rec.down = down;
        }
        rows[id] = rec;
      }
    }
    const moreHost = long ? wrap : panel;
    const more = el('div', 'rsp-more', moreHost);
    const empty = el('div', 'rsp-empty', moreHost, 'No settings match your filter.');

    // ------------------------------------------------------------- save / discard
    let saveBox = null;
    if (!long) {
      saveBox = el('footer', look.foot === 'float' ? 'rsp-float' : 'rsp-foot', card);
    } else if (look.foot === 'bar') {
      saveBox = el('div', 'rsp-float rsp-sticky', null);
    }
    if (saveBox) {
      status = el('span', 'rsp-status', saveBox);
      discardBtn = btn(saveBox, look.foot === 'float' || look.foot === 'bar' ? 'rs-btn rs-ghost rsp-onDark' : 'rs-btn', discardLabel);
      saveBtn = btn(saveBox, 'rs-btn rs-primary', saveLabel);
    }
    saveBtn.addEventListener('click', () => {
      if (!fam.isDirty(ctx.model, spec)) return;
      ctx.update(fam.save(ctx.model));
      paint(ctx.model);
    });
    discardBtn.addEventListener('click', () => {
      if (!fam.isDirty(ctx.model, spec)) return;
      ctx.update(fam.discard(ctx.model));
      paint(ctx.model);
    });

    if (long) {
      // Inert danger zone (decoy), then the sticky bar and room to scroll the last rows above it.
      const dz = el('section', 'rsp-sec rsp-danger', wrap);
      const h = el('div', 'rsp-sec-h', dz);
      el('b', '', h, rng.pick(['Danger zone', 'Advanced', 'Delete or transfer']));
      el('small', '', h, 'These actions cannot be undone.');
      for (const [t, d, b] of rng.sample(DANGER, rng.int(1, 2))) {
        const r = el('div', 'rsp-row', dz);
        const lab = el('div', 'rsp-lab', r);
        el('div', 'rsp-name', lab, t);
        el('div', 'rsp-desc', lab, d);
        const x = btn(r, `rs-btn ${rng.bool(0.5) ? 'rs-danger' : 'rs-danger-fill'}`, b);
        x.dataset.role = 'xtra';
        x.addEventListener('click', () => ctx.log('decoy', { what: 'danger-zone', label: b }));
      }
      if (saveBox) {
        wrap.append(saveBox);
        const note = document.querySelector('.rs-note');
        saveBox.style.bottom = (note ? Math.ceil(note.getBoundingClientRect().height) + 24 : 14) + 'px';
      }
      el('div', 'rsp-spacer', wrap).style.height = '170px';
    }

    // ------------------------------------------------------------- tabs layout: fit the stage height
    let rowH = 0;
    if (!long) {
      const CAP = fam.RESULT_CAP;
      const setRows = () => {
        for (const r of Object.values(rows)) r.row.style.height = rowH + 'px';
        panel.style.height = Math.round(secHead.offsetHeight + CAP * rowH + 30) + 'px';
      };
      const avail = H - 20;
      let showDesc = look.desc;
      rowH = rng.int(58, 66);
      const apply = () => {
        for (const d of descEls) d.style.display = showDesc ? '' : 'none';
        secDesc.style.display = showDesc || rowH >= 52 ? '' : 'none';
        setRows();
      };
      secTitle.textContent = spec.sections[0].title;
      secDesc.textContent = SEC_DESC[spec.sections[0].title] || 'Manage these settings.';
      apply();
      for (let k = 0; k < 8; k++) {
        const ch = card.getBoundingClientRect().height;
        if (ch <= avail) break;
        const over = ch - avail;
        if (rowH > (showDesc ? 50 : 42)) rowH = Math.max(showDesc ? 50 : 42, rowH - Math.ceil(over / CAP));
        else if (showDesc) { showDesc = false; rowH = Math.max(42, rowH - 6); }
        else if (sub.style.display !== 'none') sub.style.display = 'none';
        else if (rowH > 38) rowH = 38;
        else break;
        apply();
      }
      wrap.dataset.rowh = rowH;
    } else {
      for (const d of descEls) d.style.display = look.desc ? '' : 'none';
    }

    function placeMenu(r) {
      const rr = r.ctl.getBoundingClientRect();
      const st = ctx.stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const lo = long ? 8 : Math.max(0, st.top);
      const hi = long ? vh - 8 : Math.min(vh, st.bottom) - 4;
      const below = rr.bottom + 4 + r.menuH <= hi;
      const above = rr.top - 4 - r.menuH >= lo;
      const down = below || (!above && hi - rr.bottom >= rr.top - lo);
      r.menu.style.top = down ? 'calc(100% + 4px)' : '';
      r.menu.style.bottom = down ? '' : 'calc(100% + 4px)';
    }

    function paint(m) {
      const vis = new Set(fam.visibleIds(m, spec));
      const q = String(m.query || '').trim();
      if (sInput.value !== m.query && document.activeElement !== sInput) sInput.value = m.query;
      sClear.style.visibility = m.query ? 'visible' : 'hidden';
      if (!long) {
        const sec = spec.sections.find((s) => s.id === m.tab) || spec.sections[0];
        secTitle.textContent = q ? `Results for “${q}”` : sec.title;
        secDesc.textContent = q ? 'Matching settings from every section.' : SEC_DESC[sec.title] || `Manage your ${sec.title.toLowerCase()} settings.`;
        for (const [sid, t] of Object.entries(tabEls)) {
          t.classList.toggle('on', !q && sid === m.tab);
          t.setAttribute('aria-selected', String(!q && sid === m.tab));
        }
      } else {
        for (const sec of spec.sections) secEls[sec.id].box.style.display = sec.ids.some((id) => vis.has(id)) ? '' : 'none';
      }
      for (const [id, r] of Object.entries(rows)) {
        const shown = vis.has(id);
        r.row.style.display = shown ? '' : 'none';
        r.tag.style.display = q && !long ? '' : 'none';
        const v = m.values[id];
        if (r.kind === 'toggle') {
          if (r.ctl.type === 'checkbox') r.ctl.checked = v === true;
          else r.ctl.classList.toggle('on', v === true);
          r.ctl.setAttribute('aria-checked', String(v === true));
          if (r.onoff) r.onoff.textContent = v === true ? 'On' : 'Off';
        } else if (r.kind === 'select') {
          r.val.textContent = v;
          const open = m.open === id && shown;
          r.row.classList.toggle('open', open);
          r.menu.style.display = open ? 'grid' : 'none';
          for (const [o, b] of Object.entries(r.opts)) b.classList.toggle('cur', o === v);
          if (open) placeMenu(r);
        } else if (document.activeElement !== r.ctl || (r.ctl.value.trim() !== String(v) && Number(r.ctl.value) !== v)) {
          if (r.ctl.value !== String(v)) r.ctl.value = String(v);
        }
      }
      const all = q ? spec.sections.flatMap((s) => s.ids).filter((id) => fam.matches(spec, id, q) && fam.isShown(m, spec, id)) : [];
      more.style.display = q && !long && all.length > vis.size ? '' : 'none';
      more.textContent = `${vis.size} of ${all.length} matches shown. Type more to narrow it down.`;
      empty.style.display = q && !vis.size ? '' : 'none';
      const dirty = fam.isDirty(m, spec);
      if (look.foot === 'float' || look.foot === 'bar') {
        saveBox.classList.toggle('on', dirty);
      } else {
        saveBtn.disabled = !dirty;
        discardBtn.disabled = !dirty;
      }
      if (status) {
        status.classList.toggle('dirty', dirty);
        status.textContent = dirty ? unsavedText : m.saves ? 'All changes saved' : '';
      }
      toast.classList.toggle('on', !!m.toast && !dirty);
    }
    const unsavedText = rng.pick(UNSAVED);

    const v = {
      ctx,
      head,
      paint,
      outside(e) {
        const m = ctx.model;
        if (!m.open) return;
        const r = rows[m.open];
        if (r && (r.menu.contains(e.target) || r.ctl.contains(e.target))) return;
        ctx.update(fam.openSelect(m, m.open));
        paint(ctx.model);
      },
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
          return r && pointOf(tg.step[1] > 0 ? r.up : r.down);
        }
        return null;
      },
    };
    view = v;
    if (!listening) {
      listening = true;
      document.addEventListener('pointerdown', (e) => view && view.outside(e), true);
    }
    paint(ctx.model);
    return v;
  }

  env.widget({
    task: 'change-settings',
    site: 'mock-settings',
    name: 'workspace',
    split: 'heldout',
    scrollable: (spec) => !!spec.scroll,
    scenarios: ['toggle', 'dependent', 'mixed', 'search'],

    render(ctx) {
      const v = build(ctx);
      return { anchors: [v.head], sync: (m) => v.paint(m) };
    },

    locate(t) {
      const p = view && view.locate(t);
      if (!p) throw new Error(`change-settings/workspace cannot locate ${JSON.stringify(t)}`);
      return p;
    },
  });
})();
