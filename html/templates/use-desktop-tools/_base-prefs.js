/* use-desktop-tools/_base-prefs: Preferences dialog and settings.
 * build(ctx, main, frame?, scope) owns one render's state; scope supplies the base template's
 * overridable units. Named setup, painting and input helpers keep their original statement order.
 */
(function () {
  'use strict';
  function paint(state, m) {
    state.modal.hidden = !m.dlg;
    if (state.appMenuPanel) {
      state.appMenuPanel.hidden = !m.menu;
      if (m.menu) state.chrome.appMenu.dataset.open = '';
      else delete state.chrome.appMenu.dataset.open;
      const br = state.chrome.appMenu.getBoundingClientRect();
      const wr = state.chrome.win.getBoundingClientRect();
      state.appMenuPanel.style.left = `${Math.round(br.left - wr.left)}px`;
      state.appMenuPanel.style.top = `${Math.round(br.bottom - wr.top + 4)}px`;
    }
    for (const tab of state.spec.tabs) {
      const on = tab.id === m.tab;
      if (on) state.tabEls[tab.id].dataset.on = '';
      else delete state.tabEls[tab.id].dataset.on;
      state.paneEls[tab.id].hidden = !on;
    }
    for (const [id, c] of Object.entries(state.ctl)) {
      const v = m.draft[id];
      if (c.kind === 'switch' || c.kind === 'check') {
        if (v) c.el.dataset.on = '';
        else delete c.el.dataset.on;
        c.el.setAttribute('aria-checked', v ? 'true' : 'false');
        if (c.kind === 'check') c.el.innerHTML = v ? state.CHECK : '';
      } else if (c.kind === 'seg') {
        for (const [o, b] of Object.entries(c.opts)) {
          if (o === v) b.dataset.on = '';
          else delete b.dataset.on;
        }
      } else if (c.kind === 'dropdown') c.val.textContent = v;
      else if (document.activeElement !== c.input && c.field.get() !== String(v)) c.field.set(String(v));
    }
    const dirty = state.fam.pfDirty(m);
    if (state.gated && !dirty) state.save.dataset.off = '';
    else delete state.save.dataset.off;
    if (state.apply) {
      if (!dirty) state.apply.dataset.off = '';
      else delete state.apply.dataset.off;
    }
    // Dropdown list.
    if (m.dlg && m.dd && state.ctl[m.dd]) {
      const id = m.dd;
      if (state.ddFor !== id) {
        state.ddFor = id;
        state.ddl.replaceChildren();
        for (const o of state.spec.settings[id].options) {
          const it = state.util.el('div', '', state.ddl, o);
          it.dataset.v = o;
        }
      }
      for (const it of state.ddl.children) {
        if (it.dataset.v === m.draft[id]) it.dataset.on = '';
        else delete it.dataset.on;
      }
      state.ddl.hidden = false;
      const br = state.ctl[id].el.getBoundingClientRect();
      const bb = state.db.getBoundingClientRect();
      const h = state.ddl.offsetHeight;
      const below = br.bottom - bb.top + 4;
      const top = below + h <= bb.height - 4 ? below : Math.max(4, br.top - bb.top - h - 4);
      state.ddl.style.top = `${Math.round(top)}px`;
      state.ddl.style.left = `${Math.round(state.clamp(br.right - bb.left - Math.max(state.ddl.offsetWidth, br.width), 4, bb.width - state.ddl.offsetWidth - 4))}px`;
      state.ddl.style.minWidth = `${Math.round(br.width)}px`;
    } else {
      state.ddl.hidden = true;
      state.ddFor = null;
    }
    state.mirror();
  }

  function mirror(state) {
    const m = state.ctx.model;
    let v = null;
    if (m.dlg) {
      const pane = state.paneEls[m.tab];
      const pr = pane.getBoundingClientRect();
      const ids = state.spec.tabs.find((t) => t.id === m.tab).ids;
      let first = -1;
      let last = -1;
      ids.forEach((id, i) => {
        const r = state.rowEls[id].getBoundingClientRect();
        if (r.top >= pr.top - 1 && r.bottom <= pr.bottom + 1) {
          if (first < 0) first = i;
          last = i;
        }
      });
      v = { tab: m.tab, first, last, ids: ids.length };
    }
    if (!state.same(v, m.view)) state.ctx.update({ ...m, view: v });
  }

  function buildDialog(state) {
    ({ util: state.util, spec: state.spec, rng: state.rng } = state.ctx);
    state.fam = state.env.taskDef.helpers;
    state.home = state.util.el('div', 'at-home', state.main);
    state.util.el('h2', '', state.home, state.rng.pick(['Welcome back', 'Home', 'Good morning', 'Your workspace']));
    state.util.el('p', '', state.home, 'Pick up where you left off.');
    state.recent = state.util.el('div', 'at-recent', state.home);
    state.cr = state.rng.fork('recent');
    for (let k = 0; k < 6; k++) {
      const n = state.env.content.fileName ? state.env.content.fileName(state.cr) : `Document ${k + 1}.docx`;
      const d = state.util.el('div', '', state.recent);
      d.innerHTML = state.FILE(n, '');
      state.util.el('span', '', d, n);
      state.util.el('span', '', d, `${state.cr.int(1, 28)} ${state.cr.pick(['days', 'hours', 'minutes'])} ago`);
    }
    state.appMenuPanel = null;
    state.prefsItem = null;
    if (state.chrome.appMenu) {
      state.appMenuPanel = state.util.el('div', 'at-menu', state.chrome.win);
      for (const [label, kbd] of [['New window', 'Ctrl+Shift+N'], ['Open recent', ''], ['sep'], [state.rng.pick(['Preferences…', 'Settings…', 'Preferences']), 'Ctrl+,'], ['Keyboard shortcuts', ''], ['sep'], ['Check for updates', ''], ['About', '']]) {
        if (label === 'sep') {
          state.util.el('div', 'at-msep', state.appMenuPanel);
          continue;
        }
        const it = state.util.el('div', 'at-mi', state.appMenuPanel);
        state.util.el('span', '', it, label);
        if (kbd) state.util.el('kbd', '', it, kbd);
        if (/^(Preferences|Settings)/.test(label)) state.prefsItem = it;
        else it.addEventListener('click', () => { state.env.log('decoy', { what: 'app-menu', label }); state.commit({ ...state.ctx.model, menu: false }); });
      }
      state.prefsItem.addEventListener('click', () => state.commit(state.fam.pfOpen(state.ctx.model)));
      state.chrome.appMenu.addEventListener('click', () => state.commit({ ...state.ctx.model, menu: !state.ctx.model.menu }));
    }
    state.chrome.gear.addEventListener('click', () => state.commit(state.fam.pfOpen(state.ctx.model)));
    state.modal = state.util.el('div', 'at-modal', state.chrome.win);
    state.winR = state.chrome.win.getBoundingClientRect();
    state.dlg = state.util.el('div', 'at-dlg', state.modal);
    state.dw = Math.round(Math.min(700, state.winR.width - 50));
    state.dh = Math.round(Math.min(470, state.winR.height - 110));
    Object.assign(state.dlg.style, { width: `${state.dw}px`, height: `${state.dh}px` });
    state.dhd = state.util.el('div', 'at-dlg-h', state.dlg);
    state.util.el('h3', '', state.dhd, state.rng.pick(['Preferences', 'Settings', 'Preferences']));
    state.x = state.util.el('button', 'at-x', state.dhd, '×');
    state.x.type = 'button';
    state.x.setAttribute('aria-label', 'Close');
    state.side = state.spec.tabStyle === 'side' && state.dw >= 560;
    state.db = state.util.el('div', `at-dlg-b ${state.side ? 'side' : 'top'}`, state.dlg);
    state.tabsEl = state.util.el('div', 'at-tabs', state.db);
    state.panes = state.util.el('div', 'at-panes', state.db);
    state.ft = state.util.el('div', 'at-dlg-f', state.dlg);
    state.reset = state.util.el('button', 'ghost', state.ft, state.rng.pick(['Restore defaults', 'Reset all', 'Help']));
    state.reset.type = 'button';
    state.reset.addEventListener('click', () => state.env.log('decoy', { what: 'prefs-footer', label: state.reset.textContent }));
    state.util.el('span', 'sp', state.ft);
    state.cancel = state.util.el('button', 'at-btn', state.ft, 'Cancel');
    state.cancel.type = 'button';
    state.apply = null;
    if (state.spec.apply) {
      state.apply = state.util.el('button', 'at-btn', state.ft, 'Apply');
      state.apply.type = 'button';
    }
    state.save = state.util.el('button', 'at-btn pri', state.ft, state.spec.saveLabel);
    state.save.type = 'button';
    state.gated = /^Save/.test(state.spec.saveLabel);
    state.tabEls = {};
    state.paneEls = {};
    state.ctl = {};
    state.rowEls = {};
    state.ddl = state.util.el('div', 'at-ddl', state.db);
    state.ddl.hidden = true;
    state.ddFor = null;
    state.CHECK = state.svg('<path d="M3.5 8.5l3 3 6-7"/>', 16);
  }

  function buildSettings(state) {
    for (const tab of state.spec.tabs) {
      const t = state.util.el('button', 'at-tab', state.tabsEl, tab.label);
      t.type = 'button';
      state.tabEls[tab.id] = t;
      t.addEventListener('click', () => state.commit(state.fam.pfTab(state.ctx.model, tab.id)));
      const pane = state.util.el('div', 'at-pane', state.panes);
      pane.dataset.role = 'prefs-pane';
      state.paneEls[tab.id] = pane;
      pane.addEventListener('scroll', () => state.mirror());
      for (const id of tab.ids) {
        const s = state.spec.settings[id];
        const row = state.util.el('div', 'at-set', pane);
        state.rowEls[id] = row;
        const lbl = state.util.el('div', 'lbl', row);
        state.util.el('b', '', lbl, s.label);
        state.util.el('small', '', lbl, s.desc);
        const c = { kind: s.ctl };
        if (s.ctl === 'switch' || s.ctl === 'check') {
          c.el = state.util.el('button', s.ctl === 'switch' ? 'at-switch' : 'at-check', row);
          c.el.type = 'button';
          c.el.setAttribute('role', s.ctl === 'switch' ? 'switch' : 'checkbox');
          c.el.setAttribute('aria-label', s.label);
          c.el.addEventListener('click', () => state.commit(state.fam.pfSet(state.ctx.model, state.spec, id, !state.ctx.model.draft[id])));
        } else if (s.ctl === 'seg') {
          c.el = state.util.el('div', 'at-seg', row);
          c.opts = {};
          for (const o of s.options) {
            const b = state.util.el('button', '', c.el, o);
            b.type = 'button';
            c.opts[o] = b;
            b.addEventListener('click', () => state.commit(state.fam.pfSet(state.ctx.model, state.spec, id, o)));
          }
        } else if (s.ctl === 'dropdown') {
          c.el = state.util.el('button', 'at-dd', row);
          c.el.type = 'button';
          c.val = state.util.el('span', '', c.el);
          c.el.insertAdjacentHTML('beforeend', state.CARET);
          c.el.addEventListener('click', () => state.commit(state.fam.pfDd(state.ctx.model, id)));
        } else {
          c.el = state.util.el('div', 'at-num', row);
          c.minus = state.util.el('button', '', c.el, '−');
          c.minus.type = 'button';
          c.input = state.util.el('input', '', c.el);
          c.input.type = 'text';
          c.input.inputMode = 'numeric';
          c.input.setAttribute('aria-label', s.label);
          c.plus = state.util.el('button', '', c.el, '+');
          c.plus.type = 'button';
          if (s.unit) state.util.el('small', '', c.el, s.unit);
          c.field = state.env.ui.textField(c.input, {
            value: String(state.ctx.model.draft[id]),
            label: id,
            accept: /[\d.-]/,
            onInput: (v) => {
              if (v === '' || !Number.isFinite(Number(v))) return;
              if (Number(v) === state.ctx.model.draft[id]) return;
              state.commit(state.fam.pfSet(state.ctx.model, state.spec, id, Number(v)));
            },
          });
          c.minus.addEventListener('click', () => state.commit(state.fam.pfStep(state.ctx.model, state.spec, id, -1)));
          c.plus.addEventListener('click', () => state.commit(state.fam.pfStep(state.ctx.model, state.spec, id, 1)));
        }
        state.ctl[id] = c;
      }
    }
    state.ddl.addEventListener('click', (e) => {
      const o = e.target.closest('[data-v]');
      if (!o || !state.ddFor) return;
      state.commit(state.fam.pfSet(state.ctx.model, state.spec, state.ddFor, o.dataset.v));
    });
    state.x.addEventListener('click', () => state.commit(state.fam.pfClose(state.ctx.model)));
    state.cancel.addEventListener('click', () => state.commit(state.fam.pfClose(state.ctx.model)));
    if (state.apply) state.apply.addEventListener('click', () => { if (state.fam.pfDirty(state.ctx.model)) state.commit(state.fam.pfApply(state.ctx.model)); });
    state.save.addEventListener('click', () => {
      if (state.gated && !state.fam.pfDirty(state.ctx.model)) return;
      state.commit(state.fam.pfSave(state.ctx.model));
    });
    state.modal.hidden = false;
    for (const tab of state.spec.tabs) {
      state.paneEls[tab.id].hidden = false;
      if (state.paneEls[tab.id].scrollHeight > state.paneEls[tab.id].clientHeight + 1) state.dlg.classList.add('compact');
      state.paneEls[tab.id].hidden = true;
    }
    state.commit = (m) => { const prev = state.ctx.model; state.ctx.update(m); state.guard(state.ctx, prev, m); state.paint(state.ctx.model); };
    state.paint(state.ctx.model);
  }

  function handlers(state) {
    return {
      sync: state.paint,
      onKey(e) {
        if (e.key === 'Escape' && state.ctx.model.dlg && !state.isField(e.target)) {
          e.preventDefault();
          state.commit(state.ctx.model.dd ? { ...state.ctx.model, dd: null } : state.fam.pfClose(state.ctx.model));
        }
      },
      onDown(e) {
        const m = state.ctx.model;
        if (m.dd && !state.ddl.contains(e.target) && !(state.ctl[m.dd] && state.ctl[m.dd].el.contains(e.target))) {
          const inDlg = state.dlg.contains(e.target);
          if (!inDlg || !e.target.closest('button, input')) state.commit({ ...m, dd: null });
        }
        if (state.appMenuPanel && m.menu && !state.appMenuPanel.contains(e.target) && !state.chrome.appMenu.contains(e.target)) state.commit({ ...state.ctx.model, menu: false });
      },
      locate(t) {
        if (t.open === 'gear') return state.hitPoint(state.chrome.gear);
        if (t.open === 'menu') return state.hitPoint(state.chrome.appMenu);
        if (t.open === 'item') return state.appMenuPanel && !state.appMenuPanel.hidden ? state.hitPoint(state.prefsItem) : null;
        if (state.modal.hidden) return null;
        if (t.tab) return state.hitPoint(state.tabEls[t.tab]);
        if (t.pane) {
          const r = state.paneEls[state.ctx.model.tab].getBoundingClientRect();
          return [r.left + r.width / 2, r.top + r.height / 2];
        }
        if (t.footer) return state.hitPoint({ save: state.save, apply: state.apply, cancel: state.cancel }[t.footer]);
        if (t.setting) {
          const c = state.ctl[t.setting];
          return state.hitPoint(c.input || c.el);
        }
        if (t.stepper) {
          const c = state.ctl[t.stepper[0]];
          return state.hitPoint(t.stepper[1] > 0 ? c.plus : c.minus);
        }
        if (t.option) {
          const [id, v] = t.option;
          const c = state.ctl[id];
          if (c.kind === 'seg') return state.hitPoint(c.opts[v]);
          if (state.ddl.hidden || state.ddFor !== id) return null;
          return state.hitPoint([...state.ddl.children].find((it) => it.dataset.v === v));
        }
        return null;
      },
    };
  }

  function build(ctx, main, chrome, scope) {
    const state = {
      ctx, main, chrome, env: scope.env, FILE: scope.FILE, svg: scope.svg, CARET: scope.CARET,
      clamp: scope.clamp, same: scope.same, guard: scope.guard, isField: scope.isField,
      hitPoint: scope.hitPoint,
    };
    state.paint = (m) => paint(state, m);
    state.mirror = () => mirror(state);
    buildDialog(state);
    buildSettings(state);
    return handlers(state);
  }
  env.template('use-desktop-tools/_base-prefs', () => ({ build }));
})();
