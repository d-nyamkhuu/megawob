/* use-desktop-tools/_base-explorer: Explorer tree, file actions and preview.
 * build(ctx, main, frame?, scope) owns one render's state; scope supplies the base template's
 * overridable units. Named setup, painting and input helpers keep their original statement order.
 */
(function () {
  'use strict';
  function makeInput(state, m) {
    state.editFor = m.edit.id;
    state.editInput = document.createElement('input');
    state.editInput.type = 'text';
    state.editInput.spellcheck = false;
    state.editInput.setAttribute('aria-label', 'name');
    state.editField = state.env.ui.textField(state.editInput, {
      value: m.edit.text,
      label: 'rename',
      onInput: (v) => { if (state.ctx.model.edit && state.ctx.model.edit.text !== v) state.ctx.update(state.fam.fEditText(state.ctx.model, v)); },
    });
    state.editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        state.commit(state.fam.fCommit(state.ctx.model));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        state.commit(state.fam.fCancel(state.ctx.model));
      }
    });
    state.editInput.addEventListener('blur', () => {
      if (state.painting || !state.ctx.model.edit || state.ctx.model.edit.id !== state.editFor) return;
      state.commit(state.fam.fCommit(state.ctx.model));
    });
  }

  function paintList(state, m) {
    const R = state.fam.rows(m, state.spec);
    const keep = state.list.scrollTop;
    state.rowEls.clear();
    const L = state.fam.live(m, state.spec);
    if (!m.edit || m.edit.id !== state.editFor) {
      state.editInput = null;
      state.editField = null;
      state.editFor = null;
    }
    const order = [];
    for (const r of R) {
      const open = r.dir && state.fam.isOpen(m, r.id);
      const editing = !!(m.edit && m.edit.id === r.id);
      const sig = `${r.dir}|${r.depth}|${r.name}|${open}|${editing}`;
      let row = state.cache.get(r.id);
      if (!row) {
        row = state.util.el('div', 'at-row');
        row.dataset.id = r.id;
        state.cache.set(r.id, row);
      }
      if (row.dataset.sig !== sig) {
        row.dataset.sig = sig;
        row.dataset.role = r.dir ? 'folder' : 'file';
        row.style.paddingLeft = `${6 + r.depth * 18}px`;
        state.flag(row, 'open', open);
        row.innerHTML = r.dir ? state.CHEV + state.FOLDER(open) : '<span class="sp"></span>' + state.FILE(r.name);
        if (editing) {
          if (!state.editInput) state.makeInput(m);
          row.append(state.editInput);
        } else state.util.el('span', 'nm', row, r.name);
      }
      if (editing && state.editField.get() !== m.edit.text) state.editField.set(m.edit.text);
      state.flag(row, 'sel', m.sel === r.id || (state.mode === 'tree' && m.clicks.includes(r.id)));
      state.flag(row, 'lifted', !!(m.drag && m.drag.id === r.id));
      state.flag(row, 'drop', !!(m.drag && m.drag.over === r.id && r.dir && m.drag.id !== r.id));
      state.rowEls.set(r.id, row);
      order.push(row);
      if (open && !state.fam.isLoaded(m, state.spec, r.id)) {
        let ld = state.cache.get(`ld:${r.id}`);
        if (!ld) {
          ld = state.util.el('div', 'at-row at-loading');
          state.cache.set(`ld:${r.id}`, ld);
        }
        ld.style.paddingLeft = `${6 + (r.depth + 1) * 18 + 20}px`;
        const t0 = (m.loading && m.loading[r.id]) || 0;
        ld.innerHTML = state.SPIN(Math.round(((state.ctx.clock() - t0) / 125) * 45) % 360);
        state.util.el('span', '', ld, 'Loading…');
        order.push(ld);
      }
    }
    if (!R.length) {
      let empty = state.cache.get('empty');
      if (!empty) {
        empty = state.util.el('div', 'at-empty', null, 'This folder is empty.');
        state.cache.set('empty', empty);
      }
      order.push(empty);
    }
    const cur = state.list.children;
    if (cur.length !== order.length || order.some((el, i) => cur[i] !== el)) state.list.replaceChildren(...order);
    state.list.scrollTop = keep;
    if (state.editInput && document.activeElement !== state.editInput) {
      state.editInput.focus({ preventScroll: true });
      if (state.editInput.dataset.fresh !== '0') {
        state.editInput.dataset.fresh = '0';
        const v = state.editInput.value;
        const dot = L.byId.get(m.edit.id) && !L.byId.get(m.edit.id).dir ? v.search(/\.(tar\.gz|[A-Za-z0-9]+)$/) : -1;
        state.editInput.setSelectionRange(0, dot > 0 ? dot : v.length);
      }
    }
  }

  function paintMenu(state, m) {
    if (state.mode !== 'files' || m.menu === null || m.menu === undefined) {
      state.menuEl.hidden = true;
      state.lastMenu = null;
      return;
    }
    const row = state.rowEls.get(m.menu);
    if (state.lastMenu !== m.menu || state.menuEl.hidden) {
      state.lastMenu = m.menu;
      state.menuEl.replaceChildren();
      const n = state.fam.live(m, state.spec).byId.get(m.menu);
      const item = (act, label, kbd, off) => {
        const it = state.util.el('div', 'at-mi', state.menuEl);
        it.dataset.act = act;
        state.util.el('span', '', it, label);
        if (kbd) state.util.el('kbd', '', it, kbd);
        if (off) it.dataset.off = '';
        return it;
      };
      const sep = () => state.util.el('div', 'at-msep', state.menuEl);
      const d = state.spec.decoys;
      item('decoy', n && n.dir ? 'Open' : d[0] || 'Open', '');
      if (n && n.dir) item('newfolder', state.spec.labels.newfolder, '');
      sep();
      item('rename', state.spec.labels.rename, 'F2');
      item('delete', state.spec.labels.delete, 'Del');
      sep();
      for (const x of d.slice(1)) item('decoy', x, '');
      item('decoy', 'Paste', 'Ctrl+V', true);
      if (!(n && n.dir)) {
        sep();
        item('newfolder', state.spec.labels.newfolder, '');
      }
    }
    state.menuEl.hidden = false;
    // Position at the press point (or next to the row), kept inside the main area.
    const mr = state.main.getBoundingClientRect();
    let x;
    let y;
    if (state.menuAt && state.menuAt.id === m.menu) [x, y] = state.menuAt.at;
    else if (row) {
      const rr = row.getBoundingClientRect();
      x = Math.min(rr.right - 40, rr.left + 140) - mr.left;
      y = rr.bottom - mr.top;
    } else {
      x = 40;
      y = 40;
    }
    const w = state.menuEl.offsetWidth;
    const h = state.menuEl.offsetHeight;
    state.menuEl.style.left = `${Math.round(state.clamp(x, 4, mr.width - w - 4))}px`;
    state.menuEl.style.top = `${Math.round(y + h > mr.height - 4 ? Math.max(4, y - h) : y)}px`;
  }

  function paintToast(state, m) {
    if (state.mode !== 'files' || !m.undo) {
      state.toast.hidden = true;
      return;
    }
    state.toast.hidden = false;
    const u = m.undo;
    const nm = u.created ? u.created.name || 'New folder' : (state.spec.nodes.find((n) => n.id === u.id) || {}).name;
    state.toastText.textContent = state.spec.recoverable ? `Deleted “${nm}”` : `“${nm}” was moved to the Trash`;
    state.toastUndo.hidden = !state.spec.recoverable;
  }

  function info(state, p, m, id) {
    const L = state.fam.live(m, state.spec);
    const n = L.byId.get(id);
    if (!n) return;
    const path = [];
    for (let x = n; x && x.parent !== null; x = L.byId.get(x.parent)) path.unshift(L.byId.get(x.parent).name);
    state.crumbs.replaceChildren();
    path.forEach((s) => { state.util.el('span', '', state.crumbs, s); state.util.el('span', '', state.crumbs, '›'); });
    state.util.el('b', '', state.crumbs, n.name);
    const card = state.util.el('div', 'at-card', p);
    card.innerHTML = n.dir ? state.FOLDER(false).replace('class="ico"', '') : state.FILE(n.name, '');
    const txt = state.util.el('div', '', card);
    state.util.el('h3', '', txt, n.name || (m.edit && m.edit.id === id ? m.edit.text : 'New folder'));
    const h = [...n.name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    if (n.dir) state.util.el('p', '', txt, `Folder · ${(L.kids.get(id) || []).length} items`);
    else state.util.el('p', '', txt, `${((h % 900) / 10 + 1.2).toFixed(1)} ${h % 3 ? 'KB' : 'MB'} · modified ${1 + (h % 27)} days ago`);
    state.util.el('p', '', txt, `/${path.concat([n.name]).join('/')}`);
  }

  function paintPreview(state, m) {
    state.crumbs.replaceChildren();
    state.pbody.replaceChildren();
    if (state.mode === 'tree') {
      const last = m.clicks[m.clicks.length - 1];
      if (last === undefined) {
        state.util.el('span', '', state.crumbs, 'No file open');
        const e = state.util.el('div', 'at-empty', state.pbody);
        e.innerHTML = state.svg(state.ICON.files);
        state.util.el('div', '', e, 'Click a file in the Explorer to open it.');
        return;
      }
      if (state.spec.recoverable) {
        const b = state.util.el('button', 'at-back', state.pbody, '← Back');
        b.type = 'button';
        b.dataset.role = 'back';
        b.addEventListener('click', () => state.commit(state.fam.treeBack(state.ctx.model, state.spec)));
      }
      state.info(state.pbody, m, last);
      return;
    }
    const sel = m.sel !== null && m.sel !== undefined && state.fam.live(m, state.spec).byId.get(m.sel) ? m.sel : null;
    if (sel === null) state.util.el('span', '', state.crumbs, state.mode === 'move' ? 'Move files' : 'Nothing selected');
    else state.info(state.pbody, m, sel);
    const tips = state.util.el('div', 'at-tips', state.pbody);
    tips.textContent = state.mode === 'move'
      ? 'Drag a file onto a folder to move it there. Hold it over a closed folder for a moment to open that folder.'
      : 'Right-click an item for more actions. Double-click a name or press F2 to rename it.';
    if (sel === null) tips.style.marginTop = '22px';
  }

  function paintGhost(state, m) {
    if (state.mode !== 'move' || !m.drag || !state.ghostAt) {
      state.ghost.hidden = true;
      return;
    }
    state.ghost.hidden = false;
    state.ghost.innerHTML = state.FILE(state.nameOfId(m, m.drag.id));
    state.util.el('span', '', state.ghost, state.nameOfId(m, m.drag.id));
    const mr = state.main.getBoundingClientRect();
    // Above and to the right of the pointer, so the rows the drag is heading for stay visible.
    state.ghost.style.left = `${Math.round(state.ghostAt[0] - mr.left + 18)}px`;
    state.ghost.style.top = `${Math.round(state.ghostAt[1] - mr.top - 34)}px`;
  }

  function mirror(state) {
    const m = state.ctx.model;
    const lr = state.list.getBoundingClientRect();
    const R = state.fam.rows(m, state.spec);
    let first = -1;
    let last = -1;
    R.forEach((r, i) => {
      const el = state.rowEls.get(r.id);
      if (!el) return;
      const b = el.getBoundingClientRect();
      if (b.top >= lr.top - 1 && b.bottom <= lr.bottom + 1) {
        if (first < 0) first = i;
        last = i;
      }
    });
    const v = { first, last, px: state.rowH };
    if (!state.same(v, m.view)) state.ctx.update({ ...m, view: v });
  }

  function paint(state, m) {
    state.painting = true;
    state.paintList(m);
    state.paintMenu(m);
    state.paintToast(m);
    state.paintPreview(m);
    state.paintGhost(m);
    state.painting = false;
    state.mirror();
  }

  function commit(state, m) {
    const prev = state.ctx.model;
    state.ctx.update(m);
    state.guard(state.ctx, prev, m);
    state.paint(state.ctx.model);
  }

  function buildExplorer(state) {
    ({ util: state.util, spec: state.spec, rng: state.rng } = state.ctx);
    state.fam = state.env.taskDef.helpers;
    state.mode = state.spec.scenario;
    state.mainR = state.main.getBoundingClientRect();
    state.ex = state.util.el('div', 'at-explorer', state.main);
    state.ex.style.width = `${Math.round(state.clamp(state.mainR.width * 0.47, 230, 360))}px`;
    state.head = state.util.el('div', 'at-pane-h', state.ex);
    state.util.el('span', '', state.head, `Explorer · ${state.rng.pick(state.PROJECTS)}`);
    state.list = state.util.el('div', 'at-tree', state.ex);
    state.list.tabIndex = 0;
    state.list.dataset.role = 'tree';
    state.pv = state.util.el('div', 'at-preview', state.main);
    state.crumbs = state.util.el('div', 'at-crumbs', state.pv);
    state.pbody = state.util.el('div', '', state.pv);
    state.pbody.style.cssText = 'flex: 1; min-height: 0; display: flex; flex-direction: column;';
    state.toast = state.util.el('div', 'at-toast', state.main);
    state.toast.hidden = true;
    state.toastText = state.util.el('span', '', state.toast);
    state.toastUndo = state.util.el('button', '', state.toast, 'Undo');
    state.toastUndo.type = 'button';
    state.ghost = state.util.el('div', 'at-ghost', state.main);
    state.ghost.hidden = true;
    state.menuEl = state.util.el('div', 'at-menu', state.main);
    state.menuEl.hidden = true;
    state.listH = state.list.getBoundingClientRect().height - 24;
    state.want = state.mode === 'move' ? state.spec.nodes.length : Math.min(state.spec.nodes.length, 17);
    state.rowH = Math.round(state.clamp(Math.floor(state.listH / Math.max(1, state.want)), 21, 27));
    state.list.style.setProperty('--rowh', `${state.rowH}px`);
    state.list.style.setProperty('--rowf', state.rowH >= 25 ? '14px' : '13px');
    state.rowEls = new Map();
    state.editInput = null;
    state.editField = null;
    state.editFor = null;
    state.painting = false;
    state.menuAt = null;
    state.lastMenu = null;
    state.ghostAt = null;
    state.nameOfId = (m, id) => {
      const n = state.fam.live(m, state.spec).byId.get(id);
      return n ? n.name : '';
    };
    state.cache = new Map();
    state.flag = (el, k, on) => {
      if (on) el.dataset[k] = '';
      else delete el.dataset[k];
    };

  }

  function bindControls(state) {
    state.list.addEventListener('scroll', () => state.mirror());
    state.list.addEventListener('click', (e) => {
      if (state.isField(e.target)) return;
      const row = e.target.closest('.at-row[data-id]');
      if (!row) return;
      const id = row.dataset.id;
      const m = state.ctx.model;
      const now = state.ctx.clock();
      if (state.mode === 'tree') {
        if (row.dataset.role === 'folder') state.commit({ ...state.fam.toggleFolder(m, state.spec, id, now), sel: id });
        else state.commit(state.fam.treeClickFile(m, state.spec, id));
      } else if (state.mode === 'files') state.commit(state.fam.fClick(m, state.spec, id, now));
      else if (row.dataset.role === 'folder') state.commit({ ...state.fam.toggleFolder(m, state.spec, id, now), sel: id });
      else state.commit({ ...m, sel: id });
    });
    state.list.addEventListener('dblclick', (e) => {
      if (state.mode !== 'files' || state.isField(e.target)) return;
      const row = e.target.closest('.at-row[data-id]');
      if (!row) return;
      state.commit(state.fam.fDbl(state.ctx.model, state.spec, row.dataset.id));
    });
    state.list.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (state.mode !== 'files' || state.isField(e.target)) return;
      const row = e.target.closest('.at-row[data-id]');
      if (!row) return;
      const mr = state.main.getBoundingClientRect();
      state.menuAt = { id: row.dataset.id, at: [e.clientX - mr.left + 2, e.clientY - mr.top + 2] };
      state.commit(state.fam.fMenu(state.ctx.model, state.spec, row.dataset.id));
    });
    state.menuEl.addEventListener('click', (e) => {
      const it = e.target.closest('.at-mi');
      if (!it || it.dataset.off !== undefined) return;
      const act = it.dataset.act;
      if (act === 'decoy') {
        state.env.log('decoy', { what: 'context-menu', label: it.textContent });
        state.commit({ ...state.ctx.model, menu: null });
      } else state.commit(state.fam.fPick(state.ctx.model, state.spec, act, state.ctx.clock()));
    });
    state.toastUndo.addEventListener('click', () => state.commit(state.fam.fUndo(state.ctx.model)));
    if (state.mode === 'move') {
      state.list.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        const row = e.target.closest('.at-row[data-id]');
        if (!row || row.dataset.role !== 'file') return;
        e.preventDefault();
        state.ghostAt = [e.clientX, e.clientY];
        state.commit(state.fam.mvDown(state.ctx.model, state.spec, row.dataset.id, state.ctx.clock()));
      });
    }
    state.overAt = (x, y) => {
      const hit = document.elementFromPoint(x, y);
      if (!hit) return null;
      const row = hit.closest('.at-row[data-id]');
      if (row && state.list.contains(row)) return row.dataset.id;
      return state.list.contains(hit) ? 'root' : null;
    };
    state.paint(state.ctx.model);
  }

  function handlers(state) {
    return {
      sync: state.paint,
      onKey(e) {
        if (state.isField(e.target)) return;
        const m = state.ctx.model;
        if (state.mode === 'files') {
          if (!/^(F2|Delete|Backspace|Escape|Enter|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) return;
          e.preventDefault();
          state.commit(state.fam.fKey(m, state.spec, e.key, state.ctx.clock()));
          const r = state.rowEls.get(state.ctx.model.sel);
          if (r && /^Arrow|Home|End/.test(e.key)) r.scrollIntoView({ block: 'nearest' });
        } else if (state.mode === 'tree' && state.spec.keys) {
          if (!/^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End|Enter| )$/.test(e.key)) return;
          e.preventDefault();
          state.commit(state.fam.treeKey(m, state.spec, e.key, state.ctx.clock()));
          const r = state.rowEls.get(state.ctx.model.sel);
          if (r) r.scrollIntoView({ block: 'nearest' });
        }
      },
      onDown(e) {
        const m = state.ctx.model;
        if (state.mode === 'files' && m.menu !== null && m.menu !== undefined && e.button === 0 && !state.menuEl.contains(e.target)) {
          if (!state.list.contains(e.target)) state.commit({ ...m, menu: null });
        }
      },
      onMove(e) {
        const m = state.ctx.model;
        if (state.mode !== 'move' || !m.drag) return;
        state.ghostAt = [e.clientX, e.clientY];
        const over = state.overAt(e.clientX, e.clientY);
        if (over !== m.drag.over) state.commit(state.fam.mvOver(m, over, state.ctx.clock()));
        else state.paintGhost(m);
      },
      onUp(e) {
        const m = state.ctx.model;
        if (state.mode !== 'move' || !m.drag) return;
        const over = state.overAt(e.clientX, e.clientY);
        state.ghostAt = null;
        state.commit(state.fam.mvUp(m, state.spec, over));
      },
      locate(t) {
        const lr = state.list.getBoundingClientRect();
        if (t.node !== undefined) {
          const row = state.rowEls.get(t.node);
          if (!row) return null;
          const rr = row.getBoundingClientRect();
          if (rr.top < lr.top - 1 || rr.bottom > lr.bottom + 1) return null;
          const nm = row.querySelector('.nm') || row;
          return state.hitPoint(nm, [0.5, 0.25, 0.75, 0.1], [0.5]);
        }
        if (t.pane === 'tree') {
          const rows = [...state.rowEls.values()];
          const lastB = rows.length ? rows[rows.length - 1].getBoundingClientRect().bottom : lr.top;
          if (lr.bottom - lastB > 14) return [lr.left + lr.width / 2, (lastB + lr.bottom) / 2];
          return [lr.left + lr.width / 2, lr.top + lr.height / 2];
        }
        if (t.back) return state.hitPoint(state.pbody.querySelector('.at-back'));
        if (t.menu) return state.menuEl.hidden ? null : state.hitPoint(state.menuEl.querySelector(`.at-mi[data-act="${t.menu}"]`));
        if (t.edit !== undefined) return state.editInput && state.editFor === t.edit ? state.hitPoint(state.editInput) : null;
        if (t.toast) return state.toast.hidden ? null : state.hitPoint(state.toastUndo);
        return null;
      },
    };
  }

  function build(ctx, main, scope) {
    const state = {
      ctx, main, env: scope.env, clamp: scope.clamp, PROJECTS: scope.PROJECTS, CHEV: scope.CHEV,
      FOLDER: scope.FOLDER, FILE: scope.FILE, SPIN: scope.SPIN, svg: scope.svg, ICON: scope.ICON,
      same: scope.same, guard: scope.guard, isField: scope.isField, hitPoint: scope.hitPoint,
    };
    state.makeInput = (m) => makeInput(state, m);
    state.paintList = (m) => paintList(state, m);
    state.paintMenu = (m) => paintMenu(state, m);
    state.paintToast = (m) => paintToast(state, m);
    state.info = (p, m, id) => info(state, p, m, id);
    state.paintPreview = (m) => paintPreview(state, m);
    state.paintGhost = (m) => paintGhost(state, m);
    state.mirror = () => mirror(state);
    state.paint = (m) => paint(state, m);
    state.commit = (m) => commit(state, m);
    buildExplorer(state);
    bindControls(state);
    return handlers(state);
  }
  env.template('use-desktop-tools/_base-explorer', () => ({ build }));
})();
